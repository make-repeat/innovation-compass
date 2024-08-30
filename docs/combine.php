<?php

// Read the contents of the quiz.json file
$quizJson = file_get_contents('quiz.json');

// Read the contents of the activity.json file
$activityJson = file_get_contents('activity.json');

// Convert the JSON data to an associative array
$quizData = json_decode($quizJson, true);

// Convert the JSON data to an associative array
$activityData = json_decode($activityJson, true);

// Combine the two arrays based on the activity_name

foreach ($quizData as $key => $quizItem) {
    $quizData[$key]['activity_description'] = null;
    $quizData[$key]['activity_url'] = null;
}

foreach ($quizData as $key => $quizItem) {

    foreach ($activityData as $activityItem) {
        if ($quizItem['activity_name'] == $activityItem['activity_name']) {
            $quizData[$key]['activity_description'] = $activityItem['activity_description'];
            $quizData[$key]['activity_url'] = $activityItem['activity_url'];
        }
    }
}

// Convert the combined data back to JSON
$combinedJson = json_encode($quizData, JSON_PRETTY_PRINT);

// Write the combined JSON data to a new file
file_put_contents('combined.json', $combinedJson);
