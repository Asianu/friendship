var strg = window.localStorage;

$(document).ready(function() {

	// if user is signed in, hide the empty-page-col element
	if(strg.getItem('signin_token') == 'true') {
		$("#empty-page-col").hide();
	}


	// get the reference to the mentors
	var mentorRef = firebase.database().ref('/mentors');

	mentorRef.orderByChild('name').on('child_added', function(mentor) {
		// pre-compile the template

		var mentor_info = mentor.val();

		firebase.database().ref('/users').child(mentor_info.uid).once('value').then(function(snapshot) {
			// to load the profile pictures
			mentor_info.photoURL = snapshot.val().photoURL;

			var template = Handlebars.compile($("#find-card-template").html());
			$("#mentors-row").append(template(mentor_info));
		});

		// add the person into the mentor list of the current user
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
