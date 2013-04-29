var http = require('http');
var Feed = require('../models/feed');
var vertexType = require('../config/globalTypes');
var titan = require('../modules/titan');

//var consciousnessData;


//TODO - TOOLS: Grex is a JS framework that is like Gremlin for Rexter: https://github.com/entrendipity/grex
//TODO - DATA: http://www.google.com/finance/company_news?q=NASDAQ%3AEBAY -> Gets news
//TODO - DATA: http://www.google.com/finance?q=EBAY -> Gets current price & related companies.

//TODO - DATA: could create and email alert for CEO and gang here: http://www.google.com/alerts?t=1&q=%22John+J.+Donahoe%22&hl=en

//{"version":"2.3.0","name":"consciousness","graph":"titangraph[local:\/Users\/scatoe\/projects\/other\/consciousness\/titanDatabase]","features":{"ignoresSuppliedIds":true,"supportsTransactions":true,"supportsSelfLoops":true,"supportsEdgeRetrieval":true,"supportsBooleanProperty":true,"supportsEdgeKeyIndex":false,"supportsUniformListProperty":true,"supportsThreadedTransactions":true,"isPersistent":true,"supportsVertexIndex":false,"supportsStringProperty":true,"supportsIntegerProperty":true,"isWrapper":false,"supportsMixedListProperty":true,"supportsVertexKeyIndex":true,"isRDFModel":false,"supportsLongProperty":true,"supportsVertexIteration":true,"supportsEdgeProperties":true,"supportsKeyIndices":true,"supportsEdgeIteration":true,"supportsPrimitiveArrayProperty":true,"supportsVertexProperties":true,"supportsDoubleProperty":true,"supportsSerializableObjectProperty":true,"supportsIndices":false,"supportsEdgeIndex":false,"supportsMapProperty":true,"supportsFloatProperty":true,"supportsDuplicateEdges":true},"readOnly":false,"type":"com.thinkaurelius.titan.graphdb.database.StandardTitanGraph","queryTime":16.060928,"upTime":"0[d]:00[h]:00[m]:28[s]"}


exports = module.exports = function (server) {
    'use strict';

    /**
     * This will get either the specified feed or all the feeds that are known.
     * @param {Object} req the HTTP request object
     * @param {Object} res the HTTP response object
     */
    server.get('/feed:format', function (req, res) {
        //Get the list of feeds from the database.
        titian.getAllVertices(vertexType.feed, function (resultsArray, errors) {

            //TODO: This model is not very clear as it is not defined in it's own object.
            switch (req.param.format) {
                //If the URL requested HTML the render the model to the view.
                case ".html" :
                    res.render('feed', { feeds: resultsArray });
                    break;
                default :
                    //Otherwise, just push the data model out.
                    res.json({ feeds: resultsArray });
            }
        });
    });
    /**
     * This will get the feed based on the id provided in the request.
     *
     * TODO: This should push a JSON response back to the page which shows the details in a DIV.
     *
     * @param {Object} req the HTTP request object
     * @param {Object} res the HTTP response object
     */
    server.get('/feed/:id:format', function (req, res) {
        //Get the feed from the database.
        titan.getVertex(req.param.id, function (result, errors) {
            //TODO: This model is not very clear as it is not defined in it's own object.
            switch (req.param.format) {
                //If the URL requested HTML the render the model to the view.
                case ".html" :
                    res.render('feed', { feed: result });
                    break;
                default :
                    //Otherwise, just push the data model out.
                    res.json({ feed: result });
            }
        });
    });
    /**
     * This will update the put data into the database as a feed.
     * @param {Object} req the HTTP request object
     * @param {Object} res the HTTP response object
     */
    server.put('/feed', function (req, res) {
        //Create the feed object from the request.
        var feed = Feed.create(req.body);
        //Update the feed into the database.
        //update(feed);
    });
    /**
     * This will add the feed in the database with the post data.
     * @param {Object} req the HTTP request object
     * @param {Object} res the HTTP response object
     */
    server.post('/feed', function (req, res) {
        //Create the feed object from the request.
        var feed = Feed.create(req.body.name, req.body.source, null);
        //Create the feed into the database.
        //TODO: I could render the page and only update the view if there is an error.
        //TODO: if I did such a thing, then the render could happen after the callback close.
        titan.saveVertex(feed, function (result, error) {
            res.render('index', feed);
        });
    });
    /**
     * This will delete the feed in the database.
     * @param {Object} req the HTTP request object
     * @param {Object} res the HTTP response object
     */
    server.delete('/feed/:id', function (req, res) {
        var feedId = req.param.id;
        //delete(feedId);
    });




};