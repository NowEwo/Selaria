
/**
 * The main class
 */
var webservo = function() {

	this.initModules();

	this.isInitiated = false;
	this.isRunning = false;
	this.isSilent = false;
	this.hasError = false;
	this.cache = {};
	this.configData = {};
	this.setDir(process.cwd());

	this.aliasRecursion = 100;

	this.protocol = 'http';
};


/**
 * Initialize the modules
 */
webservo.prototype.initModules = function() {
	// init the modules
	this.modules = {};
	this.modules.fs = require('fs');
	this.modules.os = require('os');
	this.modules.sd = require('node-screwdriver');
	this.modules.url = require('url');
	this.modules.http = require('http');
	this.modules.mime = require('mime');
	this.modules.path = require('path');
	this.modules.https = require('https');
	this.modules.busboy = require('busboy');
	this.modules.colors = require('colors');
	this.modules.child_process = require('child_process');
};

/**
 * Set the server directory. Chainable
 * @param {string} dir The directory, relative or absolute
 */
webservo.prototype.setDir = function(dir) {

	// server is not running
	if (this.isRunning === true)	{
		this.warning('Cannot set the server directory while the server is running');
		return this;
	}
	
	// init the dir object
	this.dir = {};
	this.dir.base = this.modules.path.resolve(dir+'/');

	// check if the config is loaded
	if (this.configData && this.configData.server && this.configData.server.dir) {
		// set the www directory
		this.dir.www = this.modules.path.resolve(this.dir.base+'/'+this.configData.server.dir+'/');
	}

	this.isInitiated = false;

	return this;
};

/**
 * Set silent mode on and off. Chainable
 */
webservo.prototype.silent = function (b) {
    if (typeof b === "undefined") {
    	b = true;
    }
    this.isSilent = b;
    return this;
};

/**
 * Exit the process on error
 */
webservo.prototype.exitOnError = function(callback) {
	if (this.hasError) {
		process.exit();
	}
	return this;
};

/**
 * Stop the server. Chainable
 * @param  {Function} callback Called when done
 */
webservo.prototype.stop = function(callback) {

	// server is not running
	if (this.isRunning === false)	{
		this.warning('Stop: the server is not running');
		return this;
	}
	
	var ws = this;

	// stop the server
	this.server.close(function(){
        ws.log('Server stopped');

        // call the callback
        if (callback) {
        	callback(ws);
        }
    });
	return this;
};

/**
 * Start the server. Chainable
 * @param  {Function} callback Called when done
 */
webservo.prototype.start = function(callback) {
	if (this.isRunning === true)	{
		this.warning('Start: the server is already running');
		return this;
	}

	// init the server
	if (this.isInitiated === false)	{
		this.config();
	}

	// the server could not init
	if (this.isInitiated === false)	{
		// exit with failure code
		this.isRunning = false;
		this.error('Failed to load the server');
		return this;
	}

	var ws = this;

	function handleRequest(request, response) {

		if (ws.configData.methods.allowed) {
			if (ws.configData.methods.allowed.indexOf(request.method) == -1) {
	    		return ws.status405(request, response, 'Method not allowed: '+request.method);
		    }
		}

		// handle the OPTIONS method
		if (request.method == 'OPTIONS') {
			if (ws.configData.methods.allowed) {
				response.setHeader("Allow", ws.configData.methods.allowed.join(','));
			}
			return ws.status200(request, response, '');
		}

		try {
	    	var requestedFile = ws.getUrlFile(request.url);
			var parameters = ws.modules.url.parse(request.url, true);
			parameters = parameters.query;

			if (request.method == 'POST') {
	    		var busboy = new ws.modules.busboy({ headers: request.headers });

				busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
					if (filename != '') {
						// save file
					    var saveTo = ws.modules.path.join(ws.modules.os.tmpDir(), ws.modules.path.basename(fieldname)+'_'+Math.floor(Math.random() * 10000000000)+'_'+filename);
						var item = {
							fieldname: fieldname,
							filename: filename,
							encoding: encoding,
							mimetype: mimetype,
							tmpFile: saveTo,
							fileObject: file
						};
						file.pipe(ws.modules.fs.createWriteStream(saveTo));
					    parameters[fieldname] = item;
					    return true;
					} else {
						// discard file with no name
						file.resume();
						return false;
					}
				});
				busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
				    if (typeof parameters[fieldname] !== 'object') {
				    	parameters[fieldname] = val;
				    }
				});
				busboy.on('finish', function() {
					ws.process(request, response, requestedFile, parameters);
				});
				return request.pipe(busboy);
			}

			return ws.process(request, response, requestedFile, parameters);

	    } catch (e) {
	    	return ws.status500(request, response, ''+e);
	    }
	};

	if (this.configData.server.ssl.enabled) {
		try {
			var file_cert = this.modules.path.resolve(this.dir.base+'/'+this.configData.server.ssl.cert);
			var file_key = this.modules.path.resolve(this.dir.base+'/'+this.configData.server.ssl.key);
			var options = {
			  	key: this.modules.fs.readFileSync(file_key),
				cert: this.modules.fs.readFileSync(file_cert)
			};		
			this.server = this.modules.https.createServer(options, handleRequest);
			this.protocol = 'https';
		} catch (e) {
			this.error('Problem while starting the server');
			this.error(''+e);
			return this;
		}
	} else {
		try {
			this.server = this.modules.http.createServer(handleRequest);
			this.protocol = 'http';
		} catch (e) {
			this.error('Problem while starting the server');
			this.error(''+e);
			return this;
		}
	}


	this.server.listen(this.configData.server.port, function() {
	    ws.log("Server listening on: "+ws.protocol+"://localhost:"+ws.configData.server.port);
        if (callback) {
        	callback(ws);
        }
	});


	this.isRunning = true;
	return this;
};

/**
 * Set the config file or the config object of the server. Chainable
 * @param  {mixed}	file Path of the config file or object
 * @return {bool}  		 True on success
 */
webservo.prototype.config = function(file) {

	if (this.isRunning) {
		this.warning('Cannot change config while server is running');
		return this;
	}

	this.isInitiated = false;
	this.configData = {};
	var config = false;
	var fromFile = true;

	if (file && typeof file === 'object') {
		// file is the configuration object
		fromFile = false;
		config = file;
	} else {
		// try to load config from file

		// default config file
		if (!file) {
			file = this.modules.path.resolve(this.dir.base+'/config.json');
		} else {
			file = this.modules.path.resolve(this.dir.base+'/'+file);
		}

		// check if the file exists
		try {
			this.modules.fs.lstatSync(file);
		} catch (e) {
			this.log(('Using config file "'+file+'"').cyan);
			this.error(''+e);
			return this;
		}

		// try to load the JSON file
		try {
			config = require(file);
		} catch (e) {
			this.log(('Using config file "'+file+'"').cyan);
			this.error(''+e);
			return this;
		}
	}

	// set the default params in config object
	if (!config) config = {};

	if (!config.server) config.server = {};
	if (!config.server.port) config.server.port = '80';
	if (!config.server.dir) config.server.dir = 'www/';
	if (!config.server.ssl) config.server.ssl = { enabled: false };

	if (!config.page) config.page = {};
	if (!config.page.error) config.page.error = {};
	if (!config.page.script) config.page.script = 'node.js';
	if (!config.page.default) config.page.default = 'index.html';

	if (!config.log) config.log = {};
	if (!config.log.error) config.log.error = { "enabled": true, "path": "", "console": true };
	if (!config.log.access) config.log.access = { "enabled": false, "path": "", "console": false };
	if (!config.log.warning) config.log.warning = { "enabled": true };

	if (!config.methods) config.methods = {};
	if (!config.methods.allowed) config.methods.allowed = ["OPTIONS", "GET", "POST", "HEAD", "PUT", "PATCH", "DELETE", "COPY", "LINK", "UNLINK", "TRACE", "CONNECT"];

	if (fromFile) {
		this.log(('Using config file "'+file+'"').cyan);
	}

	return this.checkConfig(config);
};


webservo.prototype.checkConfig = function (config) {
	var changedDir = false;
	var previousDir = this.dir.www;

	// set configData at the beginning, so the log functions can access their parameters
	this.configData = config;

	// check every error page in config
	var pages = ['401', '403', '404', '405', '500'];
	for (var t=0; t<pages.length; t++) {
		try {
			if (config.page.error && config.page.error[pages[t]]) {
				var file = this.modules.path.resolve(this.dir.base+'/'+config.page.error[pages[t]]);
				var error = this.modules.fs.appendFileSync(file, '');
			} else {
				config.page.error[pages[t]] = false;
			}
		} catch (e) {
			this.warning('Cannot find error file "'+file+'"');
			config.page.error[pages[t]] = false;
		}
	}

	// check if www root directory exists
	if (!this.dir.www) {
		changedDir = true;
	}
	this.dir.www = this.modules.path.resolve(this.dir.base+'/'+this.configData.server.dir+'/');
	if (previousDir != this.dir.www) {
		changedDir = true;
	}

	try {
	    var stats = this.modules.fs.lstatSync(this.dir.www);
	    if (!stats.isDirectory()) {
	        this.configData = false;
	        this.error('WWW root must be a directory "'+this.dir.www+'"');
	        return this;
	    }
	} catch (e) {
        this.configData = false;
        this.error(e+'');
        return this;
	}

	// check error log file
	if (!config.log.error.path) {
		config.log.error.path = '';
	}
	if (config.log.error.enabled && config.log.error.path != '') {
		try {
			var file = this.modules.path.resolve(this.dir.base+'/'+config.log.error.path);
			var error = this.modules.fs.appendFileSync(file, '');
		} catch (e) {
			this.warning('Cannot write in error log file "'+file+'"');
			config.log.error.path = '';
		}
	}

	// check access log file
	if (!config.log.error.path) {
		config.log.error.path = '';
	}
	if (config.log.access.enabled && config.log.access.path != '') {
		try {
			var file = this.modules.path.resolve(this.dir.base+'/'+config.log.access.path);
			var access = this.modules.fs.appendFileSync(file, '');
		} catch (e) {
			this.warning('Cannot write in access log file "'+file+'"');
			config.log.access.path = '';
		}
	}

	// check SSL files
	if (config.server.ssl.enabled) {
		if (!config.server.ssl.key || config.server.ssl.key == '') {
			this.error('SSL key file is not configured');
			this.warning('Server will run with HTTP protocol');
			config.server.ssl.enabled = false;
		} else {
			try {
				var file = this.modules.path.resolve(this.dir.base+'/'+config.server.ssl.key);
				var read = this.modules.fs.readFileSync(file);
			} catch (e) {
				this.error('Cannot read SSL file "'+file+'"');
				this.warning('Server will run with HTTP protocol');
				config.server.ssl.enabled = false;
			}
		}
	}
	if (config.server.ssl.enabled) {
		if (!config.server.ssl.cert || config.server.ssl.cert == '') {
			this.error('SSL certificate file is not configured');
			this.warning('Server will run with HTTP protocol');
			config.server.ssl.enabled = false;
		} else {
			try {
				var file = this.modules.path.resolve(this.dir.base+'/'+config.server.ssl.cert);
				var read = this.modules.fs.readFileSync(file);
			} catch (e) {
				this.error('Cannot read SSL file "'+file+'"');
				this.warning('Server will run with HTTP protocol');
				config.server.ssl.enabled = false;
			}
		}
	}

	this.configData = config;
	this.isInitiated = true;

	if (changedDir) {
		this.log(('Using WWW directory "'+this.dir.www+'"').cyan);
	}

	return this;
};


/**
 * Set a variable in the config and rebuild and check the
 * @param {[type]} name  [description]
 * @param {[type]} value [description]
 */
webservo.prototype.setConfigVar = function (name, value) {

	if (this.isRunning) {
		this.warning('Cannot change config variable while server is running');
		return this;
	}

	if (!this.isInitiated) {
		this.warning('setConfigVar: server is not initiated ['+name+' = '+value+']');
		this.config();
	}
	var list = name.split('.');

	if (list.length == 0) {
		this.warning('setConfigVar: empty name ['+name+' = '+value+']');
		return this;
	}

	var config = this.configData;
	var name = list[0];

	for (var i = 0; i < list.length-1; i++) {
        if (!config[list[i]]) {
			this.warning('setConfigVar: variable does not exist ['+name+' = '+value+']');
        	return this;
        }
        config = config[list[i]];
	}
	config[list[i]] = value;

	this.checkConfig(this.configData);
	return this;
};



/**
 * Trim
 */
webservo.prototype.trim = function (str) {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};


/**
 * Get the date and time for log
 */
webservo.prototype.getDateTime = function() {

    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
};


/**
 * A error occured
 * @param  {string} message Error description
 */
webservo.prototype.error = function(message) {
	// set the server in an error state
	if (!this.isRunning) {
		this.hasError = true;
	}

	// if config not loaded yet, just print message in console
	if (!this.configData || !this.configData.log) {
		this.log(message.red);
	} else if (this.configData.log.error.enabled) {
		
		if (this.configData.log.error.path && this.configData.log.error.path != '') {
			// write error in file
			this.writeError(message);
		}

		// print in console if needed
		if (this.configData.log.error.console) {
			this.log(message.red);
		}
	}

	if (this.configData.server.exitOnError) {
		process.exit();
	}
};

/**
 * Write the error in the error log file
 * @param  {string} message 
 */
webservo.prototype.writeError = function(message) {
	return this.modules.fs.appendFile(this.modules.path.resolve(this.dir.base+'/'+this.configData.log.error.path), this.getDateTime()+'	'+message+String.fromCharCode(13));
};

/**
 * Show message in console
 * @param  {string} message 
 */
webservo.prototype.log = function(message) {
	if (!this.isSilent) {
		console.log(message);
	}
};

/**
 * Show warning in console
 * @param  {string} message 
 */
webservo.prototype.warning = function(message) {
	this.log(message.yellow);
};

/**
 * Show debug for a JS file in console
 * @param  {string} file Path to node file
 */
webservo.prototype.debug = function(file) {
	var ws = this;

	// callback to show the result
	function puts(error, stdout, stderr) { 

		// split the lines
		var lines = (stderr+'').split(String.fromCharCode(13));

		// show each line
		for (var t=0; t<lines.length; t++) {
			// hide if line empty
			if (ws.trim(lines[t]) != '') {
				ws.log(('Debug: '+lines[t]).replace(String.fromCharCode(13), '').replace(String.fromCharCode(10), '').green);
			}
		}
	}

	// execute "node -c file" to get the error details
	this.modules.child_process.exec("node -c "+file, puts);
};

/**
 * Log an access
 * @param  {object} request    
 * @param  {object} response   
 * @param  {int} 	statusCode The returned status code (200, 404 ...)
 */
webservo.prototype.access = function(request, response, statusCode) {
	
	// if access log is enabled
	if (this.configData.log.access.enabled) {

		// get the url
		var url = request.url;

		// get the IP @TODO convert to ipv4 if possible
		var ip = request.connection.remoteAddress;

		// write in log
		if (this.configData.log.access.path && this.configData.log.access.path != '') {
			this.writeAccess(statusCode, ip, url);
		}

		// write in console if needed
		if (this.configData.log.access.console) {
			this.log(('Access: '+ip+'	'+statusCode+'	'+url).magenta);
		}
	}
}

/**
 * Write an access in the access log file
 * @param  {int} 	statusCode The returned status code
 * @param  {string} ip         Remote IP
 * @param  {string} url        URL
 */
webservo.prototype.writeAccess = function(statusCode, ip, url) {
	return this.modules.fs.appendFile(this.modules.path.resolve(this.dir.base+'/'+this.configData.log.access.path), this.getDateTime()+'	'+statusCode+'	'+ip+'	'+url+String.fromCharCode(13));
};

/**
 * Return a page with status code 500
 * @param  {object} request  
 * @param  {object} response 
 * @param  {string} message
 */
webservo.prototype.status500 = function(request, response, message) {

	// log the access
	this.access(request, response, 500);

	// show in console if needed
	if (message) {
		this.error(message);
	}

	var ws = this;

	// output to client
	response.writeHead(500, {"Content-Type": "text/html"});

	if (this.cache.error500) {
		response.write(this.cache.error500);
		response.end();
		return true;
	}

	if (this.configData.page && this.configData.page.error && this.configData.page.error['500']) {
		this.modules.fs.readFile(this.dir.base+'/'+this.configData.page.error['500'], 'utf8', function (err, data) {
			if (err) {
				ws.configData.page.error['500'] = false;
				response.write("500 Server error");
				response.end();
			} else {
				ws.cache.error500 = data;
				response.write(data);
				response.end();
			}
		});
	} else {
		response.write("500 Server error");
		response.end();
	}
	return true;
};


/**
 * Return a page with status code 403
 * @param  {object} request  
 * @param  {object} response 
 * @param  {string} message
 */
webservo.prototype.status403 = function(request, response, message) {
	// log the access
	this.access(request, response, 403);

	// show in console if needed
	if (message) {
		this.error(message);
	}

	var ws = this;

	// output to client
	response.writeHead(403, {"Content-Type": "text/html"});

	if (this.cache.error403) {
		response.write(this.cache.error403);
		response.end();
		return true;
	}

	if (this.configData.page && this.configData.page.error && this.configData.page.error['403']) {
		this.modules.fs.readFile(this.dir.base+'/'+this.configData.page.error['403'], 'utf8', function (err, data) {
			if (err) {
				ws.configData.page.error['403'] = false;
				response.write("403 Forbidden");
				response.end();
			} else {
				ws.cache.error403 = data;
				response.write(data);
				response.end();
			}
		});
	} else {
		response.write("403 Forbidden");
		response.end();
	}
	return true;
};


/**
 * Return a page with status code 404
 * @param  {object} request  
 * @param  {object} response 
 * @param  {string} message
 */
webservo.prototype.status404 = function(request, response, message) {
	// log the access
	this.access(request, response, 404);

	// show in console if needed
	if (message) {
		this.error(message);
	}

	var ws = this;

	// output to client
	response.writeHead(404, {"Content-Type": "text/html"});

	if (this.cache.error404) {
		response.write(this.cache.error404);
		response.end();
		return true;
	}

	if (this.configData.page && this.configData.page.error && this.configData.page.error['404']) {
		this.modules.fs.readFile(this.dir.base+'/'+this.configData.page.error['404'], 'utf8', function (err, data) {
			if (err) {
				ws.configData.page.error['404'] = false;
				response.write("404 Not found");
				response.end();
			} else {
				ws.cache.error404 = data;
				response.write(data);
				response.end();
			}
		});
	} else {
		response.write("404 Not found");
		response.end();
	}
	return true;
};


/**
 * Return a page with status code 404
 * @param  {object} request  
 * @param  {object} response 
 * @param  {string} message
 */
webservo.prototype.status405 = function(request, response, message) {
	// log the access
	this.access(request, response, 405);

	// show in console if needed
	if (message) {
		this.error(message);
	}

	var ws = this;

	// output to client
	response.writeHead(405, {"Content-Type": "text/html"});

	if (this.cache.error404) {
		response.write(this.cache.error405);
		response.end();
		return true;
	}

	if (this.configData.page && this.configData.page.error && this.configData.page.error['405']) {
		this.modules.fs.readFile(this.dir.base+'/'+this.configData.page.error['405'], 'utf8', function (err, data) {
			if (err) {
				ws.configData.page.error['405'] = false;
				response.write("405 Method Not Allowed");
				response.end();
			} else {
				ws.cache.error405 = data;
				response.write(data);
				response.end();
			}
		});
	} else {
		response.write("405 Method Not Allowed");
		response.end();
	}
	return true;
};




/**
 * Return a page with status code 401
 * @param  {object} request  
 * @param  {object} response 
 * @param  {string} message
 */
webservo.prototype.status401 = function(request, response, message) {
	// log the access
	this.access(request, response, 401);

	// show in console if needed
	if (message) {
		this.error(message);
	}

	var ws = this;

	// output to client
	if (response._header && response._header.indexOf('Content-Type:') < 0) {
		response.writeHead(401, {"Content-Type": "text/html"});
	}

	if (this.cache.error401) {
		response.write(this.cache.error401);
		response.end();
		return true;
	}

	if (this.configData.page && this.configData.page.error && this.configData.page.error['401']) {
		this.modules.fs.readFile(this.dir.base+'/'+this.configData.page.error['401'], 'utf8', function (err, data) {
			if (err) {
				ws.configData.page.error['401'] = false;
				response.write("401 Not found");
				response.end();
			} else {
				ws.cache.error401 = data;
				response.write(data);
				response.end();
			}
		});
	} else {
		response.write("401 Not found");
		response.end();
	}
	return true;
};

/**
 * Return a page with status code 200
 * @param  {object} request  
 * @param  {object} response 
 * @param  {string} message
 */
webservo.prototype.status200 = function(request, response, body) {
	// output to client
	if (response._headers && !response._headers['content-type']) {
		response.setHeader('Content-Type', 'text/html');
	}

	// log the access
	this.access(request, response, response.statusCode);

	response.write(body);
	response.end();
	return true;
};

/**
 * Check if the file is a server script
 * @param  {string}  file Path to the file
 */
webservo.prototype.isScript = function(file) {
	return this.modules.sd.endsWith(file, this.configData.page.script);
};

/**
 * Transform a file path to an URL. Return false if impossible or server not initiated
 * @param  {string} file Path of the file
 * @return {string} 	 The URL
 */
webservo.prototype.fileToUrl = function(file) {
	if (!this.dir || !this.dir.www || file.indexOf(this.dir.www) != 0) {
		return false;
	}
	return file.replace(this.dir.www, '').replace(/\\/g, '/');
};

webservo.prototype.stringToRegex = function(string) {
	var regString = '^' + string.replace(/\./g, '\\.').replace(/\*/g, '(.*)') + '$';
	return new RegExp(regString, "");
};


/**
 * Get the alias from a file
 * @param  {string} file Path to the file
 * @return {string}      Path to the alias
 */
webservo.prototype.getAlias = function(file) {
	var count = 0;
	var originalUrl = this.fileToUrl(file);
	var previousFile, url;
	while (previousFile != file) {
		previousFile = file;
		url = this.fileToUrl(file);
		if (this.configData.url && this.configData.url[url] && this.configData.url[url].alias) {
			if (count > this.aliasRecursion) {
				this.error('Max alias recursion reach for \"'+originalUrl+'\"');
				break;
			}
			file = this.getUrlFile(this.configData.url[url].alias);
			count++;
		} else {
			for (var term in this.configData.url) {
				if (term.indexOf('*') >= 0) {
					if (!this.configData.url[term].regex) {
						this.configData.url[term].regex = this.stringToRegex(term);
					}
					var match = this.configData.url[term].regex.exec(url);
					if (match) {

						if (this.configData.url[term].alias) {
							file = this.getUrlFile(this.configData.url[term].alias);
							if (match.length > 1) {
								for (var t=1; t<match.length; t++) {
									file = file.replace('*', match[t]);
								}
							}
						}
					}
				}
			}
			break;
		}
	}
	return file;
};

webservo.prototype.verifyAuthentication = function(request, authentication) {
	if (authentication && authentication.login) {

		// no authentication  
		if (authentication.login === 'none') {
			return false;
		}

		if (request.headers && request.headers.authorization) {
			var list = request.headers.authorization.split(' ');

			// invalid authorization
			if (list.length != 2) {
				return false;
			}

			if (list[0] == 'Basic') {
				var string = (new Buffer(list[1], 'base64'))+'';
				var values = string.split(':', 2);
				
				// wrong login
				if (authentication.login != values[0]) {
					return false;
				}

				// wrong password
				if (authentication.password != values[1]) {
					return false;
				}

				// everything is awesome
				return true;

			} else {
				// authorization other than Basic is not implemented
				return false;
			}
			return false;
		}

		// URL need authentication and no authorization in header
		return false;
	}
	return true;
};

/**
 * Returns true if authentication is correct
 * @param  {object} request
 * @param  {object} response
 * @param  {object} file
 * @param  {object} parameters
 * @return {bool} True if can access the page, False ask for login / password
 */
webservo.prototype.getAuthentication = function(request, response, file, parameters) {
	var url = this.fileToUrl(file);
	if (this.configData.url && this.configData.url[url] && this.configData.url[url].authentication) {
		if (!this.verifyAuthentication(request, this.configData.url[url].authentication)) {
			return false;
		}
	}

	for (var term in this.configData.url) {
		if (term.indexOf('*') >= 0) {
			if (!this.configData.url[term].regex) {
				this.configData.url[term].regex = this.stringToRegex(term);
			}
			var match = this.configData.url[term].regex.exec(url);
			if (match) {

				if (this.configData.url[term] && this.configData.url[term].authentication) {
					if (!this.verifyAuthentication(request, this.configData.url[term].authentication)) {
						return false;
					}
				}
			}
		}
	}

	return true;
};

/**
 * Process a file
 */
webservo.prototype.process = function(request, response, file, parameters) {
	
	if (this.onBeforeRequest) {
		this.onBeforeRequest(request, response, file, parameters);
	}

  	var pathAbsolute = this.modules.path.resolve(file);
	file = this.getAlias(pathAbsolute);
	
	if (!this.getAuthentication(request, response, file, parameters)) {
		response.writeHead(401, {"WWW-Authenticate": "Basic realm=\"Password Protected Area\"", "Content-Type": "text/html"});
		return this.status401(request, response, 'Error: 401 unathorised access to "'+file+'"');
	}

	// check if file exists
	try {
		this.modules.fs.lstatSync(file);
	} catch (e) {
		// return the 404 page
		return this.status404(request, response, 'Error: 404 file not found "'+file+'"');
	}
	 
	// check if file is a script
	if (this.isScript(file)) {
		// process as a JS script, execute on the server
		this.processScript(request, response, file, parameters);
	} else {
		// process as a simple file, send the data to client
		this.processFile(request, response, file, parameters);
	}
	return true;
};

/**
 * Execute script and return result
 */
webservo.prototype.processScript = function(request, response, file, parameters) {
	
    // execute the JS file and catch error
    try {
    	// absolute path of the file
    	var pathAbsolute = this.modules.path.resolve(file);

    	// get the function to call / execute the JS
    	var fct = require(pathAbsolute);

    	var getType = {};
    	var result = false;

    	// if result if a function, execute it here and get result
    	if (fct && getType.toString.call(fct) == '[object Function]') {
    		result = fct(request, response, parameters, this);
    	}

    	// delete cache so the file is also executed next time
    	require.cache[pathAbsolute] = null;
    } catch(e) {
    	// absolute path of the file
    	var pathAbsolute = this.modules.path.resolve(file);

    	// delete cache  so the file is also executed next time
    	require.cache[pathAbsolute] = null;

    	// try to show the debug of the error
    	if (this.configData.log.error.debug) {
    		this.debug(file);
    	}

    	// return the error 500 page
		return this.status500(request, response, ''+e+' in "'+file+'"');
    }
    
    // display a warning if the script returned nothing
    if (result === false || result === '') {
		this.warning('Script returned nothing: "'+file+'"');
    }

	if (this.onAfterRequest) {
		this.onAfterRequest(request, response, file, parameters, result);
	}

    // return the page with status code 200
	return this.status200(request, response, result || '');
};


/**
 * Get file and return it to client
 */
webservo.prototype.processFile = function(request, response, file, parameters) {

	// process the file
    try {
    	var content = this.modules.fs.readFileSync(file);

		if (this.onAfterRequest) {
			this.onAfterRequest(request, response, file, parameters, content);
		}

		response.writeHead(200, {"Content-Type": this.modules.mime.lookup(file)});
		response.write(content);
		response.end();

		// log the access
		this.access(request, response, 200);
	} catch (e) {
		// if any errors happened, file is probably not here
		// return the 404 page
		return this.status404(request, response, 'Error: 404 file not found "'+file+'"');
	}
};


webservo.prototype.getUrlFile = function(url) {
	
	// build the path of the file
	var file = [this.dir.www, this.modules.url.parse(url).pathname].join('/').replace('//', '/');
	var filename = this.modules.path.basename(file);

	// set default file if needed
	if (file.slice(-1) == '/' || filename == '') {
		file += '/'+this.configData.page.default;
	}

	return this.modules.path.resolve(file);
};


/**
 * Executed before the request is processed
 */
webservo.prototype.onBeforeRequest = function(request, response, file, parameters) {
};


/**
 * Executed before the request is processed
 */
webservo.prototype.onAfterRequest = function(request, response, file, parameters, body) {
};


module.exports = new webservo();


