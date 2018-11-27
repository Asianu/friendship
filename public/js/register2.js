var strg = window.localStorage;
var counter = 1;

$(document).ready(function() {

	window.addEventListener('load', function(e) {
	    // Fetch all the forms we want to apply custom Bootstrap validation styles to
	    var forms = document.getElementsByClassName('needs-validation');
	    // Loop over them and prevent submission
	    var validation = Array.prototype.filter.call(forms, function(form) {
	      form.addEventListener("submit", function(event) {
	        if (form.checkValidity() === false) {
	        	console.log('here');
	          event.preventDefault();
	          event.stopPropagation();
	        }
	        else {
	        	event.preventDefault();
	        	console.log('there');
	        	var input = $('form').serializeArray();

				// parse input data into a user JSON object
				var user = {};

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

	// populate specific activity row
	var input = {activity_id:2
	};
	var template = Handlebars.compile($("#form-activity-row-template").html());
	$("#activity-list").append(template(input));



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
        $("#row-modifier-icon").html('<button class="remove-btn"><i class="fa fa-times" aria-hidden="true"></i></button>');
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
            </div>\
            <div id="row-modifier-icon">\
                <button type="button" class="add-btn"><i class="fas fa-check" aria-hidden="true"></i></button>\
            </div>\
        </div>\
        ');
    });

});