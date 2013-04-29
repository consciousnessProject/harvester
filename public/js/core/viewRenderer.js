define(['jquery'], function ($) {
    'use strict';

    /**
     * An abstract view renderer implementation that"s based on Promises
     * @constructor
     */
    function ViewRenderer() {
        // Intentionally left blank
    }

    ViewRenderer.prototype = {

        /**
         * The main public API for rendering a template
         * @param template the name of the template to render
         * @param context the context to pass to the renderer
         * @returns a Promise
         */
        render: function (template, context) {
            var deferred = new $.Deferred();

            this._doRender(template, context, function (err, out) {
                if (err) { return deferred.reject(err); }

                deferred.resolve(out, template);
            });

            return deferred.promise();
        },

        /**
         * The method to override to provide the view rendering implementation
         * @private
         * @param template the name of the template to render
         * @param context the content to pass to the renderer
         * @param callback the callback invoked when rendering is complete
         */
        _doRender: function (template, context, callback) {
            // TODO: Implement
        }
    };

    return ViewRenderer;
});
