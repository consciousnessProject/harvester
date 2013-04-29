'use strict';

var path = require('path');

var cluster = require('cluster');
var express = require('express');
var webcore = require('webcore');

var config  = webcore.config;
var dust    = webcore.dust;
var rc      = webcore.rescompiler;
var routes  = webcore.routes;

// Setup the application environment and global context
process.chdir(__dirname);
config.init(process.cwd());

// Initialize any dust extensions.
dust.extend(config.get('dust:extensions') || []);

// Initialize any dust render helpers.
dust.addRenderHelper(config.get('dust:renderHelpers') || []);

// Create and configure server
var server = express();

// XXX: The following configure statements are *order-specific* as
// middleware is evaluated in the order it's registered and
// conditionally included per environment.

// First, register development-only middleware.
server.configure('development', function () {
	// Compile static resources on-the-fly.
	server.use(rc.middleware({
		src: config.get('paths:resourceRoot'),
		dest: config.get('paths:staticRoot')
	}));

	// Customize X-Powered-By header.
	server.use(function (req, res, next) {
		res.header('X-Powered-By', 'Webcore/' + webcore.version);
		next();
	});
});

// No X-Powered-By in production.
server.configure('production', function () {
	server.disable('x-powered-by');
});

// Second, add the standard middleware
server.configure(function () {
	server.use(express.favicon());
	server.use(express.logger());
	server.use(express.bodyParser());

	/**
	 * Session Support
	 *
	 * To enable session support in your application, uncomment the code below.
	 * The session secret is an argument to the `cookieParser` middleware.
	 *
	 * The out-of-the-box session middleware IS NOT RECOMMENDED FOR PRODUCTION
	 * USE and additional configuration is required. Usually that means
	 * configuring an alternate session store. Additionally, the`session`
	 * middleware has a dependency on `cookieParser` middleware and must come
	 * AFTER `cookieParser` in the middleware stack.
	 *
	 * Caveat emptor.
	 */
	server.use(express.cookieParser(/*config.get('session:secret')*/));
	//server.use(express.session());

	server.use(server.router);
	server.use(express['static'](config.get('paths:staticRoot')));
});

// Third, add debugging info for pre-prod environments...
server.configure('development', 'staging', function () {
	server.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

// ...but for prod do not print error details.
server.configure('production', function () {
	server.use(express.errorHandler());
});

// Next, set up the Dust renderer.
server.configure(function () {
	server.engine('dust', dust.render);
	server.set('view engine', 'dust');
	server.set('views', config.get('paths:viewPath'));
});

server.configure('production', function () {
	server.engine('js', dust.render);
	server.set('view engine', 'js');
	server.set('views', path.join(config.get('paths:staticRoot'), 'templates'));
});

// Finally, setup routes.
server.configure(function () {
	routes.scan(server, config.get('paths:routeRoot'));
});

// Kick off server startup
// In the future may use cluster2 (http://ql-io.github.com/cluster2/) by eBay,
// but it's pretty heavyweight for our current needs. Also, we'll probably
// implement monitoring separate from a clustering implementation.
if (!config.get('env:development') && cluster.isMaster) {
	var cores = require('os').cpus().length;

	while (cores--) { cluster.fork(); }

	cluster.on('exit', function () {
		cluster.fork();
	});
} else {
	var port = config.get('port');

	server.listen(port, function () {
		console.log('Server running at http://localhost:%s/', port);
	});
}
