$(document).on("click", "#submitForm", function(){

  var answerSheet = {
    reading: {},
    writing: {},
    math1: {},
    math2: {}
  }

  
  var search = $(".question-choices") 

  search.each(function(index){

    var section = $(this).attr("data-section")

    if(section == "Evidence-Based-Reading"){
      var questionNumber =  $(this).attr("data-number")
      var questionAnswer = $(this).attr("data-ans")
      answerSheet.reading[questionNumber] = questionAnswer
      
    }
    else if(section == "Writing-and-Language"){
      var questionNumber =  $(this).attr("data-number")
      var questionAnswer = $(this).attr("data-ans")
      answerSheet.writing[questionNumber] = questionAnswer
    }

    else if(section == "Math1"){
      var questionNumber =  $(this).attr("data-number")
      var questionAnswer = $(this).attr("data-ans")
      answerSheet.math1[questionNumber] = questionAnswer
    }

    else if(section == "Math2"){
      var questionNumber =  $(this).attr("data-number")
      var questionAnswer = $(this).attr("data-ans")
      answerSheet.math2[questionNumber] = questionAnswer
    }


  })
    



  console.log(answerSheet)

})


$(document).on("click", ".ansbutton", function(){

  var studentAnswer = $(this).text()


  var questionID = $(this).attr("id").slice(0, -1)
  // console.log(questionID)

  var quesSearch = "#"+questionID
  
  $(quesSearch).attr("data-ans", studentAnswer);
 
  

})

$(document).on("change", ".gridin-dropdown", function(){

  var answer = ""
  $(this).parent().children().each(function(){
    var value = $(this).find(":selected").text();
    if(!value || value.length === 0){
      answer += ""
    }
    else{
      answer += value.charAt(0);
    }
  })
$(this).parent().attr("data-ans", answer)
})