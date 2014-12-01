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
});

Engine.addInitializer(function(options){
  //new MyAppRouter();
	Backbone.history.start();
});
document.onready = function() {
	console.log('starting');
	Engine.start();
}