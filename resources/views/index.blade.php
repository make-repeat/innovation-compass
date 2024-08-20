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

<body>
	<style>
		.hidden {
			display: none !important;
		}

		.progress-bar {
			width: 300px;
			height: 20px;
			background-color: #e0e0e0;
			margin: 20px 0;
		}

		.progress-bar-fill {
			height: 20px;
			background-color: red;
			width: 20%;
		}
	</style>

	<section class="bb-section-1 purple">
		<div class="bb-breadcrumbs-div">
			<div class="bb-breadcrumb-text">Impact</div>
		</div>

		<div class="bb-container">
			<div data-template-start>
				<h1>Start</h1>
				<p>This is the start page.</p>
				<button data-start-button>Start Quiz</button>
			</div>
			<div data-template-title
				class="hidden">
				<h1 data-title-body></h1>
				<button data-prev-button>Prev</button>
				<button data-next-button>Next</button>
			</div>
			<div data-template-question
				class="hidden">
				<span>Category: <span data-category-body></span></span>
				<div><span data-category-number></span> complete</div>
				<div><span data-progress-percent></span> complete</div>
				<!-- progress bar -->
				<div class="progress-bar">
					<div class="progress-bar-fill"
						data-progress-bar-fill></div>
				</div>

				<h1 data-question-body></h1>
				<div data-blurb-body></div>
				<div class="bb-question-div">
					<!-- radio buttons for the answers -->
					<div class="bb-question-option">
						<input type="radio"
							name="answer"
							value="0"
							data-answer
							data-answer-0>
						<label for="">Unprepared</label>
					</div>
					<div class="bb-question-option">
						<input type="radio"
							name="answer"
							value="1"
							data-answer
							data-answer-1>
						<label>Somewhat Prepared</label>
					</div>
					<div class="bb-question-option">
						<input type="radio"
							name="answer"
							value="2"
							data-answer
							data-answer-2>
						<label>Adequately Prepared</label>
					</div>
					<div class="bb-question-option">
						<input type="radio"
							name="answer"
							value="3"
							data-answer
							data-answer-3>
						<label>Very Prepared</label>
					</div>
					<div class="bb-question-option">
						<input type="radio"
							name="answer"
							value="4"
							data-answer
							data-answer-4>
						<label>Extremely Prepared</label>
					</div>
				</div>
				<button data-prev-button>Previous</button>
				<button data-next-button>Next</button>
			</div>
			<div data-template-results
				class="hidden">
				<h1>Results</h1>
				<p>Thank you for taking the quiz.</p>
			</div>
	</section>

	<!-- quiz js -->
	<script src="{{ asset('js/app.js') }}"></script>

</body>

</html>
