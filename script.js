/* =========================================
   1. QUIZ DATA
   Each question has: the question text,
   a list of options, and the index (0-3)
   of the correct option.
   ========================================= */
const subjects = [
  {
    name: "HTML",
    icon: "</>",
    questions: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "HyperText Marketing Language", "High Tech Modern Language"],
        answer: 1,
      },
      {
        question: "Which element holds the page’s main navigation links?",
        options: ["<nav>", "<menu>", "<aside>", "<links>"],
        answer: 0,
      },
      {
        question: "Which attribute gives an image a text alternative?",
        options: ["title", "src", "alt", "caption"],
        answer: 2,
      },
      {
        question: "Which tag creates the largest heading?",
        options: ["<h6>", "<head>", "<header>", "<h1>"],
        answer: 3,
      },
      {
        question: "Which element should wrap a standalone, self-contained piece like a blog post?",
        options: ["<section>", "<article>", "<div>", "<main>"],
        answer: 1,
      },
    ],
  },
  {
    name: "CSS",
    icon: "#",
    questions: [
      {
        question: "Which property changes the space inside an element’s border?",
        options: ["margin", "gap", "padding", "inset"],
        answer: 2,
      },
      {
        question: "Which value makes a flex container’s children sit in a column?",
        options: ["flex-direction: column", "flex-flow: wrap", "align-items: column", "display: column"],
        answer: 0,
      },
      {
        question: "Which selector targets an element with the id “main”?",
        options: [".main", "#main", "*main", "@main"],
        answer: 1,
      },
      {
        question: "What do rem units scale from?",
        options: ["The parent’s font size", "The viewport width", "The root element’s font size", "The element’s width"],
        answer: 2,
      },
      {
        question: "Which function reads a custom property?",
        options: ["get()", "env()", "attr()", "var()"],
        answer: 3,
      },
    ],
  },
  {
    name: "JavaScript",
    icon: "JS",
    questions: [
      {
        question: "Which keyword declares a block-scoped variable you can reassign?",
        options: ["let", "const", "var", "static"],
        answer: 0,
      },
      {
        question: "What does Array.prototype.map return?",
        options: ["The original array", "A new array", "A single value", "undefined"],
        answer: 1,
      },
      {
        question: "What is the result of typeof null?",
        options: ["null", "undefined", "object", "number"],
        answer: 2,
      },
      {
        question: "Which method turns a JSON string into an object?",
        options: ["JSON.stringify", "JSON.encode", "JSON.object", "JSON.parse"],
        answer: 3,
      },
      {
        question: "What does await do inside an async function?",
        options: ["Blocks the whole page", "Pauses until a promise settles", "Cancels the promise", "Runs code in a new thread"],
        answer: 1,
      },
    ],
  },
  {
    name: "Accessibility",
    icon: "♿",
    questions: [
      {
        question: "What does ARIA stand for?",
        options: ["Accessible Rich Internet Applications", "Applied Rich Interface Attributes", "Accessible Responsive Interface Anchors", "Automated Reader Interface API"],
        answer: 0,
      },
      {
        question: "Which text-to-background contrast ratio meets WCAG AA for normal text?",
        options: ["2:1", "4.5:1", "1.5:1", "3:1 only"],
        answer: 1,
      },
      {
        question: "What should every form input have?",
        options: ["A placeholder only", "A tooltip", "An associated label", "A title attribute"],
        answer: 2,
      },
      {
        question: "What should keyboard focus always be?",
        options: ["Hidden", "Random", "Skipped on buttons", "Visible"],
        answer: 3,
      },
      {
        question: "Which element is best for an action that doesn’t navigate?",
        options: ["<a>", "<button>", "<span>", "<div>"],
        answer: 1,
      },
    ],
  },
];

/* =========================================
   2. PAGE ELEMENTS AND QUIZ STATE
   ========================================= */
const app = document.querySelector("#app");
const brand = document.querySelector("#brand");
const themeButton = document.querySelector("#theme");

const letters = ["A", "B", "C", "D"];

// "State" is everything the quiz needs to remember
let currentSubject = null;     // the subject the user picked
let questionNumber = 0;        // which question we are on (starts at 0)
let score = 0;                 // how many answers were correct
let selectedAnswer = null;     // the option the user clicked (or null)
let answerSubmitted = false;   // true after the user presses "Submit answer"

/* =========================================
   3. HELPERS
   ========================================= */

// Makes text safe to place inside HTML.
// Needed because some answers contain tags like <nav>.
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Shows the subject icon and name in the header (or clears it)
function showBrand(subject) {
  if (subject === null) {
    brand.innerHTML = "";
    return;
  }

  brand.innerHTML = `
    <span class="brand-icon">${escapeHtml(subject.icon)}</span>
    <span>${subject.name}</span>
  `;
}

/* =========================================
   4. SCREEN 1: CHOOSE A SUBJECT
   ========================================= */
function showSubjectScreen() {
  showBrand(null);

  // Build one button for each subject
  let buttons = "";
  subjects.forEach(function (subject, index) {
    buttons += `
      <li>
        <button class="option" data-subject="${index}">
          <span class="option-letter">${escapeHtml(subject.icon)}</span>
          ${subject.name}
        </button>
      </li>
    `;
  });

  app.innerHTML = `
    <h1>Welcome to the <strong>Frontend Quiz</strong></h1>
    <p class="intro">Pick a subject to start.</p>
    <ul class="option-list">${buttons}</ul>
  `;

  // When a subject is clicked, start the quiz
  app.querySelectorAll("[data-subject]").forEach(function (button) {
    button.addEventListener("click", function () {
      startQuiz(subjects[button.dataset.subject]);
    });
  });
}

function startQuiz(subject) {
  currentSubject = subject;
  questionNumber = 0;
  score = 0;
  showBrand(subject);
  showQuestionScreen();
}

/* =========================================
   5. SCREEN 2: ANSWER A QUESTION
   ========================================= */
function showQuestionScreen() {
  selectedAnswer = null;
  answerSubmitted = false;

  const total = currentSubject.questions.length;
  const current = currentSubject.questions[questionNumber];
  const progressPercent = (questionNumber / total) * 100;

  // Build one button for each answer option
  let optionButtons = "";
  current.options.forEach(function (text, index) {
    optionButtons += `
      <li>
        <button class="option" data-answer="${index}" aria-pressed="false">
          <span class="option-letter">${letters[index]}</span>
          ${escapeHtml(text)}
          <span class="option-result"></span>
        </button>
      </li>
    `;
  });

  app.innerHTML = `
    <p class="question-count">Question ${questionNumber + 1} of ${total}</p>
    <h2>${escapeHtml(current.question)}</h2>
    <ul class="option-list">${optionButtons}</ul>
    <button class="action-button" id="action-button">Submit answer</button>
    <p class="error-message" id="error-message" role="alert"></p>
    <div class="progress-track">
      <div class="progress-fill" style="width: ${progressPercent}%"></div>
    </div>
  `;

  // Clicking an option selects it
  app.querySelectorAll("[data-answer]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectAnswer(button);
    });
  });

  // The big button either submits or moves to the next question
  document.querySelector("#action-button").addEventListener("click", handleActionButton);
}

// Highlights the clicked option
function selectAnswer(clickedButton) {
  if (answerSubmitted) return; // answers are locked after submitting

  selectedAnswer = Number(clickedButton.dataset.answer);
  document.querySelector("#error-message").textContent = "";

  app.querySelectorAll("[data-answer]").forEach(function (button) {
    const isClicked = button === clickedButton;
    button.classList.toggle("selected", isClicked);
    button.setAttribute("aria-pressed", isClicked);
  });
}

// Runs when the big button is pressed
function handleActionButton() {
  // Second press: go to the next question (or the results)
  if (answerSubmitted) {
    questionNumber++;

    if (questionNumber < currentSubject.questions.length) {
      showQuestionScreen();
    } else {
      showResultsScreen();
    }
    return;
  }

  // First press: the user must have picked something
  if (selectedAnswer === null) {
    document.querySelector("#error-message").textContent = "Select an answer to continue.";
    return;
  }

  checkAnswer();
}

// Marks the answer right or wrong and updates the screen
function checkAnswer() {
  answerSubmitted = true;

  const correctIndex = currentSubject.questions[questionNumber].answer;

  if (selectedAnswer === correctIndex) {
    score++;
  }

  app.querySelectorAll("[data-answer]").forEach(function (button) {
    const index = Number(button.dataset.answer);
    const resultLabel = button.querySelector(".option-result");

    button.disabled = true;
    button.classList.remove("selected");

    if (index === correctIndex) {
      button.classList.add("correct");
      resultLabel.textContent = "Correct";
    } else if (index === selectedAnswer) {
      button.classList.add("wrong");
      resultLabel.textContent = "Wrong";
    }
  });

  // Change the button text for the next step
  const isLastQuestion = questionNumber + 1 === currentSubject.questions.length;
  const actionButton = document.querySelector("#action-button");
  actionButton.textContent = isLastQuestion ? "See results" : "Next question";
  actionButton.focus();
}

/* =========================================
   6. SCREEN 3: RESULTS
   ========================================= */
function showResultsScreen() {
  app.innerHTML = `
    <h1><strong>Quiz completed</strong><br>You scored…</h1>
    <div class="score-card">
      <span class="score-number">${score}</span>
      <p>out of ${currentSubject.questions.length} in ${currentSubject.name}</p>
    </div>
    <button class="action-button" id="play-again">Play again</button>
  `;

  document.querySelector("#play-again").addEventListener("click", showSubjectScreen);
}

/* =========================================
   7. LIGHT / DARK THEME
   ========================================= */
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  // Remember the choice (storage can fail, so we guard it)
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    // Ignore: the theme just won't be remembered
  }
}

themeButton.addEventListener("click", function () {
  const colorScheme = getComputedStyle(document.documentElement).colorScheme;
  setTheme(colorScheme === "dark" ? "light" : "dark");
});

// Restore the saved theme when the page loads
try {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch (error) {
  // Ignore: use the device default
}

/* =========================================
   8. START THE APP
   ========================================= */
showSubjectScreen();