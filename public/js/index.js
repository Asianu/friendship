var strg = window.localStorage;

$(document).ready(function() {

	if (strg.getItem('signin_token') != 'true') {
		$('#landing-be').addClass('btn-disabled').removeClass('btn-secondary').attr('onclick', 'window.location.href=#');
		$('#landing-find').addClass('btn-disabled').removeClass('btn-primary').attr('onclick', 'window.location.href=#');
	}
	else {
		$('#landing-be').removeClass('btn-disabled').addClass('btn-secondary').attr('onclick', "window.location.href='profile.html'");
		$('#landing-find').removeClass('btn-disabled').addClass('btn-primary').attr('onclick', "window.location.href='find.html'");
		$('.sign-in-message').hide();
	}
});
