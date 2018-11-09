var strg = window.localStorage;

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
					strg.setItem('signin_token', true);

					var input = {
						'username' : $('#formGroupSignInUsername').val(),
						'password' : $('#formGroupSignInPassword').val()
					};

					strg.setItem('user', JSON.stringify(input));
				}
				form.classList.add('was-validated');
			}, false);
		});
	}, false);


});
