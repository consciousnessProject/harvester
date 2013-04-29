/*
 * nougat.js v0.0.1 - Application Mediator/Sandbox Library
 * This module performs the function of mediator/sandbox.
 *
 * @author Erik Toth <ertoth@paypal.com>
 */

define(['utils'], function (utils) {
	'use strict';

	var filter  = utils.filter;
	var forEach = utils.forEach;
	var mixin   = utils.mixin;

	function Nougat() {
		this._context = {};
		this._eventCache = {};
	}

	Nougat.prototype = {

		/**
		 * Register an event listener with the provided callback and optional context.
		 * @param {String} event a space separated list of events to bind
		 * @param {Function} callback the method to be invoked when an event is dispatched
		 * @param {Object} [context] the context the callback should have (value of "this") when the callback is invoked
		 */
		on : function (event, callback, context) {
			var cache = this._eventCache;

			forEach(event.split(/\s+/), function (event) {
				var descriptors = cache[event] || (cache[event] = []);

				descriptors.push({
					name    : event,
					callback: callback,
					context : context
				});
			});
		},

		/**
		 * Stops listening for events that meet the provided criteria
		 * @param {String} [event] a list of events to bind separated by whitespace
		 * @param {Function} [callback] the method to be invoked when an event is dispatched
		 * @param {Object} [context] the context the callback should have (value of "this") when the callback is invoked
		 */
		off : function (event, callback, context) {
			var cache  = this._eventCache,
				events = event ? Object(event.split(/\s+/)) : null,
				matcher;

			// Optimization for event-name only calls
			if (events && !callback && !context) {
				forEach(events, function (evt) {
					delete cache[evt];
				});

				return;
			}

			matcher = {
				callback: callback,
				context: context
			};

			// Scan the cache looking for events that meet the criteria to remove listeners
			forEach(cache, function (descriptors, name) {
				if (!events || events.hasOwnProperty(name)) {
					cache[name] = filter(descriptors, function (descriptor) {
						var keep = false;

						forEach(matcher, function (value, key) {
							if (value && value !== descriptor[key]) {
								// If a value is defined but doesn't match, flag the event descriptor
								// as 'keep'.
								keep = true;
							}

							return !keep;
						});

						return keep;
					});
				}
			});
		},

		/**
		 * Publish the given event, invoking callback with the optionally provided data
		 * @param {String} event the name of the event to dispatch
		 * @param {Object} [args...] any values that should be passed to listeners as arguments
		 */
		trigger : function (event) {
			var cache = this._eventCache,
				data  = Array.prototype.slice.call(arguments, 1),
				descriptors;

			forEach(event.split(/\s+/), function (event) {
				descriptors = cache[event] || [];

				forEach(descriptors, function (descriptor) {
					descriptor.callback.apply(descriptor.context, data);
				});
			});
		},

		/**
		 *
		 * @param context
		 * @returns
		 */
		setContext : function (context) {
			return mixin(context, this._context);
		},

		/**
		 *
		 * @returns the current context object
		 */
		getContext : function () {
			return this._context;
		}

	};

	return new Nougat();
});
