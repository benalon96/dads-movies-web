import React, { useState, useEffect } from "react";
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
  // const playTrailer = async () => {
  //   try {
  //     const url = await getMovieTrailer(movie.name);
  //     setTrailerUrl(url);
  //     console.log(trailerUrl, "TrailerUrl");
  //   } catch (error) {
  //     console.error("Error fetching movie trailer:", error);
  //   }
  // };
  const playTrailer = async () => {
    try {
      const url = await searchMovieTrailer(movie.name);
      setTrailerUrl(url);
      console.log(trailerUrl, "TrailerUrl");
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
    }
  };
  return (
    <div className="movie-card">
      <button onClick={playTrailer}>Play Trailer</button>
      <img
        className="movie-card-img"
        src={posterUrl ? posterUrl : movie.pictureUrl}
        alt={movie && movie.name}
      />
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.name}</h3>

        {trailerUrl && (
          <iframe
            title="Movie Trailer"
            width="320"
            height="180"
            src={trailerUrl}
            frameBorder="0"
            allowFullScreen></iframe>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
