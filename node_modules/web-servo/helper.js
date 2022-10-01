
/**
 * The main class
 */
var helper = function() {

	this.run(process.argv.slice(2));
};


helper.prototype.run = function(argv) {
console.log(argv);
};



new helper();

