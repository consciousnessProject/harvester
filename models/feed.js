var vertexType = require('../config/globalTypes');

'use strict';

/**
 * This is a collection of the in and out edges.
 * @type {Array}
 */
var edges = new Array();
/**
 * This is the human readable name of the feed.
 * @type {string}
 */
var prettyName = '';
/**
 * This is the source URL that the feed will obtain data from.
 * @type {string}
 */
var sourceURL = '';

/**
 * This object represents a source for new data to be obtained.  It could be a Google feed (based on a company) or
 * an RSS/ATOM feed that pulls in data.
 *
 * @param {String} name The display name of the Feed
 * @param {String} source The URL the that will be read when this Feed is executed
 * @param {Object} relationships An optional list of edges to associate this Feed to.
 *
 * @return {Object} A Feed object composed of vertexType, name, source and edges.
 */
module.exports.create = function Feed(name, source, relationships) {
    edges = relationships || new Array();
    prettyName = name || '';
    sourceURL = source || '';

    if(prettyName == '' || url == '') {
        //TODO: I feel like I could error out better here.
        return {};
    } else {
        return {
            vertexType: vertexType.feed,
            name: prettyName,
            source: url,
            edges: edges
        };
    }
};

/**
 * This method returns the query string format of the object for interaction with Titian.
 */
module.exports.queryString = function queryString() {
    var returnString = 'type=' + vertexType.feed + '&name=' + prettyName + '&source=' + url;
    //TODO: Need to loop through the array to create add the relationships.
    return returnString;
};
