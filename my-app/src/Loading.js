// LoadingScreen.js
import React, { useEffect } from "react";
import ProgressBar from "progressbar.js";

const LoadingScreen = () => {
  useEffect(() => {
    // Initialize the progress bar
    const bar = new ProgressBar.Path("#heart-path", {
      easing: "easeInOut",
      duration: 2800,
    });

    // Set initial value to 0
    bar.set(0);

    // Animate the progress bar to 1.0
    bar.animate(1.0);

    return () => {
      // Cleanup code if needed
    };
  }, []);

  return (
    <div id="container" style={{ top: "500px", margin: "auto", width: "500px", height: "500px", marginTop: "200px" }}>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
        <path fillOpacity="0" strokeWidth="1" stroke="#bbb" d="M81.495,13.923c-11.368-5.261-26.234-0.311-31.489,11.032C44.74,13.612,29.879,8.657,18.511,13.923  C6.402,19.539,0.613,33.883,10.175,50.804c6.792,12.04,18.826,21.111,39.831,37.379c20.993-16.268,33.033-25.344,39.819-37.379  C99.387,33.883,93.598,19.539,81.495,13.923z" />
        <path
          id="heart-path"
          fillOpacity="0"
          strokeWidth="3"
          stroke="rgb(56, 122, 221)"  
          d="M81.495,13.923c-11.368-5.261-26.234-0.311-31.489,11.032C44.74,13.612,29.879,8.657,18.511,13.923  C6.402,19.539,0.613,33.883,10.175,50.804c6.792,12.04,18.826,21.111,39.831,37.379c20.993-16.268,33.033-25.344,39.819-37.379  C99.387,33.883,93.598,19.539,81.495,13.923z"
        />
      </svg>
    </div>
  );
};

export default LoadingScreen;
