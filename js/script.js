const axios = require('axios');

// Define the anime title you want to search for
const animeTitle = 'The Rising of the Shield Hero Season 3';

// Make a search request to the AniList API
axios.get(`https://graphql.anilist.co`, {
  params: {
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
  },
})
.then((response) => {
  const anime = response.data.data.Media[0];
  if (anime) {
    const airingDate = new Date(anime.nextAiringEpisode.airingAt * 1000); // Convert Unix timestamp to JavaScript date
    console.log(`Anime: ${anime.title.romaji}`);
    console.log(`Next Airing Date: ${airingDate.toISOString()}`);
  } else {
    console.log('Anime not found.');
  }
})
.catch((error) => {
  console.error(error);
});











// Function to update the countdown timer
function updateCountdown() {
    const targetDate = new Date('2023-10-05T00:00:00'); // Set your target date and time
    const currentDate = new Date();
    const timeDifference = targetDate - currentDate;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('countdown-timer').textContent = `${days}d ${hours}h ${minutes}m`;
}

// Update the countdown every second
setInterval(updateCountdown, 1000);

// Initial call to set the countdown
updateCountdown();



