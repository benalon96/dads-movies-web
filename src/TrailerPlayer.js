import React from "react";
import ReactPlayer from "react-player";

const TrailerPlayer = ({ trailerUrl, onClose }) => {
  console.log(trailerUrl, "trailerUrl11");
  return (
    <div className="trailer-player">
      <ReactPlayer
        url={trailerUrl}
        width="100%"
        height="400px"
        controls
        playing
        onEnded={onClose}
      />
    </div>
  );
};

export default TrailerPlayer;
