/**
 * This method will save a vertex.
 * @param {Object} vertex - A model object of type vertex (that contains a queryString method).
 * @param {Function} callback - The function that the model result will be returned to.
 */
module.exports.saveVertex = function saveVertex(vertex, callback) {
    'use strict';//TODO: Should this be pulled up outside of this function.

    console.log('Entering saveVertex(vertex)');
    var options = {
        hostname:'localhost',//TODO: Get this from global config
        port:8182,//TODO: Get this from global config.
        path:'/graphs/consciousness/vertices?' + vertex.queryString,//TODO: Get the database from global config.
        method: "POST"
    };
    console.log('saveVertex request options: ' + JSON.stringify(options));
    var request = http.request(options, function (response) {
        console.log('saveVertex response code: ' + response.statusCode);
        console.log('saveVertex response headers: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        var responseText = '';
        response.on('data', function (chunk) {
            responseText = responseText + chunk;
        });
        response.on('error', function (chunk) {
            console.log('There was an error in the response: ' + response.error);
        });
        response.on('end', function () {
            console.log("saveVertex responseText=" + responseText);
            //TODO: I am going to need to parse out the Titan response values and return
            //TODO: just the results aspect.
            callback(JSON.parse(responseText));
        });
    });
    request.on('error', function (error) {
        console.log("Error in request: " + error);
    });
    request.end();
    console.log("Exiting saveVertex(vertex)");
};

/**
 * This method will get all vertices of the specified type and return the results to the callback
 * @param {String} type - This is the type of the vertex that we are searching for.
 * @param {Function} callback - This is the function that the model will be returned to.
 */
module.exports.getAllVertices = function getAllVertices(type, callback) {
    'use strict';

    console.log('Entering getAllVertices(' + type + ')');
    var options = {
        hostname:'localhost',
        port:8182,
        path:'/graphs/consciousness/vertices?type' + type,
        method: "GET"
    };
    console.log('getAllVertices request options: ' + JSON.stringify(options));
    var request = http.request(options, function (response) {
        console.log('getAllVertices response code: ' + response.statusCode);
        console.log('getAllVertices response headers: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        var responseText = '';
        response.on('data', function (chunk) {
            responseText = responseText + chunk;
        });
        response.on('error', function (chunk) {
            console.log('There was an error in the response: ' + response.error);
        });
        response.on('end', function () {
            console.log("getAllVertices responseText=" + responseText);
            //TODO: I am going to need to parse out the Titan response values and return
            //TODO: just the results aspect.
            callback(JSON.parse(responseText));
        });
    });
    request.on('error', function (error) {
        console.log("Error in request: " + error);
    });
    request.end();
    console.log('Exiting getAllVertices(' + type + ')');
};