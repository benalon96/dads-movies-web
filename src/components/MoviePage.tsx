import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../models/Navbar";
import { mergeMovieData } from "../FirebaseService";
import { getMovieDetails } from "./MoviePoster";
import "./MoviePage.css"; // Import your MoviePage.css
import { ReactNetflixPlayer } from "react-netflix-player";
import Player from "qier-player";
import {
  extractRuntimeFromURL,
  getCategoriesByNumbers,
} from "../models/MovieCategories";

const MoviePage = () => {
  const { movieName }: any = useParams();
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [movieDetails, setMovieDetails] = useState<any>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    console.log(video, "video");
    if (video) {
      console.log(`Current time: ${video.currentTime} seconds`);
    }
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
                }}
              ></div>
            ) : (
              <div
                className="movie-backdrop"
                style={{
                  background: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movieDetails.posterPath}) center/cover no-repeat`,
                }}
              ></div>
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
              </div>
            </div>
            <div className="movie-container">
              <ReactNetflixPlayer
                src={movieDetails.movieUrl}
                title={movieDetails.originalTitle}
                subTitle={"Opening"}
                titleMedia={movieDetails.originalTitle}
                extraInfoMedia={"Opening"}
                autoControllCloseEnabled
                backButton={() => {}}
                fullPlayer={false}
                autoPlay={true}
                startPosition={0}
                dataNext={{ title: "." }}
                onTimeUpdate={() => handleTimeUpdate()}
                onNextClick={() => {}}
                onClickItemListReproduction={(id: any, playing: any) => {}}
                onEnded={() => {}}
              />
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
