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

// Global variables for Chart.js chart instances
let quizChart, indexCardsChart, essayChart;

document.addEventListener("DOMContentLoaded", () => {
  // Existing logic for quizzes, index cards, and essays (your event listeners, etc.)
  // ... [Your existing code for quiz, essay, and index card interactions] ...

  // Initialize donut charts once Chart.js is loaded and DOM is ready
  initDonutCharts();
  updateProgressDisplay();
});

function initDonutCharts() {
  // Create chart objects if the corresponding canvas elements exist
  const quizCtx = document.getElementById("quizChart")?.getContext("2d");
  const indexCardsCtx = document.getElementById("indexCardsChart")?.getContext("2d");
  const essayCtx = document.getElementById("essayChart")?.getContext("2d");

  if (quizCtx) {
    quizChart = new Chart(quizCtx, {
      type: "doughnut",
      data: {
        // Initially zero progress
        datasets: [{
          data: [0, 100],
          backgroundColor: ["var(--btn-bg)", "#e0e0e0"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "70%",
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }

  if (indexCardsCtx) {
    indexCardsChart = new Chart(indexCardsCtx, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [0, 100],
          backgroundColor: ["var(--btn-bg)", "#e0e0e0"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "70%",
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }

  if (essayCtx) {
    essayChart = new Chart(essayCtx, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [0, 100],
          backgroundColor: ["var(--btn-bg)", "#e0e0e0"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "70%",
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }
}

function updateProgressDisplay() {
  // Read progress values from local storage (defaults if not set)
  const quizProgress = parseInt(localStorage.getItem("quizProgress") || "0");
  // For index cards we stored the count (each flip gives 10% progress)
  const indexCardsCount = parseInt(localStorage.getItem("indexCardsProgress") || "0");
  const indexCardsPercent = Math.min(indexCardsCount * 10, 100);
  // Essay progress is text length divided by 10, clamped to 100%
  const essayProgressValue = parseInt(localStorage.getItem("essayProgress") || "0");
  const essayPercent = Math.min(essayProgressValue / 10, 100);

  // Update donut charts if they have been initialized
  if (quizChart) {
    quizChart.data.datasets[0].data = [quizProgress, 100 - quizProgress];
    quizChart.update();
    document.getElementById("quizChartCenter").innerHTML = `${quizProgress}%<br>Quiz`;
  }

  if (indexCardsChart) {
    indexCardsChart.data.datasets[0].data = [indexCardsPercent, 100 - indexCardsPercent];
    indexCardsChart.update();
    document.getElementById("indexCardsChartCenter").innerHTML = `${indexCardsPercent}%<br>Cards`;
  }

  if (essayChart) {
    essayChart.data.datasets[0].data = [essayPercent, 100 - essayPercent];
    essayChart.update();
    document.getElementById("essayChartCenter").innerHTML = `${essayPercent}%<br>Essay`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const essays = {
    1: {
      title: "The Wonders of Space",
      body: "Space is vast and full of mysteries. From black holes to distant galaxies, it continues to inspire humanity."
    },
    2: {
      title: "The Beauty of Nature",
      body: "Nature's beauty lies in its diversity, from towering mountains to serene beaches and lush forests."
    },
    3: {
      title: "The Evolution of Technology",
      body: "Technology has transformed our lives, from the invention of the wheel to the rise of artificial intelligence."
    }
  };

  const modal = document.getElementById("essay-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.querySelector(".close-btn");

  document.querySelectorAll(".essay-box").forEach((box) => {
    box.addEventListener("click", () => {
      const essayLink = box.getAttribute("data-essay-link");
      if (essayLink) {
        window.location.href = essayLink; // Navigate to the essay page
      }
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

