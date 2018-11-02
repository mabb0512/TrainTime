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

    //get all trains in database
    database.ref().on("value", function(snapshot) {
        var result = snapshot.toJSON();
        if (!result == undefined)
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

});

database.ref().on("child_added", function(childSnapshot) {

    var currentTime = moment(moment()).format("hh:mm");
    
    var id = childSnapshot.val().trainId;
    var name = childSnapshot.val().trainName;
    var destination = childSnapshot.val().trainDest;
    var time = childSnapshot.val().trainTime;
    var frequency = childSnapshot.val().trainFreq;

    var startTime = moment(time, 'HH:mm');
    var nextTrain = moment(startTime, 'HH:mm').add(frequency, 'minutes').format('HH:mm');
    var duration = moment(nextTrain, 'HHmm').fromNow();

    var trainOnTime = moment(startTime, 'HHmm').fromNow();
    console.log(trainOnTime);

    //check if start time already past
    if (duration.slice(-3) == 'ago') {

        nextTrain = moment(currentTime, 'HH:mm').add(frequency, 'minutes').format('HH:mm');
    }

    else {

        nextTrain = time;
    }

    var away = ((moment(nextTrain, 'HHmm').fromNow()).slice(3, 5).trim()) * 60;
  
    // Create new row
    var newRow = $("<tr>").append(
    $("<td>").text(id),
    $("<td>").text(name),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(away)

    );

    // Append new row to the table
    $("#train-table > tbody").append(newRow);
});