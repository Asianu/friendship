$(document).ready(function() {

	// get the reference to the mentors
	var mentorRef = firebase.database().ref('/mentors');

	mentorRef.orderByChild('name').on('child_added', function(mentor) {
		// pre-compile the template
		// var template = Handlebars.compile($("#mentor-entry-template").html());
		// $("#find-table-body").append(template(mentor.val()));

		var mentor_info = mentor.val();
		var template = Handlebars.compile($("#find-card-template").html());
		$("#mentors-row").append(template(mentor_info));
	});

});