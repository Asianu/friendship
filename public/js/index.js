var strg = window.localStorage;

$(document).ready(function() {

	if (strg.getItem('signin_token') != 'true') {
		$('#landing-be').addClass('btn-disabled').removeClass('btn-secondary').attr('onclick', '#');
	}
	else {
		$('#landing-be').removeClass('btn-disabled').addClass('btn-secondary').attr('onclick', "window.location.href='profile.html'");
	}
});
