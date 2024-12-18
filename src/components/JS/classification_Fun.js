import $ from 'jquery';

let isHidden = true; // Tracks visibility of container-item
let isAnimating = false; // Prevents repeated animations during a single click

export const setupClassificationAnimation = () => {
  $(".Classification").click(function () {
    if (isAnimating) return; // Prevent additional clicks during animation
    isAnimating = true;

    if (isHidden) {
      // Hide container-item and move Classification down
      $(".container-item").animate(
        {
          marginBottom: "-100px",
          opacity: 0,
        },
        100,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
      $(".Classification").animate(
        {
          marginTop: "230px",
        },
        100
      );
    } else {
      // Show container-item and move Classification up
      $(".container-item").animate(
        {
          marginBottom: "0px",
          opacity: 1,
          transition: "0.3s"
        },
        10,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
      $(".Classification").animate(
        {
          marginTop: "0px",
        },
        100
      );
    }

    isHidden = !isHidden; // Toggle visibility state
  });
};
