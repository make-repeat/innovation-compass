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
    blocks: null,
    sections: {},
    currentFrame: 0,
    currentBlock: 0,
    blockKeys: [],
    activities: [],
<<<<<<< Updated upstream
    rootUrl: "https://public-policy-lab.github.io/innovation-compass/",

    init: function () {
        this.injectHtml();
        this.initHooks();
        this.loadQuizData();
        this.loadBlocksData();
    },

    initHooks: function () {
        // Containers
        this.hooks.containers = {
            quiz: document.querySelector("[data-quiz-container]"),
        };

        // Headlines
        this.hooks.headlines = {
            quizTitle: document.querySelector("[data-quiz-title-headline]"),
            quizQuestion: document.querySelector("[data-quiz-question-headline]"),
        };

        // Templates
        this.hooks.templates = {
            start: document.querySelector("[data-template-start]"),
            question: document.querySelector("[data-template-question]"),
            title: document.querySelector("[data-template-title]"),
            results: document.querySelector("[data-template-results]"),
            slide: {
                intro: document.querySelector("[data-slide-intro]"),
                single: document.querySelector("[data-slide-single]"),
                eyebrow: document.querySelector("[data-slide-eyebrow]"),
                title: document.querySelector("[data-slide-title]"),
                body: document.querySelector("[data-slide-body]"),
                priority: document.querySelector("[data-slide-priority]"),
            },
            activities: document.querySelector("[data-activities]"),
        };

        // Buttons
        this.hooks.buttons = {
            start: document.querySelector("[data-start-button]"),
            finish: document.querySelector("[data-finish-button]"),
            nextFrame: document.querySelectorAll("[data-next-frame-button]"),
            prevFrame: document.querySelectorAll("[data-prev-frame-button]"),
            nextBlock: document.querySelector("[data-next-block-button]"),
            prevBlock: document.querySelector("[data-prev-block-button]"),
        };

        this.hooks.buttons.start.addEventListener("click", () => {
            this.startQuiz();
        });
        this.hooks.buttons.finish.addEventListener("click", () => {
            this.finishQuiz();
        });
        this.hooks.buttons.nextFrame.forEach((item) => {
            item.addEventListener("click", () => {
                this.nextFrame();
            });
        });
        this.hooks.buttons.prevFrame.forEach((item) => {
            item.addEventListener("click", () => {
                this.prevFrame();
            });
        });
        this.hooks.buttons.nextBlock.addEventListener("click", () => {
            this.nextBlock();
        });
        this.hooks.buttons.prevBlock.addEventListener("click", () => {
            this.prevBlock();
        });
        // Content
        this.hooks.questionHeadline = document.querySelector("[data-question-headline]");
        this.hooks.questionBlurb = document.querySelector("[data-question-blurb]");

        this.hooks.titleHeadline = document.querySelector("[data-title-headline]");
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
        this.hooks.errorMessage = document.querySelector("[data-error-message]");
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

    prevBlock: function () {
        console.log("prevBlock");
        if (this.currentBlock > 0) {
            this.currentBlock--;
        } else {
            this.currentBlock = 0
        }
        this.renderBlock();
    },

    nextBlock: function () {
        // Hide the intro slide
        this.hideElement(this.hooks.templates.slide.intro);
        this.showElement(this.hooks.templates.slide.single);
        if (this.currentBlock < this.blockKeys.length - 1) {
            this.currentBlock++;
        } else {
            this.currentBlock = 0;
        }
        this.renderBlock();
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
        this.hooks.category.number.innerHTML = this.getSectionNumber() + " of " + Object.keys(this.sections).length;

        let percentage = ((this.getSectionProgress() + 1) / this.sections[frame.category]) * 100;
        this.hooks.progress.bar.style.width = percentage + "%";
        this.hooks.progress.percent.innerHTML = Math.round(percentage) + "%";

        const existingAnswer = this.quiz[this.currentFrame].answer;
        if (existingAnswer) {
            document.querySelector("[data-answer-" + existingAnswer + "]").checked = true;
        } else {
            let checked_answer = document.querySelector("[data-answer]:checked");
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

    renderResults: function () {
        this.hideElement(this.hooks.templates.start);
        this.hideElement(this.hooks.templates.question);
        this.hideElement(this.hooks.templates.title);
        this.showElement(this.hooks.templates.results);

        console.log("renderResults", this.blocks, this.blocks.length);

        const resultHands = document.querySelectorAll("[data-result-hands]");

        // Loop through the blocks and render the results
        for (let block in this.blocks) {
            const hand = document.querySelector("[data-hand-block-id='" + block + "']");
            const average = this.blocks[block].average;

            if (hand && average) {
                hand.setAttribute("data-hand-reach", average);
            }
        }
    },

    renderBlock: function () {
        // Get the current block
        const block = this.blocks[this.blockKeys[this.currentBlock]];
        // Output data to block
        this.hooks.templates.slide.eyebrow.innerHTML = block.category;
        this.hooks.templates.slide.title.innerHTML = block.title;
        this.hooks.templates.slide.body.innerHTML = block.description;
        this.hooks.templates.slide.priority.innerHTML = block.priority;

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
            const response = await fetch(this.rootUrl + "quiz.json");
            const data = await response.json();
            this.quiz = data;
            this.makesections();
        } catch (error) {
            console.error("Error loading quiz data:", error);
        }
    },

    loadBlocksData: async function () {
        try {
            const response = await fetch(this.rootUrl + "blocks.json");
            const data = await response.json();
            this.blocks = data;
        } catch (error) {
            console.error("Error loading blocks data:", error);
        }
    },

    makesections: function () {
        let sections = {};
        this.quiz.forEach((item, index) => {
            if (item.weighting) {
                if (!sections[item.category]) {
                    sections[item.category] = 0;
                }
                sections[item.category]++;
            }
        });
        this.sections = sections;
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

    finishQuiz: function () {
        // Loop through the quiz and randomly
        // asssign an answer value from 1-5
        this.quiz.forEach((item) => {
            if (item.weighting) {
                item.answer = Math.floor(Math.random() * 4) + 1;
            }
        });

        this.doCalculations();
    },

    doCalculations: function () {
        this.quiz.forEach((item) => {
            if (item.weighting) {
                item.priority = item.answer * item.weighting;
                this.blocks[item.building_block].items.push(item);
            }
        });

        // Calculate the average for each block
        for (let block in this.blocks) {
            let total = 0;
            this.blocks[block].items.forEach((item) => {
                total += item.priority;
            });
            this.blocks[block].average = total / this.blocks[block].items.length;

            // Round
            this.blocks[block].average = Math.round(this.blocks[block].average);
        }

        // Add priority to the blocks
        for (let block in this.blocks) {
            this.blocks[block].priority = this.getPriority(this.blocks[block].average);
        }

        this.blockKeys = Object.keys(this.blocks);

        // Render
        this.renderResults();

        // Build activities
        this.buildActivities();

    },

    buildActivities: function () {

        // Create activities list
        this.quiz.forEach((item, index) => {
            if (item.weighting) {
                item.block_priority = this.blocks[item.building_block].priority;
                this.activities.push(item);
            }
        });

        this.activities.sort(this.activitySort);

        this.activities.forEach((activity, index) => {
            let html = this.buildActivity(activity);
            this.hooks.templates.activities.innerHTML += html;
        });
    },

    activitySort: function (a, b) {
        if (a.priority > b.priority) {
            return -1;
        }
        if (a.priority < b.priority) {
            return 1;
        }
        return 0;
    },

    getPriority: function (average) {
        if (average <= 3) {
            return "low";
        } else if (average <= 7) {
            return "medium";
        } else {
            return "high";
        }
    },

    injectHtml: function () {
        let html = `      
            <section class="quiz">
                <div data-quiz-container class="quiz__container">
                <!-- Start page -->
                <div data-template-start>
                    <div class="quiz__layout quiz__layout--start">
                    <div class="quiz__header">
                        <h1 class="headline">Innovator Quiz</h1>
                        <p>
                        Assess your strengths and weaknesses based on Innovation
                        Building Blocks.
                        </p>
                    </div>
                    <div class="quiz__body">
                        <div class="quiz__summary">
                        <h2>Innovation Building Blocks</h2>
                        <p>
                            The Innovator Building Blocks consist of 40 essential
                            activities identified by innovators during the Compass Pilot
                            co-design process. Inspired by the real journeys of other
                            early-stage innovators, the building blocks seek to
                            demystify the often challenging and ambiguous experience of
                            starting your own company. The building block activities aim
                            to foster a comprehensive understanding of what it takes to
                            take a budding idea and transform it into a sustainable
                            venture by providing guidance on essential topics such as
                            vision setting, sustainable funding, business operations,
                            and more.
                        </p>
                        <h2>Quiz</h2>
                        <p>
                            To help you navigate your innovation journey, our assessment
                            quiz can guide you on where to focus your efforts. The quiz
                            should take 10-15 min to complete and contains 40 questions
                            divided in 3 sections.
                        </p>

                        <div class="buttons">
                            <button data-start-button class="button w-inline-block">
                            <div class="button-text">Begin the Quiz</div>
                            </button>
                            <br />
                            <button data-finish-button>Skip to Results (dev)</button>
                        </div>
=======
    baseUrl: "https://public-policy-lab.github.io/innovation-compass/",

    init: function () {

        if (window.location.hostname != "www.innovationcompass.io") {
            this.baseUrl = "./";
        }

        this.injectHtml().then(() => {
            this.initHooks();
            this.loadQuizData();
            this.loadBlocksData();
        });
    },

    initHooks: function () {
        // Containers
        this.hooks.containers = {
            quiz: document.querySelector("[data-quiz-container]"),
        };

        // Headlines
        this.hooks.headlines = {
            quizTitle: document.querySelector("[data-quiz-title-headline]"),
            quizQuestion: document.querySelector("[data-quiz-question-headline]"),
        };

        // Templates
        this.hooks.templates = {
            start: document.querySelector("[data-template-start]"),
            question: document.querySelector("[data-template-question]"),
            title: document.querySelector("[data-template-title]"),
            results: document.querySelector("[data-template-results]"),
            slide: {
                intro: document.querySelector("[data-slide-intro]"),
                single: document.querySelector("[data-slide-single]"),
                eyebrow: document.querySelector("[data-slide-eyebrow]"),
                title: document.querySelector("[data-slide-title]"),
                body: document.querySelector("[data-slide-body]"),
                priority: document.querySelector("[data-slide-priority]"),
            },
            activities: document.querySelector("[data-activities]"),
        };

        // Buttons
        this.hooks.buttons = {
            start: document.querySelector("[data-start-button]"),
            finish: document.querySelector("[data-finish-button]"),
            nextFrame: document.querySelectorAll("[data-next-frame-button]"),
            prevFrame: document.querySelectorAll("[data-prev-frame-button]"),
            nextBlock: document.querySelector("[data-next-block-button]"),
            prevBlock: document.querySelector("[data-prev-block-button]"),
        };

        this.hooks.buttons.start.addEventListener("click", () => {
            this.startQuiz();
        });
        this.hooks.buttons.finish.addEventListener("click", () => {
            this.finishQuiz();
        });
        this.hooks.buttons.nextFrame.forEach((item) => {
            item.addEventListener("click", () => {
                this.nextFrame();
            });
        });
        this.hooks.buttons.prevFrame.forEach((item) => {
            item.addEventListener("click", () => {
                this.prevFrame();
            });
        });
        this.hooks.buttons.nextBlock.addEventListener("click", () => {
            this.nextBlock();
        });
        this.hooks.buttons.prevBlock.addEventListener("click", () => {
            this.prevBlock();
        });
        // Content
        this.hooks.questionHeadline = document.querySelector("[data-question-headline]");
        this.hooks.questionBlurb = document.querySelector("[data-question-blurb]");

        this.hooks.titleHeadline = document.querySelector("[data-title-headline]");
        this.hooks.titleBlurb = document.querySelector("[data-title-blurb]");

        this.hooks.category = {
            body: document.querySelector("[data-category-body]"),
            number: document.querySelector("[data-category-number]"),
        };
        this.hooks.progress = {
            bar: document.querySelector("[data-progress-bar-fill]"),
            percent: document.querySelector("[data-progress-percent]"),
        };

        // Hands
        this.hooks.hands = document.querySelectorAll("[data-hand]");

        // Errors
        this.hooks.errorMessage = document.querySelector("[data-error-message]");
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

    prevBlock: function () {
        if (this.currentBlock > 0) {
            this.currentBlock--;
        } else {
            this.currentBlock = 0;
        }
        this.renderBlock();
    },

    nextBlock: function () {
        if (this.currentBlock < this.blockKeys.length - 1) {
            this.currentBlock++;
        } else {
            this.currentBlock = 0;
        }
        this.renderBlock();
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
        this.hooks.category.number.innerHTML = this.getSectionNumber() + " of " + Object.keys(this.sections).length;

        let percentage = ((this.getSectionProgress() + 1) / this.sections[frame.category]) * 100;
        this.hooks.progress.bar.style.width = percentage + "%";
        this.hooks.progress.percent.innerHTML = Math.round(percentage) + "%";

        const existingAnswer = this.quiz[this.currentFrame].answer;
        if (existingAnswer) {
            document.querySelector("[data-answer-" + existingAnswer + "]").checked = true;
        } else {
            let checked_answer = document.querySelector("[data-answer]:checked");
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

    renderResults: function () {
        this.hideElement(this.hooks.templates.start);
        this.hideElement(this.hooks.templates.question);
        this.hideElement(this.hooks.templates.title);
        this.showElement(this.hooks.templates.results);

        console.log("renderResults", this.blocks, this.blocks.length);

        this.hooks.hands.forEach((hand) => {
            hand.addEventListener("click", () => {
                this.hooks.hands.forEach((hand) => {
                    hand.classList.remove("is--focused");
                });

                hand.classList.add("is--focused");

                // Get the selected hand and set the current block
                const selectedHandId = hand.getAttribute("data-hand-block-id");
                for (let block in this.blocks) {
                    if (block === selectedHandId) {
                        this.currentBlock = this.blockKeys.indexOf(block);
                        this.renderBlock();
                    }
                }
            });
        });

        // Loop through the blocks and render the results
        for (let block in this.blocks) {
            const hand = document.querySelector("[data-hand-block-id='" + block + "']");
            const average = this.blocks[block].average;

            if (hand && average) {
                hand.setAttribute("data-hand-reach", average);
            }
        }
    },

    renderBlock: function () {
        // Hide the intro slide
        this.hideElement(this.hooks.templates.slide.intro);
        // Show the single slide
        this.showElement(this.hooks.templates.slide.single);

        // Get the current block
        const block = this.blocks[this.blockKeys[this.currentBlock]];

        // Set the relevant hand to be focused
        this.hooks.hands.forEach((hand) => {
            hand.classList.remove("is--focused");

            const handBlockId = hand.getAttribute("data-hand-block-id");
            if (handBlockId === this.blockKeys[this.currentBlock]) {
                hand.classList.add("is--focused");
            }
        });

        // Output data to block
        this.hooks.templates.slide.eyebrow.innerHTML = block.category;
        this.hooks.templates.slide.title.innerHTML = block.title;
        this.hooks.templates.slide.body.innerHTML = block.description;
        this.hooks.templates.slide.priority.innerHTML = block.priority;
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
            const response = await fetch(this.baseUrl + "quiz.json");
            const data = await response.json();
            this.quiz = data;
            this.makeSections();
        } catch (error) {
            console.error("Error loading quiz data:", error);
        }
    },

    loadBlocksData: async function () {
        try {
            const response = await fetch(this.baseUrl + "blocks.json");
            const data = await response.json();
            this.blocks = data;
        } catch (error) {
            console.error("Error loading blocks data:", error);
        }
    },

    makeSections: function () {
        let sections = {};
        this.quiz.forEach((item, index) => {
            if (item.weighting) {
                if (!sections[item.category]) {
                    sections[item.category] = 0;
                }
                sections[item.category]++;
            }
        });
        this.sections = sections;
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

    finishQuiz: function () {
        // Loop through the quiz and randomly
        // asssign an answer value from 1-5
        this.quiz.forEach((item) => {
            if (item.weighting) {
                item.answer = Math.floor(Math.random() * 4) + 1;
            }
        });

        this.doCalculations();
    },

    doCalculations: function () {
        this.quiz.forEach((item) => {
            if (item.weighting) {
                item.priority = item.answer * item.weighting;
                this.blocks[item.building_block].items.push(item);
            }
        });

        // Calculate the average for each block
        for (let block in this.blocks) {
            let total = 0;
            this.blocks[block].items.forEach((item) => {
                total += item.priority;
            });
            this.blocks[block].average = total / this.blocks[block].items.length;

            // Round
            this.blocks[block].average = Math.round(this.blocks[block].average);
        }

        // Add priority to the blocks
        for (let block in this.blocks) {
            this.blocks[block].priority = this.getPriority(this.blocks[block].average);
        }

        this.blockKeys = Object.keys(this.blocks);

        // Render
        this.renderResults();

        // Build activities
        this.buildActivities();
    },

    buildActivities: function () {
        // Create activities list
        this.quiz.forEach((item, index) => {
            if (item.weighting) {
                item.block_priority = this.blocks[item.building_block].priority;
                this.activities.push(item);
            }
        });

        this.activities.sort(this.activitySort);

        this.activities.forEach((activity, index) => {
            let html = this.buildActivity(activity);
            this.hooks.templates.activities.innerHTML += html;
        });
    },

    activitySort: function (a, b) {
        if (a.priority > b.priority) {
            return -1;
        }
        if (a.priority < b.priority) {
            return 1;
        }
        return 0;
    },

    getPriority: function (average) {
        if (average <= 3) {
            return "low";
        } else if (average <= 7) {
            return "medium";
        } else {
            return "high";
        }
    },

    injectHtml: function () {
        return fetch(this.baseUrl + "js/_quiz-partial.html")
            .then((res) => res.text())
            .then((text) => {
                // Inject the HTML
                let scriptNode = document.querySelector("[data-quiz-script]");
                var htmlNode = document.createElement("div");
                htmlNode.innerHTML = text;
                scriptNode.after(htmlNode);
            })
            .catch((e) => console.error(e));
    },

    // Build an activity
    buildActivity: function (activity) {
        let html = `
            <div
                role="list"
                class="">
                <div
                    role="listitem"
                    class="collection-item-4 w-dyn-item w-col w-col-4">
                    <div
                        class="bb-activity-tile-div">
                        <div
                            class="bb-activity-tile-rounded-border">
                            <div
                                class="bb-activity-tile-top-grid">
                                <div
                                    style="color: #5d62f4"
                                    class="bb-tag-text navy-tag-text block-display">
                                    ${activity.category}-${activity.priority}
                                </div>
                                <div
                                    class="bb-activity-tile-title">
                                    ${activity.activity_name}
                                </div>
                            </div>
                            <a
                                href="${activity.activity_url}"
                                target="_blank"
                                class="button w-inline-block">
                                <div
                                    class="button-text">Go To Activity</div>
                            </a>
>>>>>>> Stashed changes
                        </div>
                    </div>
                    </div>
                </div>

                <!-- Title page -->
                <div data-template-title class="hidden">
                    <div class="quiz__layout quiz__layout--title">
                    <div class="quiz__header">
                        <h1 data-quiz-title-headline class="headline">
                        Innovator Quiz
                        </h1>
                    </div>
                    <div class="quiz__body">
                        <div class="quiz__progress"></div>
                        <div class="quiz__card-wrap">
                        <div class="quiz__card">
                            <h2 data-title-headline class="headline"></h2>
                            <p data-title-blurb class="blurb"></p>
                        </div>
                        <div class="quiz__buttons">
                            <button data-prev-frame-button class="quiz__button">
                            Previous
                            </button>
                            <button data-next-frame-button class="quiz__button">Next</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <!-- Question page -->
                <div data-template-question class="hidden">
                    <div class="quiz__layout quiz__layout--question">
                    <div class="quiz__header">
                        <h1 data-quiz-question-headline class="headline">
                        Innovator Quiz
                        </h1>
                    </div>
                    <div class="quiz__body">
                        <div class="quiz__progress">
                        <div class="quiz__progress-text">
                            <div class="quiz__progress-text__inner">
                            <div>
                                <strong>Category</strong>
                            </div>
                            <div>
                                <span data-category-body></span>
                                (<span data-category-number></span>)
                            </div>
                            </div>
                            <div>
                            <strong>
                                <span data-progress-percent></span>
                                complete</strong
                            >
                            </div>
                        </div>
                        <!-- progress bar -->
                        <div class="quiz__progress-bar">
                            <div
                            class="quiz__progress-bar__fill"
                            data-progress-bar-fill
                            ></div>
                        </div>
                        </div>
                        <div class="quiz__card-wrap">
                        <div class="quiz__card">
                            <p class="question">
                            How prepared are you or your team to accomplish the
                            following?
                            </p>
                            <div class="">
                            <h2 data-question-headline class="headline"></h2>
                            <div class="hidden">
                                <div data-question-blurb class="blurb"></div>
                            </div>
                            </div>
                            <div class="option-group">
                            <div class="option">
                                <input
                                type="radio"
                                id="option1"
                                name="answer"
                                value="0"
                                data-answer
                                data-answer-0
                                />
                                <label for="option1">Unprepared</label>
                            </div>
                            <div class="option">
                                <input
                                type="radio"
                                id="option2"
                                name="answer"
                                value="1"
                                data-answer
                                data-answer-1
                                />
                                <label for="option2">Somewhat Prepared</label>
                            </div>
                            <div class="option">
                                <input
                                type="radio"
                                id="option3"
                                name="answer"
                                value="2"
                                data-answer
                                data-answer-2
                                />
                                <label for="option3">Adequately Prepared</label>
                            </div>
                            <div class="option">
                                <input
                                type="radio"
                                id="option4"
                                name="answer"
                                value="3"
                                data-answer
                                data-answer-3
                                />
                                <label for="option4">Very Prepared</label>
                            </div>
                            <div class="option">
                                <input
                                type="radio"
                                id="option5"
                                name="answer"
                                value="4"
                                data-answer
                                data-answer-4
                                />
                                <label for="option5">Extremely Prepared</label>
                            </div>
                            </div>
                            <div
                            data-error-message
                            class="error error--no-selection hidden"
                            >
                            <p>Please make a selection from the options above</p>
                            </div>
                        </div>
                        <div class="quiz__buttons">
                            <button data-prev-button class="quiz__button">
                            Previous
                            </button>
                            <button data-next-button class="quiz__button">Next</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <!-- Results page -->
                <div data-template-results class="hidden">
                    <div class="quiz__layout quiz__layout--results">
                    <div class="quiz__header">
                        <h1 class="headline">Quiz Results</h1>
                    </div>
                    <div class="quiz__body">
                        <div class="quiz__results">
                        <div class="results-graph">
                            <div class="clock-container">
                            <div class="clock">
                                <div class="ring ring--1"></div>
                                <div class="ring ring--2"></div>
                                <div class="ring ring--3"></div>
                                <div data-result-hands class="clock-hands">
                                <div
                                    data-hand
                                    data-hand-reach="1"
                                    data-hand-color="1"
                                    data-hand-block-id="proof_of_impact"
                                    class="hand hand--1"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="2"
                                    data-hand-color="1"
                                    data-hand-block-id="equity_centered_practices"
                                    class="hand hand--2"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="3"
                                    data-hand-color="2"
                                    data-hand-block-id="community_connection"
                                    class="hand hand--3"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="4"
                                    data-hand-color="2"
                                    data-hand-block-id="supportive_guides"
                                    class="hand hand--4"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="5"
                                    data-hand-color="2"
                                    data-hand-block-id="compatible_collaborators"
                                    class="hand hand--5"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="6"
                                    data-hand-color="2"
                                    data-hand-block-id="public_presence"
                                    class="hand hand--6"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="7"
                                    data-hand-color="3"
                                    data-hand-block-id="operating_infrastructure"
                                    class="hand hand--7"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="8"
                                    data-hand-color="3"
                                    data-hand-block-id="leadership_capacity"
                                    class="hand hand--8"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="9"
                                    data-hand-color="3"
                                    data-hand-block-id="startup_tactics"
                                    class="hand hand--9"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="10"
                                    data-hand-color="3"
                                    data-hand-block-id="sustainable_funding"
                                    class="hand hand--10"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="11"
                                    data-hand-color="1"
                                    data-hand-block-id="unique_value_proposition"
                                    class="hand hand--11"
                                ></div>
                                <div
                                    data-hand
                                    data-hand-reach="12"
                                    data-hand-color="1"
                                    data-hand-block-id="signature_strength"
                                    class="hand hand--12"
                                ></div>
                                </div>
                                <div class="clock-labels">
                                <div class="clock-label clock-label--1">
                                    Proof of Impact
                                </div>
                                <div class="clock-label clock-label--2">
                                    Equity Centered Process
                                </div>
                                <div class="clock-label clock-label--3">
                                    Community Connection
                                </div>
                                <div class="clock-label clock-label--4">
                                    Supportive Guides
                                </div>
                                <div class="clock-label clock-label--5">
                                    Compatible Collaborators
                                </div>
                                <div class="clock-label clock-label--6">
                                    Public Presence
                                </div>
                                <div class="clock-label clock-label--7">
                                    Operating Infrastructure
                                </div>
                                <div class="clock-label clock-label--8">
                                    Effective Leadership
                                </div>
                                <div class="clock-label clock-label--9">
                                    Startup Tactics
                                </div>
                                <div class="clock-label clock-label--10">
                                    Sustainable Funding
                                </div>
                                <div class="clock-label clock-label--11">
                                    Foundational Vision
                                </div>
                                <div class="clock-label clock-label--12">
                                    Signature Strength
                                </div>
                                </div>
                                <div class="middle-cap"></div>
                            </div>
                            </div>
                        </div>
                        <div class="results-summary">
                            <div data-slideshow>
                            <div data-slides>
                                <div data-slide-intro>
                                <h2>Your Innovator Quiz Results</h2>
                                <p>
                                    This chart visually represents your strengths and
                                    growth areas across the twelve building blocks,
                                    enabling easy comparison between nodes. This
                                    snapshot offers an at-a-glance view to identify
                                    patterns and gaps in your innovation journey.
                                </p>
                                <p>
                                    Select points on the chart to learn more about your
                                    results or the innovation building blocks.
                                </p>
                                </div>
                                <div data-slide-single class="hidden">
                                <div data-slide-eyebrow class="eyebrow">Impact</div>
                                <h2 data-slide-title>Signature Strength</h2>
                                <p data-slide-body>
                                    Define your unique combination of skills, insights,
                                    and approaches that gives you a competitive edge.
                                </p>
                                <p>
                                    Your responses suggest that completing signature
                                    strength activities is a <span data-slide-priority></span> 
                                    priority right now.
                                </p>
                                </div>
                            </div>
                            <div data-slideshow-buttons>
                                <button
                                data-prev-block-button
                                class="button w-inline-block"
                                >
                                <svg
                                    width="12"
                                    height="20"
                                    viewBox="0 0 12 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    d="M10.0001 19.3079L0.692383 10.0001L10.0001 0.692383L11.0636 1.75588L2.81938 10.0001L11.0636 18.2444L10.0001 19.3079Z"
                                    fill="currentColor"
                                    />
                                </svg>
                                </button>
                                <button
                                data-next-block-button
                                class="button w-inline-block"
                                >
                                <svg
                                    width="12"
                                    height="20"
                                    viewBox="0 0 12 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    d="M1.75573 0.692117L11.0635 9.99987L1.75573 19.3076L0.692227 18.2441L8.93648 9.99987L0.692228 1.75562L1.75573 0.692117Z"
                                    fill="currentColor"
                                    />
                                </svg>
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>

                        <div class="quiz__activities">
                        <div data-activities>    
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
        `;
        // Inject the HTML
        let containerNode = document.getElementById("quiz-container");
        containerNode.innerHTML = html;
    },

    // Build an activity
    buildActivity: function (activity) {
        let html = `
            <div role="list" class="">
            <div role="listitem"
                class="collection-item-4 w-dyn-item w-col w-col-4" >
                <div class="bb-activity-tile-div">
                <div class="bb-activity-tile-rounded-border">
                    <div class="bb-activity-tile-top-grid">
                    <div
                        style="color: #5d62f4"
                        class="bb-tag-text navy-tag-text block-display"
                    >
                        ${activity.category}-${activity.priority}
                    </div>
                    <div class="bb-activity-tile-title">
                        ${activity.activity_name}
                    </div>
                    </div>
                    <a href="${activity.activity_url}" target="_blank" class="button w-inline-block">
                    <div class="button-text">Go To Activity</div>
                    </a>
                </div>
                </div>
            </div>
            </div>
        `;
        return html;
<<<<<<< Updated upstream
    }
=======
    },
>>>>>>> Stashed changes
};
