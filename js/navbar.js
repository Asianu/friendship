var strg = window.localStorage;

$(document).ready(function(){

	console.log(strg);

	if (strg.getItem('login_token') != 'true') {
		console.log('user has not logged in yet');
		$('#nav-signout, #nav-collapse-signout, #nav-user, #nav-collapse-user').hide();
		$('#nav-login, #nav-collapse-login').show();
	}
	else {
		console.log('user is logged in')
		$('#nav-signout, #nav-collapse-signout, #nav-user, #nav-collapse-user').show();
		$('#nav-login, #nav-collapse-login').hide();
	}

	$('#nav-signout, #nav-collapse-signout').click(function() {
		console.log('user is signing out');
		strg.removeItem('user');
		strg.setItem('login_token', false);
		window.location.reload();
	});
});
