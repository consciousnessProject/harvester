(function () {
    'use strict';

    function extend(dust) {
        /**
         * Modify the dust object as you wish. For example:
         *
         *   dust.helpers.myHelper = function (chk, context, bodies, params) {
         *       // Do something here...
         *   }
         */
    }

    if (typeof module !== "undefined") {
        /*global module:false */
        module.exports = extend;
    }
    else if (typeof define !== "undefined") {
        define(function () {
            return extend;
        });
    }
}());
