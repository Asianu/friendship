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

	// for validation purposes
	window.addEventListener('load', function() {
	    // Fetch all the forms we want to apply custom Bootstrap validation styles to
	    var forms = document.getElementsByClassName('needs-validation');
	    // Loop over them and prevent submission
	    var validation = Array.prototype.filter.call(forms, function(form) {
	      form.addEventListener('submit', function(event) {
	        if (form.checkValidity() === false) {
	          event.preventDefault();
	          event.stopPropagation();
	        }
	        form.classList.add('was-validated');
	      }, false);
	    });
	  }, false);

	// to update the database when a form has been submitted
	$("#submit-data-btn").click(function() {
		
    	var input = $('form').serializeArray();

		// parse input data into a user JSON object
		var user = {};
		$.each(input, function(index, form_obj) {
			if (form_obj.name == "expertise") {
				var expertiseLevel = parseInt(form_obj.value)
				if (expertiseLevel == 1){
					user[form_obj.name] = "No Experience"
				} else if (expertiseLevel <= 20){
					user[form_obj.name] = "Beginner";
				} else if (expertiseLevel <= 40) {
					user[form_obj.name] = "Novice";
				} else if (expertiseLevel <= 60) {
					user[form_obj.name] = "Intermediate";
				} else if (expertiseLevel <= 80) {
					user[form_obj.name] = "Advanced";
				} else if (expertiseLevel < 100) {
					user[form_obj.name] = "Expert";
				} else {
					user[form_obj.name] = "Master";
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

	});

	// make sure name field is properly generated
	var template = Handlebars.compile($("#form-name-value-template").html());
	$(template(JSON.parse(strg.getItem('user')))).insertAfter('#form-name-label');

	$(".retHomeBtn").click(function() {
		window.location = $(this).find("a").attr("href");
		return false;
	});

});