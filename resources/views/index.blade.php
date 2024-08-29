<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
	<meta charset="utf-8">
	<meta name="viewport"
		content="width=device-width, initial-scale=1">

	<title>Quiz</title>

	<link href="https://cdn.prod.website-files.com/6658bec756a97f66072b9992/css/innovationcompass.webflow.827ed5d4c.css"
		rel="stylesheet"
		type="text/css">

	<link href="/css/app.css"
		rel="stylesheet"
		type="text/css">

<body>
	{{-- <section class="quiz-intro">
        Start screen
    </section> --}}

	<section class="quiz">
		<div data-quiz-container
			class="quiz__container">
			<div data-template-start>
				<h1>Start</h1>
				<p>This is the start page.</p>
				<button data-start-button>Start Quiz</button>
			</div>
			<div data-template-title
				class="hidden">
				<div class="quiz__layout">
					<div class="quiz__header">
						<h1 data-quiz-title-headline
							class="headline">Innovator Quiz</h1>
					</div>
					<div class="quiz__progress"></div>
					<div class="quiz__card-wrap">
						<div class="quiz__card">
							<h2 data-title-headline
								class="headline"></h2>
							<p data-title-blurb
								class="blurb"></p>
						</div>
						<div class="quiz__buttons">
							<button data-prev-button
								class="quiz__button">Previous</button>
							<button data-next-button
								class="quiz__button">Next</button>
						</div>
					</div>
				</div>
			</div>
			<div data-template-question
				class="hidden">
				<div class="quiz__layout">
					<div class="quiz__header">
						<h1 data-quiz-question-headline
							class="headline">Innovator Quiz</h1>
					</div>
					<div class="quiz__progress">
						<div class="quiz__progress-text">
							<div class="quiz__progress-text__inner">
								<div><strong>Category</strong></div>
								<div><span data-category-body></span> (<span data-category-number></span>)</div>
							</div>
							<div><strong><span data-progress-percent></span> complete</strong></div>
						</div>
						<!-- progress bar -->
						<div class="quiz__progress-bar">
							<div class="quiz__progress-bar__fill"
								data-progress-bar-fill></div>
						</div>
					</div>
					<div class="quiz__card-wrap">
						<div class="quiz__card">
							<p class="question">How prepared are you or your team to accomplish the following?</p>
							<div class="">
								<h2 data-question-headline
									class="headline"></h2>
								<div class="hidden">
									<div data-question-blurb
										class="blurb"></div>
								</div>
							</div>
							<div class="option-group">
								<div class="option">
									<input type="radio"
										id="option1"
										name="answer"
										value="0"
										data-answer
										data-answer-0 />
									<label for="option1">Unprepared</label>
								</div>
								<div class="option">
									<input type="radio"
										id="option2"
										name="answer"
										value="1"
										data-answer
										data-answer-1 />
									<label for="option2">Somewhat Prepared</label>
								</div>
								<div class="option">
									<input type="radio"
										id="option3"
										name="answer"
										value="2"
										data-answer
										data-answer-2 />
									<label for="option3">Adequately Prepared</label>
								</div>
								<div class="option">
									<input type="radio"
										id="option4"
										name="answer"
										value="3"
										data-answer
										data-answer-3 />
									<label for="option4">Very Prepared</label>
								</div>
								<div class="option">
									<input type="radio"
										id="option5"
										name="answer"
										value="4"
										data-answer
										data-answer-4 />
									<label for="option5">Extremely Prepared</label>
								</div>
							</div>
							<div data-error-message
								class="error error--no-selection hidden">
								<p>Please make a selection from the options above</p>
							</div>
						</div>
						<div class="quiz__buttons">
							<button data-prev-button
								class="quiz__button">Previous</button>
							<button data-next-button
								class="quiz__button">Next</button>
						</div>
					</div>
				</div>
			</div>
			<div data-template-results
				class="hidden">
				<h2>Results</h2>
				<p>Thank you for taking the quiz.</p>
			</div>
		</div>
	</section>

	{{-- <section class="quiz-results">
        Results screen
    </section> --}}

	<!-- quiz js -->
	<script src="{{ asset('js/app.js') }}"></script>

</body>

</html>
