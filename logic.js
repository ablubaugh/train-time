$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyB_7ZSmlgV2r5LtHQRIs8wUmEaXMml2qfg",
        authDomain: "train-time-92b6b.firebaseapp.com",
        databaseURL: "https://train-time-92b6b.firebaseio.com",
        projectId: "train-time-92b6b",
        storageBucket: "train-time-92b6b.appspot.com",
        messagingSenderId: "493027948055",
        appId: "1:493027948055:web:6073de9ca42c72dd"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = "";

    // Run the following function when the submit button is pressed
    $("#submit-button").on("click", function(event) {
        event.preventDefault();

        // Grabbed values from text boxes
        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        trainTime = $("#trainTime").val().trim();
        frequency = $("#frequency").val().trim();

        // Code for handling the push
        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency
        });

        // Empty the text boxes when the user data is submitted
        $("#trainName").val("");
        $("#destination").val("");
        $("#trainTime").val("");
        $("#frequency").val("");

    });

    // Firebase watcher + initial loader
    database.ref().on("child_added", function(childSnapshot) {

      console.log(childSnapshot.val().trainName);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().trainTime);
      console.log(childSnapshot.val().frequency);

      var trainNameTable = childSnapshot.val().trainName;
      var destinationTable = childSnapshot.val().destination;
      var frequencyTable = childSnapshot.val().frequency;
      var nextArrivalTable = childSnapshot.val().trainTime;

      var firstTimeConverted = moment(nextArrivalTable, "hh:mm").subtract(1, "years");
      var currentTime = moment();
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      var tRemainder = diffTime % frequencyTable;
      var minutesTillTrain = frequencyTable - tRemainder;
      var nextTrain = moment().add(minutesTillTrain, "minutes");
      var nextTrainFormatted = moment(nextTrain).format("hh:mm")

      $("#train-table").append("<tr><td>" +
            trainNameTable + "</td><td>" +
            destinationTable + "</td><td>" +
            frequencyTable + "</td><td>" +
            nextTrainFormatted + "</td><td>" +
            minutesTillTrain + "</td></tr>");

    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

})