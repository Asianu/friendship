var strg = window.localStorage;
var counter = 1;

$(document).ready(function() {

	// to populate the activites field
	var activityRef = firebase.database().ref('/activities');
	activityRef.orderByValue().on("child_added", function(activity) {
		var template = Handlebars.compile($("#form-activity-template").html());
		$("#form-activity-dropdown").append(template({'activity' : activity.val()}));
	});

	// for validation purposes
	window.addEventListener('load', function() {
	    // Fetch all the forms we want to apply custom Bootstrap validation styles to
	    var forms = document.getElementsByClassName('needs-validation');
	    // Loop over them and prevent submission
	    var validation = Array.prototype.filter.call(forms, function(form) {
	      form.addEventListener($("#submit"), function(event) {
	        if (form.checkValidity() === false) {
	          event.preventDefault();
	          event.stopPropagation();
	        }
	        else {
	        	console.log('there');
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
				user['uid'] = firebase.auth().currentUser.uid;
				console.log(user);

				// get a new key for post
				var newMentorKey = firebase.database().ref().child('mentors').push().key;
				user['mentor_id'] = newMentorKey;

				var updates = {};
				updates['/mentors/' + newMentorKey] = user;
				console.log(updates);

				firebase.database().ref().update(updates);

				console.log(newMentorKey);

				$('#exampleModal').modal('show');

		        event.preventDefault();
		        event.stopPropagation();
		        }
		        form.classList.add('was-validated');
	      	}, false);
	    });
	}, false);




	// make sure name field is properly generated
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		var template = Handlebars.compile($("#form-name-value-template").html());
		$(template(user)).insertAfter('#form-name-label');
	  }
	});

	$(".retHomeBtn").click(function() {
		window.location = $(this).find("a").attr("href");
		return false;
    });
    
    $(".add-btn").click(function(e) {
        e.preventDefault();
        counter = counter + 1;
        $("#activity-list").append('<div id="activity-'+counter+'" class="form-row">\
            <div class="col-lg">\
                <input type="text" class="form-control" name="activity-'+counter+'" />\
            </div>\
            <div class="col-lg">\
                <div class="custom-control custom-radio custom-control-inline">\
                    <input type="radio" id="adv-radio-'+counter+'" name="expertise-radio-'+counter+'">\
                    <label class="tag" for="adv-radio-'+counter+'">Advanced</label>\
                </div>\
                <div class="custom-control custom-radio custom-control-inline">\
                    <input type="radio" id="exp-radio-'+counter+'" name="expertise-radio-'+counter+'">\
                    <label class="tag" for="exp-radio-'+counter+'">Expert</label>\
                </div>\
                <div class="custom-control custom-radio custom-control-inline">\
                    <input type="radio" id="mas-radio-'+counter+'" name="expertise-radio-'+counter+'">\
                    <label class="tag" for="mas-radio-'+counter+'">Master</label>\
                </div>\
                <button id="new-row" class="add-btn"><i class="fas fa-check" aria-hidden="true"></i></button>\
            </div>\
        </div>\
        ');
    });

});