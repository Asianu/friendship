var strg = window.localStorage;

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

		        	firebase.database().ref('/profiles/' + profile_id).set(profile);
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

	// populate specific activity row, figure out a way here to implement a listener that will call this *again*
	var input = {
		activity_id: 1
	};
	var template = Handlebars.compile($("#form-activity-row-template").html());
    //$("#activity-list").append(template(input));
    addRow();

	// make sure name field is properly generated
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		var name_template = Handlebars.compile($("#form-name-value-template").html());
		$(name_template(user)).insertAfter('#form-name-label');
	  }
	});

	$(".retHomeBtn").click(function() {
		window.location = $(this).find("a").attr("href");
		return false;
    });
    
    function addRow() {
        $(".row-modifier-icon").html('<button type="button" class="tag remove-btn"><i class="fa fa-times" aria-hidden="true"></i></button>');
        $("#activity-list").append(template(input));
        input.activity_id = input.activity_id + 1;
        $(".add-btn").bind("click", addRow);
    };

    $(".remove-btn").click(function() {
        $("div").remove(this.parent());
    });

});