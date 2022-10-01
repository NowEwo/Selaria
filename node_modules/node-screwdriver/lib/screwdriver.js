

var screwdriver = function() {};


screwdriver.prototype.polyfill = function() {
    String.prototype.getExtension = function() {
        return (new screwdriver()).getExtension(this);
    };
    String.prototype.getNoExtension = function() {
        return (new screwdriver()).getNoExtension(this);
    };
    String.prototype.getFilename = function() {
        return (new screwdriver()).getFilename(this);
    };
    String.prototype.getDir = function() {
        return (new screwdriver()).getDir(this);
    };
    String.prototype.fileExists = function() {
        return (new screwdriver()).fileExists(this);
    };
    String.prototype.dirExists = function() {
        return (new screwdriver()).dirExists(this);
    };
    String.prototype.touch = function() {
        return (new screwdriver()).touch(this);
    };
    String.prototype.isHex = function() {
        return (new screwdriver()).isHex(this);
    };
    String.prototype.isHexShort = function() {
        return (new screwdriver()).isHexShort(this);
    };
    String.prototype.trim = function() {
        return (new screwdriver()).trim(this);
    };
    String.prototype.ltrim = function() {
        return (new screwdriver()).ltrim(this);
    };
    String.prototype.rtrim = function() {
        return (new screwdriver()).rtrim(this);
    };
    String.prototype.xtrim = function() {
        return (new screwdriver()).xtrim(this);
    };
    String.prototype.contains = function(str) {
        return (new screwdriver()).contains(this, str);
    };
    String.prototype.endWith = function(str) {
        return (new screwdriver()).xtrim(this, str);
    };
    String.prototype.ucFirst = function(str) {
        return (new screwdriver()).ucFirst(this, str);
    };
    String.prototype.startsWith = function(str, position) {
        return (new screwdriver()).startsWith(this, str, position);
    };
    Array.prototype.quickSort = function(str, position) {
        return (new screwdriver()).quickSort(this, str, position);
    };

    Math.randFloat = function(min, max) {
        return (new screwdriver()).randFloat(min, max);
    };
    Math.randInt = function(min, max) {
        return (new screwdriver()).randInt(min, max);
    };
    Object.isBoolean = (new screwdriver().isBoolean);
    Object.isString = (new screwdriver().isString);
    Object.isObject = (new screwdriver().isObject);
    Object.isArray = (new screwdriver().isArray);
    Object.isDefined = (new screwdriver().isDefined);
    Object.isUndefined = (new screwdriver().isUndefined);
    Object.isInt = (new screwdriver().isInt);
    Object.isRegexp = (new screwdriver().isRegexp);
    Object.isFunction = (new screwdriver().isFunction);
};


/**
 ***********************************************************************************************************
 * MATH
 ***********************************************************************************************************
 */

/*
 * Returns a random float number between min and max, included.
 * @method randFloat
 * @return {float} Float number
 */
screwdriver.prototype.randFloat = function(min, max) {
    return Math.random() * (max - min) + min;
};

/**
 * Returns a random integer between min and max, included. Each Integer have the same distribution.
 * @method randInt
 * @return {integer} Integer number
 */
screwdriver.prototype.randInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


/**
 ***********************************************************************************************************
 * ARRAY
 ***********************************************************************************************************
 */

/**
 * Returns array with unique values
 * @method unique
 */
screwdriver.prototype.unique = function(arr) {
    var o = {},
        i,
        l = arr.length,
        r = [];
    for (i = 0; i < l; i++) {
        o[arr[i]] = arr[i];
    }
    for (i in o) {
        r.push(o[i]);
    }
    return r;
};

/**
 * Check if the value is in the array
 * @param arr The array to check
 * @return {boolean} True if the value is in the array
 * @method inArray
 */
screwdriver.prototype.inArray = function(arr, value) {
    return (arr.indexOf(value) != -1);
};

/**
 * Execute a function for each element of an array
 * @method each
 */
screwdriver.prototype.each = function(array, fn, args) {
    var i;

    if (!this.isArray(array)) array = [].slice.call(array);
    var length = array.length;
    args = args || [];
    if (length) {
        if (this.isFunction(fn)) {
            for (i in array) fn.apply(array[i], args);
        } else if (this.isString(fn)) {
            for (i in array)
                if (array[i][fn] && this.isFunction(array[i][fn])) array[i][fn].apply(array[i], args);
        }
    }
    return this;
};


/**
 ***********************************************************************************************************
 * FILE
 ***********************************************************************************************************
 */

/**
 * @method getExtension
 */
screwdriver.prototype.getExtension = function(str) {
    var ext = str.split('.').pop();
    if (ext == str) {
        return '';
    }
    return ext;
};

/**
 * @method getFilename
 */
screwdriver.prototype.getFilename = function(str) {
    return str.split('/').pop();
};

/**
 * @method getDir
 */
screwdriver.prototype.getDir = function(str) {
    if (str.lastIndexOf("/") == -1) return '';
    return str.substring(0, str.lastIndexOf("/") + 1);
};

/**
 * @method getNoExtension
 */
screwdriver.prototype.getNoExtension = function(str) {
    var filename = this.getFilename(str);
    if (filename.lastIndexOf(".") == -1) return filename;
    return filename.substring(0, filename.lastIndexOf("."));
};

/**
 * Synchronous mkdirp, create directory and parent directories if needed, similar to command "mkdir -p"
 * @method mkdirpSync
 * @param  {string}   dir      Directory to create
 * @param  {string}   mode     Creation mode, default '0777'
 * @return True if the directory is created
 */
screwdriver.prototype.mkdirpSync = function(dir, mode) {
    var path = require('path');
    var fs = require('fs');

    mode = mode || '0777';
    var intMode = parseInt(mode, 8) & (~process.umask());
    dir = path.resolve(dir);
    
    var dirs = dir.split('/');

    // for Windows 
    if (dirs.length == 1) {
        dirs = dir.split('\\');
    }

    var newdir = '';

    for (var t=0; t<dirs.length; t++) {
        newdir = newdir == '' ? dirs[t] : newdir+'/'+dirs[t];
        try {
            fs.mkdirSync(newdir, intMode);
        } catch (error) {
        }
    }
    
    return this.dirExists(dir);
};

/**
 * Create directory and parent directories if needed, similar to command "mkdir -p"
 * @method mkdirp
 * @param  {string}   dir      Directory to create
 * @param  {string}   mode     Creation mode, default '0777'
 * @param  {Function} callback The callback function
 * @return null
 */
screwdriver.prototype.mkdirp = function(dir, mode, callback) {
    callback = callback || function () {};
    var sd = this;
    setTimeout(function() {
        callback(sd.mkdirpSync(dir, mode));
    }, 0);
};

/**
 * Return true if the file exists
 * @param  {string} path File path
 * @return {boolean} True if the file exists
 */
screwdriver.prototype.fileExists = function(path) {
  	try {
        path = path+'';
    	var stat = require('fs').statSync(require('path').resolve(path));
		if (stat && stat.isFile()) {
			return true;
		}    	
  	} catch (ex) {
  	}
	return false;
};

/**
 * Return true if the directory exists
 * @param  {string} dir Directory
 * @return {boolean} True if the directory exists
 */
screwdriver.prototype.dirExists = function(dir) {
  	try {
        dir = dir+'';
    	var stat = require('fs').statSync(dir);
		if (stat && stat.isDirectory()) {
			return true;
		}    	
  	} catch (error) {
  	}

	return false;
};

/**
 * Return true if the file was created or exists and modify the last modified / read date
 * @param  {string} file File path
 * @return {boolean} True on success
 */
screwdriver.prototype.touch = function(file) {
  	try {
    	if (this.fileExists(file)) {
            require('fs').utimesSync(file, new Date(), new Date());
        } else {
            require('fs').writeFileSync(file, '');
        }
        return true;
  	} catch (error) {
  	}

	return false;
};


/**
 ***********************************************************************************************************
 * TYPE
 ***********************************************************************************************************
 */

/**
 * Returns true if value type is integer
 * @method isInt
 */
screwdriver.prototype.isInt = function(value) {
    if (this.isString(value)) return false;
    if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) return true;
    return false;
};

/**
 * Returns true if value type is array
 * @method isArray
 */
screwdriver.prototype.isArray = function(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
};

/**
 * Returns true if value type is boolean
 * @method isBoolean
 */
screwdriver.prototype.isBoolean = function(value) {
    return typeof value == "boolean" || typeof value === 'object' && typeof value.valueOf() === 'boolean';
};

/**
 * Returns true if value type is undefined
 * @method isUndefined
 */
screwdriver.prototype.isUndefined = function(value) {
    return value === undefined || value === null;
};

/**
 * Returns true if value type is defined
 * @method isUndefined
 */
screwdriver.prototype.isDefined = function(value) {
    return value !== undefined && value !== null;
};

/**
 * Returns true if value type is defined
 * @method isString
 */
screwdriver.prototype.isString = function(value) {
    return typeof value == "string";
};

/**
 * Returns true if value type is Regular expression
 * @method isRegex
 */
screwdriver.prototype.isRegexp = function(value) {
    return (value instanceof RegExp);
};

/**
 * Returns True if fn is a function
 * @method isFunction
 */
screwdriver.prototype.isFunction = function(fn) {
    return fn !== undefined && fn && {}.toString.call(fn) === "[object Function]";
};

/**
 * Returns True if obj is an object
 * @method isObject
 */
screwdriver.prototype.isObject = function(obj) {
    if (this.isString(obj) || this.isArray(obj)) return false;
    return obj !== null && typeof obj === "object";
};

/**
 * Returns True if string is a hexadecimal color (#ffffff)
 * @method isObject
 */
screwdriver.prototype.isHex = function(hex) {
    var isHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return isHex ? true : false;
};

/**
 * Returns True if string is a short hexadecimal color (#fff)
 * @method isObject
 */
screwdriver.prototype.isHexShort = function(hex) {
    var isHexShort = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    return isHexShort ? true : false;
};


/**
 ***********************************************************************************************************
 * STRING
 ***********************************************************************************************************
 */

/**
 * Trim string left and right
 * @param  {string} str String to trim
 * @return {string} Result string
 */
screwdriver.prototype.trim = function(str) {
    return (str + '').replace(/^\s+|\s+$/g, '');
};

/**
 * Left trim string
 * @param  {string} str String to trim
 * @return {string} Result string
 */
screwdriver.prototype.ltrim = function(str) {
    return (str + '').replace(/^\s+/, '');
};

/**
 * Right trim string
 * @param  {string} str String to trim
 * @return {string} Result string
 */
screwdriver.prototype.rtrim = function(str) {
    return (str + '').replace(/\s+$/, '');
};

/**
 * Trim string left and right, merge multiple spaces inside the string into one space
 * @param  {string} str String to trim
 * @return {string} Result string
 */
screwdriver.prototype.xtrim = function(str) {
    return (str + '').replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
};

/**
 * @method contains
 */
screwdriver.prototype.contains = function(str, search) {
    return (str + '').indexOf(search) > -1;
};

/**
 * @method endsWith
 */
screwdriver.prototype.endsWith = function(str, search) {
    return (str + '').substr((str + '').length - search.length) === search;
};

// TODO: add to screwdriver
screwdriver.prototype.startsWith = function(str, search, position) {
    position = position || 0;
    return (str + '').substr(position, search.length) === search;
};

screwdriver.prototype.ucFirst = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};


/**
 * Sort array using quicksort algorythm
 * @method quickSort
 * @uses sd.quick(array, function(a,b) { if (a<b) return true; else return false; });
 * @param {array} array
 * @param {function} compare Comparison function that must returns true or false
 * @return {array} The sorted array
 */
screwdriver.prototype.quickSort = (function() {

    function partition(array, left, right, compare) {
        var minEnd = left,
            maxEnd;
        for (maxEnd = left; maxEnd < right - 1; maxEnd += 1) {
            if (compare(array[maxEnd], array[right - 1])) {
                swap(array, maxEnd, minEnd);
                minEnd += 1;
            }
        }
        swap(array, minEnd, right - 1);
        return minEnd;
    }

    function swap(array, i, j) {
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        return array;
    }

    function quickSort(array, left, right, compare) {
        compare = compare || function(a,b) { if (a<b) return true; else return false; };
        if (left < right) {
            var p = partition(array, left, right, compare);
            quickSort(array, left, p, compare);
            quickSort(array, p + 1, right, compare);
        }
        return array;
    }

    return function(array, compare) {
        return quickSort(array, 0, array.length, compare);
    };
}());


/**
 ***********************************************************************************************************
 * TIME
 ***********************************************************************************************************
 */

/**
 * Get now timestamp in ms
 * @param {integer} time Time in seconds to go back or forward in time
 * @return {integer} The date time string
 * @example sd.getDateTime() // get date time string for now
 * @example sd.getDateTime(new Date().getTime() - 10*24*60*60*1000) // get date time string from 10 days ago
 */
screwdriver.prototype.now = function(time) {
    if (!time) {
        return Date.now() || new Date.getTime();
    }
    return new Date().getTime() + time;
};


/**
 * Get the date and time for now or for time
 * @param {integer} time Timestamp in ms
 * @return {string} The date time string
 * @example sd.getDateTime() // get date time string for now
 * @example sd.getDateTime(new Date().getTime() - 10*24*60*60*1000) // get date time string from 10 days ago
 * @example sd.getDateTime(sd.now(-10*24*60*60*1000)) // using sd.now()
 */
screwdriver.prototype.getDateTime = function(time) {

    if (this.isDefined(time)) {
        var date = new Date(time);
    } else {
        var date = new Date();
    }
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
 ***********************************************************************************************************
 * VECTOR
 ***********************************************************************************************************
 */

/**
 * Converts from degree to radian
 * @param  {integer} d Degree value
 * @return {integer} Radian value
 */
screwdriver.prototype.degreeToRadian = function(d) {
  return d * Math.PI / 180;
};
 

/**
 * Converts from radian to degree
 * @param  {integer} r Radian value
 * @return {integer} Degree value
 */
screwdriver.prototype.radianToDegree = function(r) {
  return r * 180 / Math.PI;
};

/**
 * Returns a normalized vector
 * @param  {integer} x 
 * @param  {integer} y 
 * @return {object} Vector object {x,y,force}
 */
screwdriver.prototype.normalize = function(x, y) {
    var length = Math.sqrt(x*x + y*y);
    x /= length;
    y /= length;
    return {x: x, y: y, force: length};
};


/**
 ***********************************************************************************************************
 * COLOR
 ***********************************************************************************************************
 */

screwdriver.prototype.hexToRgb = function(hex) {
	hex = this.normalizeHex(hex);
    var result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

screwdriver.prototype.normalizeHex = function(hex) {
    var result = /^#([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    return result ? '#' + result[1] + result[1] + result[2] + result[2] + result[3] + result[3] : hex;
};

screwdriver.prototype.rgbToHex = function(rgb) {
    return "#" +
        ("0" + parseInt(rgb.r, 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb.g, 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb.b, 10).toString(16)).slice(-2);
};


module.exports = new screwdriver();

