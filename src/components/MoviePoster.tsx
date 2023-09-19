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
