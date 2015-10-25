$(function () {
	$('.btn-custom').pkpopup({
		url: 'popup3.jade',
		modal: true,
		onCallback: function() {
			$('.btn-close').on('click', function() {
				$('.btn-custom').pkpopup('closePopup')
			});
		}
	});
});