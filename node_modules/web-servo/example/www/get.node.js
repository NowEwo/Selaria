
module.exports = function(request, response, parameters, ws) {
	var str = '';

	for (var name in parameters) {
	  	str += '<p>' + name + ' = ' + parameters[name] + '</p>';
	}

	// A simple form to send the file
	str += '<html>'
	  +'  <body>'
	  +'    <form method="GET">'
	  +'      <input type="text" name="my-get-var-name" value="" /><input type="submit"/>'
	  +'    </form>'
	  +'  </body>'
	  +'</html>';

	return str;
};
