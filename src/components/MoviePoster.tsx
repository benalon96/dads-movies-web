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
      console.log(response.data, "response");
      // Construct the full poster URL
      const posterUrl = `https://image.tmdb.org/t/p/w300${posterPath}`;
      return posterUrl;
    } else {
      throw new Error("No movie found with that title.");
    }
  } catch (error) {
    console.error("Error fetching movie poster:", error);
    throw error;
  }
};
export const getMovieDetails = async (movieTitle: any) => {
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
      const movieDetails = response.data.results[0];
      return movieDetails;
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

// import sizeOf from "image-size";
// import sharp from "sharp";

// export const changeSizeOfImage = async (
//   imageUrl: string,
//   newWidth: number,
//   newHeight: number
// ) => {
//   try {
//     // Load the image
//     const imageBuffer = await sharp(imageUrl).toBuffer();

//     // Get the dimensions of the image
//     const dimensions = sizeOf(imageBuffer);

//     // Resize the image using sharp
//     const resizedImageBuffer = await sharp(imageBuffer)
//       .resize(newWidth, newHeight)
//       .toBuffer();

//     // Save or use the resized image as needed (you can save it to a file or return it as a data URI)
//     return resizedImageBuffer;
//   } catch (error) {
//     console.error("Error resizing image:", error);
//     throw error;
//   }
// };

// Constants for your YouTube Data API key and base URL
const YOUTUBE_API_KEY = "AIzaSyAmw3Zy_osVZ31nfM922Fn-i60p3VY8v3s";
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

export const searchMovieTrailer = async (movieTitle: any) => {
  try {
    // Make a GET request to search for the movie trailer on YouTube
    const response = await fetch(
      `${YOUTUBE_BASE_URL}?part=snippet&maxResults=1&q=${encodeURIComponent(
        `${movieTitle} official trailer`
      )}&key=${YOUTUBE_API_KEY}`
    );

    const responseData = await response.json();

    // Check if any results were found
    if (responseData.items && responseData.items.length > 0) {
      // Get the video ID of the first result
      const videoId = responseData.items[0].id.videoId;

      // Construct the YouTube trailer URL
      const trailerUrl = `https://www.youtube.com/watch?v=${videoId}`;
      return trailerUrl;
    } else {
      throw new Error("No trailer found for the movie.");
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
