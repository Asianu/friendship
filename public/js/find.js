var strg = window.localStorage;

$(document).ready(function() {

	// if user is signed in, hide the empty-page-col element
	if(strg.getItem('signin_token') == 'true') {
		$("#empty-page-col").hide();
	}

	// get the reference to the profiles
	firebase.database().ref('/profiles').orderByChild('name').on('child_added', function(profile) {
		
		// code that loads each user card into the page
		var profile_info = profile.val();

		// load card only if the user's profile contains at least one activity
		if (profile_info.hasOwnProperty("activities")) {

			// get some information of the profile card's person's and match data with existing user
			firebase.database().ref('/users').child(profile_info.uid).once('value').then(function(user) {
				// to load the profile pictures
				profile_info.photoURL = user.val().photoURL;

				// load info to a new card and append it
				var template = Handlebars.compile($("#find-card-template").html());
				$(".card-deck").append(template(profile_info));

				// if the card is the current user's display text indicating that instead of a button
				if (firebase.auth().currentUser.uid == profile_info.uid) {
					$('#foot' + profile_info.uid).html('<p>This is you!</p>');
				}

				// if the card is another user that the current user has already added as mentor, disable it
				firebase.database().ref('/users').child(firebase.auth().currentUser.uid).once('value').then(function(currUser) {
					firebase.database().ref('/mentor_list').child(currUser.val().mentor_list).once('value').then(function(mentor_list) {
						if(mentor_list.val()) {
							$.each(mentor_list.val(), function(key, mentor_profile_id) {
								if (user.val().profile_id == mentor_profile_id) {
									$('#foot' + profile_info.uid).find('button').removeClass('btn-primary').addClass('btn-disabled').off();
								}
							});
						}
					});
				});

			});
		}

		// listener for each button, this is inside "on" function so that functionality is tied to each rendered button
		$(document).on('click', '.btn-req', function(event) {
			event.stopPropagation();
			event.stopImmediatePropagation();

			mentor_id = event.target.id;
			if ($("#" + mentor_id).hasClass("btn-primary")) {

				firebase.database().ref('/users').child(mentor_id).once('value').then(function(mentor) {
					console.log(mentor.val());

					var updates = {};

					// generate a new key for the user
					var key = firebase.database().ref('/mentee_list').child(mentor.val().mentee_list).push().key;

					// add the user as a mentee to the mentor's mentee list
					updates['/mentee_list/' + mentor.val().mentee_list + '/' + key] = firebase.auth().currentUser.uid;

					// add the mentor as a mentor to the user's mentor list
					firebase.database().ref('/users').child(firebase.auth().currentUser.uid).once('value').then(function(user) {
						updates['/mentor_list/' + user.val().mentor_list + '/' + key] = mentor.val().profile_id;

						// updates database once the mentors are added						
						console.log(updates);
						firebase.database().ref().update(updates);
					});


				});
			}
		});
	});
});
