import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../models/Navbar";
import { mergeMovieData } from "../FirebaseService";
import {
  getMovieDetails,
  getMovieTrailerByName,
  searchMovieTrailer,
} from "./MoviePoster";
import "./MoviePage.css"; // Import your MoviePage.css
import { Box, IconButton, Modal, Typography } from "@mui/material";
import ReactPlayer from "react-player";
import {
  extractRuntimeFromURL,
  getCategoriesByNumbers,
} from "../models/MovieCategories";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon

const MoviePage = () => {
  const { movieName }: any = useParams();
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [movieDetails, setMovieDetails] = useState<any>({});
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  useEffect(() => {
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
              voteAverage: details.vote_average || "",
              posterPath: details.poster_path || "",
              movieUrl: matchingMovie.movieUrl || "",
              trailerUrl: matchingMovie.trailerUrl || "", // Add trailer URL here
              categories: details.genre_ids || "",
            });
          } catch (error) {
            console.error("Error fetching movie details:", error);
          }
        };

        fetchMovieDetails();
      }
    }
  }, [moviesData, movieName]);

  const releaseDate = (date: any) => {
    const releaseYear = new Date(date).getFullYear();
    return releaseYear;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ backgroundColor: "rgb(20, 20, 19)", height: "100%" }}>
      <Navbar />
      <div className="background-gradient"></div>
      <div className="movie-info-container">
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

            <div className="movie_header">
              <div className="movie-details">
                <h1 className="movie_header">{movieDetails.originalTitle}</h1>
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
              {/* Use react-player instead of ReactNetflixPlayer */}
              <ReactPlayer
                url={movieDetails.movieUrl}
                controls
                width="100%"
                height="100%"
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
