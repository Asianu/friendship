var strg = window.localStorage;

$(document).ready(function() {
	firebase.auth().onAuthStateChanged(function(user) {
		// pre-compile the template
		var template = Handlebars.compile($("#username-template").html());
		$("#profile_header").append(template(user));	
	});
});
