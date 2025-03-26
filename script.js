const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const scoreDisplay = document.getElementById("score-value");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let isQuestionJsonDone = false; // Kiểm tra khi hết question.json

//  Hàm xáo trộn mảng (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//  Hàm tải câu hỏi từ file JSON
async function loadQuestions(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Lỗi ${response.status}`);
        const data = await response.json();
        return data.length ? data : []; // Trả về mảng rỗng nếu không có câu hỏi
    } catch (error) {
        console.error(` Lỗi khi tải ${file}:`, error);
        return [];
    }
}

//  Bắt đầu quiz
async function startQuiz() {
    questions = await loadQuestions("question.json");
    shuffleArray(questions);

    if (questions.length === 0) {
        // Nếu `question.json` rỗng, chuyển ngay sang `quiz.json`
        isQuestionJsonDone = true;
        questions = await loadQuestions("quiz.json");
        shuffleArray(questions);
    }

    showQuestion();
}

//  Hiển thị câu hỏi hiện tại
function showQuestion() {
    resetState();

    if (currentQuestionIndex >= questions.length) {
        if (!isQuestionJsonDone) {
            // Khi hết `question.json`, hiển thị thông báo và chuyển sang `quiz.json`
            isQuestionJsonDone = true;
            questionElement.innerText = " Tiếp theo là phần trắc nghiệm!";
            answerButtons.innerHTML = "";

            // Chuyển sang `quiz.json` sau 3 giây
            setTimeout(async () => {
                currentQuestionIndex = 0;
                questions = await loadQuestions("quiz.json");
                shuffleArray(questions);
                showQuestion();
            }, 3000);

            return;
        } else {
            //  Nếu hết tất cả câu hỏi, hiển thị điểm số
            questionElement.innerText = ` Hoàn thành! Bạn đạt ${score}/${questions.length} điểm.`;
            answerButtons.innerHTML = "";
            return;
        }
    }

    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

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

//  Reset giao diện trước khi hiển thị câu hỏi mới
function resetState() {
    answerButtons.innerHTML = "";
}

//  Xử lý chọn đáp án
function selectAnswer(button, correct) {
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (correct) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");

        // Hiển thị màu xanh cho đáp án đúng
        const correctButton = Array.from(answerButtons.children).find(btn => btn.innerText === correctAnswer);
        if (correctButton) {
            correctButton.classList.add("correct");
        }
    }

    // Cập nhật điểm số
    scoreDisplay.innerText = score;

    // Vô hiệu hóa tất cả các nút sau khi chọn
    Array.from(answerButtons.children).forEach(btn => btn.disabled = true);

    //  Sau 1,5 giây tự động chuyển sang câu tiếp theo
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

// 🟢 Bắt đầu quiz
startQuiz();
