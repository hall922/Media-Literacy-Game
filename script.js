// Load questions from JSON file
let questions = [];
let currentIndex = 0;
let score = 0;
let playerName = "";

// DOM elements
const questionEl = document.getElementById("question");
const feedbackEl = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");
const btnReal = document.getElementById("btn-real");
const btnFake = document.getElementById("btn-fake");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");

// Prompt for player name at start
function askName() {
  playerName = prompt("Enter your name to start the quiz:") || "Player";
}

// Fetch questions.json dynamically
fetch('data/questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    askName();       // <-- Prompt user for name here
    loadQuestion();
  })
  .catch(err => {
    console.error("Failed to load questions:", err);
    questionEl.textContent = "Failed to load quiz questions.";
  });

// Load a question
function loadQuestion() {
  if (currentIndex >= questions.length) {
    endQuiz();
    return;
  }

  const q = questions[currentIndex];
  questionEl.textContent = q.question;
  feedbackEl.style.display = "none";
  btnReal.disabled = false;
  btnFake.disabled = false;
  nextBtn.hidden = true;

  // Update progress
  const progressPercent = (currentIndex / questions.length) * 100;
  progressBar.style.width = progressPercent + "%";
  progressBar.setAttribute("aria-valuenow", progressPercent);
  scoreEl.textContent = `Score: ${score}`;
}

// Check answer
function checkAnswer(selected) {
  const q = questions[currentIndex];
  const correct = selected === q.answer;

  // Update score and show feedback
  if (correct) {
    score += 1;
    feedbackEl.className = "correct";
    feedbackEl.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
  } else {
    feedbackEl.className = "incorrect";
    feedbackEl.innerHTML = `<strong>Wrong!</strong> ${q.explanation}`;
  }

  feedbackEl.style.display = "block";
  btnReal.disabled = true;
  btnFake.disabled = true;
  nextBtn.hidden = false;

  scoreEl.textContent = `Score: ${score}`;

  // Auto-advance after 2 seconds
  setTimeout(() => {
    if (currentIndex < questions.length) {
      nextQuestion();
    }
  }, 2000);
}

// Go to next question
function nextQuestion() {
  currentIndex++;
  loadQuestion();
}

// End of quiz
function endQuiz() {
  // Save score to leaderboard in localStorage
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: playerName, score: score });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // Show end message
  questionEl.textContent = "🎉 Quiz Finished!";
  feedbackEl.className = "correct";
  feedbackEl.innerHTML = `Your final score is ${score}/${questions.length}. Check out the <a href="pages/leaderboard.html">Leaderboard</a>!`;
  feedbackEl.style.display = "block";

  // Hide answer buttons and next button
  btnReal.style.display = "none";
  btnFake.style.display = "none";
  nextBtn.style.display = "none";
}
