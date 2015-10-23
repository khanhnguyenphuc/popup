
var ui = {
	popup1: 
		'<div class="box-popup">' +
		'<h1>This is my popup plugin</h1>' +
		'<div class="content">' +
			'aldfjldksfla' +
			'adsklfjdkasf' +
			'adklfjdkls' +
		'</div>' +
		'</div>'
};
$(function () {
	$('#show-pop1').click(function() {
		// $.get( "popup1.html", function( data ) {
		//   $( "#desc" ).html( data );
		//   alert( "Load was performed." );
		// });
		// var $html = $.get("popup1.html");
		// console.log($html)
		var $popup = $(ui.popup1);
		$popup.appendTo($('body'));
	});
});