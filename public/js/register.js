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

	// make sure name field is properly generated
	var template = Handlebars.compile($("#form-name-value-template").html());
	$(template(JSON.parse(strg.getItem('user')))).insertAfter('#form-name-label');

	$(".retHomeBtn").click(function() {
		window.location = $(this).find("a").attr("href");
		return false;
	});

});