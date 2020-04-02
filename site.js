
// Constants
var jconstants = {
   TOTAL_QUESTIONS: 30,
   NUM_ANSWERS_PER_QUESTION: 4,
   BONUS_SCORE: 4000,
   ONE_SECOND_MS: 1000,  // milliseconds
   INITIAL_TIMER_SECS: 45
}

// Jeopardy state variables
var jeopardy = {
   completed_questions: 0,
   your_score: 0,
   data: [],
   random_questions: [],
   time_remaining: 0
};
jeopardy.random_questions = new Array(6);
for (var i=0; i<6; i++) {
    jeopardy.random_questions[i] = new Array(5);
}

// Timer function to limit amount time to answer question
jeopardy.setTimer = function() {
    if (jeopardy.time_remaining == 0) {
        var correct_answer = jeopardy.GetCorrectAnswer();
        jeopardy.BackToJeopardy("Time expired!", correct_answer);

        // remove the click handler for the submit button
        $("#final-answer").off( "click", jeopardy.CheckAnswer);
    } else {
        $('#timer').text("Time remaining: " + jeopardy.time_remaining.toString());
        jeopardy.time_remaining--;
        jeopardy.timeout = setTimeout(function() {
            jeopardy.setTimer();
        }, jconstants.ONE_SECOND_MS);
    }
}

// Get the correct answer to the question
jeopardy.GetCorrectAnswer = function() {

    // Get the column and row number of the question from #the-question attributes
    col_num = $('#the-question').attr("col_num");
    row_num = $('#the-question').attr("row_num");

    var correct_answer = "";
    for (var i=0; i<jeopardy.data[col_num-1].
                Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers.length; i++) {
        var selection =jeopardy.data[col_num-1].
                     Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers[i].Selection;
        var correct_selection = jeopardy.data[col_num-1].
                     Questions[jeopardy.random_questions[col_num-1][row_num-1]].CorrectAnswer;
        if (selection == correct_selection) {
            correct_answer = "Correct answer: " + correct_selection + ") " + jeopardy.data[col_num-1].
                         Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers[i].Answer;
            break;
        }
    }
    return correct_answer;
}

// Check the selected answer for correctness (update the score, display message to user)
jeopardy.CheckAnswer = function (){

    var msg="";

    // Get the column and row number of the question
    col_num = $('#the-question').attr("col_num");
    row_num = $('#the-question').attr("row_num");

    // Get the correct answer from the data
    var correct_selection = jeopardy.data[col_num-1].
                    Questions[jeopardy.random_questions[col_num-1][row_num-1]].CorrectAnswer;
    var correct_answer=""
   
    // Get the user's selection
    var selection = $('#question-and-answers').find(':checked').val();

    // Update the score if the correct answer was given
    if (selection == correct_selection) {

        var query_string = ".points[col_num="+col_num+"][row_num="+row_num+"]";
        jeopardy.your_score += parseInt($(query_string).text());
        msg = "Correct!"
    } else {
        msg = "Try Again!";
        correct_answer = jeopardy.GetCorrectAnswer();
    }

    // remove the click handler
    $("#final-answer").off( "click", jeopardy.CheckAnswer);

    // return to the jeopardy grid view
    jeopardy.BackToJeopardy(msg, correct_answer);
}

// Select questions to insert into the grid from the data at random
jeopardy.UpdateRandomQuestions = function() {
    
    for (var i=0; i<jeopardy.data.length; i++) {
        var questions = jeopardy.data[i].Questions;
        var questions_length = questions.length;

        // create question_number array based on available number of questions
        var question_number = [questions_length];
        for (j=0; j<questions_length; j++) {
            question_number[j] = j;
        }

        // place the randomly selected questions into random_question array
        for (j=0; j<questions_length; j++) {
            var random = Math.floor(Math.random()*question_number.length);

            // move random number into answer array
            jeopardy.random_questions[i][j] = question_number[random];

            // remove random entry from question_number array
            var index = question_number.indexOf(question_number[random]);
            question_number.splice(index, 1);
        }
    }
}

// Display completion message after all questions completed
jeopardy.DisplayCompletionMsg = function() {
    $('#completion-box').css("display", "block");
    $('#jeopardy-container').css("display", "none");
    if (jeopardy.your_score >= jconstants.BONUS_SCORE) {
        $('#bonus').css("display", "block");
        $('#img-bonus').css("display", "block");
        $('#challenge').css("display", "none");
    }
}

// Update the topics on the jeopardy grid from the data
jeopardy.UpdateTopics = function() {
    $("#jcolumn1").find("h1").text(jeopardy.data[0].Topic);
    $('#jcolumn2').find("h1").text(jeopardy.data[1].Topic);
    $('#jcolumn3').find("h1").text(jeopardy.data[2].Topic);
    $('#jcolumn4').find("h1").text(jeopardy.data[3].Topic);
    $('#jcolumn5').find("h1").text(jeopardy.data[4].Topic);
    $('#jcolumn6').find("h1").text(jeopardy.data[5].Topic);
}

// Read the jeopardy data from file and store in the jeopardy object
jeopardy.GetQuestionsJSON = function() {

    var xReq = new XMLHttpRequest();
    xReq.open("GET", "https://j-j-dean.github.io/jeopardy/jeopardy.txt", true);
    //xReq.open("GET", "http://localhost:8080/jeopardy.txt", true);
    xReq.send(null);

    xReq.onreadystatechange = function(e) {
        if (xReq.readyState == 4) {
            if (xReq.status == "200") {
                jeopardy.data = JSON.parse(xReq.response);
                jeopardy.UpdateTopics();
                jeopardy.UpdateRandomQuestions();
            } else {
                console.log("Error opening file with status: " + xReq.status);
            }
        } else {
            console.log("Server appears to not be ready");
        }
    }
}

// Return back to the jeopardy grid
jeopardy.BackToJeopardy = function(msg, correct_answer) {

    // Clear the grid view and replace with the question view
    $('#jeopardy-container').css("display", "block");
    $('#question-box').css("display", "none");

    // Get the column and row number from the attributes
    col_num = $('#the-question').attr("col_num");
    row_num = $('#the-question').attr("row_num");

    // update the score on the display
    $('#score').text("Your score is " + jeopardy.your_score.toString() + " - " + msg);
    $('#timer').text(correct_answer);

    // clear the last question and answers from the jeopardy grid view - question has been completed
    var query_string = ".points[col_num="+col_num+"][row_num="+row_num+"]";
    $(query_string).text("");
    jeopardy.data[col_num-1].Questions[jeopardy.random_questions[col_num-1][row_num-1]].Question = "";
    for (var i=0; i<jeopardy.data[col_num-1].
                    Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers.length; i++) {
        jeopardy.data[col_num-1].Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers[i] = "";
    }

    // check the first radio button answer as the default in the question and answers view
    $('#answer-a').prop("checked", true);

    // increment the number of completed questions
    jeopardy.completed_questions++;

    // display completion page if all questions completed
    if (jeopardy.completed_questions == jconstants.TOTAL_QUESTIONS) {
        $('#score').text(msg + " All complete! Final score: " + jeopardy.your_score.toString());
        var score_text = "<br />Your score - " + parseInt(jeopardy.your_score) + " points";
        $('#completion').find('h2').append(score_text);
        $('#timer').text(correct_answer);
        jeopardy.DisplayCompletionMsg();
    }

    // clear timeouts when returning to jeopardy grid
     clearTimeout(jeopardy.timeout);
}

// Replace the jeopardy grid view with the selected question and answers
jeopardy.AskQuestion = function(points_element) {

    // Issue error message if data was not successfully read from server
    if (jeopardy.data.length == 0) {
        $('#score').text("Try again later - server error reading data file");
        return;
    }

    // Get the column and row number of the selected question
    var col_num = points_element.attr("col_num");
    var row_num = points_element.attr("row_num");

    // Skip question boxes that have already been completed (question still in list)
    if (jeopardy.data[col_num-1].
          Questions[jeopardy.random_questions[col_num-1][row_num-1]].Question.length > 0) {
        
        // Retrieve the selected question from the data
        var question = jeopardy.data[col_num-1].
                                Questions[jeopardy.random_questions[col_num-1][row_num-1]].Question;

        // Retrieve the corresponding answers to the question, and add as radio buttons
        var num_answers = jeopardy.data[col_num-1].
                                Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers.length;

        // Check to see the right number of questions in the input data
        if (num_answers != jconstants.NUM_ANSWERS_PER_QUESTION) {
            $('#score').text("Inconsistent input file values.  Please check.");
            return;
        }

        // Add the question to the question and answers view
        $('#the-question').text(question);

        // Add the answers to the question and answers view
        for (var i=0; i<num_answers; i++) {
            var answer_selection = jeopardy.data[col_num-1].
                            Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers[i].Selection;
            var answer = answer_selection;
            answer += ") ";
            answer += jeopardy.data[col_num-1].
                                Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers[i].Answer;
            var query_string = "label[for='answer-" + answer_selection + "']";
            $(query_string).text(answer);
         }

        // replace the question grid with the question and answers view
        $('#question-box').css("display", "block");
        $('#jeopardy-container').css("display", "none");

        // add the handler for clicking the submit button
        $("#final-answer").on( "click", jeopardy.CheckAnswer);

        // set timer
        jeopardy.timeout = setTimeout(function() {
            jeopardy.time_remaining = jconstants.INITIAL_TIMER_SECS;
            jeopardy.setTimer();
        }, jconstants.ONE_SECOND_MS);

        // set attributes for the topic and question for element with id=the-question
        $('#the-question').attr("col_num", col_num);
        $('#the-question').attr("row_num", row_num);
    }
}

// Function to perform after the window loads
$(document).ready(function() {

    // Add column 1 Topic Questions
    $(".points").click(function() {
        jeopardy.AskQuestion($(this));
    });

    // Reset the page if play-again button pressed
    $('#play-again').click(function() {
        location.reload(true);
    });

});

/*********************************************
   DETERMINE HOW TO READ THIS FROM FILE
*********************************************/

// Read and store questions from file 
jeopardy.GetQuestionsJSON();
