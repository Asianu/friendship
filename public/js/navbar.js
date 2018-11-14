var strg = window.localStorage;

$(document).ready(function(){
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyCC10Foydrc3wvtIebKN1kys_LoL40QU7Y",
		authDomain: "cse170-launchpad.firebaseapp.com",
		databaseURL: "https://cse170-launchpad.firebaseio.com",
		projectId: "cse170-launchpad",
		storageBucket: "cse170-launchpad.appspot.com",
		messagingSenderId: "80394625965"
	};
	firebase.initializeApp(config);

	console.log(strg);

	if (strg.getItem('signin_token') != 'true') {
		console.log('user has not logged in yet');
		$('#nav-signout, #nav-collapse-signout, #nav-user, #nav-collapse-user').hide();
		$('#nav-signin, #nav-collapse-signin').show();
		$('#nav-be').addClass('disabled').attr('href', '#');
	}
	else {
		console.log('user is logged in')
		$('#nav-signout, #nav-collapse-signout, #nav-user, #nav-collapse-user').show();
		$('#nav-signin, #nav-collapse-signin').hide();
		$('#nav-be').removeClass('disabled').attr('href', 'register.html');
	}

	$('#nav-signout, #nav-collapse-signout').click(function() {
		console.log('user is signing out');
		strg.removeItem('user');
		strg.setItem('signin_token', false);
		firebase.auth().signOut().then(function () {
			console.log('sign out successful');
		}).catch(function(error) {
			console.log('sign out error');
		});

		window.location.replace('http://localhost:5000');
		// TODO: use below code during deploy
		// window.location.replace('http://cse170-launchpad.firebaseapp.com');
	});
});
