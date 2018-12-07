var strg = window.localStorage;

$(document).ready(function() {
	firebase.auth().onAuthStateChanged(function(user) {
		// pre-compile the template
		var template = Handlebars.compile($("#username-template").html());
		$("#profile_header").append(template(user));

		// update the table entries and remove empty-table-row
		firebase.database().ref('/users').child(user.uid).once('value').then(function(user) {
			var mentor_list_id = user.val().mentor_list;
			var mentee_list_id = user.val().mentee_list;

			var mentor_template = Handlebars.compile($("#mentor-table-template").html());
			firebase.database().ref('/mentor_list').child(mentor_list_id).once('value').then(function(mentors) {
				if(mentors.val() != null) {
					$.each(mentors.val(), function(key, profile_id) {
						firebase.database().ref('/profiles').child(profile_id).once('value').then(function(mentor) {
							console.log(mentor.val());
							if (mentor.val().hasOwnProperty("activities")) {
								$("#mentor-table-body").append(mentor_template(mentor.val()));
							}
							$('.remove-btn').on('click', function(event) {
								console.log(this);
							});
						});
						$("#empty-mentor-row").hide();
					});
				}
			});

			var mentee_template = Handlebars.compile($("#mentee-table-template").html());

			// read data to get entry values for each mentee
			firebase.database().ref('/mentee_list').child(mentee_list_id).once('value').then(function(mentees) {
				if (mentees.val() != null) {
					$.each(mentees.val(), function(key, uid) {
						firebase.database().ref('/users').child(uid).once('value').then(function(user) {
							firebase.database().ref('/profiles').child(user.val().profile_id).once('value').then(function(profile){
								$("#mentee-table-body").append(mentee_template(profile.val()));
							});

						});
						$("#empty-mentee-row").hide();
					});
				}
			});
		});


	});

});
