define(['jquery', 'dust', 'core/viewRenderer', 'utils'], function ($, dust, ViewRenderer, utils) {
    'use strict';

    var extend  = utils.extend;
    var forEach = utils.forEach;

    /**
     * A Dust view rendering implementation
     * @constructor
     */
    function DustRenderer(nougat, defaultPath) {
        var DEFAULT_PATH = defaultPath || '/templates/%s.js',
            requestQueue = this.requestQueue = {},
            slice = Array.prototype.slice;

        function notify(name /*, args... */) {
            var args = slice.call(arguments, 1);

            forEach(requestQueue[name], function (callback) {
                callback.apply(null, args);
            });

            delete requestQueue[name];
        }

        dust.onLoad = function (name, callback) {
            // Get or create a callback queue for the template. If a template is
            // requested there's a chance subsequent requests could come in
            // prior to the original HTTP request being fulfilled, resulting in
            // multiple requests for the same template. Queueing requests
            // alleviates this issue.
            var queue = requestQueue.hasOwnProperty(name) ? requestQueue[name] : (requestQueue[name] = []),
                appContext = nougat.getContext(),
                options = null;

            queue.push(callback);

            if (queue.length > 1) {
                // All requests are queued, but only the first is allowed to
                // continue and request the template.
                return;
            }

            // Create an options object for the request. We do this instead of
            // the shorthand $.getScript(), because getScript aggressively busts
            // caching. We want to cache templates where possible.
            options = {
                url: (appContext.templatePath || DEFAULT_PATH).replace('%s', name),
                dataType: 'script',
                cache: true
            };

            function done(script) {
                notify(name, null, script);
            }

            function fail(jqhxr, settings, err) {
                notify(name, err);
            }

            $.ajax(options).done(done).fail(fail);
        };
    }

    DustRenderer.prototype = extend({}, ViewRenderer.prototype, {
        _doRender: function (template, context, callback) {
            var base = {};
            context = context || {};

            if (context.content) {
                base.cn = context.content;
                delete context.content;
            }

            context = dust.makeBase(base).push(context);
            dust.render(template, context, callback);
        }
    });

    return DustRenderer;
});
