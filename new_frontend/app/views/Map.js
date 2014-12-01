module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	className: 'mapContainer',
	template: '#map-template',
	onRender: function() {
		var mapOptions = {
			center: { lat: -34.397, lng: 150.644},
			zoom: 8
		};
		var map = new google.maps.Map(this.el, mapOptions);
	}
});