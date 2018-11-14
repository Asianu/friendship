var strg = window.localStorage;

$(document).ready(function() {

	var ui = new firebaseui.auth.AuthUI(firebase.auth());
	ui.start('#firebaseui-auth-container', {
		callbacks: {
		    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
				// User successfully signed in.
				// Return type determines whether we continue the redirect automatically
				// or whether we leave that to developer to handle.
				strg.setItem('signin_token', true);
				strg.setItem('user', JSON.stringify(firebase.auth().currentUser));
				return true
		    },
		    uiShown: function() {
				// The widget is rendered.
				// Hide the loader.
				document.getElementById('loader').style.display = 'none';
		    }
		},
		// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
		signInFlow: 'popup',
		// TODO: use this when we deploy
		// signInSuccessUrl: 'http://cse170-launchpad.firebaseapp.com',
		signInSuccessUrl: 'http://localhost:5000/',
		signInOptions: [
			// Leave the lines as is for the providers you want to offer your users.
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			// firebase.auth.FacebookAuthProvider.PROVIDER_ID,
			// firebase.auth.TwitterAuthProvider.PROVIDER_ID,
			// firebase.auth.GithubAuthProvider.PROVIDER_ID,
			// firebase.auth.EmailAuthProvider.PROVIDER_ID,
			// firebase.auth.PhoneAuthProvider.PROVIDER_ID
		]
	});



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
