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
    blockData: [],
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
            quizQuestion: document.querySelector("[data-quiz-question-headline]"),
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
            finish: document.querySelector("[data-finish-button]"),
            next: document.querySelectorAll("[data-next-button]"),
            prev: document.querySelectorAll("[data-prev-button]"),
        };

        this.hooks.buttons.start.addEventListener("click", () => {
            this.startQuiz();
        });
        this.hooks.buttons.finish.addEventListener("click", () => {
            this.finishQuiz();
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
        this.hooks.category.number.innerHTML = this.getSectionNumber() + " of " + Object.keys(this.sectionData).length;

        let percentage = ((this.getSectionProgress() + 1) / this.sectionData[frame.category]) * 100;
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

        console.log("renderResults", this.blockData, this.blockData.length);

        const resultHands = document.querySelectorAll("[data-result-hands]");

        // Loop through the blockData and render the results
        for (let block in this.blockData) {
            const hand = document.querySelector("[data-hand-block-id='" + block + "']");
            const average = this.blockData[block].average;

            if (hand && average) {
                hand.setAttribute("data-hand-reach", average);
            }
        }
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

    finishQuiz: function () {
        // Loop through the quiz and randomly
        // asssign an answer value from 1-5
        this.quiz.forEach((item) => {
            if (item.weighting) {
                item.answer = Math.floor(Math.random() * 5) + 1;
            }
        });

        this.doCalculations();
    },

    doCalculations: function () {
        this.quiz.forEach((item) => {
            if (item.weighting) {
                item.priority = item.answer * item.weighting;
                // If the blockData doesn't contain the key, add it
                if (!this.blockData[item.building_block]) {
                    this.blockData[item.building_block] = {
                        items: [],
                        average: null,
                    };
                }
                this.blockData[item.building_block].items.push(item);
            }
        });

        // Calculate the average for each block
        for (let block in this.blockData) {
            let total = 0;
            this.blockData[block].items.forEach((item) => {
                total += item.priority;
            });
            this.blockData[block].average = total / this.blockData[block].items.length;

            // Round
            this.blockData[block].average = Math.round(this.blockData[block].average);
        }

        // Render
        this.renderResults();
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
                            <button data-prev-button class="quiz__button">
                            Previous
                            </button>
                            <button data-next-button class="quiz__button">Next</button>
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
                                <div data-slide class="">
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
                                <div data-slide class="hidden">
                                <div class="eyebrow">Impact</div>
                                <h2>Signature Strength</h2>
                                <p>
                                    Define your unique combination of skills, insights,
                                    and approaches that gives you a competitive edge.
                                </p>
                                <p>
                                    Your responses suggest that completing signature
                                    strength activities is a high priority right now.
                                </p>
                                </div>
                            </div>
                            <div data-slideshow-buttons>
                                <button
                                data-slideshow-button-previous
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
                                data-slideshow-button-next
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
                        <div class="">
                            <div role="list" class="">
                            <div
                                role="listitem"
                                class="collection-item-4 w-dyn-item w-col w-col-4"
                            >
                                <div class="bb-activity-tile-div">
                                <div class="bb-activity-tile-rounded-border">
                                    <div class="bb-activity-tile-top-grid">
                                    <div
                                        style="color: #5d62f4"
                                        class="bb-tag-text navy-tag-text block-display"
                                    >
                                        Foundational Vision
                                    </div>
                                    <div class="bb-activity-tile-title">
                                        Define a vision and purpose for the innovation
                                    </div>
                                    </div>
                                    <a href="#" class="button w-inline-block">
                                    <div class="button-text">Go To Activity</div>
                                    </a>
                                </div>
                                </div>
                            </div>

                            <div
                                role="listitem"
                                class="collection-item-4 w-dyn-item w-col w-col-4"
                            >
                                <div class="bb-activity-tile-div">
                                <div class="bb-activity-tile-rounded-border">
                                    <div class="bb-activity-tile-top-grid">
                                    <div
                                        style="color: #5d62f4"
                                        class="bb-tag-text navy-tag-text block-display"
                                    >
                                        Foundational Vision
                                    </div>
                                    <div class="bb-activity-tile-title">
                                        Define a vision and purpose for the innovation
                                    </div>
                                    </div>
                                    <a href="#" class="button w-inline-block">
                                    <div class="button-text">Go To Activity</div>
                                    </a>
                                </div>
                                </div>
                            </div>

                            <div
                                role="listitem"
                                class="collection-item-4 w-dyn-item w-col w-col-4"
                            >
                                <div class="bb-activity-tile-div">
                                <div class="bb-activity-tile-rounded-border">
                                    <div class="bb-activity-tile-top-grid">
                                    <div
                                        style="color: #5d62f4"
                                        class="bb-tag-text navy-tag-text block-display"
                                    >
                                        Foundational Vision
                                    </div>
                                    <div class="bb-activity-tile-title">
                                        Define a vision and purpose for the innovation
                                    </div>
                                    </div>
                                    <a href="#" class="button w-inline-block">
                                    <div class="button-text">Go To Activity</div>
                                    </a>
                                </div>
                                </div>
                            </div>

                            <div
                                role="listitem"
                                class="collection-item-4 w-dyn-item w-col w-col-4"
                            >
                                <div class="bb-activity-tile-div">
                                <div class="bb-activity-tile-rounded-border">
                                    <div class="bb-activity-tile-top-grid">
                                    <div
                                        style="color: #5d62f4"
                                        class="bb-tag-text navy-tag-text block-display"
                                    >
                                        Foundational Vision
                                    </div>
                                    <div class="bb-activity-tile-title">
                                        Define a vision and purpose for the innovation
                                    </div>
                                    </div>
                                    <a href="#" class="button w-inline-block">
                                    <div class="button-text">Go To Activity</div>
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
        `;
        // Inject the HTML
        let scriptNode = document.querySelector("[data-quiz-script]");
        var htmlNode = document.createElement('div');
        htmlNode.innerHTML = html;
        scriptNode.after(htmlNode);
    },
};
