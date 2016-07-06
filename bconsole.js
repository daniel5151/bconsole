"use strict";

var util = require('util');

// Uses http://stackoverflow.com/a/14842659 as a foundation
var bconsole = function(options) {
    var default_options = {
        pad_to: 24,
        max_lineno_digits: 4,
    };

    if (typeof options === "object") {
        Object.keys(options).forEach(function(key) {
            default_options[key] = options[key];
        });
    }
    options = default_options;

    var Log = Error; // Why? Magic...
    Log.prototype.write = function(streamname, postfix, higlight, usegroup, args_to_print) {
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
            if (typeof result.group[group] === "undefined" || result.group[group] === false) return;
        } else {
            group = "";
        }

        // Calculate number of chars to print pre-group
        var chars_wo_group = (`[${line_num}] ${postfix}`).length - 6; // -6 because of color chars

        var max_group_chars = options.pad_to - chars_wo_group;



        if (group.length > max_group_chars)
            group = group.slice(0, -2 + (max_group_chars - group.length)) + "..";

        var lineAndPrefixLength = (
            line_num +
            (group ? group + " - " : "") +
            postfix + "|"
        ).length - 8; // -8 because of color chars


        if (usegroup) group = "\x1b[32m" + group + "\x1b[0m - ";

        var fullprefix =
            "[" + line_num + "]" +
            " ".repeat(Math.max(options.pad_to - lineAndPrefixLength, 0)) +
            group +
            postfix;

        // Check if ew need to add higlighting
        if (higlight) {
            args_to_print.unshift(higlight[0]);
            args_to_print.push(higlight[1]);
        }

        process[streamname].write(fullprefix + " | " + args_to_print.map(function(x) {
                if (typeof x === "string") return x;
                return util.inspect(x, {
                    depth: null,
                    colors: true
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
            prefix,
            usegroup = false,
            higlight = false;

        switch (method) {
            case "glog":
                usegroup = true;
            case "log":
                streamname = "stdout";
                prefix = "\x1b[36mLog\x1b[0m";
                break;
            case "gerror":
                usegroup = true;
            case "error":
                streamname = "stderr";
                prefix = "\x1b[31mErr\x1b[0m";
                higlight = ["\x1b[41m", "\x1b[0m"]; // red
                break;
            case "gwarn":
                usegroup = true;
            case "warn":
                streamname = "stderr";
                prefix = "\x1b[33mWrn\x1b[0m";
                higlight = ["\x1b[43m", "\x1b[0m"]; // yellow
                break;
        }

        // Actual function that gets called when calling bconsole.XXX()
        return function() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            // call handler extension which provides stack trace
            Log().write(streamname, prefix, higlight, usegroup, args);
        };
    }

    // -- final buildup -- //

    var result = {};

    // build up the different types of logs
    ['log', 'error', 'warn', 'glog', 'gerror', 'gwarn'].forEach(function(method) {
        result[method] = logMethod(method);
    });

    // Generate a blank groups objct that the user can populate
    result.group = {};

    return result; // expose
};

module.exports = bconsole;
