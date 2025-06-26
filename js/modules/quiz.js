// All logic for the quiz functionality.
import { showSlide } from '../core/presentation.js';

const quizQuestions = [
    { id: 'q1', correctAnswer: 'b' },
    { id: 'q2', correctAnswer: 'b' },
    { id: 'q3', correctAnswer: 'c' },
    { id: 'q4', correctAnswer: 'c' }
];
const totalQuizQuestions = quizQuestions.length;

export function initQuiz() {
    const submitQuizBtn = document.getElementById('submitQuizBtn');
    const quizScoreDisplay = document.getElementById('quizScoreDisplay');
    const quizFeedback = document.getElementById('quizFeedback');
    const restartQuizBtn = document.getElementById('restartQuizBtn');

    if (!submitQuizBtn || !quizScoreDisplay || !quizFeedback || !restartQuizBtn) {
        console.warn("Elementos do Quiz não encontrados. A funcionalidade do quiz não estará disponível.");
        return;
    }

    document.querySelectorAll('.quiz-question input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            const questionForm = event.target.closest('form');
            questionForm.querySelectorAll('.quiz-option').forEach(label => {
                label.classList.remove('selected');
            });
            if (event.target.checked) {
                event.target.closest('.quiz-option').classList.add('selected');
            }
        });
    });

    submitQuizBtn.addEventListener('click', () => {
        let score = 0;
        let allAnswered = true;

        quizQuestions.forEach((question, index) => {
            const questionForm = document.getElementById(`quizFormQ${index + 1}`);
            const selectedOption = questionForm ? questionForm.querySelector(`input[name="q${index + 1}"]:checked`) : null;

            if (!selectedOption) {
                allAnswered = false;
                return;
            }

            const userAnswer = selectedOption.value;
            const optionLabel = selectedOption.closest('.quiz-option');

            if (userAnswer === question.correctAnswer) {
                optionLabel.classList.add('correct');
                score++;
            } else {
                optionLabel.classList.add('incorrect');
                const correctOption = questionForm.querySelector(`input[value="${question.correctAnswer}"]`);
                if (correctOption) {
                    correctOption.closest('.quiz-option').classList.add('correct');
                }
            }
        });

        if (!allAnswered) {
            alert("Por favor, responda todas as perguntas antes de ver os resultados.");
            return;
        }

        document.querySelectorAll('.quiz-question input[type="radio"]').forEach(radio => {
            radio.disabled = true;
        });
        submitQuizBtn.style.display = 'none';
        restartQuizBtn.style.display = 'inline-block';

        const resultsSlideIndex = 18; // slide-19 is index 18
        showSlide(resultsSlideIndex);

        quizScoreDisplay.innerHTML = `Sua pontuação: <strong>${score}</strong> de ${totalQuizQuestions}`;

        if (score === totalQuizQuestions) {
            quizFeedback.textContent = "Excelente! Você dominou os conceitos do S3!";
        } else if (score >= totalQuizQuestions / 2) {
            quizFeedback.textContent = "Bom trabalho! Você está no caminho certo para entender o S3.";
        } else {
            quizFeedback.textContent = "Continue estudando! O S3 pode ser um pouco complexo no início, mas vale a pena.";
        }
    });

    restartQuizBtn.addEventListener('click', () => {
        document.querySelectorAll('.quiz-question input[type="radio"]').forEach(radio => {
            radio.checked = false;
            radio.disabled = false;
            const label = radio.closest('.quiz-option');
            label.classList.remove('selected', 'correct', 'incorrect');
        });

        quizScoreDisplay.innerHTML = "Calculando pontuação...";
        quizFeedback.textContent = "";
        submitQuizBtn.style.display = 'inline-block';
        restartQuizBtn.style.display = 'none';

        const firstQuizQuestionSlideIndex = 14; // slide-15 is index 14
        showSlide(firstQuizQuestionSlideIndex);
    });
}
