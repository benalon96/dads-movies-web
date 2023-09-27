import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { getMoviePoster, searchMovieTrailer } from "../components/MoviePoster";
import "./MovieCard.css";

const MovieCard = ({ movie }: any) => {
  const [posterUrl, setPosterUrl] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  // Fetch and set the poster URL when the component mounts or when the movie name changes
  useEffect(() => {
    if (movie && movie.name) {
      const fetchPoster = async () => {
        try {
          const url = await getMoviePoster(movie.name);
          setPosterUrl(url);
        } catch (error) {
          console.error("Error fetching movie poster:", error);
        }
      };

      fetchPoster();
    }
  }, [movie]);

  return (
    // Use Link to navigate to the MoviePage and pass the movie name as a parameter
    <Link
      to={`/movie/${encodeURIComponent(movie.originalTitle)}`}
      className="movie-link">
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
              alt={movie.originalTitle}
              style={{ width: "150px", height: "200px" }}
            />
          </div>
          <div className="flip-card-back">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
              alt={movie.originalTitle}
              style={{ width: "150px", height: "200px" }}
            />
            <div className="text-overlay">
              <p>{movie.originalTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
