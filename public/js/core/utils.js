define(function () {
    'use strict';

    /**
     * A simple object extend implementation that copies properties from several
     * source objects into the destination object.
     *
     * @param {Object} dest the object to which the properties should be copied
     * @param {Object...} sources the objects from which the properties should
     *      be copied
     */
    function extend(dest) {
        forEach(Array.prototype.slice.call(arguments, 1), function (src) {
            mixin(src, dest);
        });

        return dest;
    }

    /**
     * Creates a new array with all elements that pass the test implemented by
     * the provided function. The filter callback receives three arguments: the
     * value of the element, the index of the element, and the Array object
     * being traversed.
     *
     * @param {Array} arr the array to filter
     * @param {Function} fn the function defining the filter test, returning true to keep and false to discard.
     * @param {Object} [context] Object to use as this when executing callback.
     */
    function filter(arr, fn, context) {
        if (Array.prototype.filter) {
            return arr.filter(fn);
        }

        var result = [],
            length = arr.length - 1,
            value;

        while (length > -1) {
            value = arr[length];

            if (fn.call(context, value, length, arr)) {
                result.unshift(value);
            }

            length--;
        }

        return result;
    }

    /**
     * Executes a provided function once per array element or object property.
     * Based on http://es5.github.com/#x15.4.4.18
     *
     * @param {Object} obj the array or object to enumerate
     * @param {Function} fn the function to invoke on each element
     * @param {Object} [context] Object to use as this when executing callback.
     */
    function forEach(obj, fn, context) {
        if (obj instanceof Array && Array.prototype.forEach) {
            return obj.forEach(fn, context);
        }

        var prop,
            result;

        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                result = fn.call(context, obj[prop], prop, obj);

                // Provide the ability to short circuit and fail-fast
                if (result === false) {
                    break;
                }
            }
        }
    }

    /**
     * A basic object mixin implementation. Copies the properties from the
     * source object to the destination object.
     *
     * @param {Object} src the object containing the properties to be copied
     * @param {Object} dest the object to which the properties should be copied
     */
    function mixin(src, dest) {
        var prop;

        for (prop in src) {
            if (src.hasOwnProperty(prop)) {
                dest[prop] = src[prop];
            }
        }

        return dest;
    }

    return {
        extend : extend,
        filter : filter,
        forEach: forEach,
        mixin  : mixin
    };
});
