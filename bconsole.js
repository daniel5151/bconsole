"use strict";

var util = require('util');

var RESETCOLOR = "\x1b[0m";

// Uses http://stackoverflow.com/a/14842659 as a foundation
var bconsole = function bconsole(custom_options) {
    // Define final object to be returned
    var result = {};

    // define default options and incorporate custom options
    var default_options = {
        pad_to: 16,
        color: true
    };

    var options = default_options;

    result.setOption = function(opt, val) {
        switch (opt) {
            case "pad_to":
                val = Math.max(val, 0) | 0;
                break;
            case "color":
                val = !!val;
                break;
            case "groups":
                // tecnically, this isn't an option,
                // but this is a good place to put it...

                break;
        }
        options[opt] = val;
    };

    if ((typeof custom_options === "undefined" ? "undefined" : typeof custom_options) === "object") {
        Object.keys(custom_options).forEach(function(opt) {
            result.setOption(opt, custom_options[opt]);
        });
    }

    // Generate a blank groups object that contains switches for what groups are on or off
    var groups = {};

    result.toggleGroup = function(group, state) {
        if (typeof state !== "boolean") {
            if (typeof groups[group] !== "undefined") state = !groups[group];
            else state = true;
        }
        groups[group] = state;
    };

    var Log = Error; // Why? Magic...
    Log.prototype.write = function(streamname, logtype, logtype_color, higlight_color, usegroup, args_to_print) {
        // Get Line number
        var m = /(.*):(\d+):(\d+)/.exec(extractLineNumberFromStack(this.stack));

        var filename = m[1],
            line_num = m[2],
            colm_num = m[3];

        // check to see if we are using group logging:
        var group;
        if (usegroup) {
            group = args_to_print.shift().toString();

            // skip groups toggled off
            if (typeof groups[group] === "undefined" || groups[group] === false) return;
        } else {
            group = "";
        }

        var color_char_offset = 0;

        // Add color to logtype
        if (options.color) {
            logtype = logtype_color + logtype + RESETCOLOR;
            color_char_offset += (logtype_color + RESETCOLOR).length;
        }

        // Calculate number of chars that will be printed without including group
        var chars_wo_group = ("[" + line_num + "] " + logtype).length - color_char_offset; // -9 because of color chars

        var max_group_chars = options.pad_to - chars_wo_group - 3; // -3 because of " - "

        // We may need to truncate (or even get rid of) the group name
        if (group.length > max_group_chars) {
            if (max_group_chars == 2) {
                group = group.charAt(0) + ".";
            } else if (max_group_chars == 1) {
                group = group.charAt(0);
            } else if (max_group_chars < 1) {
                // don't show the group if there is not enough space
                group = "";
                usegroup = false;
            } else {
                group = group.slice(0, -2 + (max_group_chars - group.length)) + "..";
            }
        }

        // Calculate number of chars that will be printed with group
        // (necessary for calculating how many spaces will be needed for spacing)
        var chars_w_group = ("[" + line_num + "] " + (usegroup ? group + " - " : "") + logtype).length - color_char_offset;

        var group_color = "\x1b[32m";

        // Add color to group and " - "
        if (usegroup) {
            if (options.color) group = group_color + group + RESETCOLOR;
            group = group + " - ";
        }

        var full_prefix =
            "[" + line_num + "] " +
            " ".repeat(Math.max(options.pad_to - chars_w_group, 0)) +
            group +
            logtype;

        // But what if we don't want color?!
        if (options.color === false) {
            full_prefix.replace(/\x1b\[\d*m/g, "");
        }

        // Check if ew need to add higlighting
        if (higlight_color && options.color) {
            args_to_print.unshift(higlight_color);
            args_to_print.push(RESETCOLOR);
        }

        process[streamname].write(
            full_prefix + " | " +
            args_to_print.map(function(x) {
                if (typeof x === "string") return x;
                return util.inspect(x, {
                    depth: null,
                    colors: options.color
                });
            })
            .join(" ")
            .replace(/\n/g, "\n" + " ".repeat(options.pad_to) + " | ")
            .replace(/\\n/g, "\n")
            .replace(/\\/g, '')
            .concat("\n")
        );
    };

    function extractLineNumberFromStack(stack) {
        // correct line number according to how Log().write implemented
        var line = stack.split('\n')[3];
        // fix for various display text
        line = line.indexOf(' (') >= 0 ? line.split(' (')[1].substring(0, line.length - 1) : line.split('at ')[1];
        return line;
    }

    // method builder
    function logMethod(method) {
        var streamname,
            logtype,
            logtype_color,
            usegroup = false,
            higlight_color = false;

        switch (method) {
            case "glog":
                usegroup = true;
                /* falls through */
            case "log":
                streamname = "stdout";
                logtype = "Log";
                logtype_color = "\x1b[36m"; // blue fg
                break;
            case "gerror":
                usegroup = true;
                /* falls through */
            case "error":
                streamname = "stderr";
                logtype = "Err";
                logtype_color = "\x1b[31m"; // reg fg
                higlight_color = "\x1b[41m"; // red bg
                break;
            case "gwarn":
                usegroup = true;
                /* falls through */
            case "warn":
                streamname = "stderr";
                logtype = "Wrn";
                logtype_color = "\x1b[33m"; // yellow fg
                higlight_color = "\x1b[43m"; // yellow bg
                break;
        }

        // Actual function that gets called when calling bconsole.whatever()
        return function() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            // call handler extension which provides stack trace
            Log().write(streamname, logtype, logtype_color, higlight_color, usegroup, args);
        };
    }

    // -- final buildup -- //

    // build up the different types of logs
    ['log', 'error', 'warn', 'glog', 'gerror', 'gwarn'].forEach(function(method) {
        result[method] = logMethod(method);
    });





    return result; // expose
};

module.exports = bconsole;
