
var jeopardy = {};

jeopardy.GetQuestionsJSON = function() {

    var data = '[{"Topic": "BIRTH & CHILDHOOD","Questions": [{"Question": "(1-1) What is the Question"},{"Question": "(1-2) What is the Question"},{"Question": "(1-3) What is the Question"},{"Question": "(1-4) What is the Question"},{"Question": "(1-5) What is the Question"}]}]';

    data = '[{"Topic": "BIRTH & CHILDHOOD",';
    data += '"Questions": [{"Question": "(1-1) What is the Question"},';
    data += '{"Question": "(1-2) What is the Question"},';
    data += '{"Question": "(1-3) What is the Question"},';
    data += '{"Question": "(1-4) What is the Question"},';
    data += '{"Question": "(1-5) What is the Question"}]},';

    data += '{"Topic": "MIRACLES",';
    data += '"Questions": [{"Question": "(2-1) What is the Question"},';
    data += '{"Question": "(2-2) What is the Question"},';
    data += '{"Question": "(2-3) What is the Question"},';
    data += '{"Question": "(2-4) What is the Question"},';
    data += '{"Question": "(2-5) What is the Question"}]},';

    data += '{"Topic": "CHRISTMAS",';
    data += '"Questions": [{"Question": "(3-1) What is the Question"},';
    data += '{"Question": "(3-2) What is the Question"},';
    data += '{"Question": "(3-3) What is the Question"},';
    data += '{"Question": "(3-4) What is the Question"},';
    data += '{"Question": "(3-5) What is the Question"}]},';

    data += '{"Topic": "DEATH & RESURRECTION",';
    data += '"Questions": [{"Question": "(4-1) What is the Question"},';
    data += '{"Question": "(4-2) What is the Question"},';
    data += '{"Question": "(4-3) What is the Question"},';
    data += '{"Question": "(4-4) What is the Question"},';
    data += '{"Question": "(4-5) What is the Question"}]},';

    data += '{"Topic": "PARABLES",';
    data += '"Questions": [{"Question": "(5-1) What is the Question"},';
    data += '{"Question": "(5-2) What is the Question"},';
    data += '{"Question": "(5-3) What is the Question"},';
    data += '{"Question": "(5-4) What is the Question"},';
    data += '{"Question": "(5-5) What is the Question"}]},';

    data += '{"Topic": "BIRTH & CHILDHOOD",';
    data += '"Questions": [{"Question": "(6-1) What is the Question"},';
    data += '{"Question": "(6-2) What is the Question"},';
    data += '{"Question": "(6-3) What is the Question"},';
    data += '{"Question": "(6-4) What is the Question"},';
    data += '{"Question": "(6-5) What is the Question"}]}]';

    var questions = JSON.parse(data);
    return questions;
}

jeopardy.BackToJeopardy = function() {
    $('#jeopardy-container').css("display", "block");
    $('#question-box').css("display", "none");
    jeopardy.BackToJeopardy = "";
}

// Function to update post heights on the towers
jeopardy.AskQuestion = function(box_element) {

    // Read question file*****************************************

    var col_num = box_element.attr("topic");
    var row_num = box_element.attr("question");

    var question = questions[col_num-1].Questions[row_num-1].Question;

    var translate_xvalue = Math.round(-(col_num - 1) * $(".jbox").outerWidth() / 6);
    var translate_yvalue = Math.round((-$(".jbox-header").outerHeight() -
                            (row_num - 1) * $(".jbox").outerHeight()) / 6);
    var translate_string = 'translate(' + translate_xvalue.toString() + 'px ,' +
                            translate_yvalue.toString() + 'px)';
    $('#question-box').css("display", "block");
    $('#jeopardy-container').css("display", "none");
    $('#the-question').text(question);

    $("#the-question").click(jeopardy.BackToJeopardy);


    // Decrease the font size of the question being viewed (maybe based on size of string??)
}

// Function to perform after the window loads
$(document).ready(function() {

    // Add column 1 Topic Questions
    $(".jbox").click(function() {
        jeopardy.AskQuestion($(this));
    });
});

/*********************************************
   DETERMINE HOW TO READ THIS FROM FILE
*********************************************/
// Read question file
var data = '[{"Topic": "BIRTH & CHILDHOOD","Questions": [{"Question": "(1-1) What is the Question"},{"Question": "(1-2) What is the Question"},{"Question": "(1-3) What is the Question"},{"Question": "(1-4) What is the Question"},{"Question": "(1-5) What is the Question"}]}]';
var questions = jeopardy.GetQuestionsJSON();
