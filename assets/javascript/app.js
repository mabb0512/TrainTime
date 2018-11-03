var config = {
    apiKey: "AIzaSyDEBH9igtxEa2MlW2JZ9xtnNv04kPM_FkY",
    authDomain: "train-time-90ac0.firebaseapp.com",
    databaseURL: "https://train-time-90ac0.firebaseio.com",
    storageBucket: "train-time-90ac0.appspot.com",
};

firebase.initializeApp(config);
var database = firebase.database();
var savedTrains = 0;

$("#train-submit").on("click", function(event) {

    event.preventDefault();

    var name = $("#train-name").val().trim();
    var destination = $("#train-dest").val().trim();
    var time = $("#train-time").val().trim();
    var frequency = $("#train-freq").val().trim();

    if (name.length == 0 || destination.length == 0 || time.length == 0 || frequency.length == 0) {

        alert ("Fields cannot be empty");
    }

    else {

                //get all trains in database
                database.ref().on("value", function(snapshot) {

                    var result = snapshot.toJSON();
                    if (result != null)
                        savedTrains = Object.keys(result).length;
                });
        
                //get user input data
                var id = savedTrains + 1;
                var name = $("#train-name").val().trim();
                var destination = $("#train-dest").val().trim();
                var time = $("#train-time").val().trim();
                var frequency = $("#train-freq").val().trim();
        
                // Creates object with train data
                var newTrain = {
                    trainId: id,
                    trainName: name,
                    trainDest: destination,
                    trainTime: time,
                    trainFreq: frequency
                };
        
                //add train to db
                database.ref().push(newTrain);
        
                alert("Train added successfully");
        
                // Clears all of the text-boxes
                $("#train-name").val("");
                $("#train-dest").val("");
                $("#train-time").val("");
                $("#train-freq").val("");
    }



});

database.ref().on("child_added", function(childSnapshot) {
    
    var id = childSnapshot.val().trainId;
    var name = childSnapshot.val().trainName;
    var destination = childSnapshot.val().trainDest;
    var firstTime = childSnapshot.val().trainTime;
    var frequency = childSnapshot.val().trainFreq;

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var timeApart = diffTime % frequency;
    var minutesAway = frequency - timeApart;
    var nextTrain = moment().add(minutesAway, "minutes");
  
    // Create new row
    var newRow = $("<tr>").append(
    $("<td>").text(id),
    $("<td>").text(name),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(moment(nextTrain).format("hh:mm")),
    $("<td>").text(minutesAway));

    // Append new row to the table
    $("#train-table > tbody").append(newRow);
});