var strg = window.localStorage;

$(document).ready(function(){

	console.log(strg);

	if (strg.getItem('login_token') != 'true') {
		console.log('user has not logged in yet');
		$('#nav-user').hide();
		$('#nav-login').show();
	}
	else {
		console.log('user is logged in')
		$('#nav-user').show();
		$('#nav-login').hide();
	}
});
