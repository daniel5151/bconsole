var bconsole = require("./bconsole.js")({
    pad_to: 24,
    // color: false
});

bconsole.log("Plain Log");
bconsole.warn("Plain Warn");
bconsole.error("Plain Error");

bconsole.log("Plain Log that is also a really long string that may possibly overflow the terminal oh me oh my what will happen!");


bconsole.toggleGroup(0);

bconsole.glog(0, "Group 0 Log");
bconsole.gwarn(0, "Group 0 Warn");
bconsole.gerror(0, "Group 0 Error");

bconsole.toggleGroup("strings");

bconsole.glog("strings", "Group strings Log");
bconsole.gwarn("strings", "Group strings Warn");
bconsole.gerror("strings", "Group strings Error");

bconsole.toggleGroup("123456789");
bconsole.glog("123456789", "Big Group Log");

bconsole.log("Logging an array: ", [1, "2", function() {
    return "3";
}]);

bconsole.error("Warning with color!");
bconsole.setOption("color", false);
bconsole.error("Warning without color!");

bconsole.setOption("color", true);


// bconsole.options.pad_to = 26;

bconsole.toggleGroup("123456");

for (var i = 20; i >= 0; i--) {
    bconsole.setOption("pad_to", i);
    bconsole.glog("123456", "Pad to: " + i + " with group '123456'");
}














































































bconsole.log("Big Line Number Log")
bconsole.glog("strings", "Big Line Number Log")
