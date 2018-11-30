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
		var activity_template = Handlebars.compile($("#form-activity-row-template").html());
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
					$.each(user_profile.activities, function(key, value) {
						activity_input['activity_name'] = key;
						activity_input['activity_expertise'] = value;

						// if the new row is the second+, first change the 'plus' to a 'times'
						if (activity_input['activity_id'] >= 2) {
							var row_btn = $("#activity-" + (activity_input['activity_id']-1)).find("button");
							row_btn.removeClass("add-btn").addClass("remove-btn");
							row_btn.find("i").removeClass("fa-plus").addClass("fa-times");
						}

						// appends a new row
						$('#activity-list').append(activity_template(activity_input));
						if (value == 1) {
							$('#adv-radio-' + activity_input['activity_id']).prop('checked', true);
						}
						else if (value == 2) {
							$('#exp-radio-' + activity_input['activity_id']).prop('checked', true);
						}
						else {
							$('#mas-radio-' + activity_input['activity_id']).prop('checked', true);
						}
						
						console.log(activity_input);

						// increment for future rows added
						activity_input['activity_id'] = activity_input['activity_id'] + 1;
						activity_input['counter'] = activity_input['counter'] + 1;
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
    
    // function addRow() {
    //     if (input.activity_id >= 9){
    //         return;
    //     }
    //     $(".row-modifier-icon").html('<button type="button" class="tag remove-btn"><i class="fa fa-times" aria-hidden="true"></i></button>');
    //     $("#activity-list").append(template(input));
    //     input.activity_id = input.activity_id + 1;
    //     $(".add-btn").bind("click", addRow);
    //     $(".remove-btn").bind("click", deleteRow);
    // };

    // function deleteRow() {
    //     $(this).parent().parent().remove();
    // };

});