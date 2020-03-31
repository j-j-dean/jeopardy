
var jeopardy = {
   completed_questions: 0,
   your_score: 0,
   data: [],
   random_questions: [],
   TOTAL_QUESTIONS: 30,
   BONUS_SCORE: 4000,
   time_remaining: 0
};
jeopardy.random_questions = new Array(6);
for (var i=0; i<6; i++) {
    jeopardy.random_questions[i] = new Array(5);
}

jeopardy.setTimer = function() {
    if (jeopardy.time_remaining == 0) {
        var correct_answer = jeopardy.GetCorrectAnswer();
        jeopardy.BackToJeopardy("Time expired!", correct_answer);
    } else {
        $('#timer').text("Time remaining: " + jeopardy.time_remaining.toString());
        jeopardy.time_remaining--;
        jeopardy.timeout = setTimeout(function() {
            jeopardy.setTimer();
        }, 1000);
    }
}

// Get the correct answer to the question
jeopardy.GetCorrectAnswer = function() {

    // Get the column and row number of the question
    col_num = $('#the-question').attr("topic");
    row_num = $('#the-question').attr("question");

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

// Check the selected answer to the Jeopardy question
jeopardy.CheckAnswer = function (){

    var msg="";

    // Get the column and row number of the question
    col_num = $('#the-question').attr("topic");
    row_num = $('#the-question').attr("question");

    // Get the correct answer from the data
    var correct_selection = jeopardy.data[col_num-1].
                    Questions[jeopardy.random_questions[col_num-1][row_num-1]].CorrectAnswer;
    var correct_answer=""
   
    // Get the user's selection
    var selection = $('#answers').find(':checked').val();

    // Update the score if the correct answer was given
console.log("selection="+selection);
console.log("corrent="+correct_selection);
    if (selection == correct_selection) {
        jeopardy.your_score += parseInt($('#T'+col_num+'-Q'+row_num+'-label').text());
        var score = $('#T'+col_num+'-Q'+row_num+'-label').text();
        msg = "Correct!"
    } else {
        msg = "Try Again!";
        correct_answer = jeopardy.GetCorrectAnswer();
    }

    // reset the click handler to null
    $("#final-answer").off( "click", jeopardy.CheckAnswer);

    // return to the jeopardy grid view
    jeopardy.BackToJeopardy(msg, correct_answer);
}

// Select questions to insert into the grid from the data at random
jeopardy.UpdateRandomQuestions = function() {
    
    for (var i=0; i<jeopardy.data.length; i++) {
        var questions = jeopardy.data[i].Questions;
        var questions_length = questions.length;
        var question_number = [questions_length];
        for (j=0; j<questions_length; j++) {
            question_number[j] = j;
        }
        for (j=0; j<questions_length; j++) {
            var random = Math.floor(Math.random()*question_number.length);

            // move random number into answer array
            jeopardy.random_questions[i][j] = question_number[random];

            // remove random entry from question_number
            var index = question_number.indexOf(question_number[random]);
            question_number.splice(index, 1);
        }
    }
}

// Display completion message after all questions completed
jeopardy.DisplayCompletionMsg = function() {
    $('#completion-box').css("display", "block");
    $('#jeopardy-container').css("display", "none");

    if (jeopardy.your_score >= jeopardy.BONUS_SCORE) {
        $('#completion').find('h2').text("You completed the BONUS challenge!");

        var text_string="print a copy of the screen or remember "
        text_string += "the winning code to receive a prize when we return to class. ";
        $('#extra').text(text_string);
        text_string = "<h3 id='bonus'>Extra Bonus: memorize John3:16 or Matthew 22:38-39 for an additional prize</h3>";
        $('#extra').append(text_string);
        $('#bonus').css("color", "yellow");
        $('#img-bonus').css("display", "block");
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

    $('#jeopardy-container').css("display", "block");
    $('#question-box').css("display", "none");

    col_num = $('#the-question').attr("topic");
    row_num = $('#the-question').attr("question");

    var query_element = "#T" + col_num + "-Q" + row_num + "-label";

    // update the score on the display
    $('#score').text("Your score is " + jeopardy.your_score.toString() + " - " + msg);
    $('#timer').text(correct_answer);

    // clear the last question and answers from the data object - question has been completed
    $(query_element).text("");
    jeopardy.data[col_num-1].Questions[jeopardy.random_questions[col_num-1][row_num-1]].Question = "";
    for (var i=0; i<jeopardy.data[col_num-1].
                    Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers.length; i++) {
        jeopardy.data[col_num-1].Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers[i] = "";
    }

    // increment the number of completed questions
    jeopardy.completed_questions++;

    // check to see if all the questions have been completed
    if (jeopardy.completed_questions == jeopardy.TOTAL_QUESTIONS) {
        $('#score').text(msg + " All complete! Final score: " + jeopardy.your_score.toString());
        $('#timer').text(correct_answer);
        jeopardy.DisplayCompletionMsg();
    }

    // clear timeouts when returning to jeopardy grid
     clearTimeout(jeopardy.timeout);
}

// Replace the jeopardy grid view with the selected question and answers
jeopardy.AskQuestion = function(box_element) {

    // Issue error message if data was not successfully read from server
    if (jeopardy.data.length == 0) {
        $('#score').text("Try again later - server error reading data file");
        return;
    }

    // Retrieve the column and row number of the selected question
    var col_num = box_element.attr("topic");
    var row_num = box_element.attr("question");

    // Skip question boxes that have already been completed
    if (jeopardy.data[col_num-1].
          Questions[jeopardy.random_questions[col_num-1][row_num-1]].Question.length > 0) {
        
        // Retrieve the selected question from the data
        var question = jeopardy.data[col_num-1].
                                Questions[jeopardy.random_questions[col_num-1][row_num-1]].Question;

        // Retrieve the corresponding answers to the question, and add as radio buttons
        var answers = "";
        answers+="<br /><br />"
        var num_answers = jeopardy.data[col_num-1].
                                Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers.length;
        var checked="checked"
        for (var i=0; i<num_answers; i++) {
            var answer_selection = jeopardy.data[col_num-1].
                    Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers[i].Selection;
            answers += '<input type="radio" name="answers" value=' + 
                                answer_selection + ' '+ checked + '/>'
            checked = ""
            answers += "&nbsp; &nbsp;"
            answers += jeopardy.data[col_num-1].
                            Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers[i].Selection;
            answers += ")&nbsp;&nbsp;";
            answers += jeopardy.data[col_num-1].
                                Questions[jeopardy.random_questions[col_num-1][row_num-1]].Answers[i].Answer;
            answers += "<br />";
         }

        // replace the question grid with the question and answer selection
        $('#question-box').css("display", "block");
        $('#jeopardy-container').css("display", "none");

        // update the font size
        $('#the-question').css("font-size", "3vw");

        // display the question
        $('#the-question').text(question);

        // add the answers
        $('#answers').text("");
        $('#answers').append(answers);

        // add the handler for clicking the submit button
        $("#final-answer").on( "click", jeopardy.CheckAnswer);

        // set timer
        jeopardy.timeout = setTimeout(function() {
            jeopardy.time_remaining = 30;
            jeopardy.setTimer();
        }, 1000);

        // set attributes for the topic and question for element with id=the-question
        $('#the-question').attr("topic", col_num);
        $('#the-question').attr("question", row_num);
    }
}

// Function to perform after the window loads
$(document).ready(function() {

    // Add column 1 Topic Questions
    $(".jbox").click(function() {
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
