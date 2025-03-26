const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score-value");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// 🛠️ Hàm xáo trộn mảng (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 🟢 Load file JSON câu hỏi
fetch("question.json")
    .then(response => response.json())
    .then(data => {
        questions = data;
        shuffleArray(questions); // Xáo trộn danh sách câu hỏi
        showQuestion();
    })
    .catch(error => console.error("Lỗi tải câu hỏi:", error));

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];

    questionElement.innerText = currentQuestion.question;

    // 🟢 Xáo trộn lựa chọn trước khi hiển thị
    let shuffledOptions = [...currentQuestion.options]; 
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(button, option === currentQuestion.answer));
        answerButtons.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add("hidden");
    answerButtons.innerHTML = "";
}

function selectAnswer(button, correct) {
    if (correct) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
    }
    scoreDisplay.innerText = score;

    Array.from(answerButtons.children).forEach(btn => btn.disabled = true);
    nextButton.classList.remove("hidden");
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        questionElement.innerText = `🎉 Hoàn thành! Bạn đạt ${score}/${questions.length} điểm.`;
        answerButtons.innerHTML = "";
        nextButton.classList.add("hidden");
    }
});
