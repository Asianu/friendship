var strg = window.localStorage;

$(document).ready(function(){

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
		window.location.reload();
	});
});
