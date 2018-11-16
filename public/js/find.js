$(document).ready(function() {

	// get the reference to the mentors
	var mentorRef = firebase.database().ref('/mentors');

	mentorRef.orderByChild('name').on('child_added', function(mentor) {
		// pre-compile the template

		var mentor_info = mentor.val();
		firebase.database().ref('/users').child(mentor_info.uid).once('value').then(function(snapshot) {
			// to load the profile picture
			mentor_info.photoURL = snapshot.val().photoURL;

			var template = Handlebars.compile($("#find-card-template").html());
			$("#mentors-row").append(template(mentor_info));
		});

	});

});