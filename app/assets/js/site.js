$(function () {
	$('.btn-pop3').pkpopup({
		url: 'popup3.jade',
		data: {name: 'Khanh'},
		modal: true,
		onCallback: function() {
			$('.btn-close').on('click', function() {
				$('.btn-pop3').pkpopup('closePopup')
			});
		},
		css: {
			width: '300px',
			height: '200px',
			left: '20%'
		}
	});
	$('.btn-pop4').pkpopup({
		url: 'popup3.jade',
		data: {name: 'Hoang'},
		modal: true,
		onCallback: function() {
			console.log('onCallback called');
			$('.btn-close').on('click', function() {
				$('.btn-pop4').pkpopup('closePopup')
			});
		}
	});
});