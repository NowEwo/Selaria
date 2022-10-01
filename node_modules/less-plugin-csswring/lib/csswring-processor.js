var CSSWring = require('csswring'),
    usage = require("./usage");

module.exports = function(less) {
    function CSSWringProcessor(options) {
        this.options = options || {};
    };

    CSSWringProcessor.prototype = {
        process: function (css, extra) {
            
            var options = this.options;
            var sourceMap = extra.sourceMap;
            var sourceMapInline, processOptions = {};

            if (sourceMap) {
                options.map = {};
                options.to = sourceMap.getOutputFilename();
                // setting from = input filename works unless there is a directory,
                // then autoprefixer adds the directory onto the source filename twice.
                // setting to to anything else causes an un-necessary extra file to be
                // added to the map, but its better than it failing
                options.from = sourceMap.getOutputFilename();
                sourceMapInline = sourceMap.isInline();
                if (sourceMapInline) {
                    options.map.inline = true;
                } else {
                    options.map.prev = sourceMap.getExternalSourceMap();
                    options.map.annotation = sourceMap.getSourceMapURL();
                }
            }

            var processed = new CSSWring.wring(css,options);

            if (sourceMap && !sourceMapInline) {
                sourceMap.setExternalSourceMap(processed.map);
            }

            return processed.css;
        }
    };

    return CSSWringProcessor;
};
