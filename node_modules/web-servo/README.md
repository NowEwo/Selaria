
# web-servo

A HTTP web server fully configurable executing node JS scripts.

The server can return normal HTML files and assets (.css, .html, .js ...) and will execute the .node.js files as node scripts (file extension editable in config). So you can do everything a node script can do with a simple HTTP request.

## Features

- Easy to use, launch with one line of code
- Handle GET, POST and file upload
- Configuration in a JSON file
- Log management of errors and access
- HTTPS web server
- [Tutorials](https://github.com/Komrod/web-servo/blob/master/tutorials.md)
- Executing node script on the server and output result
- Debug log to fix your node script
- URL alias, password protection
- onBeforeRequest and onAfterRequest events
- Error pages customization
- Descriptive log in the console

## Install

**From node / npm:**
``` 
  npm install web-servo
``` 

**From GitHub:**
``` 
  git clone https://github.com/Komrod/web-servo.git
  cd web-servo
  npm install
``` 

## How to use

Launch the server with one line of script in your javascript file:
``` 
  require('web-servo').start();
``` 

Change server directory from inside node script:
``` 
  var ws = require('web-servo');
  ws.setDir('../somedir/').start();
``` 

**For regular HTTP files:**
When a client request an URL, the server will return the content of the file to the client, only when the extension does not match with the node script file extension (by default .node.js). The returned mime type depends on the file extension.

**For node JS script:**
When the client request an URL with the script extension (by default .node.js), the server will execute the node script and return the result as HTML. The server will not stop even if there is an error in the script but will return the 500 error page. There is an additional "debug" option which track the syntax error in the console.

**For non existing files:**
If file is not here, server will return the 404 error page.

**Other errors:**
There is some optional password protection, not allowed HTTP methods etc ... So in some cases, the server can alors returns 401, 405 error codes.

A node page is a file placed in the "www" directory of the server. It can be "/www/test.node.js" and requested by the server from http://localhost/test.node.js".

Example of node page that returns HTML:
```
  // As this script runs in the server, this will show in the console
  console.log('test');

  // to return HTML, we use module.exports
  module.exports = function(request, response, parameters, ws) {
    // Do something here, read some files ..
    // Then return the HTML
    return '<html><body>This is it!</body></html>';
  };

```

Simple node page that returns nothing:
```
  // We don't use module.exports so we can't return anything
  // We also don't know anything about the request (parameters, type ...)

  // Here, you can use any installed modules
  var fs = require('fs');
  fs.stat('/helloWorld.html', function (error, stast) {
    // Do something
  });
```

## Handle GET, POST and upload

When you are requesting a node script, you can retrieve the GET and POST parameters of the HTTP request. You can also access the request and response object for additional informations and actions.

If you want the script to work, you should place it in the "www" directory in a file with a .node.js extension and request the correct URL. For a node page "test.node.js" directly in "www" directory with the default server running on port 80, the request URL would be "http://localhost:80/test.node.js".

GET and POST fields are merged in the "parameters" object. A POST parameter will overwrite a GET parameter with the same name.

When you send a file with a POST request, the file is uploaded in the server. The location is in the temporary files directory of the operating system. An object containing the Meta data of the file is set in the parameters object.

**Example of the basic structure of a node page:**
```
  module.exports = function(request, response, parameters, ws) {
    // request: HTTP request by client
    // response: HTTP response of server
    // parameters: GET and POST parameters
    // ws: web-servo object

    return 'Ok';
  };

```

**Example of a node page that returns the parameters list:**
```
  module.exports = function(request, response, parameters, ws) {
    var str = '';
    for (var name in parameters) {
      str += '<p>' + name + ' = ' + parameters[name] + '</p>';
    }
    return '<html><body>' + str + '</body></html>';
  };
``` 

**Example of a file upload with a node page:**
```
  module.exports = function(request, response, parameters, ws) {
    var str = '';

    // if the file is uploaded
    if (parameters.myText) {
      // show the file data
      str += '<p>File uploaded successfully!</p>'
        +'<p>'
        +'<li>Mime type: '+parameters.myText.mimetype+'</li>'
        +'<li>Encoding: '+parameters.myText.encoding+'</li>'
        +'<li>Remote file name: '+parameters.myText.filename+'</li>'
        +'<li>Temporary file: '+parameters.myText.tmpFile+'</li>'
        +'</p>';
    }
    
    // A simple form to send the file
    str += '<html>'
      +'  <body>'
      +'    <form method="POST" enctype="multipart/form-data">'
      +'      <input type="file" name="myText" /><input type="submit"/>'
      +'    </form>'
      +'  </body>'
      +'</html>';

    return str;
  };
``` 


## HTTPS server

You can run a web server over HTTPS protocol. You will need the SSL key file and the SSL certificate file.
If you want to run your server locally, you can generate those files on your computer with some commands, it will require OpenSSL installed. 

[You can access a more complete tutorial for the HTTPS server here!](https://github.com/Komrod/web-servo/blob/master/tutorials.md)

Execute this script on the root directory of the project :
```
  ./generateSSL.sh example/ssl/ example
```

Then, you need to configure the path of the SSL files (.key and .crt) in the config file, it may looks like this (in config.json):

```
{
  "server": {
    "port": "443",               <-- port of the HTTPS server
    "ssl": {
      "enabled": true,           <-- HTTPS protocol is enabled
      "key": "ssl/example.key",  <-- SSL key file
      "cert": "ssl/example.crt"  <-- SSL certificate file
    }
  },

```

Run your server with a simple line in a node script

```
  require('web-servo').start();
```

Executing this script runs the server :

```
  Using config file "C:\Users\PR033\git\web-servo\example\config_https.json"
  Using WWW directory "C:\Users\PR033\git\web-servo\example\www"
  Server listening on: https://localhost:443
```

You can now access the server on https://localhost/. You may have a warning because your local SSL certificate is not validated by a trusted source. But it will run properly.


## Methods

### setDir(dir)
Set the dir of the server, before calling config() or start()
- **dir**: {string} directory of the server, relative to working directory or absolute

Example: 
``` 
  ws.setDir('./myServer/');
``` 

### config(file)
Set the config for the server. Parameter can be a path to a config file or a config object. If parameter is omited, load the default file "config.json" in the server directory. If parameter is an object, consider it as the loaded config.
- **file**: {mixed} path to the file or object

Example: 
``` 
  // Load the default file "config.json" from server directory
  ws.config();

  // Configure server to listen to port 9000
  ws.config({server: {port: 9000}})
``` 

### setConfigVar(name, value)
Set a configuration variable for the server. You cannot change a variable while the server is running.
- **name**: {string} name of the variable as in config file with dots "." if the variable is in an object
- **value**: {mixed} value

Example: 
``` 
  // Change config to show access in console
  ws.setConfigVar('log.access.console', true)
``` 

### exitOnError(callback)
The server is configured by default to continue even if an error occurs. This function detects if an error occurs since the configration was loaded and exit the process if there is one. You can execute it just before start the server if you want to be sure the server starts on stable condition.

When the server exit the process, it call the callback function.

Example:
```
  ws
    .config()
    .exitOnError()
    .start();
```


### start(callback)
Start the server then call the callback function. Configure by default the server if config() wasn't called

Example: 
```
  ws.start();
```

### stop(callback)
Stop the server then call the callback function 

Example: 
```
  ws.stop();
```

### silent(b)
Set the silent mode on or off, no console output.
- **b**: {bool} if true, set the silent mode on, default true

Example: 
```
  // silent mode set on
  ws.silent(); 
```

**All these methods are chainable.**
Example:
``` 
  // set server to silent mode and start
  require('web-servo').silent().start(); 

  // set server dir and load a config file
  require('web-servo').setDir('./www-prod/').config('./config-prod.json'); 
``` 

## Configuration file

The configuration file "config.json" must be located in the server directory. The server directory is initialized to the working directory at startup and can be changed with the setDir() method. You can also load a different config file or load directly an object using the config() method.

```	
{
  "server": {
    "port": "80",                 <-- port of the web server
    "dir": "www/"                 <-- directory of the www root (from server dir)
    "exitOnError": false,         <-- if true, exit process after the first error
    "ssl": {
      "enabled": false,           <-- if the HTTPS protocol is enabled
      "key": "",                  <-- SSL key file of the server
      "cert": ""                  <-- SSL certificate file of the server
    }
  },
  "page": {
    "script": "node.js",          <-- extension of the node page to execute server side
    "default": "index.html",      <-- default page if none
    "error": {
      "401": "page/error/401.html", <-- full path of the 401 error page
      "403": "page/error/403.html", <-- full path of the 403 error page
      "404": "page/error/404.html", <-- full path of the 404 error page
      "500": "page/error/500.html"  <-- full path of the 500 error page
    }
  },
  "url": {
    "/not-here.html": {           <-- alias from this URL
      "alias": "test.html"        <-- to this URL
    },
    "/alias-recursion-1.html": {  <-- create an infinite alias recursion
      "alias": "alias-recursion-2.html"
    },
    "/alias-recursion-2.html": {  <-- create an infinite alias recursion
      "alias": "alias-recursion-1.html"
    },
    "/first/*": {                 <-- make the directory /first/
      "alias": "/second/*"        <-- an alias of /second/
    }
  },
  "methods": {
    "allowed": ["OPTIONS", "GET", "POST", "HEAD", "PUT", "PATCH", "DELETE", "COPY", "LINK", "UNLINK", "TRACE", "CONNECT"] <-- allowed HTTP methods
    }
  },
  "log": {
    "access": {
      "enabled": true,            <-- if access log is enabled
      "path": "log/access.log",   <-- path of the access log file
      "console": false            <-- show access log in console
    },
    "error": {
      "enabled": true,            <-- if error log is enabled
      "path": "log/error.log",    <-- path of the error log
      "console": true             <-- show error log in console
      "debug": true,              <-- additional debug for error in script
    },
    "warning": {
      "enabled": true             <-- show warning log in console
    }
  }
}
```

## Example

Execute the example server :
```
    node example/server.js
```

The server is started. Open your browser and go to these locations:
- http://localhost:80/                <-- index page (default page is index.html)
- http://localhost:80/index.html      <-- index page directly
- http://localhost:80/404.html        <-- Page not found
- http://localhost:80/script.node.js  <-- script executed on the server, returns HTML
- http://localhost:80/simple.node.js  <-- simple script executed on the server, returns nothing
- http://localhost:80/error.node.js   <-- Error and debug log on console
- http://localhost:80/json.node.js    <-- change the content type header response to "application/json"
- http://localhost:80/get.node.js     <-- GET request example
- http://localhost:80/post.node.js    <-- POST request example
- http://localhost:80/upload.node.js  <-- file upload example
- http://localhost:80/not-here.html   <-- alias to test.html
- http://localhost:80/first/page.html <-- directory alias /first/ to /second/
- http://localhost:80/alias-recursion-1.html <-- infinite alias recursion error


## Tutorials

[You can access the tutorials here!](https://github.com/Komrod/web-servo/blob/master/tutorials.md)

List of the tutorials:
- Make a server from scratch
- Make a HTTPS server


## Changelog

**version 0.5**
- Adding HTTPS protocol
- Rename .xjs scripts to .node.js scripts
- Fix using another file for config
- Adding script to generate local SSL certificate
- Tutorial how to create a HTTPS server
- Rename the example dir for custom error page
- Chainable function to exit on error
- Add option in config.json to exit process on error

**version 0.4.1**
- Support HTTP 403 error
- Allow and disallow HTTP methods
- Automatic OPTIONS response
- Separate tutorials

**version 0.4**
- Password protected directory and file (basic authentication)
- Event system (onBeforeRequest, onAfterRequest)

**version 0.3.3**
- Remove table of contents in readme

**version 0.3.2**
- Fix error 500 page when error 404 is in cache
- directory alias, search term with "*" in url

**version 0.3.1**
- Dont change config while server is running
- URL alias
- Fix error page directory
- Error on reaching max of alias recursion

**version 0.3**
- Get additional informations about the uploaded files
- Fix error function when there is no log directory
- Tutorial to set up a server from scratch
- Fix log access when requesting a file
- Example script, GET POST data and upload files
- Fix error in script when header not set
- Fix file upload
- Dont try to upload file when filename is empty

**Version 0.2**
- Set server config from script
- Check if www root directory exists
- Fix error 404 on XJS script request
- Change a config parameter from script
- Change mime type of output page in a script

**Version 0.1.2**
- Configure files for error pages
- Launch silently, no console output
- Chainable functions

## TODO

- Block remote IP
- Include empty folders with .gitkeep
- Automatically adding headers to requests
- FAQ page
- HTTPS server using .pfx file
- Block mime type
- Block url
- Function to add and remove alias
- Function to add and remove password protected directory
- Timeout for a page / script
- Build an API REST
- Setup function to automatically build a server
- Launch from command line (port, dir ...)
- Run multiple types of script (PHP)
