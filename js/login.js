var strg = window.localStorage

$(document).ready(function() {

	$('#login-button').click(function(e){
		e.preventDefault(e);

		var input = {
			'username' : $('#formGroupLoginUsername').val(),
			'password' : $('#formGroupLoginPassword').val()
		};

		// TODO: input some kind of check for user and password fields

		console.log('user has logged in');

		strg.setItem('user', JSON.stringify(input));

		console.log(strg);
	});

});
