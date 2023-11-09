window.onload = async function () {
  const countdownTimer = document.getElementById("airing-date-countdown-timer");

  let episode, unixTimestamp;

  // Initial call to set the countdown
  ({ episode, unixTimestamp } = await fetchCountdown());
  updateCountdown();

  // Set up an interval to update the countdown every second
  setInterval(updateCountdown, 1000);

  // Set up a separate interval to fetch new data and pause every minute
  setInterval(async function () {
    ({ episode, unixTimestamp } = await fetchCountdown());
  }, 60000);

  /**
   * Function to update the countdown timer
   */
  function updateCountdown() {
    const airingDate = formatCountdown(episode, unixTimestamp);
    countdownTimer.textContent = airingDate;
  }
};

/**
 * Fetches the next airing episode and its Unix timestamp for a given anime title using the AniList GraphQL API.
 *
 * @returns {Promise<{ episode: number, unixTimestamp: number }>} An object containing the next airing episode number and Unix timestamp.
 *
 * @throws {Error} If there is an issue with the network request or the response is not OK.
 */
async function fetchCountdown() {
  const apiUrl = "https://graphql.anilist.co";
  const animeTitle = "The Rising of the Shield Hero Season 3";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ($title: String) {
          Media (search: $title, type: ANIME) {
            title {
              romaji
            }
            nextAiringEpisode {
              episode
              airingAt
            }
          }
        }
      `,
      variables: { title: animeTitle },
    }),
  };

  let response;
  try {
    response = await fetch(apiUrl, requestOptions);
  } catch (error) {
    throw new Error(`Network response was not ok: ${error}`);
  }

  if (!response.ok) {
    throw new Error(`Network response was not ok.`);
  }

  const responseJson = await response.json();

  const anime = responseJson.data.Media;
  const episode = anime.nextAiringEpisode.episode;
  const unixTimestamp = anime.nextAiringEpisode.airingAt;
  return { episode, unixTimestamp };
}

/**
 * Formats a countdown based on a Unix timestamp and episode number.
 *
 * @param {number} episode - The episode number for which the 'countdown' is calculated.
 * @param {number} unixTimestamp - An Unix timestampfor which the 'episode' is calculated.
 *
 * @returns The formatted episode and it's countdown, as a string.
 */
function formatCountdown(episode, unixTimestamp) {
  // Create a Date object using the Unix timestamp (multiply by 1000 to convert to milliseconds)
  const targetDate = new Date(unixTimestamp * 1000);

  // Get the current date and time
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = targetDate - currentDate;

  // Calculate days, hours, and minutes
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Format the result
  const formattedCountdown = `Ep ${episode}: ${days}d ${hours}h ${minutes}m ${seconds}s`;

  return formattedCountdown;
}
