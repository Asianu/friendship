var creds = {
	'user': 'cse170-team-friendship',
	'password': 'launchpad'
};

var strg = window.localStorage;

$(document).ready(function(){
	console.log('Hello World');

	console.log(strg);

	if (strg.getItem('login_token') == null || strg.getItem('login_item') == false) {
		console.log('user has not logged in yet');
		$('#user-icon').hide();
		$('#login-button').show();
	}
	else {
		console.log('user is logged in')
		$('#user-icon').show();
		$('#login-button').hide();
	}
});
