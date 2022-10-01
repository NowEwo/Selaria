

var sd = require('../index.js');
var expect = require("chai").expect;


describe("Screwdriver", function() {
  	describe("Random float 0,100", function() {
	    it("returns max 100", function() {
	    	var max = 0;
	    	for (var t=0; t<1000000; t++) {
	    		max = Math.max(sd.randFloat(0,100), max);
	    	}
	    	expect(max).to.be.at.most(100);
	    });
	    it("returns min 0", function() {
	    	var min = 0;
	    	for (var t=0; t<1000000; t++) {
	    		min = Math.min(sd.randFloat(0,100), min);
	    	}
	    	expect(min).to.be.at.least(0);
	    });
	    it("returns float", function() {
	    	var result = true;
	    	for (var t=0; t<1000000; t++) {
	    		f = sd.randFloat(0,100);
	    		if (f === parseInt(f)) {
	    			result = false;
	    		}
	    	}
	    	expect(result).to.be.true;
		});
	});
  	describe("Random int 0,100", function() {
	    it("returns max 100", function() {
	    	var max = 0;
	    	for (var t=0; t<1000000; t++) {
	    		max = Math.max(sd.randInt(0,100), max);
	    	}
	    	expect(max).to.be.at.most(100);
	    });
	    it("returns min 0", function() {
	    	var min = 0;
	    	for (var t=0; t<1000000; t++) {
	    		min = Math.min(sd.randInt(0,100), min);
	    	}
	    	expect(min).to.be.at.least(0);
	    });
	    it("returns integer", function() {
	    	var result = true;
	    	for (var t=0; t<1000000; t++) {
	    		f = sd.randInt(0,100);
	    		if (f !== parseInt(f)) {
	    			result = false;
	    		}
	    	}
	    	expect(result).to.be.true;
		});
	});
  	describe("Get file extension", function() {
	  	it("returns a simple extension", function() {
	   		var result = sd.getExtension('/path/to/file/access.log');
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('log');
		});
	  	it("Returns from multiple extension", function() {
	   		var result = sd.getExtension('/path/to/file/archive.tar.gz');
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('gz');
		});
	  	it("Returns no extension", function() {
	   		var result = sd.getExtension('/path/to/file/blob');
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('');
		});
	  	it("Returns from URL", function() {
	   		var result = sd.getExtension('https://fr.wikipedia.org/wiki/Node.js');
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('js');
		});
	  	it("Returns extension from upper case", function() {
	   		var result = sd.getExtension('/path/to/file/image.JPEG');
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('JPEG');
		});
	  	it("Returns from no path", function() {
	   		var result = sd.getExtension('image.png');
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('png');
		});
	});
  	describe("String functions", function() {
	  	it("Returns first char in upper case", function() {
	   		var result = sd.ucFirst('somebody once Told me');
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('Somebody once Told me');
		});
	});
  	describe("Array unique", function() {
	  	it("returns array integer", function() {
	   		var result = sd.unique([1,2,3,4,1,1,1,1,1,1,1,1,1,1,2,3,4]);
	    	expect(result).to.be.an('array');
	    	expect(result).to.eql([1,2,3,4]);
		});
	  	it("returns array string", function() {
	   		var result = sd.unique(['a','z','e','r','t','y','z','z','z']);
	    	expect(result).to.be.an('array');
	    	expect(result).to.eql(['a','z','e','r','t','y']);
		});
	  	it("returns array boolean", function() {
	   		var result = sd.unique([true, true, true, false, false]);
	    	expect(result).to.be.an('array');
	    	expect(result).to.eql([true, false]);
		});
	  	it("returns no change", function() {
	   		var result = sd.unique([1,2,3,'a','z','e','r','t','y',true,false]);
	    	expect(result).to.be.an('array');
	    	expect(result).to.eql([1,2,3,'a','z','e','r','t','y',true,false]);
		});
	});
  	describe("String endsWith", function() {
	  	it("returns end false", function() {
	   		var result = sd.endsWith('Some text here with this end!', 'end!');
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.true;
		});
	  	it("returns start false", function() {
	   		var result = sd.endsWith('end! Some text here with this', 'end!');
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.false;
		});
	  	it("returns almost false", function() {
	   		var result = sd.endsWith('Some text here with this almost end!.', 'end!');
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.false;
		});
	  	it("returns multiple true", function() {
	   		var result = sd.endsWith('end!end!end!end!end!end!end!end!end!end!', 'end!');
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.true;
		});
	});
  	describe("String from getDateTime", function() {
	  	it("returns date not now", function() {
	   		var resultNow = sd.getDateTime();
			var resultNotNow =  sd.getDateTime(new Date().getTime() - 10*24*60*60*1000);
	    	expect(resultNow).not.to.be.equal(resultNotNow);
		});
	});
  	describe("Polyfill", function() {
  		sd.polyfill();

	  	it("returns string getExtension from polyfill", function() {
	  		var str = '/path/to/file/iamgroot.txt';
	   		var result = str.getExtension();
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('txt');
		});
	  	it("returns string getFilename from polyfill", function() {
	  		var str = '/path/to/file/iamgroot.txt';
	   		var result = str.getFilename();
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('iamgroot.txt');
		});
	  	it("returns string getDir from polyfill", function() {
	  		var str = '/path/to/file/iamgroot.txt';
	   		var result = str.getDir();
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('/path/to/file/');
		});
	  	it("returns string getNoExtension from polyfill", function() {
	  		var str = '/path/to/file/iamgroot.txt';
	   		var result = str.getNoExtension();
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('iamgroot');
		});
	  	it("returns string ucFirst from polyfill", function() {
	  		var str = 'somebody once Told Me';
	   		var result = str.ucFirst();
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('Somebody once Told Me');
		});
	  	it("returns boolean fileExists from polyfill", function() {
	   		var result = __filename.fileExists();
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.true;
		});
	  	it("returns string dirExists from polyfill", function() {
	   		var result = __dirname.dirExists();
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.true;
		});
	  	it("returns boolean isHex from polyfill", function() {
	   		var result = "#123456".isHex();
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.true;
		});
	  	it("returns boolean isHexShort from polyfill", function() {
	   		var result = "#123".isHexShort();
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.true;
		});
	  	it("returns string trim from polyfill", function() {
	   		var result = "  ha ha ha  ".trim();
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('ha ha ha');
		});
	  	it("returns string ltrim from polyfill", function() {
	   		var result = "  ha ha ha  ".ltrim();
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('ha ha ha  ');
		});
	  	it("returns string rtrim from polyfill", function() {
	   		var result = "  ha ha ha  ".rtrim();
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('  ha ha ha');
		});
	  	it("returns string xtrim from polyfill", function() {
	   		var result = "  ha ha  ha   ha     ha  ".xtrim();
	    	expect(result).to.be.a('string');
	    	expect(result).to.be.equal('ha ha ha ha ha');
		});
	  	it("returns boolean contains from polyfill", function() {
	   		var result = "The quick brown fox jumps over the lazy dog".contains('fox');
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.true;
	   		var result = "The quick brown fox jumps over the lazy dog".contains('your mom');
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.false;
		});
	  	it("returns boolean endsWith from polyfill", function() {
	   		var result = "The quick brown fox jumps over the lazy dog".endsWith('dog');
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.true;
	   		var result = "The quick brown fox jumps over the lazy dog".endsWith('your mom');
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.false;
		});
	  	it("returns boolean startsWith from polyfill", function() {
	   		var result = "The quick brown fox jumps over the lazy dog".startsWith('The');
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.true;
	   		var result = "The quick brown fox jumps over the lazy dog".startsWith('The quick brown dog');
	    	expect(result).to.be.a('boolean');
	    	expect(result).to.be.false;
		});
	  	it("returns array quickSort from polyfill", function() {
	   		var result = [1,5,1,2,3,4,5,6,7,8,9].quickSort();
	    	expect(result).to.be.an('array');
	    	expect(result).to.eql([1,1,2,3,4,5,5,6,7,8,9]);
	   		var result = [1,5,1,2,3,4,5,6,7,8,9].quickSort(function(a,b) { if (a>b) return true; else return false; });
	    	expect(result).to.be.an('array');
	    	expect(result).to.eql([9,8,7,6,5,5,4,3,2,1,1]);
		});
	  	it("returns boolean isBoolean from polyfill", function() {
	   		var result = Object.isBoolean(false);
	    	expect(result).to.be.true;
	   		var result = Object.isBoolean(3.14159);
	    	expect(result).to.be.false;
		});
	  	it("returns boolean isInt from polyfill", function() {
	   		var result = Object.isInt(42);
	    	expect(result).to.be.true;
	   		var result = Object.isInt(3.14159);
	    	expect(result).to.be.false;
		});
	  	it("returns boolean isFunction from polyfill", function() {
	   		var result = Object.isFunction(function() { });
	    	expect(result).to.be.true;
	   		var result = Object.isFunction(3.14159);
	    	expect(result).to.be.false;
		});
	  	it("returns boolean isRegexp from polyfill", function() {
	   		var result = Object.isRegexp(/iamgroot/g);
	    	expect(result).to.be.true;
	   		var result = Object.isRegexp(3.14159);
	    	expect(result).to.be.false;
		});
	  	it("returns boolean isArray from polyfill", function() {
	   		var result = Object.isArray([1,2,3]);
	    	expect(result).to.be.true;
	   		var result = Object.isArray(3.14159);
	    	expect(result).to.be.false;
		});
	  	it("returns boolean isUndefined from polyfill", function() {
	   		var result = Object.isUndefined(undefined);
	    	expect(result).to.be.true;
	   		var result = Object.isUndefined(3.14159);
	    	expect(result).to.be.false;
		});
	  	it("returns boolean isDefined from polyfill", function() {
	   		var result = Object.isDefined(undefined);
	    	expect(result).to.be.false;
	   		var result = Object.isDefined(3.14159);
	    	expect(result).to.be.true;
		});
	  	it("returns boolean isObject from polyfill", function() {
	   		var result = Object.isObject({});
	    	expect(result).to.be.true;
	   		var result = Object.isObject(3.14159);
	    	expect(result).to.be.false;
		});
	});
});

