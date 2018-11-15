$(document).ready(function() {

	// get the reference to the mentors
	var mentorRef = firebase.database().ref('/mentors');

	mentorRef.orderByChild('name').on('child_added', function(mentor) {
		// pre-compile the template
		var template = Handlebars.compile($("#mentor-entry-template").html());
		$("#find-table-body").append(template(mentor.val()));
	});

});

/* JQuery toggle for modal */
jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
		$('#exampleModal').modal('show');
    });
});