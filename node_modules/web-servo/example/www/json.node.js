
module.exports = function(request, response, parameters, ws) {
	
	// change header to JSON mime type
	response.writeHead(200, {"Content-Type": "application/json"});

	var object = {
		"alive": true, 
		"serverRoot": ws.dir.www,
		"time": new Date()+''
	}

	// return JSON as string
	return JSON.stringify(object);
};
