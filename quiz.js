const INITIAL_SCORE = 0;
const POINTS_PER_CORRECT_ANSWER = 1;
const HINTS_PER_GAME = 1;
const HINTS_PER_USE = 1;
const PASSING_SCORE = 3;
const FIRST_INDEX = 0;
const INDEX_STEP = 1;
const EMPTY_COUNT = 0;
const QUESTIONS_PER_DRAW = 1;

const questions = [
    {
        question: "Which brawler summons Bruce the bear?",
        options: ["Nita", "Colt", "Shelly", "Poco"],
        correctIndex: 0
    },
    {
        question: "Which brawler attacks with a shotgun?",
        options: ["Colt", "Shelly", "Poco", "Nita"],
        correctIndex: 1
    },
    {
        question: "Which brawler's Super charges forward and knocks enemies around?",
        options: ["Nita", "Colt", "Poco", "Bull"],
        correctIndex: 3
    },
    {
        question: "Which brawler can heal teammates with his Super?",
        options: ["Bull", "Shelly", "Poco", "Colt"],
        correctIndex: 2
    },
    {
        question: "Which brawler throws cactus grenades?",
        options: ["Shelly", "Spike", "Nita", "Bull"],
        correctIndex: 1
    }
];

const TOTAL_QUESTIONS = questions.length;
const MAX_SCORE = TOTAL_QUESTIONS * POINTS_PER_CORRECT_ANSWER;

const questionElement = document.getElementById("question-text");
const scoreElement = document.getElementById("score");
const answerButtons = document.querySelectorAll(".quiz-answer");
const nextButton = document.getElementById("next-button");
const feedbackElement = document.getElementById("answer-feedback");
const questionNumberElement = document.getElementById("question-number");
const gamePanel = document.getElementById("quiz-game");
const resultsPanel = document.getElementById("quiz-results");
const finalScoreElement = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");
const hintButton = document.getElementById("hint-button");
const hintStatusElement = document.getElementById("hint-status");
const moveMessageElement = document.getElementById("move-message");
const gameStatusElement = document.getElementById("game-status");
const resultsTitleElement = document.getElementById("results-title");
const resultsMessageElement = document.getElementById("results-message");

let remainingQuestions = [...questions];
let currentQuestion;
let score = INITIAL_SCORE;
let hintsRemaining = HINTS_PER_GAME;
let hasAnswered = false;
let gameFinished = false;

document.getElementById("question-total").textContent = TOTAL_QUESTIONS;
document.getElementById("final-total").textContent = MAX_SCORE;
document.getElementById("question-count").textContent = TOTAL_QUESTIONS;
document.getElementById("points-per-answer").textContent = POINTS_PER_CORRECT_ANSWER;
document.getElementById("passing-score").textContent = PASSING_SCORE;

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + INDEX_STEP)) + min;
}

function renderState() {
    scoreElement.textContent = score;
    finalScoreElement.textContent = score;
    questionNumberElement.textContent = TOTAL_QUESTIONS - remainingQuestions.length;
    hintStatusElement.textContent = hintsRemaining === EMPTY_COUNT
        ? "No hints remaining for this game"
        : `${hintsRemaining} hint available for this game`;
    gameStatusElement.textContent = hasAnswered
        ? "Answer locked. Select Next to continue."
        : "Choose one answer. Your choice is final.";
    nextButton.textContent = remainingQuestions.length === EMPTY_COUNT ? "See results" : "Next question";
    nextButton.disabled = gameFinished;
    hintButton.disabled = gameFinished;
    gamePanel.hidden = gameFinished;
    resultsPanel.hidden = !gameFinished;
}

function rejectMove(reason) {
    moveMessageElement.textContent = reason;
}

function finishGame() {
    gameFinished = true;

    if (score === MAX_SCORE) {
        resultsTitleElement.textContent = "Perfect score!";
        resultsMessageElement.textContent = "You answered every question correctly. You're a Brawl Stars expert!";
    } else if (score >= PASSING_SCORE && score < MAX_SCORE) {
        resultsTitleElement.textContent = "Quiz passed!";
        resultsMessageElement.textContent = "Well done! You know your brawlers. Try again for a perfect score.";
    } else {
        resultsTitleElement.textContent = "Keep practicing!";
        resultsMessageElement.textContent = `You need at least ${PASSING_SCORE} points to pass. Meet the brawlers and try again!`;
    }

    renderState();
    resultsTitleElement.focus();
}

function showNextQuestion() {
    if (remainingQuestions.length === EMPTY_COUNT) {
        finishGame();
        return;
    }

    const randomIndex = randomInteger(FIRST_INDEX, remainingQuestions.length - INDEX_STEP);
    currentQuestion = remainingQuestions.splice(randomIndex, QUESTIONS_PER_DRAW)[FIRST_INDEX];
    hasAnswered = false;
    questionElement.textContent = currentQuestion.question;
    feedbackElement.textContent = "";
    moveMessageElement.textContent = "";

    answerButtons.forEach((button, index) => {
        button.querySelector("[data-answer-text]").textContent = currentQuestion.options[index];
        button.disabled = false;
        button.classList.remove("is-correct", "is-incorrect", "is-hint");
    });

    renderState();
}

function answerQuestion(selectedIndex) {
    if (gameFinished || hasAnswered) {
        rejectMove(gameFinished
            ? "The quiz is finished. Select Play again to start a new game."
            : "You already answered this question. Select Next to continue.");
        return;
    }

    if (!Number.isInteger(selectedIndex) || selectedIndex < FIRST_INDEX || selectedIndex >= currentQuestion.options.length) {
        rejectMove("Choose one of the available answer buttons.");
        return;
    }

    hasAnswered = true;
    moveMessageElement.textContent = "";
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    if (isCorrect) {
        score += POINTS_PER_CORRECT_ANSWER;
        feedbackElement.textContent = "Correct!";
    } else {
        feedbackElement.textContent = `Incorrect. The correct answer is ${currentQuestion.options[currentQuestion.correctIndex]}.`;
        answerButtons[selectedIndex].classList.add("is-incorrect");
    }

    answerButtons[currentQuestion.correctIndex].classList.add("is-correct");
    answerButtons.forEach((button) => {
        button.disabled = true;
        button.classList.remove("is-hint");
    });

    renderState();
}

function nextQuestion() {
    if (gameFinished || !hasAnswered) {
        rejectMove(gameFinished
            ? "The quiz is finished. Select Play again to start a new game."
            : "Choose an answer before moving to the next question.");
        return;
    }

    moveMessageElement.textContent = "";
    showNextQuestion();
    if (!gameFinished) questionElement.focus();
}

function useHint() {
    if (gameFinished) {
        rejectMove("The quiz is finished. Select Play again to start a new game.");
        return;
    }

    if (hasAnswered || hintsRemaining === EMPTY_COUNT) {
        rejectMove(hasAnswered
            ? "Use the hint before answering the question."
            : "You have already used your hint for this game.");
        return;
    }

    const correctButton = answerButtons[currentQuestion.correctIndex];
    const wrongButtons = [...answerButtons].filter((button) => {
        return Number(button.dataset.answerIndex) !== currentQuestion.correctIndex;
    });

    const randomIndex = randomInteger(FIRST_INDEX, wrongButtons.length - INDEX_STEP);
    const randomWrongButton = wrongButtons[randomIndex];
    correctButton.classList.add("is-hint");
    randomWrongButton.classList.add("is-hint");
    hintsRemaining -= HINTS_PER_USE;
    moveMessageElement.textContent = "";
    renderState();
}

function restartGame() {
    remainingQuestions = [...questions];
    score = INITIAL_SCORE;
    hintsRemaining = HINTS_PER_GAME;
    gameFinished = false;
    showNextQuestion();
    questionElement.focus();
}

answerButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const rawIndex = button.dataset.answerIndex;
        answerQuestion(rawIndex.trim() === "" ? NaN : Number(rawIndex));
    });
});

nextButton.addEventListener("click", nextQuestion);
hintButton.addEventListener("click", useHint);
restartButton.addEventListener("click", restartGame);

const navigationToggle = document.querySelector(".navbar-toggler");
const navigationMenu = document.getElementById("mainNav");

navigationToggle.addEventListener("click", () => {
    const expanded = navigationToggle.getAttribute("aria-expanded") === "true";
    navigationToggle.setAttribute("aria-expanded", String(!expanded));
    navigationMenu.classList.toggle("show", !expanded);
});

showNextQuestion();
