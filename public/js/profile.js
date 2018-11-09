var strg = window.localStorage;

$(document).ready(function() {
	// pre-compile the template
	var source = $("#username-template").html();
	var template = Handlebars.compile(source);

	var parentDiv = $(".container")

	// put in simple data
	var context = {username: "Hello"};
	var html = template(JSON.parse(strg.getItem('user')));

	// inject html code into the page
	parentDiv.prepend(html);

});
