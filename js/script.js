window.onload = async function () {
  const countdownTimer = document.getElementById('airing-date-countdown-timer');
  if (!isHTMLElement(countdownTimer)) {
    throw new Error(`'countdownTimer' is not an HTMLElement`);
  }

  updateCountdown(countdownTimer); // Initial call to set the countdown
  setInterval(() => updateCountdown(countdownTimer), 60000); // Repeat the call to set the countdown every minute
}


/**
 * Checks if the provided element is an instance of HTMLElement.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} `true` if the element is an instance of HTMLElement, otherwise `false`.
 */
function isHTMLElement(element) {
  return element instanceof HTMLElement;
}


/**
 * @param {HTMLElement} countdownTimer - A reference to the countdown timer, HTML element.
 *
 * @returns {void}
 */
async function updateCountdown(countdownTimer) {
  const apiUrl = 'https://graphql.anilist.co';
  const animeTitle = 'The Rising of the Shield Hero Season 3';
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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

  let _response;
  try {
    _response = await fetch(apiUrl, requestOptions);
  } catch (error) {
    throw new Error(`Network response was not ok: ${error}`);
  }
  const response = _response;

  if (!response.ok) {
    throw new Error(`Network response was not ok.`);
  }

  const responseJson = await response.json();

  const anime = responseJson.data.Media;
  const episode = anime.nextAiringEpisode.episode;
  const unixTimestamp = anime.nextAiringEpisode.airingAt

  const airingDate = formatCountdown(episode, unixTimestamp);
  countdownTimer.textContent = airingDate;
}


/**
 * Formats a countdown based on a Unix timestamp and episode number.
 *
 * @param {number} episode - The episode number for which the 'countdown' is calculated.
 * @param {number} unixTimestamp - An Unix timestampfor which the 'episode' is calculated.
 *
 * @returns {string} The formatted episode and it's countdown, as a string.
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