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

  // Function to play the trailer
  const playTrailer = async () => {
    try {
      const url = await searchMovieTrailer(movie.name);
      setTrailerUrl(url);
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
    }
  };

  return (
    // Use Link to navigate to the MoviePage and pass the movie name as a parameter
    <Link
      to={`/movie/${encodeURIComponent(movie.name)}`}
      className="movie-link">
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img
              src={posterUrl ? posterUrl : movie.pictureUrl}
              alt={movie.name}
              style={{ width: "150px", height: "200px" }}
            />
          </div>
          <div className="flip-card-back">
            <img
              src={posterUrl ? posterUrl : movie.pictureUrl}
              alt={movie.name}
              style={{ width: "150px", height: "200px" }}
            />
            <div className="text-overlay">
              <p>{movie.name}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
