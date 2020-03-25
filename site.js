
var jeopardy = {
   completed_questions: 0,
   your_score: 0,
   questions: [],
   TOTAL_QUESTIONS: 30,
};

jeopardy.ShowQuestions = function() {

    $("#score").text("Temporary shortcut to see all questions");
    $(".jbox").find("label").each(function(index) {
        $(this).css("font-size", "40%");
        $(this).text(jeopardy.questions[$(this).parent().attr("topic")-1].
             Questions[$(this).parent().attr("question")-1].Question);
    });

//$( "li" ).each(function( index ) {
  //console.log( index + ": " + $( this ).text() );
//});
}

jeopardy.UpdateTopics = function(data) {
    $("#jcolumn1").find("h1").text(data[0].Topic);
    $('#jcolumn2').find("h1").text(data[1].Topic);
    $('#jcolumn3').find("h1").text(data[2].Topic);
    $('#jcolumn4').find("h1").text(data[3].Topic);
    $('#jcolumn5').find("h1").text(data[4].Topic);
    $('#jcolumn6').find("h1").text(data[5].Topic);
}

jeopardy.UpdateQuestions = function(data) {
    jeopardy.questions = data;
}

jeopardy.GetQuestionsJSON = function() {

    var xReq = new XMLHttpRequest();
    xReq.open("GET", "https://j-j-dean.github.io/jeopardy/jeopardy.txt", true);
    xReq.send(null);

    xReq.onreadystatechange = function(e) {
        if (xReq.readyState == 4) {
            if (xReq.status == "200") {
                var json_data = JSON.parse(xReq.response);
                jeopardy.UpdateQuestions(json_data);
                jeopardy.UpdateTopics(json_data);
            } else {
                console.log("Error opening file with status: " + xReq.status);
             }
        }
    }
}

/*
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
*/

jeopardy.BackToJeopardy = function() {

    $('#jeopardy-container').css("display", "block");
    $('#question-box').css("display", "none");

    col_num = $('#the-question').attr("topic");
    row_num = $('#the-question').attr("question");

    var query_element = "#T" + col_num + "-Q" + row_num + "-label";

    jeopardy.your_score += parseInt($(query_element).text());
    $('#score').text("Your score is " + jeopardy.your_score.toString());

    $(query_element).text("");

    jeopardy.BackToJeopardy = "";

    jeopardy.completed_questions++;

    if (jeopardy.completed_questions == jeopardy.TOTAL_QUESTIONS) {
        $('#score').text("You win! More updates soon...");
    }
}

// Function to update post heights on the towers
jeopardy.AskQuestion = function(box_element) {

    // Skip question boxes that have already been completed
    if ($('#the-question').text() != "") {

        var col_num = box_element.attr("topic");
        var row_num = box_element.attr("question");

        var question = jeopardy.questions[col_num-1].Questions[row_num-1].Question;

        var translate_xvalue = Math.round(-(col_num - 1) * $(".jbox").outerWidth() / 6);
        var translate_yvalue = Math.round((-$(".jbox-header").outerHeight() -
                                (row_num - 1) * $(".jbox").outerHeight()) / 6);
        var translate_string = 'translate(' + translate_xvalue.toString() + 'px ,' +
                            translate_yvalue.toString() + 'px)';
        $('#question-box').css("display", "block");
        $('#jeopardy-container').css("display", "none");
        $('#the-question').text(question);
        $('#the-question').attr("topic", col_num);
        $('#the-question').attr("question", row_num);

        $("#the-question").click(jeopardy.BackToJeopardy);
    }
}

// Function to perform after the window loads
$(document).ready(function() {

    // Add column 1 Topic Questions
    $(".jbox").click(function() {
        jeopardy.AskQuestion($(this));
    });

    // comment this out later
    $("#score").click(function() {
        jeopardy.ShowQuestions();
    });
});

/*********************************************
   DETERMINE HOW TO READ THIS FROM FILE
*********************************************/
// Read question file
var data = '[{"Topic": "BIRTH & CHILDHOOD","Questions": [{"Question": "(1-1) What is the Question"},{"Question": "(1-2) What is the Question"},{"Question": "(1-3) What is the Question"},{"Question": "(1-4) What is the Question"},{"Question": "(1-5) What is the Question"}]}]';
jeopardy.GetQuestionsJSON();
