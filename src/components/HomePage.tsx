import React, { useEffect, useState } from "react";
import { mergeMovieData } from "../FirebaseService";
import MovieCard from "../models/MovieCard";
import "./HomePage.css";
import Navbar from "../models/Navbar";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  getMovieDetails,
  getMoviePoster,
  searchMovieTrailer,
} from "./MoviePoster";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [moviesDetails, setMoviesDetails] = useState<any[]>([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [moviePosters, setMoviePosters] = useState<string[]>([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const data: any = await mergeMovieData();
        setMoviesData(data);

        // Fetch movie posters for each movie and store movie details
        const posterAndDetailsPromises = data.map(async (movie: any) => {
          const [posterUrl, details] = await Promise.all([
            getMoviePoster(movie.name),
            getMovieDetails(movie.name), // Fetch movie details
          ]);
          setMoviesDetails((prevMoviesDetails) => [
            ...prevMoviesDetails,
            {
              originalTitle: details.original_title || "", // Ensure you have a default value
              backdropPath: details.backdrop_path || "",
              overview: details.overview || "", // Ensure you have a default value
              releaseDate: details.release_date || "", // Ensure you have a default value
              voteAverage: details.vote_average || "", // Ensure you have a default value
              posterPath: details.poster_path || "", // Ensure you have a default value
              movieUrl: movie.movieUrl || "", // Ensure you have a default value
            },
          ]);
          setMoviePosters((prevMoviePosters: any) => [
            ...prevMoviePosters,
            posterUrl || "",
          ]);
        });

        // Wait for all poster and details promises to resolve
        await Promise.all(posterAndDetailsPromises);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, []);
  console.log(moviesDetails, "test");
  useEffect(() => {
    const handleNext = () => {
      if (activeIndex === moviePosters.length - 1) {
        setActiveIndex(0);
      } else {
        setActiveIndex(activeIndex + 1);
      }
    };

    const intervalId = setInterval(handleNext, 10000);

    return () => clearInterval(intervalId);
  }, [activeIndex, moviePosters]);

  const handleMovieCardClick = (movie: any) => {
    // Instead of using <MoviePage />, use Link to navigate to MoviePage and pass the movie object
    // This assumes you have set up your routes properly with React Router
  };

  const playTrailer = async (movieTitle: string) => {
    try {
      const url = await searchMovieTrailer(movieTitle);
      setTrailerUrl(url);
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
    }
  };

  return (
    <div>
      <Carousel
        className="custom-carousel"
        controls={false}
        indicators={false}
        onSelect={() => {}}>
        {moviesDetails.map((movie, index) => (
          <Carousel.Item
            key={index}
            interval={10000}
            style={{
              maxHeight: "420px",
              background: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdropPath}) center/cover no-repeat`,
            }}>
            <div style={{ float: "right", bottom: "0" }}>
              <div className="info_section">
                <div className="movie_header">
                  <img
                    style={{
                      float: "left",
                      height: "300px",
                      marginLeft: "0px",
                      width: "200px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      padding: "20px",
                    }}
                    src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
                    alt={`Movie Poster ${index + 1}`}
                  />
                  <h1 className="movie_name">{movie.originalTitle}</h1>
                  <h4 className="date">{movie.releaseDate}</h4>
                  <span className="minutes">117 min</span>
                  <p className="type">Action, Crime, Fantasy</p>
                  <p className="text">{movie.overview}</p>
                </div>
                <button className="button_movie">Watch Now!</button>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <div className="movie-list">
        <Navbar />
        {moviesData && moviesData.length > 0 ? (
          moviesData.map((movie, index) => (
            <Link
              key={index}
              to={`/movie/${movie.name}`}
              className="movie-card-link">
              <MovieCard movie={movie} />
            </Link>
          ))
        ) : (
          <p>No movies available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
