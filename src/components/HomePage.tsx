import React, { useEffect, useState } from "react";
import { mergeMovieData } from "../FirebaseService";
import MovieCard from "../models/MovieCard";
import "./HomePage.css";
import Navbar from "../models/Navbar";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getMovieDetails, getMoviePoster } from "./MoviePoster";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getCategoriesByNumbers } from "../models/MovieCategories";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [moviesDetails, setMoviesDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const data: any = await mergeMovieData();
        setMoviesData(data);

        const posterAndDetailsPromises = data.map(async (movie: any) => {
          const [posterUrl, details] = await Promise.all([
            getMoviePoster(movie.name),
            getMovieDetails(movie.name),
          ]);

          setMoviesDetails((prevMoviesDetails) => [
            ...prevMoviesDetails,
            {
              originalTitle: details.original_title || "",
              backdropPath: details.backdrop_path || "",
              overview: details.overview || "",
              releaseDate: details.release_date || "",
              voteAverage: details.vote_average || "",
              posterPath: details.poster_path || "",
              movieUrl: movie.movieUrl || "",
              categories: details.genre_ids || [],
            },
          ]);
        });

        await Promise.all(posterAndDetailsPromises);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, []);

  useEffect(() => {
    filterMovies(searchQuery);
  }, [searchQuery, moviesDetails]);

  const realeseDate = (date: any) => {
    const releaseYear = new Date(date).getFullYear();
    return releaseYear;
  };

  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
  };

  const filterMovies = (query: string) => {
    const filtered = moviesDetails.filter((movie) =>
      movie.originalTitle.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  // Slick slider settings
  const sliderSettings = {
    infinite: true,
    slidesToShow: 8, // You can adjust the number of movies shown per slide
    slidesToScroll: 1,
    prevArrow: <SamplePrevArrow />, // Add custom prevArrow component
    nextArrow: <SampleNextArrow />, // Add custom nextArrow component
  };

  // Custom prevArrow component
  function SamplePrevArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-prev "
        style={{ left: "20px", zIndex: "100" }}
        onClick={onClick}>
        Previous
      </div>
    );
  }

  // Custom nextArrow component
  function SampleNextArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-next"
        style={{ right: "20px", zIndex: "100" }}
        onClick={onClick}>
        Next
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "rgb(20, 20, 19)", height: "100%" }}>
      <Navbar onSearchInputChange={handleSearchInputChange} />
      <Carousel
        className="custom-carousel"
        controls={false}
        indicators={false}
        slide={true}
        pause={false}
        onSelect={() => {}}>
        {moviesDetails.map((movie, index) => (
          <Carousel.Item
            key={index}
            interval={5000}
            className="custom-carousel-item"
            style={{
              background: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdropPath}) center/cover no-repeat`,
              transition: "transform 0.5s ease",
            }}>
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
      <div
        style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
        <h2
          style={{
            color: "white",
            textAlign: "right",
            float: "right",
            padding: "20px",
            marginTop: "20px",
          }}>
          Featured Movies
        </h2>
        {moviesDetails.length > 0 ? (
          <Slider {...sliderSettings}>
            {moviesDetails.map((movie, index) => (
              <Link key={index} to={`/movie/${movie.originalTitle}`}>
                <MovieCard movie={movie} />
              </Link>
            ))}
          </Slider>
        ) : (
          <p>No movies available.</p>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2
          style={{
            color: "white",
            textAlign: "right",
            float: "right",
            padding: "20px",
            marginTop: "20px",
          }}>
          Featured Movies
        </h2>
        {moviesDetails.length > 0 ? (
          <Slider {...sliderSettings}>
            {moviesDetails.map((movie, index) => (
              <div key={index}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </Slider>
        ) : (
          <p>No movies available.</p>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2
          style={{
            color: "white",
            textAlign: "right",
            float: "right",
            padding: "20px",
            marginTop: "20px",
          }}>
          Featured Movies
        </h2>
        {moviesDetails.length > 0 ? (
          <Slider {...sliderSettings}>
            {moviesDetails.map((movie, index) => (
              <div key={index}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </Slider>
        ) : (
          <p>No movies available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
