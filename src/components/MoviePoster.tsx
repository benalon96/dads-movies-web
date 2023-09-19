// import * as $ from "jquery";

// export const getMoviePoster = (film: string) => {
//   return new Promise<string>((resolve, reject) => {
//     if (film === "") {
//       reject(new Error("Movie name is empty"));
//     } else {
//       $.getJSON(
//         `https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${film}&callback=?`,
//         (json: any) => {
//           if (json.results && json.results.length > 0) {
//             const posterPath = json.results[0].poster_path;
//             if (posterPath) {
//               // Adjust the poster size to 'w185' (smaller size)
//               resolve(`http://image.tmdb.org/t/p/w200/${posterPath}`);
//             } else {
//               reject(new Error("No poster path found for the movie"));
//             }
//           } else {
//             reject(new Error("No results found for the movie"));
//           }
//         }
//       );
//     }
//   });
// };
import axios from "axios";

const API_KEY = "YOUR_TMDB_API_KEY"; // Replace with your TMDb API key
const BASE_URL = "https://api.themoviedb.org/3";

// Function to fetch a movie poster by title
export const getMoviePoster = async (movieTitle: any) => {
  try {
    // Make a GET request to search for movies by title
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: "ae8f86e5b5ca3c75e791e6897790791c",
        query: movieTitle,
      },
    });

    // Check if any results were found
    if (response.data.results.length > 0) {
      // Get the poster path of the first result
      const posterPath = response.data.results[0].poster_path;

      // Construct the full poster URL
      const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

      return posterUrl;
    } else {
      throw new Error("No movie found with that title.");
    }
  } catch (error) {
    console.error("Error fetching movie poster:", error);
    throw error;
  }
};
// Function to fetch a movie's trailer by title
// const axios = require("axios");

// Function to fetch a movie trailer by name using TMDb API
export const searchMovieTrailer = async (movieTitle: any) => {
  try {
    // Construct the TMDb API URL for movie search
    const tmdbApiUrl = `https://api.themoviedb.org/3/search/movie`;

    // Replace "YOUR_TMDB_API_KEY" with your actual TMDb API key
    const apiKey = "k_tb2eox4k";

    // Make a GET request to search for the movie using TMDb API
    const response = await axios.get(tmdbApiUrl, {
      params: {
        api_key: apiKey,
        query: movieTitle,
      },
    });

    // Check if any results were found
    if (response.data.results.length > 0) {
      // Get the movie ID of the first result
      const movieId = response.data.results[0].id;

      // Construct the TMDb API URL for movie videos (trailers)
      const videosApiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos`;

      // Make a GET request to get videos (trailers) for the movie
      const videosResponse = await axios.get(videosApiUrl, {
        params: {
          api_key: apiKey,
        },
      });

      // Check if there are any video results (trailers)
      if (videosResponse.data.results.length > 0) {
        // Get the key of the first video result (usually a trailer)
        const videoKey = videosResponse.data.results[0].key;

        // Construct the YouTube trailer URL
        const trailerUrl = `https://www.youtube.com/watch?v=${videoKey}`;

        return trailerUrl;
      } else {
        throw new Error("No trailer found for the movie.");
      }
    } else {
      throw new Error("No movie found with that name.");
    }
  } catch (error) {
    console.error("Error searching for movie trailer:", error);
    throw error;
  }
};

// Example usage:
searchMovieTrailer("Inception")
  .then((trailerUrl) => {
    console.log("Movie trailer URL:", trailerUrl);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
