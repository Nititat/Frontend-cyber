import $ from 'jquery';

let isHiddens = true; // Tracks visibility of tableContainer
let isAnimatings = false; // Prevents repeated animations during a single click

export const setupDataAttackerAnimation = () => {
  $(".DataAttacker_log").css({
    "z-index": "999",
    
  })
  $(".DataAttacker_log").click(function () {
    if (isAnimatings) return; // Prevent additional clicks during animation
    isAnimatings = true;

    if (isHiddens) {
      // Hide tableContainer and move DataAttacker_log down
      $(".tableContainer").animate(
        {
          marginBottom: "-100px",
          opacity: 0,
        },
        100, // Duration of 500ms
        () => {
          isAnimatings = false; // Allow new animation after completion
        }
      );
      $(".DataAttacker_log").animate(
        {
          marginTop: "230px",
        },
        100
      );
      $(".DataAttacker_log").css({
        "z-index": "999"
      })
      $("")
    } else {
      // Show tableContainer and move DataAttacker_log up
      $(".tableContainer").animate(
        {
          marginBottom: "0px",
          opacity: 1,
        },
        10, // Duration of 500ms
        () => {
          isAnimatings = false; // Allow new animation after completion
        }
      );
      $(".DataAttacker_log").animate(
        {
          marginTop: "0px",
        },
        100
      );
    }

    isHiddens = !isHiddens; // Toggle visibility state
  });
};
