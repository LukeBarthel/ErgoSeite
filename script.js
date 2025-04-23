document.addEventListener("DOMContentLoaded", () => {
    const quizContainer = document.getElementById("quiz-container");
    const startQuizButton = document.getElementById("start-quiz");
  
    if (startQuizButton) {
      startQuizButton.addEventListener("click", () => {
        quizContainer.innerHTML = `
          <div class="quiz-question">
            <p>Question 1: What is 2 + 2?</p>
            <button onclick="alert('Correct!')">4</button>
            <button onclick="alert('Incorrect. Try again!')">5</button>
          </div>
        `;
      });
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  // --- QUIZ PAGE LOGIC ---
  const startQuizButton = document.getElementById("start-quiz");
  const quizContainer = document.getElementById("quiz-container");

  if (startQuizButton && quizContainer) {
    startQuizButton.addEventListener("click", () => {
      quizContainer.innerHTML = `
        <div class="quiz-question">
          <p>Question 1: What is 2 + 2?</p>
          <button id="option-correct">4</button>
          <button id="option-incorrect">5</button>
        </div>
      `;

      // Bind handlers for the new quiz buttons
      const correctBtn = document.getElementById("option-correct");
      const incorrectBtn = document.getElementById("option-incorrect");

      correctBtn.addEventListener("click", () => {
        alert("Correct!");
        // Here, for example, we set quiz progress to 100 (could be a percentage)
        localStorage.setItem("quizProgress", "100");
        updateProgressDisplay();
      });

      incorrectBtn.addEventListener("click", () => {
        alert("Incorrect. Try again!");
      });
    });
  }

  // --- ESSAY PAGE LOGIC ---
  const essayInput = document.getElementById("essay-input");
  if (essayInput) {
    // Restore saved essay text if available
    const savedEssay = localStorage.getItem("essayInput");
    if (savedEssay) {
      essayInput.value = savedEssay;
    }

    // Save progress on input
    essayInput.addEventListener("input", (e) => {
      localStorage.setItem("essayInput", e.target.value);
      // Option: use text length or completion status as a progress metric
      localStorage.setItem("essayProgress", e.target.value.length);
      updateProgressDisplay();
    });
  }

  // --- INDEX CARDS LOGIC ---
  const cardElements = document.querySelectorAll(".card");
  if (cardElements.length) {
    // You can store flip state of each card in an array (one boolean per card)
    let cardsProgress = JSON.parse(localStorage.getItem("cardsProgress") || "[]");

    // Restore flip state if the user had already interacted with the cards
    cardElements.forEach((card, index) => {
      const cardInner = card.querySelector(".card-inner");
      if (cardsProgress[index]) {
        cardInner.classList.add("flipped");
      }
      card.addEventListener("click", () => {
        // Toggle flip by adding/removing a CSS class
        cardInner.classList.toggle("flipped");
        // Update progress state for this card
        cardsProgress[index] = !cardsProgress[index];
        localStorage.setItem("cardsProgress", JSON.stringify(cardsProgress));
        // Option: count how many cards have been flipped to represent progress
        const flippedCount = cardsProgress.filter((status) => status).length;
        localStorage.setItem("indexCardsProgress", flippedCount);
        updateProgressDisplay();
      });
    });
  }

  // Update progress when the page loads by reading from local storage
  updateProgressDisplay();
});

function updateProgressDisplay() {
  // Read progress values from local storage (defaulting to zero if not set)
  const quizProgress = parseInt(localStorage.getItem("quizProgress") || "0");
  const indexCardsProgress = parseInt(localStorage.getItem("indexCardsProgress") || "0");
  // For essays, you might use text length; adjust the metric as you see fit
  const essayProgress = parseInt(localStorage.getItem("essayProgress") || "0");

  // Combine these into an overall progress percentage.
  // The weighting here is arbitrary – adjust the math based on your desired scoring.
  // For example, assume:
  //    Quiz: 100 is complete,
  //    Each flipped card might add 10% (if you have 10 cards),
  //    Essay: every 10 characters counts as 1%.
  const essayPercent = Math.min((essayProgress / 10), 100);
  const indexCardsPercent = Math.min(indexCardsProgress * 10, 100);

  // For simplicity, average the three progress values:
  const overallProgress = (quizProgress + indexCardsPercent + essayPercent) / 3;

  // Update the progress display in the user dropdown if it exists
  const progressStats = document.getElementById("progress-stats");
  if (progressStats) {
    progressStats.textContent = "Progress: " + overallProgress.toFixed(0) + "%";
  }
}
  