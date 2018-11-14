$(document).ready(function() {

	// get the reference to the mentors
	var mentorRef = firebase.database().ref('/mentors');

	// for each mentor, add a row to the table
	mentorRef.once('value').then(function(snapshot) {
		var mentors = snapshot.val();
		$.each(mentors, function(key, mentor) {

			// pre-compile the template
			var template = Handlebars.compile($("#mentor-entry-template").html());

			$("#find-table-body").append(template(mentor));
		});
	});

});

/* JQuery toggle for modal */
jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
		$('#exampleModal').modal('show');
    });
});