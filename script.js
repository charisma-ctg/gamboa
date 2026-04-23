/* ================================================
   CHARISMA T. GAMBOA — SCRIPT.JS
   Assistance Tool + Quiz Tool Logic
   ================================================ */

/* ========== EDUCATIONAL ASSISTANCE TOOL ========== */
let correctCount = 0;

function checkAnswer(num) {
  let userAnswer, correctAnswer, feedback;

  if (num === 1) {
    userAnswer    = document.getElementById('q1Input')?.value.trim();
    correctAnswer = '20,000';
    feedback      = document.getElementById('feedback1');
    if (feedback) {
      const isCorrect = userAnswer === correctAnswer;
      feedback.innerHTML = isCorrect
        ? '✅ Correct! Tuition fee is ₱20,000 per semester.'
        : '❌ Incorrect. Try again. (Hint: ₱__)';
      feedback.style.color = isCorrect ? '#065f46' : '#e74c3c';
      if (isCorrect) correctCount++;
    }
  }

  if (num === 2) {
    userAnswer    = document.getElementById('q2Input')?.value.trim().toLowerCase();
    correctAnswer = '7:30 am';
    feedback      = document.getElementById('feedback2');
    if (feedback) {
      const isCorrect = userAnswer === correctAnswer;
      feedback.innerHTML = isCorrect
        ? '✅ Correct! Class starts at 7:30 AM.'
        : '❌ Incorrect. Try again. (Format: h:mm am)';
      feedback.style.color = isCorrect ? '#065f46' : '#e74c3c';
      if (isCorrect) correctCount++;
    }
  }

  if (num === 3) {
    userAnswer    = document.getElementById('q3Input')?.value.trim().toLowerCase();
    correctAnswer = 'ur lady of sacred heart college of guimba inc';
    feedback      = document.getElementById('feedback3');
    if (feedback) {
      const isCorrect = userAnswer === correctAnswer;
      feedback.innerHTML = isCorrect
        ? '✅ Correct! OLSHCO stands for Our Lady of Sacred Heart College of Guimba INC.'
        : '❌ Incorrect. Try again.';
      feedback.style.color = isCorrect ? '#065f46' : '#e74c3c';
      if (isCorrect) correctCount++;
    }
  }

  // Update progress bar
  const progressEl  = document.getElementById('progress');
  const progressBar = document.getElementById('progressBar');
  if (progressEl) {
    progressEl.innerHTML = `You answered ${correctCount} out of 3 correctly.`;
  }
  if (progressBar) {
    progressBar.style.width = ((correctCount / 3) * 100) + '%';
  }
}

/* ========== SIMPLE QUIZ TOOL ========== */
let timeLeft = 30;
let timerInterval = null;

if (document.getElementById('timer')) {
  const timerBar = document.getElementById('timerBar');
  timerInterval = setInterval(() => {
    timeLeft--;
    const timerEl = document.getElementById('timer');
    if (timerEl) timerEl.textContent = timeLeft;
    if (timerBar) timerBar.style.width = ((timeLeft / 30) * 100) + '%';
    if (timeLeft <= 5 && timerEl) timerEl.style.color = '#e74c3c';
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
    }
  }, 1000);
}

function submitQuiz() {
  if (timerInterval) clearInterval(timerInterval);

  let score = 0;
  if (document.querySelector('input[name="q1"]:checked')?.value === '4')     score++;
  if (document.querySelector('input[name="q2"]:checked')?.value === 'Blue')  score++;
  if (document.querySelector('input[name="q3"]:checked')?.value === 'Manila')score++;
  if (document.querySelector('input[name="q4"]:checked')?.value === '7')     score++;
  if (document.querySelector('input[name="q5"]:checked')?.value === 'Earth') score++;

  const result = document.getElementById('result');
  if (result) {
    let emoji = score === 5 ? '🎉 Perfect score!' : score >= 3 ? '👍 Good job!' : '😊 Keep practicing!';
    result.innerHTML = `You got <strong>${score} out of 5</strong> correct answers. ${emoji}`;
  }

  const btn = document.getElementById('submitQuizBtn');
  if (btn) btn.disabled = true;
}
