// Global variables
let currentStage = 'start';
let currentQuestion = 0;
let answers = {};
let telegramUsername = null;

// Quiz questions
const questions = [
    {
        id: 1,
        question: "Как часто вы сталкиваетесь с английским языком?",
        options: [
            { id: 'a', text: "Каждый день на работе", gif: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif" },
            { id: 'b', text: "Иногда смотрю фильмы/сериалы в оригинале", gif: "https://media.giphy.com/media/3o7rc0qU6m5hneMsuc/giphy.gif" },
            { id: 'c', text: "Редко, в основном в путешествиях", gif: "https://media.giphy.com/media/3o6ZtrvsFui01kCPCg/giphy.gif" },
            { id: 'd', text: "Практически никогда", gif: "https://media.giphy.com/media/26BRxBeok4neDwUQo/giphy.gif" }
        ]
    },
    {
        id: 2,
        question: "Какая ваша главная цель в изучении английского?",
        options: [
            { id: 'a', text: "Карьерный рост", gif: "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif" },
            { id: 'b', text: "Путешествия", gif: "https://media.giphy.com/media/3o6ZtpWvwnhf34Oj0A/giphy.gif" },
            { id: 'c', text: "Саморазвитие", gif: "https://media.giphy.com/media/26BRzozg4TCBXv6QU/giphy.gif" },
            { id: 'd', text: "Переезд за границу", gif: "https://media.giphy.com/media/3o6Zt3AC93PIPAdQ9a/giphy.gif" }
        ]
    },
    {
        id: 3,
        question: "Как бы вы оценили свой текущий уровень английского?",
        options: [
            { id: 'a', text: "Начинающий", gif: "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif" },
            { id: 'b', text: "Элементарный", gif: "https://media.giphy.com/media/3o6Zt3AC93PIPAdQ9a/giphy.gif" },
            { id: 'c', text: "Средний", gif: "https://media.giphy.com/media/3o6ZtrvsFui01kCPCg/giphy.gif" },
            { id: 'd', text: "Продвинутый", gif: "https://media.giphy.com/media/26BRxBeok4neDwUQo/giphy.gif" }
        ]
    }
];

// DOM Elements
const quizContainer = document.getElementById('quiz-container');

// Helper functions
function setStage(stage) {
    currentStage = stage;
    renderQuiz();
}

function renderQuiz() {
    switch (currentStage) {
        case 'start':
            renderQuizStart();
            break;
        case 'questions':
            renderQuizQuestions();
            break;
        case 'complete':
            renderQuizComplete();
            break;
    }
}

function renderQuizStart() {
    quizContainer.innerHTML = `
        <div class="text-center space-y-6">
            <img src="https://via.placeholder.com/300" alt="English Teacher" width="300" height="300" class="mx-auto rounded-lg">
            <h1 class="text-3xl font-bold text-blue-600">Определите свой уровень английского</h1>
            <p class="text-gray-600 max-w-md mx-auto">Пройдите короткий тест и получите бесплатный пробный урок с профессиональным преподавателем</p>
            <button id="start-quiz" class="btn btn-green">Начать квиз</button>
        </div>
    `;
    document.getElementById('start-quiz').addEventListener('click', () => setStage('questions'));
}

function renderQuizQuestions() {
    const question = questions[currentQuestion];
    const isLastQuestion = currentQuestion === questions.length - 1;
    const canProceed = answers[question.id] && answers[question.id].length > 0;

    quizContainer.innerHTML = `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <button id="prev-question" class="btn btn-ghost" ${currentQuestion === 0 ? 'disabled' : ''}>
                    ← Назад
                </button>
                <span class="text-sm text-gray-500">Вопрос ${currentQuestion + 1} из ${questions.length}</span>
            </div>
            <h2 class="text-2xl font-bold text-center text-blue-600">${question.question}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="options-container"></div>
            <button id="next-question" class="btn btn-blue w-full" ${!canProceed ? 'disabled' : ''}>
                ${isLastQuestion ? 'Завершить' : 'Следующий вопрос'} →
            </button>
        </div>
    `;

    const optionsContainer = document.getElementById('options-container');
    question.options.forEach(option => {
        const isSelected = answers[question.id] && answers[question.id].includes(option.id);
        optionsContainer.innerHTML += `
            <div class="card p-4 cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : ''}" data-option-id="${option.id}">
                <div class="flex items-start space-x-3">
                    <input type="radio" id="${option.id}" name="question-${question.id}" value="${option.id}" ${isSelected ? 'checked' : ''} class="mt-1">
                    <div class="flex-1">
                        <label for="${option.id}">${option.text}</label>
                        <img src="${option.gif}" alt="${option.text}" width="200" height="150" class="mt-2 rounded-lg">
                    </div>
                </div>
            </div>
        `;
    });

    // Add event listeners
    document.getElementById('prev-question').addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuizQuestions();
        }
    });

    document.getElementById('next-question').addEventListener('click', () => {
        if (isLastQuestion) {
            handleQuizComplete();
        } else {
            currentQuestion++;
            renderQuizQuestions();
        }
    });

    optionsContainer.addEventListener('click', (e) => {
        const optionCard = e.target.closest('[data-option-id]');
        if (optionCard) {
            const optionId = optionCard.dataset.optionId;
            answers[question.id] = [optionId];
            renderQuizQuestions();
        }
    });
}

function handleQuizComplete() {
    // Instead of sending data to the server, we'll just log it and move to the complete stage
    console.log('Quiz completed:', { telegram: telegramUsername, answers: answers });
    setStage('complete');
}

function renderQuizComplete() {
    quizContainer.innerHTML = `
        <div class="text-center space-y-6">
            <img src="https://via.placeholder.com/300" alt="Celebration" width="300" height="300" class="mx-auto rounded-lg">
            <h2 class="text-3xl font-bold text-blue-600">Поздравляем! Вы успешно завершили квиз</h2>
            <p class="text-gray-600 max-w-md mx-auto">Вы показали отличную мотивацию к изучению английского языка. Забронируйте бесплатный пробный урок прямо сейчас!</p>
            <button id="book-lesson" class="btn btn-green">Забронировать бесплатный урок</button>
        </div>
    `;
    document.getElementById('book-lesson').addEventListener('click', showBookingModal);
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function showBookingModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Забронировать бесплатный урок</h3>
            </div>
            <form id="booking-form">
                <div class="form-group">
                    <label for="date" class="form-label">Предпочтительная дата *</label>
                    <input type="date" id="date" required class="form-input" min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="time" class="form-label">Предпочтительное время *</label>
                    <select id="time" required class="form-select">
                        <option value="">Выберите время</option>
                        ${Array.from({ length: 11 }, (_, i) => i + 10).map(hour => `
                            <option value="${hour}:00">${hour}:00</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="phone" class="form-label">Номер телефона (необязательно)</label>
                    <input type="tel" id="phone" class="form-input">
                </div>
                <button type="submit" class="btn btn-blue w-full">Забронировать</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('booking-form').addEventListener('submit', handleBookingSubmit);
}

function handleBookingSubmit(e) {
    e.preventDefault();
    const formData = {
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        phone: document.getElementById('phone').value,
        telegram: telegramUsername
    };

    // Instead of sending data to the server, we'll just log it and show a success message
    console.log('Booking submitted:', formData);
    alert('Урок успешно забронирован!');
    document.querySelector('.modal').remove();
}

// Initialize the quiz
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    telegramUsername = urlParams.get('telegram');
    renderQuiz();
});

