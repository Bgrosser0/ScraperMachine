$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href=" + data[i].link + ">" + data[i].link + "</a>" +"<br />" + data[i].summary + "</p>");
        $("#articles").append("<button data-id'" + "' id='savearticle'>Save Article</button>")
    }
});

$(document).on("click", "p", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
      .then(function(data) {
          console.log(data);
          // TITLE
          $("#notes").append("<h2 class='noteTitle'>" + data.title + "</h2>");
          $("#notes").append("<h2> Leave a comment? </h2>");
          // text area to add a new note body
          $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
          // A button to submit the new note with the note's id
          $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
          $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");


          if (data.note) {
              $("#bodyinput").val(data.note.body);
          }
      })

})
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#bodyinput").val("");
  });
  
    // When you click the deletenote button
    $(document).on("click", "#deletenote", function() {
      // Grab the id associated with the article from the submit button
      var thisId = $(this).attr("data-id");
    
      // Run a DELETE request to change the note, using what's entered in the inputs
      $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId,
        data: {
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
        // With that done
        .then(function(data) {
          // Log the response
          console.log(data);
          // Empty the notes section
          $("#notes").empty();
        });
    
      // Also, remove the values entered in the input and textarea for note entry
      $("#bodyinput").val("");
    });
    