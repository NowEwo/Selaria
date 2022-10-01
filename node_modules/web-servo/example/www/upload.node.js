
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
