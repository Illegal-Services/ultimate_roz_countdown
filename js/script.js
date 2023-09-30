window.onload = async function () {
  setInterval(async function () {
    await updateCountdown();
  }, 60000);
  // Initial call to set the countdown
  updateCountdown();
}


async function updateCountdown() {
  const countdownTimer = document.getElementById('countdown-timer');

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
  if (!anime) {
    throw new Error(`Anime not found.`);
  }

  const airingDate = formatCountdown(anime.nextAiringEpisode.airingAt);
  countdownTimer.textContent = airingDate;
}


function formatCountdown(unixTimestamp) {
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

  // Format the result
  const formattedCountdown = `Ep 1: ${days}d ${hours}h ${minutes}m`;

  return formattedCountdown;
}