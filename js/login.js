var strg = window.localStorage

$(document).ready(function() {
	window.addEventListener('load', function() {
		// Fetch all the forms we want to apply custom Booststrap validation styles to
		var forms = $('.needs-validation');
		// Loop over them and prevent submission
		var validation = Array.prototype.filter.call(forms, function(form) {
			form.addEventListener('submit', function(event) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}
				else {
					console.log('user has logged in');
					strg.setItem('login_token', true);

					var input = {
						'username' : $('#formGroupLoginUsername').val(),
						'password' : $('#formGroupLoginPassword').val()
					};

					strg.setItem('user', JSON.stringify(input));
				}
				form.classList.add('was-validated');
			}, false);
		});
	}, false);

	// $('#login-button').click(function(e){
	// 	e.preventDefault(e);

	// 	var input = {
	// 		'username' : $('#formGroupLoginUsername').val(),
	// 		'password' : $('#formGroupLoginPassword').val()
	// 	};

	// 	// TODO: input some kind of check for user and password fields

	// 	console.log('user has logged in');

	// 	strg.setItem('user', JSON.stringify(input));

	// 	console.log(strg);
	// });

});
