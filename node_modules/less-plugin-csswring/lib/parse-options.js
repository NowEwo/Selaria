module.exports = function(options) {
    if (typeof options === 'string') {
        var cleanOptionArgs = options.split(" ");
        options = {};
        for(var i = 0; i < cleanOptionArgs.length; i++) {
            var argSplit = cleanOptionArgs[i].split("="),
                argName = argSplit[0].replace(/^-+/,"");
            switch(argName) {
                case "sourcemap":
                    options.sourcemap = true;
                    break;
                case "preserveHacks":
                    options.preserve-hacks = true;
                    break; 
                case "remove-all-comments":
                    options.removeAllComments = true;
                    break;                         
                default:
                    throw new Error("unrecognised csswring option '" + argSplit[0] + "'");
            }
        }
    }
    return options;
};
