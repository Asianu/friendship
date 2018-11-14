var strg = window.localStorage;

$(document).ready(function() {
	// pre-compile the template
	var template = Handlebars.compile($("#username-template").html());

	// inject html code into the page
	$(".container").prepend(template(JSON.parse(strg.getItem('user'))))
});
