var strg = window.localStorage;

$(document).ready(function() {
	var ui = new firebaseui.auth.AuthUI(firebase.auth());
	ui.start('#firebaseui-auth-container', {
		callbacks: {
		    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
				// User successfully signed in.
				// Return type determines whether we continue the redirect automatically
				// or whether we leave that to developer to handle.
				
				// TODO: use localhost for development, cse170-* for deployment
				// redirectUrl = 'http://localhost:5000';
				redirectUrl = 'https://cse170-launchpad.firebaseapp.com';

				strg.setItem('signin_token', true);

				// add the user to the database if does not exist
				firebase.auth().onAuthStateChanged(function(user) {
					if (user) {
						var userRef = firebase.database().ref('users');
						var userExists = false;
						userRef.child(user.uid).once('value').then(function(snapshot) {
							userExists = snapshot.exists();
						}).then(function() {
							if(!userExists){
								console.log('signing up user ' + user.displayName);
								firebase.database().ref('/users/' + user.uid).set({
									'displayName': user.displayName,
									'email': user.email,
									'phoneNumber': user.phoneNumber,
									'photoURL': user.photoURL,
									'providerId': user.providerId,
									'mentor_list': firebase.database().ref('mentor_list').child(user.uid).push().key,
									'mentee_list': firebase.database().ref('mentee_list').child(user.uid).push().key
								}).then(function() {
									window.location.replace(redirectUrl);
								}).catch(function(err) {
									console.log('err', err);
								});
							}
							else {
								console.log('singing in existing user ' + user.displayName);
								window.location.replace(redirectUrl);
							}
						});	
					}
				});

				return false;
		    },
		    uiShown: function() {
				// The widget is rendered.
				// Hide the loader.
				document.getElementById('loader').style.display = 'none';
		    }
		},
		// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
		signInFlow: 'default',
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


});
