
$("#cancelButton").click(function() {
	window.location = $(this).find("a").attr("href");
	return false;
});

$('#exampleModal').on('shown.bs.modal', function () {
	$('#exampleModal').trigger('focus')
  })