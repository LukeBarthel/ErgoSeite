document.addEventListener("DOMContentLoaded", () => {
    if (document.body.contains(document.querySelector("#index-cards"))) {
        const knownCardsKey = 'KnownCards'; // Key for local storage
        const knownCards = JSON.parse(localStorage.getItem(knownCardsKey)) || []; // Retrieve the list of known cards

        // Loop through all cards and add the 'known' class to known cards
        const cards = document.querySelectorAll(".cards-container .card");
        cards.forEach((card, index) => {
            if (knownCards.includes(index + 1)) { // Card indices are 1-based
                card.classList.add("known");
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if(document.body.contains(document.querySelector(".user-dropdown"))) {
        const Quiz_Amount = 7;
        let Quiz_Percentages = 0;
        for (let i = 1; i <= Quiz_Amount; i++) {
            Quiz_Percentages += localStorage.getItem('Score' + i) ? parseInt(localStorage.getItem('Score' + i)) : 0; // Add the score for each quiz
        }
        const Quiz_Percentage = Quiz_Percentages ? parseInt(Quiz_Percentages / Quiz_Amount) : 0;
        const Index_Amount = 7;
        const Index_Percentage = localStorage.getItem('KnownCards') ? parseInt(JSON.parse(localStorage.getItem('KnownCards')).length / Index_Amount * 100) : 0; // Calculate the percentage of known cards
        const Essay_Amount = 7;
        let Essay_Percentages = 0;
        for (let i = 1; i <= Essay_Amount; i++) {
            const Scroll_Progress = localStorage.getItem('HighestScrollPosition_' + i);
            const Max_Scroll = localStorage.getItem('MaxScrollPosition_' + i);
            if (Scroll_Progress && Max_Scroll) {
                Essay_Percentages += parseInt(Scroll_Progress) / parseInt(Max_Scroll) * 100;
            }
        }
        const Essay_Percentage = parseInt(Essay_Percentages / Essay_Amount);

        // Function to create a donut chart
    function createDonutChart(canvasId, percentage, centerId, label) {
        const ctx = document.getElementById(canvasId).getContext("2d");
        new Chart(ctx, {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [percentage, 100 - percentage],
                        backgroundColor: ["#ff5a5f", "#e0e0e0"], // Colors for the chart
                        borderWidth: 0,
                    },
                ],
            },
            options: {
                cutout: "70%", // Creates the donut effect
                plugins: {
                    tooltip: { enabled: false }, // Disable tooltips
                },
            },
        });

        // Update the center text
        const centerElement = document.getElementById(centerId);
        centerElement.innerHTML = `${percentage}%<br>${label}`;
    }

    // Create the charts
    createDonutChart("quizChart", Quiz_Percentage, "quizChartCenter", "Quiz");
    createDonutChart("indexCardsChart", Index_Percentage, "indexCardsChartCenter", "Karten");
    createDonutChart("essayChart", Essay_Percentage, "essayChartCenter", "Texte");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is on an essay page
    if (document.body.contains(document.querySelector(".essay-main"))) {
        const essayId = document.querySelector(".essay-main").getAttribute("essay-id"); // Use the essay title as the key
        localStorage.setItem('MaxScrollPosition_' + essayId, document.body.scrollHeight); // Store the maximum scroll position
        let highestScroll = parseInt(localStorage.getItem(`ScrollPosition_${essayId}`)) || 0;

        // Restore the scroll position if it exists
        if (highestScroll > 0) {
            window.scrollTo(0, highestScroll);
        }

        // Listen for scroll events
        window.addEventListener("scroll", () => {
            const currentScroll = window.scrollY;
            localStorage.setItem(`ScrollPosition_${essayId}`, currentScroll);
            if (currentScroll > highestScroll) {
                highestScroll = currentScroll;
                localStorage.setItem(`HighestScrollPosition_${essayId}`, highestScroll);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Loop through all quiz boxes
    document.querySelectorAll(".quiz-box").forEach((box) => {
        const quizId = box.getAttribute("data-quiz-id"); // Get the quiz ID
        const score = localStorage.getItem(`Score${quizId}`); // Retrieve the score from local storage

        // Find the "Last Score:" element and update it
        const lastScoreElement = box.querySelector("h3:nth-of-type(2)");
        if (score !== null) {
            lastScoreElement.textContent = `Letzte Bewertung: ${score}%`;
        } else {
            lastScoreElement.textContent = "Kein Versuch"; // Default if no score is found
        }
    });
});

document.querySelectorAll(".quiz-box").forEach((box) => {
    box.addEventListener("click", () => {
      const quizLink = box.getAttribute("data-quiz-link");
      if (quizLink) {
        window.location.href = quizLink;
      }
    });
});

document.querySelectorAll(".essay-box").forEach((box) => {
    box.addEventListener("click", () => {
      const essayLink = box.getAttribute("data-essay-link");
      if (essayLink) {
        window.location.href = essayLink;
      }
    });
});

function Flip_Card(Card_Element) {
    Card_Element.classList.toggle('flipped');
}

function Previous_Card() {
    if (document.querySelector('.active-card').classList.contains('flipped')) {
        document.querySelector('.active-card').classList.toggle('flipped');
    }
    const Card_Index = parseInt(document.querySelector('#card-index').innerText);
    if (Card_Index == 1) {
        document.querySelector('#card-index').innerText =
            document.querySelector('.cards-container').childElementCount;
    } else {
        document.querySelector('#card-index').innerText = Card_Index - 1;
    }
    Update_Card_By_Index();
}

function Next_Card() {
    if (document.querySelector('.active-card').classList.contains('flipped')) {
        document.querySelector('.active-card').classList.toggle('flipped');
    }
    const Card_Index = parseInt(document.querySelector('#card-index').innerText);
    if (Card_Index == document.querySelector('.cards-container').childElementCount) {
        document.querySelector('#card-index').innerText = 1;
    } else {
        document.querySelector('#card-index').innerText = Card_Index + 1;
    }
    Update_Card_By_Index();
}

function Update_Card_By_Index() {
    const Previous_Card = document.querySelector('.active-card');
    document.querySelector('.cards-container').children[document.querySelector('#card-index').innerText - 1].classList.remove('inactive-card');
    document.querySelector('.cards-container').children[document.querySelector('#card-index').innerText - 1].classList.add('active-card');
    Previous_Card.classList.remove('active-card');
    Previous_Card.classList.add('inactive-card');
}

function Add_Index_Card() {
    document.querySelector('#card-popup').style.display = 'block';
}

function Close_Popup() {
    document.querySelector('#input-front').value = '';
    document.querySelector('#input-back').value = '';
    document.querySelector('#card-popup').style.display = 'none';
}

function Confirm_Card() {
    const Front_Text = document.querySelector('#input-front').value;
    const Back_Text = document.querySelector('#input-back').value;
    if (Front_Text == '' || Back_Text == '') {
        alert('Please fill in both fields!');
        return;
    }
    const New_Card = document.createElement('div');
    New_Card.classList.add('card', 'inactive-card');
    New_Card.setAttribute('onclick', 'Flip_Card(this)');
    New_Card.innerHTML = 
        `<div class="card-inner">
            <div class="card-face card-front">
                <p>${Front_Text}</p>
            </div>
            <div class="card-face card-back">
                <p>${Back_Text}</p>
            </div>
        </div>`;
    document.querySelector('.cards-container').appendChild(New_Card);
    Close_Popup();
}

function Submit() {
    const Answers = document.querySelectorAll('#answers');
    const Selections = document.querySelectorAll('#quiz-select');
    const Max_Points = Answers.length + Selections.length;
    let Correct_Answers = 0;
    let feedback = ""; // Initialize feedback string

    // Check radio button answers
    for (let i = 0; i < Answers.length; i++) {
        let questionCorrect = false;
        for (let j = 0; j < 4; j++) {
            const option = Answers[i].children[j];
            if (option.checked) {
                if (option.getAttribute('correct') === 'true') {
                    Correct_Answers++;
                    questionCorrect = true;
                }
            }
        }
        feedback += `<p>Auswahl ${i + 1}: ${questionCorrect ? "Korrekt" : "Falsch"}</p>`;
    }

    // Check dropdown answers
    for (let i = 0; i < Selections.length; i++) {
        const selection = Selections[i];
        if (selection.value === selection.getAttribute('correct')) {
            Correct_Answers++;
            feedback += `<p>Lücke ${i + 1}: Korrekt</p>`;
        } else {
            feedback += `<p>Lücke ${i + 1}: Falsch</p>`;
        }
    }

    const Score = Math.round((Correct_Answers / Max_Points) * 100);
    const Quiz_Id = document.querySelector('#quiz-main').getAttribute('quiz-id');
    localStorage.setItem('Score' + Quiz_Id, Score);

    // Display score and feedback
    document.querySelector('#score-display').innerHTML = `
        <h3>Deine Bewertung: ${Score}%!</h3>
        <h4>Feedback:</h4>
        ${feedback}
    `;
}

function Known() {
    const currentIndex = parseInt(document.querySelector('#card-index').innerText); // Get the current card index
    const knownCardsKey = 'KnownCards'; // Key for local storage
    document.querySelector('.active-card').classList.add('known'); // Add a class to the active card
    // Retrieve the list of known cards from local storage
    let knownCards = JSON.parse(localStorage.getItem(knownCardsKey)) || [];

    // Check if the current index is already in the list
    if (!knownCards.includes(currentIndex)) {
        knownCards.push(currentIndex); // Add the current index to the list
        localStorage.setItem(knownCardsKey, JSON.stringify(knownCards)); // Save the updated list back to local storage
    }
}