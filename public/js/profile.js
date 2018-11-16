var strg = window.localStorage;

$(document).ready(function() {
	firebase.auth().onAuthStateChanged(function(user) {
		// pre-compile the template
		var template = Handlebars.compile($("#username-template").html());
		$("#profile_header").append(template(user));

		// update the table entries and remove empty-table-row
		firebase.database().ref('/users').child(user.uid).once('value').then(function(snapshot) {
			var mentor_list_id = snapshot.val().mentor_list;
			var mentee_list_id = snapshot.val().mentee_list;

			var mentor_template = Handlebars.compile($("#mentor-table-template").html());
			firebase.database().ref('/mentor_list').child(mentor_list_id).once('value').then(function(mentors) {
				$.each(mentors.val(), function(key) {
					firebase.database().ref('/mentors').child(key).once('value').then(function(mentor) {
						$("#mentor-table-body").append(mentor_template(mentor.val()));
					});
					$("#empty-mentor-row").hide();
				});
			});

			var mentee_template = Handlebars.compile($("#mentee-table-template").html());

			// read data to get entry values for each mentee
			firebase.database().ref('/mentee_list').child(mentee_list_id).once('value').then(function(mentees) {
				$.each(mentees.val(), function(key, value) {
					$.each(value, function(uid, activity) {
						var mentee_entry = {};

						// get the data for the mentor's specific-activity
						firebase.database().ref('/mentors').child(key).once('value').then(function(mentor) {
							mentee_entry['activity'] = activity;
							mentee_entry['specific-activity'] = mentor.val()['specific-activity'];

							// get the data for the mentee's name
							firebase.database().ref('/users').child(uid).once('value').then(function(mentee) {
								mentee_entry['name'] = mentee.val().displayName;
								$("#mentee-table-body").append(mentee_template(mentee_entry));
							});
						});
					});
					$("#empty-mentee-row").hide();
				});
			});
		});
	});

});
