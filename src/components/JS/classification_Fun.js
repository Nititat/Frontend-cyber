import $ from 'jquery';

let isHidden = true; // Tracks visibility of container-item
let isAnimating = false; // Prevents repeated animations during a single click

export const setupClassificationAnimation = () => {
  // Initial CSS setup
  $(".container-item").css({
    marginBottom: "0px",
    opacity: 1,
  });

  $(".Classification").css({
    marginTop: "0px",
    position: "relative", // Ensure proper positioning for animations
  });

  $(".Classification").click(function () {
    if (isAnimating) return; // Prevent additional clicks during animation
    isAnimating = true;

    // Calculate responsive values
    const marginBottomValue = isHidden ? "-20%" : "0px"; // เพิ่มระยะลง
    const marginTopValue = isHidden ? "50%" : "0px"; // เพิ่มระยะขึ้น

    if (isHidden) {
      // Hide container-item and move Classification down
      $(".container-item").animate(
        {
          marginBottom: marginBottomValue,
          opacity: 0,
        },
        200,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
      $(".Classification").animate(
        {
          marginTop: marginTopValue,
        },
        200
      );
    } else {
      // Show container-item and move Classification up
      $(".container-item").animate(
        {
          marginBottom: marginBottomValue,
          opacity: 1,
        },
        200,
        () => {
          isAnimating = false; // Allow new animation after completion
        }
      );
      $(".Classification").animate(
        {
          marginTop: marginTopValue,
        },
        200
      );
    }

    isHidden = !isHidden; // Toggle visibility state
  });

  // Adjust animation values on window resize
  $(window).resize(() => {
    // Recalculate values dynamically for different screen sizes
    const responsiveMarginBottom = isHidden ? "-20%" : "0px";
    const responsiveMarginTop = isHidden ? "50%" : "0px";

    $(".container-item").css({
      marginBottom: responsiveMarginBottom,
    });
    $(".Classification").css({
      marginTop: responsiveMarginTop,
    });
  });

  // Optional: Reset animation state if necessary
  $(window).on("load", () => {
    isHidden = true;
    $(".container-item").css({
      marginBottom: "0px",
      opacity: 1,
    });
    $(".Classification").css({
      marginTop: "0px",
    });
  });
};
