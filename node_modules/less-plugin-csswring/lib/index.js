var getCSSWringProcessor = require("./csswring-processor.js"),
    usage = require("./usage"),
    parseOptions = require("./parse-options");

function LessPluginCSSWring(options) {
    this.options = options;
};

LessPluginCSSWring.prototype = {
    install: function(less, pluginManager) {
        var CSSWringProcessor = getCSSWringProcessor(less);
        pluginManager.addPostProcessor(new CSSWringProcessor(this.options));
    },
    printUsage: function () {
        usage.printUsage();
    },
    setOptions: function(options) {
        this.options = parseOptions(options);
    },
    minVersion: [0, 0, 1]
};

module.exports = LessPluginCSSWring;
