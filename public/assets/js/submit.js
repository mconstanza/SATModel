// When the user clicks the submit button on the test bubblesheet
$(document).on("click", "#submitForm", function() {

    // create the answersheet object that will be sent to the server
    var answerSheet = {
        reading: {},
        writing: {},
        math1: {},
        math2: {},
        testId: 1
    };

    var search = $(".question-choices");

    // create an array of all of the question answers on the page
    search.each(function(index) {

        // extract what section the question belongs to
        var section = $(this).attr("data-section");

        // check what section the question belongs to and push it to the object accordingly
        if (section == "1") {
            var questionNumber = $(this).attr("data-number");
            var questionAnswer = $(this).attr("data-ans");
            answerSheet.reading[questionNumber] = questionAnswer;

        } else if (section == "2") {
            var questionNumber = $(this).attr("data-number");
            var questionAnswer = $(this).attr("data-ans");
            answerSheet.writing[questionNumber] = questionAnswer;
        } else if (section == "3") {
            var questionNumber = $(this).attr("data-number");
            var questionAnswer = $(this).attr("data-ans");
            answerSheet.math1[questionNumber] = questionAnswer;
        } else if (section == "4") {
            var questionNumber = $(this).attr("data-number");
            var questionAnswer = $(this).attr("data-ans");
            answerSheet.math2[questionNumber] = questionAnswer;
        }
    });

    // submit post request to /test to submit answersheet
    // data is score object from server

    var testId = $('#testId').attr('data-test');
    $.post('/test/' + testId, answerSheet, function(data) {
        window.location = data.url;

    });
});


// When the user clicks on a multiple choice answer
$(document).on("click", ".ansbutton", function() {

    var studentAnswer = $(this).text();

    // the question's ID is the same as the multiple-choice answer's minus the last letter
    var questionID = $(this).attr("id").slice(0, -1);

    var quesSearch = "#" + questionID;



    //changing status of button
    if($(this).data("selected") == false){
        var rowButtons = $(this).parent().children()

        for(var i = 0; i<rowButtons.length; i++){
            rowButtons.data("selected", false)
            rowButtons.removeClass("selectedButton")
        }

        $(this).data("selected", true);
        $(this).addClass("selectedButton");

        $(quesSearch).attr("data-ans", studentAnswer);

    }
    else if($(this).data("selected") == true){
        $(this).data("selected", false);
        $(this).removeClass("selectedButton")
        $(quesSearch).attr("data-ans", " ")
    }




});


// When the user changes the value of a dropdown on the answersheet
$(document).on("change", ".gridin-dropdown", function() {

    var answer = "";
    $(this).parent().children().each(function() {
        var value = $(this).find(":selected").text();
        if (!value || value.length === 0) {
            answer += "";
        } else {
            answer += value.charAt(0);
        }
    });
    // set the answer to a data attribute in the dropdown box
    $(this).parent().attr("data-ans", answer);
});


$("option").on("", function() {
    console.log(this)
    var changeVal = $(this).val();
    console.log(changeVal)
    
})