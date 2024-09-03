document.addEventListener("DOMContentLoaded", function () {
    quizApp.init();
    window.addEventListener('beforeunload', (event) => {
        // Cancel the event as stated by the standard.
        event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = '';

    });
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
        return fetch(this.baseUrl + "_quiz-partial.html")
            .then((res) => res.text())
            .then((text) => {
                // Inject the HTML
                let containerNode = document.getElementById("quiz-container");
                containerNode.innerHTML = text;
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
                        </div>
                    </div>
                </div>
            </div>
        `;
        return html;
    },
};