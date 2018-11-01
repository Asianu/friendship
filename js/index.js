/* Filename: index.js
 * Description: javascript file for index.html
 */

// finds the a element in a landing-card and goes to that link
$(".landing-card").click(function() {
	window.location = $(this).find("a").attr("href");
	return false;
});