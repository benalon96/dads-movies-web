import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../models/Navbar";
import { mergeMovieData } from "../FirebaseService";
import { getMovieDetails } from "./MoviePoster";
import "./MoviePage.css"; // Import your MoviePage.css
import { ReactNetflixPlayer } from "react-netflix-player";

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
    <div style={{ backgroundColor: "rgb(20, 20, 19)", height: "120vh" }}>
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
                {/* <img
                  className="movie-poster"
                  src={`https://image.tmdb.org/t/p/w300${movieDetails.posterPath}`}
                  alt={`Movie Poster ${movieDetails + 1}`}
                /> */}
                <div className="movie-details">
                  <h1 className="movie_header">{movieDetails.originalTitle}</h1>
                  <h4 className="date">{movieDetails.releaseDate}</h4>
                  <span className="minutes">117 min</span>
                  <p className="type">Action, Crime, Fantasy</p>
                  <p className="text">{movieDetails.overview}</p>
                </div>
                <div>
                  <ReactNetflixPlayer
                    // Vídeo Link - Just data is required
                    src={movieDetails.movieUrl}
                    // src={"http://videoinvalid"}
                    title={movieDetails.originalTitle}
                    subTitle={"Opening"}
                    titleMedia={movieDetails.originalTitle}
                    extraInfoMedia={"Opening"}
                    autoControllCloseEnabled
                    // Action when the button X (close) is clicked
                    backButton={() => {}}
                    // The player use the all viewport
                    fullPlayer={false}
                    // The video starts when the component is render
                    autoPlay={true}
                    // The start position video
                    startPosition={0}
                    // The info of the next video action
                    dataNext={{ title: "." }}
                    // The action call when the next video is clicked
                    onNextClick={() => {}}
                    // The list reproduction data, will be render in this order
                    // reprodutionList={[
                    //   {
                    //     nome: "Opening",
                    //     id: 1,
                    //     playing: true,
                    //   },
                    //   {
                    //     nome: "Teste",
                    //     id: 2,
                    //     playing: false,
                    //   },
                    // ]}
                    // The function call when a item in reproductionList is clicked
                    onClickItemListReproduction={(id: any, playing: any) => {}}
                    // The function is call when the video finish
                    onEnded={() => {}}
                    // The function is call when the video is playing (One time for frame)
                    onTimeUpdate={() => {}}
                  />
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
