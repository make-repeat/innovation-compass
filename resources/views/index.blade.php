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

		.section-community {
			background-color: #5d62f4;
		}

		.section-entrepreneurship {
			background-color: #8e43e7;
		}

		.section-impact {
			background-color: #42b3f4;
		}
	</style>

	<section style="background-color:#5d62f4"
		class="bb-section-1 purple">
		<div class="bb-breadcrumbs-div">
			<div class="bb-breadcrumb-text">Impact</div>
		</div>

		<div class="bb-container">
			<div data-template-start>
				<h1>Start</h1>
				<p>This is the start page.</p>

				<!-- button to go to the next page in js app -->
				<button data-start-button>Start Quiz</button>
			</div>
			<div data-template-question
				class="hidden">
				<h1 data-question-body></h1>
				<div class="bb-question-div">
					<!-- radio buttons for the answers -->
					<div class="bb-question-option">
						<input type="radio"
							name="answer"
							value="0"
							data-answer
							data-answer-0>
						<label data-answer>Unprepared</label>
					</div>
					<div class="bb-question-option">
						<input type="radio"
							name="answer"
							value="1"
							data-answer
							data-answer-1>
						<label data-answer>Somewhat Prepared</label>
					</div>
					<div class="bb-question-option">
						<input type="radio"
							name="answer"
							value="2"
							data-answer
							data-answer-2>
						<label data-answer>Adequately Prepared</label>
					</div>
					<div class="bb-question-option">
						<input type="radio"
							name="answer"
							value="3"
							data-answer-3>
						<label data-answer>Very Prepared</label>
					</div>
					<div class="bb-question-option">
						<input type="radio"
							name="answer"
							value="4"
							data-answer-4>
						<label data-answer>Extremely Prepared</label>
					</div>
				</div>
				<button data-prev-button>Previous</button>
				<button data-next-button>Next</button>
			</div>
			<div data-template-title
				class="hidden">
				<h1 data-title-body></h1>

				<button data-next-button>Next</button>
			</div>
	</section>

	<!-- quiz js -->
	<script src="{{ asset('js/app.js') }}"></script>

</body>

</html>
