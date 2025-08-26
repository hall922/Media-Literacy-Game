let questions = [];
let currentQuestion = 0;
let score = 0;
let playerName = "";
let answered = false; // Track if the question was already answered

// Ask for player name
window.onload = () => {
  playerName = prompt("Enter your name:") || "Player";
};

fetch("data/questions.json")
  .then(res => {
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    return res.json();
  })
  .then(data => {
    console.log("Questions loaded:", data);
    questions = data;
    showQuestion();
  })
  .catch(err => console.error("Error loading questions:", err));

function showQuestion() {
  document.getElementById("feedback").innerText = "";
  document.getElementById("next-btn").style.display = "none";
  
  // Reset answered flag
  answered = false;

  // Re-enable buttons for new question
  let buttons = document.querySelectorAll(".buttons button");
  buttons.forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = "1"; // make them look active
  });

  if (currentQuestion < questions.length) {
    document.getElementById("question").innerText = questions[currentQuestion].question;
  } else {
    document.getElementById("question").innerText = "🎉 Quiz Finished!";
    document.getElementById("feedback").innerText = `Your final score is ${score}`;
    document.querySelector(".buttons").style.display = "none";

    saveToLeaderboard();
  }
}

function checkAnswer(answer) {
  // Prevent answering multiple times
  if (answered) return;
  answered = true;

  let correct = questions[currentQuestion].answer;
  let feedback = document.getElementById("feedback");

  if (answer === correct) {
    score++;
    feedback.innerText = "✅ Correct! " + questions[currentQuestion].explanation;
    feedback.style.color = "green";
  } else {
    feedback.innerText = "❌ Wrong! " + questions[currentQuestion].explanation;
    feedback.style.color = "red";
  }

  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("next-btn").style.display = "inline-block";

  // Disable buttons after answering
  let buttons = document.querySelectorAll(".buttons button");
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = "0.6"; // faded look to show they're inactive
  });
}

function nextQuestion() {
  currentQuestion++;
  showQuestion();
}

function saveToLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: playerName, score: score });

  //  Keep only top 10 scores
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // Show button to view leaderboard
  let feedback = document.getElementById("feedback");
  feedback.innerHTML += `<br><br><a href="pages/leaderboard.html"><button>View Leaderboard</button></a>`;
}
