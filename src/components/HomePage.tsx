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
import { getCategoriesByNumbers } from "../models/MovieCategories";

const HomePage = () => {
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [moviesDetails, setMoviesDetails] = useState<any[]>([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
            console.log(posterAndDetailsPromises, "details"),
          ]);
          console.log(details, "details"),
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
                categories: details.genre_ids || "",
              },
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

  const playTrailer = async (movieTitle: string) => {
    try {
      const url = await searchMovieTrailer(movieTitle);
      setTrailerUrl(url);
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
    }
  };
  const realeseDate = (date: any) => {
    const releaseYear = new Date(date).getFullYear();
    return releaseYear;
  };
  return (
    <div style={{ backgroundColor: "rgb(20, 20, 19)", height: "120vh" }}>
      <Carousel
        className="custom-carousel"
        controls={false}
        indicators={false}
        slide={true}
        pause={false}
        onSelect={() => {}}
      >
        {moviesDetails.map((movie, index) => (
          <Carousel.Item
            key={index}
            interval={5000}
            className="custom-carousel-item"
            style={{
              background: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdropPath}) center/cover no-repeat`,
              transition: "transform 0.5s ease",
            }}
          >
            <div style={{ float: "left", bottom: "0" }}>
              <div className="info_section">
                <img
                  style={{
                    float: "left",
                    marginTop: "3%",
                    width: "200px",
                    borderRadius: "10px",
                    objectFit: "cover",
                    padding: "20px",
                  }}
                  src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
                  alt={`Movie Poster ${index + 1}`}
                />
                <div style={{ marginTop: "5%", width: "50%" }}>
                  <h1 className="movie_name">{movie.originalTitle}</h1>
                  <h4 className="date">{realeseDate(movie.releaseDate)}</h4>
                  <span className="minutes">117 min</span>
                  <p className="type">
                    {getCategoriesByNumbers(movie.categories)}
                  </p>
                  <p className="text">{movie.overview}</p>
                </div>
              </div>
              <Link to={`/movie/${encodeURIComponent(movie.originalTitle)}`}>
                <button className="button_movie">Watch Now!</button>
              </Link>
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
              className="movie-card-link"
            >
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
