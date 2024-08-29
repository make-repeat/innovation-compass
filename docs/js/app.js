document.addEventListener("DOMContentLoaded", function () {
    quizApp.init();
    // window.addEventListener('beforeunload', (event) => {
    //     // Cancel the event as stated by the standard.
    //     event.preventDefault();
    //     // Chrome requires returnValue to be set.
    //     event.returnValue = '';
    // });
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
        // Containers
        this.hooks.containers = {
            quiz: document.querySelector("[data-quiz-container]"),
        };

        // Headlines
        this.hooks.headlines = {
            quizTitle: document.querySelector("[data-quiz-title-headline]"),
            quizQuestion: document.querySelector(
                "[data-quiz-question-headline]"
            ),
        };

        // Templates
        this.hooks.templates = {
            start: document.querySelector("[data-template-start]"),
            question: document.querySelector("[data-template-question]"),
            title: document.querySelector("[data-template-title]"),
            results: document.querySelector("[data-template-results]"),
        };

        // Buttons
        this.hooks.buttons = {
            start: document.querySelector("[data-start-button]"),
            next: document.querySelectorAll("[data-next-button]"),
            prev: document.querySelectorAll("[data-prev-button]"),
        };

        this.hooks.buttons.start.addEventListener("click", () => {
            this.startQuiz();
        });
        this.hooks.buttons.next.forEach((item) => {
            item.addEventListener("click", () => {
                this.nextFrame();
            });
        });
        this.hooks.buttons.prev.forEach((item) => {
            item.addEventListener("click", () => {
                this.prevFrame();
            });
        });

        // Content
        this.hooks.questionHeadline = document.querySelector(
            "[data-question-headline]"
        );
        this.hooks.questionBlurb = document.querySelector(
            "[data-question-blurb]"
        );

        this.hooks.titleHeadline = document.querySelector(
            "[data-title-headline]"
        );
        this.hooks.titleBlurb = document.querySelector("[data-title-blurb]");

        this.hooks.category = {
            body: document.querySelector("[data-category-body]"),
            number: document.querySelector("[data-category-number]"),
        };
        this.hooks.progress = {
            bar: document.querySelector("[data-progress-bar-fill]"),
            percent: document.querySelector("[data-progress-percent]"),
        };

        // Errors
        this.hooks.errorMessage = document.querySelector(
            "[data-error-message]"
        );
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

        if (frame.weighting) {
            const answer = document.querySelector("[data-answer]:checked");
            if (answer) {
                this.quiz[this.currentFrame].answer = answer.value;
                this.currentFrame++;
                this.renderFrame();
            } else {
                this.hooks.errorMessage.classList.remove("hidden");
            }
        } else {
            this.currentFrame++;
            this.renderFrame();
        }
    },

    renderFrame: function () {
        // Hide error message
        this.hooks.errorMessage.classList.add("hidden");

        // Render the frame
        if (this.currentFrame < this.quiz.length) {
            const frame = this.quiz[this.currentFrame];
            if (frame.weighting) {
                // If the frame is a question
                this.renderQuestion(frame);
            } else {
                this.renderTitle(frame);
            }
        } else {
            // If the quiz is finished
            this.hideElement(this.hooks.templates.question);
            this.hideElement(this.hooks.templates.title);
            this.showElement(this.hooks.templates.results);
        }
    },

    renderQuestion: function (frame) {
        this.hideElement(this.hooks.templates.title);
        this.showElement(this.hooks.templates.question);

        this.hooks.questionHeadline.innerHTML = frame.activity_name;
        this.hooks.questionBlurb.innerHTML = frame.blurb;

        this.hooks.category.body.innerHTML = frame.category;
        this.hooks.category.number.innerHTML =
            this.getSectionNumber() +
            " of " +
            Object.keys(this.sectionData).length;

        let percentage =
            ((this.getSectionProgress() + 1) /
                this.sectionData[frame.category]) *
            100;
        this.hooks.progress.bar.style.width = percentage + "%";
        this.hooks.progress.percent.innerHTML = Math.round(percentage) + "%";

        const existingAnswer = this.quiz[this.currentFrame].answer;
        if (existingAnswer) {
            document.querySelector(
                "[data-answer-" + existingAnswer + "]"
            ).checked = true;
        } else {
            let checked_answer = document.querySelector(
                "[data-answer]:checked"
            );
            if (checked_answer) {
                checked_answer.checked = false;
            }
        }

        // Set the theme
        this.setTheme(frame.category, "question");
    },

    renderTitle: function (frame) {
        this.hideElement(this.hooks.templates.question);
        this.showElement(this.hooks.templates.title);
        this.hooks.titleHeadline.innerHTML = frame.activity_name;
        this.hooks.titleBlurb.innerHTML = frame.blurb;

        // Set the theme
        this.setTheme(frame.category, "title");
    },

    setTheme: function (category, type) {
        switch (category + "-" + type) {
            case "community-title":
                this.hooks.containers.quiz.style.background = "#5D62F4";
                this.hooks.headlines.quizTitle.style.color = "#DFE0FD";
                this.hooks.progress.bar.style.background = "#5D62F4";
                break;
            case "community-question":
                this.hooks.containers.quiz.style.background = "#DFE0FD";
                this.hooks.headlines.quizQuestion.style.color = "#5D62F4";
                this.hooks.progress.bar.style.background = "#5D62F4";
                break;
            case "entrepreneurship-title":
                this.hooks.containers.quiz.style.background = "#E76446";
                this.hooks.headlines.quizTitle.style.color = "#FAE0DA";
                this.hooks.progress.bar.style.background = "#E76446";
                break;
            case "entrepreneurship-question":
                this.hooks.containers.quiz.style.background = "#FAE0DA";
                this.hooks.headlines.quizQuestion.style.color = "#E76446";
                this.hooks.progress.bar.style.background = "#E76446";
                break;
            case "impact-title":
                this.hooks.containers.quiz.style.background = "#3B817E";
                this.hooks.headlines.quizTitle.style.color = "#D0DEDD";
                this.hooks.progress.bar.style.background = "#3B817E";
                break;
            case "impact-question":
                this.hooks.containers.quiz.style.background = "#D0DEDD";
                this.hooks.headlines.quizQuestion.style.color = "#3B817E";
                this.hooks.progress.bar.style.background = "#3B817E";
                break;
        }
    },

    loadQuizData: async function () {
        try {
            const response = await fetch("quiz.json");
            const data = await response.json();
            this.quiz = data;
            this.makeSectionData();
        } catch (error) {
            console.error("Error loading quiz data:", error);
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

    getSectionProgress: function () {
        // Go through each question to determine the progress
        let sectionProgress = 0;
        for (let i = 0; i < this.currentFrame; i++) {
            if (this.quiz[i].weighting) {
                sectionProgress++;
            } else {
                sectionProgress = 0;
            }
        }
        return sectionProgress - 1;
    },

    getSectionNumber: function () {
        let sectionNumber = 0;
        for (let i = 0; i < this.currentFrame; i++) {
            if (!this.quiz[i].weighting) {
                sectionNumber++;
            }
        }
        return sectionNumber;
    },

    hideElement: function (element) {
        element.classList.add("hidden");
    },

    showElement: function (element) {
        element.classList.remove("hidden");
    },
};
