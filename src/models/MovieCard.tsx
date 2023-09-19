import React, { useState, useEffect } from "react";
import { getMoviePoster } from "../components/MoviePoster";
import "./MovieCard.css"; // Import your CSS for styling

const MovieCard = ({ movie }: any) => {
  const [posterUrl, setPosterUrl] = useState("");

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
    <div className="movie-card">
      <img
        className="movie-card-img"
        src={posterUrl ? posterUrl : movie.pictureUrl}
        alt={movie && movie.name}
      />
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.name}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
