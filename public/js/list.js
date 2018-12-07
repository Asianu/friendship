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

	// removes the profile from the user's list of mentors
	$(document).on('click', '.remove-btn', function(event) {
		event.stopPropagation();
		event.stopImmediatePropagation();

		// uid refers to the mentor's uid
		var uid = 0;

		if ($(event.target).is('i')) {
			uid = $(event.target).parent().attr('id');
		}
		else {
			uid = event.target.id;
		}

		// remove the user from the other user's mentee list
		firebase.database().ref('/users').child(firebase.auth().currentUser.uid).once('value').then(function(user) {
			firebase.database().ref('/mentor_list').child(user.val().mentor_list).once('value').then(function(mentor_list) {

				// match the key used to connect mentor/mentee pair and delete it
				firebase.database().ref('/users').child(uid).once('value').then(function(other) {
					var mentor_mentee_key = 0;

					// searches and finds correct mentor/mentee key
					$.each(mentor_list.val(), function(key, profile_id) {
						if (profile_id == other.val().profile_id) {
							mentor_mentee_key = key;
						}
					});

					console.log(mentor_mentee_key);

					firebase.database().ref('/mentor_list/' + user.val().mentor_list).child(mentor_mentee_key).remove();
					firebase.database().ref('/mentee_list/' + other.val().mentee_list).child(mentor_mentee_key).remove();
				});

			});
		});

		// remove the other user from the user's mentor list
		$("#row" + uid).remove();
	});

});
