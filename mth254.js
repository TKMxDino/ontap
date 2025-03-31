const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const scoreDisplay = document.getElementById("score-value");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Hàm xáo trộn mảng (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Hàm tải câu hỏi từ file JSON
async function loadQuestions(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Lỗi ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) && data.length ? data : [];
    } catch (error) {
        console.error(`Lỗi khi tải ${file}:`, error);
        return [];
    }
}

// Bắt đầu quiz
async function startQuiz() {
    questions = await loadQuestions("questionMTH254.json");
    if (questions.length === 0) {
        questionElement.innerText = "Không có câu hỏi nào!";
        return;
    }
    
    shuffleArray(questions);
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.innerText = score;

    showQuestion();
}

// Hiển thị câu hỏi hiện tại
function showQuestion() {
    resetState();

    if (currentQuestionIndex >= questions.length) {
        questionElement.innerText = `🎉 Hoàn thành! Bạn đạt ${score}/${questions.length} điểm.`;
        answerButtons.innerHTML = "";
        return;
    }

    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.q;

    let options = Object.entries(currentQuestion.opts);
    shuffleArray(options);

    options.forEach(([key, value]) => {
        const button = document.createElement("button");
        button.innerText = value;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(button, key === currentQuestion.ans));
        answerButtons.appendChild(button);
    });
}

// Reset giao diện trước khi hiển thị câu hỏi mới
function resetState() {
    answerButtons.innerHTML = "";
}

// Xử lý chọn đáp án
function selectAnswer(button, correct) {
    const correctAnswerKey = questions[currentQuestionIndex].ans;
    const correctAnswerText = questions[currentQuestionIndex].opts[correctAnswerKey];

    if (correct) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");

        // Hiển thị màu xanh cho đáp án đúng
        const correctButton = Array.from(answerButtons.children).find(btn => btn.innerText === correctAnswerText);
        if (correctButton) {
            correctButton.classList.add("correct");
        }
    }

    scoreDisplay.innerText = score;

    // Vô hiệu hóa tất cả các nút sau khi chọn
    Array.from(answerButtons.children).forEach(btn => btn.disabled = true);

    // Sau 1,5 giây tự động chuyển sang câu tiếp theo
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

startQuiz();
