// The paragraph that the user has to type
const paragraph = "Learning something new takes time and practice. Every small step helps us improve. Stay focused, keep trying, and do not give up when a task feels difficult.";

const quote = document.getElementById("quote");
const input = document.getElementById("input");
const timeText = document.getElementById("time");
const wpmText = document.getElementById("wpm");
const accuracyText = document.getElementById("accuracy");
const mistakesText = document.getElementById("mistakes");
const statusText = document.getElementById("status");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

let timeLeft = 60;
let timer = null;
let started = false;
let finished = false;

// Split the paragraph into separate letters so each can be checked
function showParagraph() {
  quote.innerHTML = "";
  for (let i = 0; i < paragraph.length; i++) {
    const letter = document.createElement("span");
    letter.textContent = paragraph[i];
    quote.appendChild(letter);
  }
  quote.children[0].classList.add("active");
}

// Start the 60 second timer only on the first key press
function startTimer() {
  if (started) return;
  started = true;
  statusText.textContent = "Testing";
  timer = setInterval(function () {
    timeLeft--;
    timeText.textContent = timeLeft;
    updateStats();
    if (timeLeft <= 0) endTest();
  }, 1000);
}

// Check each typed character and update the colours
function checkTyping() {
  if (finished) return;
  if (!started && input.value.length > 0) startTimer();

  const typed = input.value;
  const letters = quote.querySelectorAll("span");
  let correct = 0;
  let mistakes = 0;

  letters.forEach(function (letter, index) {
    letter.className = "";
    if (index < typed.length) {
      if (typed[index] === paragraph[index]) {
        letter.classList.add("correct");
        correct++;
      } else {
        letter.classList.add("wrong");
        mistakes++;
      }
    }
  });

  if (typed.length < letters.length) {
    letters[typed.length].classList.add("active");
  }

  mistakesText.textContent = mistakes;
  updateStats(correct, mistakes);

  if (typed.length >= paragraph.length) endTest();
}

// Calculate net WPM and accuracy using the typed characters
function updateStats(correctCount, mistakeCount) {
  const typed = input.value;
  const correct = correctCount === undefined
    ? [...typed].filter((char, i) => char === paragraph[i]).length
    : correctCount;
  const mistakes = mistakeCount === undefined ? typed.length - correct : mistakeCount;
  const elapsed = 60 - timeLeft;
  const minutes = Math.max(elapsed / 60, 1 / 60);
  const netWpm = Math.max(0, Math.round((correct / 5) / minutes));
  const accuracy = typed.length === 0 ? 100 : Math.round((correct / typed.length) * 100);

  wpmText.textContent = netWpm;
  accuracyText.textContent = accuracy + "%";
  mistakesText.textContent = mistakes;
}

// Stop the timer and show the final result
function endTest() {
  if (finished) return;
  finished = true;
  clearInterval(timer);
  input.disabled = true;
  statusText.textContent = "Finished";
  message.textContent = "Test complete! Press Restart Test to try again.";
}

// Reset everything, including the old timer
function restartTest() {
  clearInterval(timer);
  timeLeft = 60;
  started = false;
  finished = false;
  input.disabled = false;
  input.value = "";
  timeText.textContent = "60";
  wpmText.textContent = "0";
  accuracyText.textContent = "100%";
  mistakesText.textContent = "0";
  statusText.textContent = "Ready";
  message.textContent = "The timer starts when you press your first key.";
  showParagraph();
  input.focus();
}

input.addEventListener("input", checkTyping);
restartButton.addEventListener("click", restartTest);
showParagraph();
