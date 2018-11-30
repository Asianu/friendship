var strg = window.localStorage;

// variable that will keep track of the number of activity rows in the page
var activity_input = {
	activity_id: 1,
	counter: 1
};

$(document).ready(function() {

	window.addEventListener('load', function(e) {
	    // Fetch all the forms we want to apply custom Bootstrap validation styles to
	    var forms = document.getElementsByClassName('needs-validation');
	    // Loop over them and prevent submission
	    var validation = Array.prototype.filter.call(forms, function(form) {
	      form.addEventListener("submit", function(event) {
	        if (form.checkValidity() === false) {
	          event.preventDefault();
	          event.stopPropagation();
	        }
	        else {
	        	event.preventDefault();
	        	var input = $('form').serializeArray();


	        	var profile = {};
	        	profile['uid'] = firebase.auth().currentUser.uid;
	        	profile['activities'] = {};

	        	var profile_id = null;
	        	firebase.database().ref('/users').child(firebase.auth().currentUser.uid).once('value').then(function(snapshot) {
        			profile_id = snapshot.val().profile_id;
	        	
        			// go through the activity list and add it to the update object
		        	var tmp_activity = null;
		        	$.each(input, function(key, form_item) {

		        		// add the activity to the profile
		        		if(form_item.name.toLowerCase().indexOf('activity') >= 0) {
		        			tmp_activity = form_item.value;
		        			profile.activities[tmp_activity] = 0;
		        		}

		        		// add the expertise level of that activity to the profile
		        		else if (form_item.name.toLowerCase().indexOf('expertise') >= 0) {
		        			profile.activities[tmp_activity] = form_item.value;
		        		}

		        		// add any other relevant data to the profile
		        		else {
		        			profile[form_item.name] = form_item.value;
		        		}
		        	});

		        	firebase.database().ref('/profiles/' + profile_id).update(profile);
	        	});

	        	console.log(profile);

				$('#exampleModal').modal('show');

		        event.preventDefault();
		        event.stopPropagation();
		        }
		        form.classList.add('was-validated');
	      	}, false);
	    });
	}, false);

	
    //$("#activity-list").append(template(input));
    // addRow();

	// code to make sure that the page is loaded correctly with user's profile info
	firebase.auth().onAuthStateChanged(function(user) {

		// compile the Handlebar templates
		var name_template = Handlebars.compile($("#form-name-value-template").html());
		var text_area_template = Handlebars.compile($("#form-bio-area-template").html());

		// name data to be filled
		$(name_template(user)).insertAfter('#form-name-label');

		// retrieving the user's info here
		firebase.database().ref('/users/' + user.uid).once('value').then(function(user_info) {


			// search for the user's profile here
			firebase.database().ref('/profiles').once('value').then(function(profiles) {

				// if the profile exists, populate the page via this code
				if (profiles.hasChild(user_info.val().profile_id)) {

					user_profile = profiles.val()[user_info.val().profile_id];

					console.log(user_profile);

					// activity data to be filled
					$.each(user_profile.activities, function(act, exp) {

						// update the activity_input so that addRow contains the proper information
						activity_input['activity_name'] = act;
						activity_input['activity_expertise'] = exp;

						addRow();

						// selects the correct values
						if (exp == 1) {
							$('#adv-radio-' + (activity_input['activity_id']-1)).prop('checked', true);
						}
						else if (exp == 2) {
							$('#exp-radio-' + (activity_input['activity_id']-1)).prop('checked', true);
						}
						else {
							$('#mas-radio-' + (activity_input['activity_id']-1)).prop('checked', true);
						}

						// reset activity_input's act and exp
						activity_input['activity_name'] = "";
						activity_input['activity_expertise'] = "";
					});

					// bio data to be filled
					$("#text-area-group").append(text_area_template(user_profile));

				}

				// otherwise default populate
				else {

				}

			});

		
		});


	});

	$(".retHomeBtn").click(function() {
		window.location = $(this).find("a").attr("href");
		return false;
    });
    
    // helper function to add a new row to the activity list
    function addRow() {
		var activity_template = Handlebars.compile($("#form-activity-row-template").html());

    	// no more than 8 rows allowed
        if (activity_input['counter'] >= 9){
        	console.log("max number of rows added");
            return;
        }

        // remove add buttons from all existing rows first
        var row_btn = $(".form-row").find("button");
        row_btn.off();
        row_btn.removeClass("add-btn").addClass("remove-btn");
		row_btn.find("i").removeClass("fa-plus").addClass("fa-times");

		// appends a new row
		$('#activity-list').append(activity_template(activity_input));

		// if the row has reached maximum capacity, make sure last row has 'x'
		if (activity_input['counter'] == 8) {
        	var row_btn = $(".form-row").find("button");
			row_btn.removeClass("add-btn").addClass("remove-btn");
			row_btn.find("i").removeClass("fa-plus").addClass("fa-times");
		}

        activity_input['activity_id'] = activity_input['activity_id'] + 1;
        activity_input['counter'] = activity_input['counter'] + 1;

        $(".add-btn").on("click", addRow);
        $(".remove-btn").on("click", deleteRow);

        console.log(activity_input);
    };

    function deleteRow() {
        $(this).parent().parent().remove();
        activity_input['counter'] = activity_input['counter'] - 1;

        // make the last button always be plus (unless max capacity reached)
        $(".form-row").find("button").off();

        var row_btn = $(".form-row:last").find("button");
        console.log(row_btn.name);
        row_btn.removeClass("remove-btn").addClass("add-btn");
		row_btn.find("i").removeClass("fa-times").addClass("fa-plus");
        $(".add-btn").on("click", addRow);

        console.log(activity_input);
    };

});