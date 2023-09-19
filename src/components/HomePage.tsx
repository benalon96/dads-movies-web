import React, { useEffect, useState } from "react";
import { mergeMovieData } from "../FirebaseService";
import MovieCard from "../models/MovieCard";
import "./HomePage.css";
import Navbar from "../models/Navbar";
import Footer from "../models/Footer";

const HomePage = () => {
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch movie data when the component mounts
    const fetchMovieData = async () => {
      try {
        const data: any = await mergeMovieData();

        setMoviesData(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        // After data is fetched (or an error occurs), set isLoading to false
        setIsLoading(false);
      }
    };

    fetchMovieData();

    // Ensure the dependency array is empty to run the effect only once
  }, [moviesData]);
  console.log(moviesData.length, "Fetched Data"); // Log the fetched data
  return (
    <div>
      <Navbar />
      <div className="movie-list">
        {moviesData && moviesData.length > 0 ? (
          moviesData.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))
        ) : (
          <p>No movies available.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default HomePage;
