$(document).ready(function() {
	// initialize the firebase app
	var config = {
		apiKey: "AIzaSyCC10Foydrc3wvtIebKN1kys_LoL40QU7Y",
		authDomain: "cse170-launchpad.firebaseapp.com",
		databaseURL: "https://cse170-launchpad.firebaseio.com",
		projectId: "cse170-launchpad",
		storageBucket: "cse170-launchpad.appspot.com",
		messagingSenderId: "80394625965"
	};
	firebase.initializeApp(config);

	// get the reference to the mentors
	var mentorRef = firebase.database().ref('/mentors');

	// for each mentor, add a row to the table
	mentorRef.once('value').then(function(snapshot) {
		var mentors = snapshot.val();
		$.each(mentors, function(key, mentor) {

			// pre-compile the template
			var template = Handlebars.compile($("#mentor-entry-template").html());

			$("#find-table-body").prepend(template(mentor));
		});
	});

});

jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
		$('#exampleModal').modal('show');
    });
});