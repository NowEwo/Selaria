
////////////////////////////////////////////////////////////////////
// Example on how to use a script to launch a server
////////////////////////////////////////////////////////////////////

// use require('web-servo') if you installed the module with npm
require('../lib/web-servo')
	
	// set server dir to the script dir "/example/"
	.setDir(__dirname)

	// Load the config from default file "config.json"
	.config() 

	// Change config var to show access in console
	.setConfigVar('log.access.console', true)

	// start the server
	.start();
