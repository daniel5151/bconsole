var bconsole = require("./bconsole.js")({
    pad_to: 16,
    // color: false
});



bconsole.log("Plain Log");
bconsole.warn("Plain Warn");
bconsole.error("Plain Error");

bconsole.log("Plain Log that is also a really long string that may possibly overflow the terminal oh me oh my what will happen!");


bconsole.group[0] = true;

bconsole.glog(0, "Group 0 Log");
bconsole.gwarn(0, "Group 0 Warn");
bconsole.gerror(0, "Group 0 Error");

bconsole.group["strings"] = true;

bconsole.glog("strings", "Group strings Log");
bconsole.gwarn("strings", "Group strings Warn");
bconsole.gerror("strings", "Group strings Error");

bconsole.group["123456789"] = true;
bconsole.glog("123456789", "Big Group Log");

bconsole.log("Logging an array: ", [1, "2", function() {
    return "3";
}]);

// bconsole.options.pad_to = 26;

bconsole.group["123456"] = true;

for (var i = 20; i >= 0; i--) {
    bconsole.setOption("pad_to", i);
    bconsole.glog("123456", `Pad to: ${i} with group '123456'`);
}














































































bconsole.log("Big Line Number Log")
bconsole.glog("strings", "Big Line Number Log")
