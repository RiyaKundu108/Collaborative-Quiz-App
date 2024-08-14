// function getQueryParam(param) {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(param);
// }

// document.addEventListener('DOMContentLoaded', function() {
//     const quizId = getQueryParam('id');
//     const quizzes = JSON.parse(localStorage.getItem('quizzes')) || {};
//     const quiz = quizzes[quizId];
    
//     if (quiz) {
//         const quizContainer = document.getElementById('quiz-container');
        
//         quiz.forEach((question, index) => {
//             const questionElement = document.createElement('div');
//             questionElement.classList.add('question-item');
            
//             questionElement.innerHTML = `
//                 <h3>Question ${index + 1}</h3>
//                 <p>${question.questionText}</p>
//                 ${question.answerOptions.map((option, i) => `
//                     <label>
//                         <input type="radio" name="question${index}" value="${i + 1}" required>
//                         ${option}
//                     </label>
//                 `).join('')}
//             `;
            
//             quizContainer.appendChild(questionElement);
//         });

//         document.getElementById('submit-quiz').style.display = 'block';
//     } else {
//         document.getElementById('quiz-container').innerHTML = '<p>Quiz not found!</p>';
//     }
// });

// document.getElementById('submit-quiz').addEventListener('click', function() {
//     const quizId = getQueryParam('id');
//     const quizzes = JSON.parse(localStorage.getItem('quizzes')) || {};
//     const quiz = quizzes[quizId];

//     if (quiz) {
//         let score = 0;

//         quiz.forEach((question, index) => {
//             const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
//             if (selectedOption && parseInt(selectedOption.value) === question.correctAnswer) {
//                 score++;
//             }
//         });

//         alert(`You scored ${score} out of ${quiz.length}`);

//         // Store the score for this quiz
//         const scores = JSON.parse(localStorage.getItem('scores')) || {};
//         if (!scores[quizId]) {
//             scores[quizId] = [];
//         }

//         const participantName = prompt("Enter your name:");
//         scores[quizId].push({ name: participantName, score: score });
//         localStorage.setItem('scores', JSON.stringify(scores));

//         // Optionally, redirect to a "Thank You" page or the quiz creator's dashboard
//     }
// });

let currentQuestionIndex = 0;
let quizData = [];
let userAnswers = [];

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function showQuestion(index) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    if (index >= 0 && index < quizData.length) {
        const question = quizData[index];

        const questionElement = document.createElement('div');
        questionElement.classList.add('question-item');
        questionElement.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${question.questionText}</p>
            ${question.answerOptions.map((option, i) => `
                <label>
                    <input type="radio" name="question${index}" value="${i + 1}" required>
                    ${option}
                </label>
            `).join('')}
        `;

        quizContainer.appendChild(questionElement);

        // Restore the selected answer if already answered
        if (userAnswers[index] !== undefined) {
            document.querySelector(`input[name="question${index}"][value="${userAnswers[index]}"]`).checked = true;
        }
    }

    // Update navigation buttons
    document.getElementById('prev-question').disabled = index === 0;
    document.getElementById('next-question').style.display = index === quizData.length - 1 ? 'none' : 'inline-block';
    document.getElementById('submit-quiz').style.display = index === quizData.length - 1 ? 'inline-block' : 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const quizId = getQueryParam('id');
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || {};
    quizData = quizzes[quizId] || [];

    if (quizData.length > 0) {
        userAnswers = Array(quizData.length).fill(undefined);
        showQuestion(currentQuestionIndex);
    } else {
        document.getElementById('quiz-container').innerHTML = '<p>Quiz not found!</p>';
    }

    document.getElementById('prev-question').addEventListener('click', function() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    });

    document.getElementById('next-question').addEventListener('click', function() {
        const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
        if (selectedOption) {
            userAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
            if (currentQuestionIndex < quizData.length - 1) {
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            }
        } else {
            alert('Please select an answer before proceeding.');
        }
    });

    document.getElementById('submit-quiz').addEventListener('click', function() {
        const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
        if (selectedOption) {
            userAnswers[currentQuestionIndex] = parseInt(selectedOption.value);

            let score = 0;
            quizData.forEach((question, index) => {
                if (userAnswers[index] === question.correctAnswer) {
                    score++;
                }
            });

            alert(`You scored ${score} out of ${quizData.length}`);

            const scores = JSON.parse(localStorage.getItem('scores')) || {};
            if (!scores[quizId]) {
                scores[quizId] = [];
            }

            const participantName = prompt("Enter your name:");
            scores[quizId].push({ name: participantName, score: score });
            localStorage.setItem('scores', JSON.stringify(scores));

            window.location.href = 'thank-you.html'; // Redirect after submission (optional)
        } else {
            alert('Please select an answer before submitting.');
        }
    });
});
