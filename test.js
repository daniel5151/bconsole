// instantiate with custom options
var bconsole = require("./bconsole.js")({
    pad_to: 18
});

// Classic log/warn/error
bconsole.log("Plain Log");
bconsole.warn("Plain Warn");
bconsole.error("Plain Error");

// Supports groups
bconsole.toggleGroup(0);

bconsole.glog(0, "Logging from group 0");
bconsole.gwarn(0, "Warning from group 0");
bconsole.gerror(0, "Error from group 0");

bconsole.toggleGroup(0);

bconsole.glog(0, "Won't print");

// Groups can be strings too
bconsole.toggleGroup("strings");

bconsole.glog('string', "Logging from group 'string'");
bconsole.gwarn('string', "Warning from group 'string'");
bconsole.gerror('string', "Error from group 'string'");

// Logs objects using util.inspect()
bconsole.log({
    test: 1,
    test2: "str"
});

// Supports multiline logs!
bconsole.log("This log\nspans across\nthree lines");

// Groups with long names are truncated if there is not
// enough room in the prefix
bconsole.toggleGroup("123456789");
bconsole.glog("123456789", "Big Group Log");

bconsole.log("Logging an array: ", [1, "2", function() {
    return "3";
}]);

// Toggle color on or off
bconsole.warn("Warning with color!");
bconsole.setOption("color", false);
bconsole.warn("Warning without color!");

bconsole.setOption("color", true);

// Change options on the fly!
bconsole.toggleGroup(123456);
for (var i = 20; i >= 10; i--) {
    bconsole.setOption("pad_to", i);
    bconsole.glog(123456, "Pad to: " + i + " with group '123456'");
}














































































bconsole.log("Big Line Number Log")
bconsole.glog("strings", "Big Line Number Log")
