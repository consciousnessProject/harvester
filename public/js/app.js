define(['nougat', 'jquery', 'BaseView'], function(nougat, $, BaseView) {

	'use strict';

	var AppView = BaseView.extend({

		initialize: function() {
			/*global console:false */
			if (console && console.log) {
				console.log('initialized');
			}
		}

	});


	$(function() {
		// Set the app view on the global context
		// so we don't lose the reference and get
		// our app garbage collected unknowningly.
		var context = nougat.getContext();
		context.app = new AppView();
	});

});
