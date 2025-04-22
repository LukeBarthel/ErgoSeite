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
  