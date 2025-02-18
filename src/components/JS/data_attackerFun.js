import $ from 'jquery';

let isHiddens = true; // Tracks visibility of tableContainer
let isAnimatings = false; // Prevents repeated animations during a single click

export const setupDataAttackerAnimation = () => {
  // Initial CSS setup
  $(".DataAttacker_log").css({
    "z-index": "999",
    position: "relative", // Ensure proper positioning for z-index
    marginTop: "0px", // Ensure default position
  });

  $(".tableContainer").css({
    marginBottom: "0px",
    opacity: 1, // Ensure visible by default
  });

  $(".DataAttacker_log").click(function () {
    if (isAnimatings) return; // Prevent additional clicks during animation
    isAnimatings = true;

    // Fixed values for marginBottom and marginTop
    const marginBottomValue = isHiddens ? "-20%" : "0px"; // Fixed 20% for hiding
    const marginTopValue = isHiddens ? "16.69%" : "0px"; // Fixed 16.69% for showing

    if (isHiddens) {
      // Hide tableContainer and move DataAttacker_log down
      $(".tableContainer").animate(
        {
          marginBottom: marginBottomValue,
          opacity: 0,
        },
        200, // Smooth animation duration
        () => {
          isAnimatings = false; // Allow new animation after completion
        }
      );
      $(".DataAttacker_log").animate(
        {
          marginTop: marginTopValue,
        },
        200
      );
    } else {
      // Show tableContainer and move DataAttacker_log up
      $(".tableContainer").animate(
        {
          marginBottom: marginBottomValue,
          opacity: 1,
        },
        200, // Smooth animation duration
        () => {
          isAnimatings = false; // Allow new animation after completion
        }
      );
      $(".DataAttacker_log").animate(
        {
          marginTop: marginTopValue,
        },
        200
      );
    }

    isHiddens = !isHiddens; // Toggle visibility state
  });

  // Adjust animation values on window resize
  $(window).resize(() => {
    // Fixed values for responsive styles
    const responsiveMarginBottom = isHiddens ? "-20%" : "0px";
    const responsiveMarginTop = isHiddens ? "16.69%" : "0px";

    // Update styles dynamically
    $(".tableContainer").css({
      marginBottom: responsiveMarginBottom,
    });
    $(".DataAttacker_log").css({
      marginTop: responsiveMarginTop,
    });
  });

  // Reset state on page load to ensure correct initialization
  $(window).on("load", () => {
    isHiddens = true;
    $(".tableContainer").css({
      marginBottom: "0px",
      opacity: 1,
    });
    $(".DataAttacker_log").css({
      marginTop: "0px",
    });
  });
};
