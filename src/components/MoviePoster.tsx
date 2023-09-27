import axios from "axios";

const API_KEY = "ae8f86e5b5ca3c75e791e6897790791c"; // Replace with your TMDb API key
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

export const getMovieTrailerByName = async (movieName: any) => {
  try {
    // Step 1: Search for the movie by name
    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        movieName
      )}`
    );
    const searchData = await searchResponse.json();

    // Check if there are search results
    if (searchData.results && searchData.results.length > 0) {
      const movieId = searchData.results[0].id; // Get the ID of the first result (you can refine this logic as needed)

      // Step 2: Fetch movie details including videos (trailers)
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`
      );
      const movieData = await movieResponse.json();

      // Step 3: Filter and return the trailer URL
      const trailers = movieData.videos.results.filter(
        (video: any) => video.type === "Trailer"
      );
      if (trailers.length > 0) {
        const trailerKey = trailers[0].key;
        const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;
        return trailerUrl;
      } else {
        return "No trailers found for this movie.";
      }
    } else {
      return "Movie not found.";
    }
  } catch (error) {
    throw new Error("Error fetching movie trailer: " + error);
  }
};

// Example usage:

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
