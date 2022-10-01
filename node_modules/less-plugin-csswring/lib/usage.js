module.exports = {
    printUsage: function() {
        console.log("");
        console.log("Clean CSS Plugin");
        console.log("specify plugin with --csswring");
        console.log("To pass an option to clean css, we use similar CLI arguments as from https://github.com/hail2u/node-csswring");
        console.log("--clean-css=\"--sourcemap  --preserve-hacks\"");
        console.log("The options do not require dashes, so this is also equivalent");
        console.log("--clean-css=\"sourcemap preserve-hacks\"");
        //this.printOptions();
        console.log("");
    },
    printOptions: function() {
        //console.log("we support only arguments that make sense for less, 'keep-line-breaks', 'b'");
        //console.log("'s0', 's1', 'advanced', 'compatibility', 'rounding-precision'");
    }
};
