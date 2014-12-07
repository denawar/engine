(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Views = require('./views');

var Engine = new Backbone.Marionette.Application({container: '#app'});

Engine.addRegions({
	map: '#map',
	deck: '#deck'
});

Engine.addInitializer(function(options){
	var map = new Views.Map();
	Engine.map.show(map);

	var deck = new Views.Deck();
	Engine.deck.show(deck);

	deck.on('showPlace', map.showPlace);
	map.on('map:showPlaceModal', function() {
		console.log(arguments)
	});
});

Engine.addInitializer(function(options){
  //new MyAppRouter();
	Backbone.history.start();
});
document.onready = function() {
	Engine.start();
}
},{"./views":10}],2:[function(require,module,exports){
var Models = require('../models');

module.exports = Backbone.Collection.extend({
	model: Models.Place,
	url: '/places'
});
},{"../models":6}],3:[function(require,module,exports){
module.exports = {
	Places: require('./Places.js')
}
},{"./Places.js":2}],4:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: '/places',
	vote: function() {
		return $.when($.put('/places/' + this.id + '/vote'));
	}
});
},{}],5:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: '/users',
	auth: function(email, password) {
		var url = '/auth';
		return $.when($.post({
			url: url,
			body: {
				email: email,
				password: password
			}
		}));
	}
});
},{}],6:[function(require,module,exports){
module.exports = {
	Place: require('./Place.js'),
	User: require('./User.js')
}
},{"./Place.js":4,"./User.js":5}],7:[function(require,module,exports){
var Models = require('../models');
var Collections = require('../collections');
var OnePlace = require('./OnePlace');

module.exports = Marionette.CompositeView.extend({
	template: "#deck-template",
	model: new Models.User(),
	childView: OnePlace,
	collection: new Collections.Places(),
	childViewContainer: '.places',
	initialize: function() {
		this.collection.fetch();
	}

});
},{"../collections":3,"../models":6,"./OnePlace":9}],8:[function(require,module,exports){
var Collections = require('../collections');

module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	className: 'mapContainer',
	template: '#map-template',
	onRender: function() {
		var mapOptions = {
			center: { lat: window.config.lat, lng: window.config.lon},
			zoom: window.config.zoom,
			disableDefaultUI: true
		};
		this.map = new google.maps.Map(this.el, mapOptions);
		this.places = new Collections.Places();
		this.places.fetch().then(this.showMarkers.bind(this));
		this.handleMapEvents();
	},
	showMarkers: function(places) {
		places.forEach(this.drawMarker.bind(this));
	},
	drawMarker: function(place) {
		var position = place.latlng.split(';');
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(position[0], position[1]),
			map: this.map
		});
		var that = this;
		google.maps.event.addListener(marker, 'click', function(e) {
			that.map.setCenter(marker.getPosition());
			that.trigger('map:showPlaceModal', place);
		});
	},
	showPlace: function() {
		debugger;
	},
	handleMapEvents: function() {

	}
});
},{"../collections":3}],9:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#one-place-template',
	className: 'onePlace',
	triggers: {
		"click": "showPlace"
	},
	templateHelpers: function () {
		return {
			time: function(){
				return moment(this.created_at).format('DD.MM.YYYY');
			}
		}
	}
});
},{}],10:[function(require,module,exports){
module.exports = {
	Map: require('./Map.js'),
	Deck: require('./Deck.js')
}
},{"./Deck.js":7,"./Map.js":8}]},{},[1]);
