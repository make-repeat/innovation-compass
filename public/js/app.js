document.addEventListener('DOMContentLoaded', function () {
    quizApp.init();
});

const quizApp = {

    hooks: {},
    quiz: null,
    sectionData: {},
    currentFrame: 0,

    init: function () {
        this.initHooks();
        this.loadQuizData();
    },

    initHooks: function () {
        // Templates
        this.hooks.templates = {
            'start': document.querySelector('[data-template-start]'),
            'question': document.querySelector('[data-template-question]'),
            'title': document.querySelector('[data-template-title]'),
            'results': document.querySelector('[data-template-results]'),
        };

        // Buttons
        this.hooks.buttons = {
            'start': document.querySelector('[data-start-button]'),
            'next': document.querySelectorAll('[data-next-button]'),
            'prev': document.querySelectorAll('[data-prev-button]')
        };
        this.hooks.buttons.start.addEventListener('click', () => { this.startQuiz(); });
        this.hooks.buttons.next.forEach((item) => {
            item.addEventListener('click', () => { this.nextFrame(); })
        });
        this.hooks.buttons.prev.forEach((item) => {
            item.addEventListener('click', () => { this.prevFrame(); })
        });

        // Content
        this.hooks.question = document.querySelector('[data-question-body]');
        this.hooks.title = document.querySelector('[data-title-body]');
    },

    startQuiz: function () {
        this.hideElement(this.hooks.templates.start);
        this.showElement(this.hooks.templates.question);
        this.renderFrame();
    },

    prevFrame: function () {
        if (this.currentFrame > 0) {
            this.currentFrame--;
            this.renderFrame();
        }
    },

    nextFrame: function () {
        // Get current answer from radio buttons
        const frame = this.quiz[this.currentFrame];
        console.log(frame);
        if (frame.weighting) {
            const answer = document.querySelector('[data-answer]:checked');

            if (answer) {
                this.quiz[this.currentFrame].answer = answer.value;
                this.currentFrame++;
                this.renderFrame();
            } else {
                alert('Please select an answer');
            }
        } else {
            this.currentFrame++;
            this.renderFrame();
        }
    },

    renderFrame: function () {
        console.log('currentFrame:' + this.currentFrame);
        const frame = this.quiz[this.currentFrame];

        if (frame.weighting) {
            this.hideElement(this.hooks.templates.title);
            this.showElement(this.hooks.templates.question);

            this.hooks.question.innerHTML = frame.activity_name;
            const existingAnswer = this.quiz[this.currentFrame].answer;
            if (existingAnswer) {
                console.log('existing: ' + existingAnswer);
                document.querySelector("[data-answer-" + existingAnswer + "]").checked = true;
            } else {
                let checked_answer = document.querySelector('[data-answer]:checked');
                if (checked_answer) {
                    checked_answer.checked = false;
                }
            }
        } else {
            this.hideElement(this.hooks.templates.question);
            this.showElement(this.hooks.templates.title);
            this.hooks.title.innerHTML = frame.activity_name;
            if (frame.category == 'community') {
                this.hooks.title.style.background = '#7C3AED';
            } else if (frame.category == 'entrepreneurship') {
                this.hooks.title.style.background = '#34D399';
            } else if (frame.category == 'impact') {
                this.hooks.title.style.background = '#F59E0B';
            }
        }
    },

    loadQuizData: async function () {
        try {
            const response = await fetch('/quiz.json');
            const data = await response.json();
            this.quiz = data;
            this.makeSectionData();
        } catch (error) {
            console.error('Error loading quiz data:', error);
        }
    },

    makeSectionData: function () {
        let sectionData = {};
        this.quiz.forEach((item, index) => {
            if (item.weighting) {
                if (!sectionData[item.category]) {
                    sectionData[item.category] = 0;
                }
                sectionData[item.category]++;
            }
        });
        this.sectionData = sectionData;
    },

    hideElement: function (element) {
        element.classList.add('hidden');
    },

    showElement: function (element) {
        element.classList.remove('hidden');
    },
};


