import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../models/Navbar";
import { mergeMovieData, updateWatchedMovieUser } from "../FirebaseService";
import { getMovieDetails, getMovieTrailerByName } from "./MoviePoster";
import "./MoviePage.css"; // Import your MoviePage.css
import { Box, IconButton, Modal } from "@mui/material";
import ReactPlayer from "react-player";
import {
  Movie,
  extractRuntimeFromURL,
  getCategoriesByNumbers,
} from "../models/MovieCategories";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon
import { useAuth } from "../AuthContext";
// import ffmpegStatic from "ffmpeg-static";
// import fluentFfmpeg from "fluent-ffmpeg";
// import ffmpegWasm from "ffmpeg-wasm";
// import { FFmpeg, createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"; // Import FFmpeg

const MoviePage = () => {
  const [movieDetails, setMovieDetails] = useState<Movie>({
    originalTitle: "",
    backdropPath: "",
    overview: "",
    releaseDate: "",
    voteAverage: 0, // Provide a default value if needed
    posterPath: "",
    movieUrl: "",
    categories: [],
    movieName: "",
  });

  const { movieName }: any = useParams();
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [watched, setWatched] = useState(false); // Track if the user has watched the movie
  const [watchingTime, setWatchingTime] = useState(0); // Track watching time in seconds
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login"); // Redirect to the login page
    }

    const playTrailer = async () => {
      try {
        const url = await getMovieTrailerByName(movieName);
        setVideoUrl(url);
      } catch (error) {
        console.error("Error fetching movie trailer:", error);
      }
    };
    const fetchMovieDB = async () => {
      try {
        const data: any = await mergeMovieData();
        setMoviesData(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    fetchMovieDB();
    playTrailer();

    if (moviesData.length > 0) {
      const matchingMovie = moviesData.find(
        (movie) => movie.name === movieName
      );
      console.log(moviesData, "moviesData");
      console.log(movieName, "bb");
      if (matchingMovie) {
        // Fetch movie details for the matching movie
        const fetchMovieDetails = async () => {
          try {
            const details = await getMovieDetails(matchingMovie.name);
            setMovieDetails({
              originalTitle: details.original_title || "",
              backdropPath: details.backdrop_path || "",
              overview: details.overview || "",
              releaseDate: details.release_date || "",
              voteAverage: details.vote_average || 0, // You can provide a default value if needed
              posterPath: details.poster_path || "",
              movieUrl: matchingMovie.movieUrl || "",
              trailerUrl: matchingMovie.trailerUrl || "", // Add trailer URL here
              categories: details.genre_ids || [],
              movieName: matchingMovie.name || "",
            });
          } catch (error) {
            console.error("Error fetching movie details:", error);
          }
        };

        fetchMovieDetails();
      }
    }
  }, [moviesData, movieName, currentUser, navigate]);

  const releaseDate = (date: any) => {
    const releaseYear = new Date(date).getFullYear();
    return releaseYear;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // const convertAndPlayVideo = async (videoUrl: any) => {
  //   // Create a new FFmpeg instance
  //   const ffmpeg = new ffmpegWasm();

  //   // Add the input file to the FFmpeg instance
  //   ffmpeg.addInput(videoUrl);

  //   // Set the output format to MP4
  //   ffmpeg.setOutputFormat("mp4");

  //   // Start the conversion
  //   const outputData = await ffmpeg.run();

  //   // Create a new Blob object from the output data
  //   const blob = new Blob([outputData], { type: "video/mp4" });

  //   // Create a new URL object from the Blob object
  //   const url = URL.createObjectURL(blob);

  //   // Set the video player's source to the new URL
  //   setVideoUrl(url);
  // };

  // convertAndPlayVideo(videoUrl);
  const handleProgress = (progress: any) => {
    // The 'progress' argument contains the current playback progress
    // Convert it to seconds
    const currentTimeInSeconds = progress.playedSeconds;

    // Check if the user has watched more than 2 minutes (120 seconds)
    if (currentTimeInSeconds >= 120) {
      // Mark the movie as watched
      if (!watched) {
        handleWatchedMovie();
      }
    }

    // Update the watching time state
    setWatchingTime(currentTimeInSeconds);
  };
  const handleWatchedMovie = () => {
    // Set the watched state to true
    setWatched(true);
    updateWatchedMovieUser(
      currentUser.uid,
      movieName,
      movieDetails.categories,
      watchingTime
    );
  };

  return (
    <div style={{ backgroundColor: "rgb(20, 20, 19)", height: "100%" }}>
      <Navbar />
      <div className="background-gradient"></div>
      <div className="movie-info-container ">
        {movieDetails ? (
          <>
            {movieDetails.backdropPath ? (
              <div
                className="movie-backdrop"
                style={{
                  background: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movieDetails.backdropPath}) center/cover no-repeat`,
                }}></div>
            ) : (
              <div
                className="movie-backdrop"
                style={{
                  background: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movieDetails.posterPath}) center/cover no-repeat`,
                }}></div>
            )}

            <div className="movie_header text-focus-in">
              <div className="movie-details text-focus-in">
                <h1 className="movie_header text-focus-in">
                  {movieDetails.originalTitle}
                </h1>
                <h4 className="date">
                  {releaseDate(movieDetails.releaseDate)}
                </h4>
                <span className="minutes">
                  {extractRuntimeFromURL(movieDetails.movieUrl)}
                </span>
                <p className="type">
                  {getCategoriesByNumbers(movieDetails.categories)}
                </p>
                <p className="text">{movieDetails.overview}</p>

                {videoUrl && (
                  <button onClick={() => setIsModalOpen(true)}>
                    Play Trailer
                  </button>
                )}
              </div>
            </div>
            <div className="movie-container">
              <ReactPlayer
                url={movieDetails.movieUrl}
                controls
                width="100%"
                height="100%"
                muted={false}
                onProgress={handleProgress}
              />
            </div>
          </>
        ) : (
          <p>Loading movie data...</p>
        )}
      </div>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        {/* Modal content */}
        <Box
          sx={{
            width: "700px",
            position: "relative", // Position relative for absolute positioning
          }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1, // Ensure it's above the content
            }}>
            <CloseIcon />
          </IconButton>

          <ReactPlayer
            url={videoUrl}
            muted={false}
            autoPlay={true}
            playing={true}
            controls
            width="700px"
            height="500px"
          />
        </Box>
      </Modal>
    </div>
  );
};

export default MoviePage;
