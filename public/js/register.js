var strg = window.localStorage;

$(document).ready(function() {
	// initialize the firebase app
	var config = {
		apiKey: "AIzaSyCC10Foydrc3wvtIebKN1kys_LoL40QU7Y",
		authDomain: "cse170-launchpad.firebaseapp.com",
		databaseURL: "https://cse170-launchpad.firebaseio.com",
		projectId: "cse170-launchpad",
		storageBucket: "cse170-launchpad.appspot.com",
		messagingSenderId: "80394625965"
	};
	firebase.initializeApp(config);

	// to populate the activites field
	var activityRef = firebase.database().ref('/activities').orderByValue();
	activityRef.once('value').then(function(snapshot) {
		var activities = snapshot.val();
		$.each(activities, function(key, activity) {
			var template = Handlebars.compile($("#form-activity-template").html());

			$("#form-activity-dropdown").append(template({'activity' : activity}));
		});
	});

	// to update the database when a form has been submitted
	$("#form-submit-button").click(function() {
		var input = $('form').serializeArray();

		// parse input data into a user JSON object
		var user = {};
		$.each(input, function(index, form_obj) {
			if (form_obj.name == "expertise") {
				switch(form_obj.value) {
					case '1': user[form_obj.name] = "Beginner";
						break;
					case '2': user[form_obj.name] = "Novice";
						break;
					case '3': user[form_obj.name] = "Intermediate";
						break;
					case '4': user[form_obj.name] = "Advanced";
						break;
					case '5': user[form_obj.name] = "Expert";
						break;
				}
			}
			else {
				user[form_obj.name] = form_obj.value;
			}
		});
		console.log(user);

		// get a new key for post
		var newPostKey = firebase.database().ref().child('mentors').push().key;

		var updates = {};
		updates['/mentors/' + newPostKey] = user;

		firebase.database().ref().update(updates);

		console.log(newPostKey);

	})

	// make sure name field is properly generated
	var template = Handlebars.compile($("#form-name-value-template").html());
	$(template(JSON.parse(strg.getItem('user')))).insertAfter('#form-name-label');

	$(".retHomeBtn").click(function() {
		window.location = $(this).find("a").attr("href");
		return false;
	});

});