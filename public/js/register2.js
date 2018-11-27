var strg = window.localStorage;

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
        $(".add-btn").bind("click", addRow);
        input.argument_id = input.argument_id + 1;
    };

    function deleteRow() {
        
    }

});