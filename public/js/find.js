var strg = window.localStorage;

$(document).ready(function() {

	// if user is signed in, hide the empty-page-col element
	if(strg.getItem('signin_token') == 'true') {
		$("#empty-page-col").hide();
	}

	// get the reference to the profiles
	var profileRef = firebase.database().ref('/profiles');
	profileRef.orderByChild('name').on('child_added', function(profile) {
		
		// code that loads each user card into the page
		var profile_info = profile.val();
		console.log(Object.keys(profile_info.activities).length);
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

		});

		// listener for each button, this is inside "on" function so that functionality is tied to each rendered button
		$(document).on('click', '.request', function(event) {
			event.stopPropagation();
			event.stopImmediatePropagation();
			mentor_id = event.target.id;
			firebase.database().ref('/mentors').child(mentor_id).once('value').then(function(mentor) {
				// if user adds themself, do not add to database
				// TODO: find a way to disable button
				if(mentor.val().uid == firebase.auth().currentUser.uid) {
					console.log("adding self as mentor", mentor.val().uid);
					return false;
				}
				else {
					var updates = {};

					// to add the user as a mentee to the mentor's mentee list
					firebase.database().ref('/users').child(mentor.val().uid).once('value').then(function(user) {
						updates['/mentee_list/' + user.val().mentee_list + '/' + mentor_id + '/' + firebase.auth().currentUser.uid] = mentor.val().activity;

						// to add the mentor to the current user's mentor list
						firebase.database().ref('/users').child(firebase.auth().currentUser.uid).once('value').then(function(currUser) {
							updates['/mentor_list/' + currUser.val().mentor_list + '/' + mentor_id] = "";
							
							console.log(updates);
							firebase.database().ref().update(updates);
						});
					});
				}
			});
		});
	});
});
