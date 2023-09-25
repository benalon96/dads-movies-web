import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../models/Navbar";
import { mergeMovieData } from "../FirebaseService";
import { getMovieDetails } from "./MoviePoster";
import "./MoviePage.css"; // Import your MoviePage.css

const MoviePage = () => {
  const { movieName }: any = useParams();
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [movieDetails, setMovieDetails] = useState<any>({});

  useEffect(() => {
    const fetchMovieDB = async () => {
      try {
        const data: any = await mergeMovieData();
        setMoviesData(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    fetchMovieDB();
    if (moviesData.length > 0) {
      const matchingMovie = moviesData.find(
        (movie) => movie.name === movieName
      );

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
            });
          } catch (error) {
            console.error("Error fetching movie details:", error);
          }
        };

        fetchMovieDetails();
      }
    }
  }, [moviesData, movieName]);

  return (
    <div>
      <Navbar />
      <div className="background-gradient"></div>
      <div className="movie-info-container">
        {movieDetails ? (
          <>
            <div
              className="movie-backdrop"
              style={{
                background: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movieDetails.backdropPath}) center/cover no-repeat`,
              }}>
              <div className="movie_header">
                <img
                  className="movie-poster"
                  src={`https://image.tmdb.org/t/p/w300${movieDetails.posterPath}`}
                  alt={`Movie Poster ${movieDetails + 1}`}
                />
                <div className="movie-details">
                  <h1 className="movie_name">{movieDetails.originalTitle}</h1>
                  <h4 className="date">{movieDetails.releaseDate}</h4>
                  <span className="minutes">117 min</span>
                  <p className="type">Action, Crime, Fantasy</p>
                  <p className="text">{movieDetails.overview}</p>
                  <button className="button_movie">Watch Now!</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Loading movie data...</p>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
