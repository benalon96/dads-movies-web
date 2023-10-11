import React, { useEffect, useState, useRef } from "react";
import { mergeMovieData } from "../FirebaseService";
import MovieCard from "../models/MovieCard";
import "./HomePage.css";
import Navbar from "../models/Navbar";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getMovieDetails, getMoviePoster } from "./MoviePoster";
import { Carousel } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getCategoriesByNumbers } from "../models/MovieCategories";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext";
import arrowRight from "../images/arrowRight.svg";
import arrowLeft from "../images/arrowLeft.svg";

const HomePage = () => {
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [moviesDetails, setMoviesDetails] = useState<any[]>([]);
  const [comedyMovies, setComedyMovies] = useState<any[]>([]);
  const [dramaMovies, setDramaMovies] = useState<any[]>([]);
  const [newMovies, setNewMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login"); // Redirect to the login page
    }
  }, [currentUser, isLoading]);
  // Slick slider settings
  const sliderSettings = {
    infinite: true,
    slidesToShow: 12, // You can adjust the number of movies shown per slide
    slidesToScroll: 12,
    speed: 3000,
    prevArrow: <SamplePrevArrow />, // Add custom prevArrow component
    nextArrow: <SampleNextArrow />, // Add custom nextArrow component
    loading: "lazy",
    responsive: [
      {
        breakpoint: 1600, // Adjust this breakpoint for your 27-inch screen
        settings: {
          slidesToShow: 8,
          slidesToScroll: 8,
        },
      },
      {
        breakpoint: 1200, // Adjust this breakpoint for larger tablets
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
        },
      },
      {
        breakpoint: 768, // Adjust this breakpoint for standard tablets
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 480, // Adjust this breakpoint for mobile screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      // Add more breakpoints and settings as needed
    ],
  };

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
              movieName: movie.name || "",
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
    // filterMovies(searchQuery);
    filterMoviesByCategory();
  }, [searchQuery, moviesDetails]);

  const filterMoviesByCategory = () => {
    const comedyMovies = moviesDetails.filter(
      (movie) =>
        movie.categories.includes(35) || movie.categories.includes(10751)
    );

    setComedyMovies(comedyMovies);

    const newMovies = moviesDetails.filter((movie) => {
      const releaseYear = new Date(movie.releaseDate).getFullYear();
      return releaseYear >= 2020;
    });

    setNewMovies(newMovies);

    const dramaMovies = moviesDetails.filter(
      (movie) => movie.categories.includes(18) || movie.categories.includes(28)
    );

    setDramaMovies(dramaMovies);
  };

  const realeseDate = (date: any) => {
    const releaseYear = new Date(date).getFullYear();
    return releaseYear;
  };

  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
  };

  // Custom prevArrow component
  function SamplePrevArrow(props: any) {
    const { onClick, onMouseEnter } = props;

    // Use state to track whether the arrow is currently hovered
    const [isHovered, setIsHovered] = useState(false);

    // Use a ref to store the interval ID
    const intervalRef = useRef<number | null>(null);

    // Function to repeatedly click the arrow when hovered
    const startRepeatingClick = () => {
      setIsHovered(true);

      // Repeat the arrow click every 500 milliseconds
      intervalRef.current = window.setInterval(() => {
        onClick();
      }, 500);
    };

    // Function to stop repeating the click
    const stopRepeatingClick = () => {
      setIsHovered(false);

      // Clear the interval when not hovered
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    return (
      <div
        onMouseEnter={startRepeatingClick}
        onMouseLeave={stopRepeatingClick}
        onClick={onClick}>
        <img
          style={{
            left: "30px",
            zIndex: "100",
            width: isHovered ? "40px" : "30px",
            height: isHovered ? "40px" : "30px",
            transition: "width 0.3s, height 0.3s",
          }}
          className={`slick-arrow slick-prev ${isHovered ? "hovered" : ""}`}
          src={arrowLeft}
          alt=""
        />
      </div>
    );
  }

  // Custom nextArrow component
  function SampleNextArrow(props: any) {
    const { onClick, onMouseEnter } = props;

    // Use state to track whether the arrow is currently hovered
    const [isHovered, setIsHovered] = useState(false);

    // Use a ref to store the interval ID
    const intervalRef = useRef<number | null>(null);

    // Function to repeatedly click the arrow when hovered
    const startRepeatingClick = () => {
      setIsHovered(true);

      // Repeat the arrow click every 500 milliseconds
      intervalRef.current = window.setInterval(() => {
        onClick();
      }, 500);
    };

    // Function to stop repeating the click
    const stopRepeatingClick = () => {
      setIsHovered(false);

      // Clear the interval when not hovered
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    return (
      <div
        onMouseEnter={startRepeatingClick}
        onMouseLeave={stopRepeatingClick}
        onClick={onClick}>
        <img
          style={{
            right: "30px",
            zIndex: "100",
            width: isHovered ? "40px" : "30px",
            height: isHovered ? "40px" : "30px",
            transition: "width 0.3s, height 0.3s",
          }}
          className={`slick-arrow slick-next ${isHovered ? "hovered" : ""}`}
          src={arrowRight}
          alt=""
        />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "rgb(20, 20, 19)",
        height: "100%",
      }}>
      <Navbar onSearchInputChange={handleSearchInputChange} />
      <Carousel
        className="custom-carousel"
        controls={false}
        indicators={false}
        slide={true}
        pause={false}
        onSelect={() => {}}>
        {newMovies.map((movie, index) => (
          <Carousel.Item
            key={index}
            interval={5000}
            className="custom-carousel-item text-focus-in"
            style={{
              background: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdropPath}) center/cover no-repeat`,
              transition: "transform 0.5s ease",
            }}>
            <div style={{ float: "left", bottom: "0" }}>
              <div className="info_section ">
                <div className=" text-focus-in">
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
                </div>
                <div style={{ marginTop: "5%", width: "50%" }}>
                  <h1 className="movie_name text-focus-in">
                    {movie.originalTitle}
                  </h1>
                  <h4 className="date text-focus-in">
                    {realeseDate(movie.releaseDate)}
                  </h4>
                  <span className="minutes text-focus-in">117 min</span>
                  <p className="type text-focus-in">
                    {getCategoriesByNumbers(movie.categories)}
                  </p>
                  <p className="text text-focus-in">{movie.overview}</p>
                </div>
              </div>
              <Link to={`/movie/${encodeURIComponent(movie.movieName)}`}>
                <button className="button_movie jello-vertical">
                  Watch Now!
                </button>
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
          {`New movies (${newMovies.length})`}
        </h2>
        {newMovies.length > 0 ? (
          <Slider {...sliderSettings}>
            {newMovies.map((movie, index) => (
              <Link key={index} to={`/movie/${movie.name}`}>
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
          {`Drama movies (${dramaMovies.length})`}
        </h2>
        {dramaMovies.length > 0 ? (
          <Slider {...sliderSettings}>
            {dramaMovies.map((movie, index) => (
              <Link key={index} to={`/movie/${movie.movieName}`}>
                <MovieCard movie={movie} loading="lazy" />
              </Link>
            ))}
          </Slider>
        ) : (
          <p>No movies available.</p>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "50px",
        }}>
        <h2
          style={{
            color: "white",
            textAlign: "right",
            float: "right",
            padding: "20px",
            marginTop: "20px",
          }}>
          {`Comedy movies (${comedyMovies.length})`}
        </h2>
        {comedyMovies.length > 0 ? (
          <Slider {...sliderSettings}>
            {comedyMovies.map((movie, index) => (
              <Link key={index} to={`/movie/${movie.movieName}`}>
                <MovieCard movie={movie} />
              </Link>
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
