"use strict"

// Note: the reports *must* be well formed. The reporter assumes the reports are
// correct, and it will *not* verify this.

var Promise = require("bluebird")
var resolveAny = require("../../lib/core/common.js").resolveAny
var t = require("../../index.js")
var dot = require("../../r/dot.js")
var R = require("../../lib/reporter/index.js")
var Util = require("../../helpers/base.js")
var Console = require("../../lib/reporter/console.js")
var methods = require("../../lib/methods.js")

var Symbols = R.Symbols
var c = R.color
var p = Util.p
var oldUseColors = Console.useColors()

function n(type, path, value, data) {
    if (type === "pass" || type === "enter") {
        if (data == null) data = {duration: 1, slow: 75}
    }

    return Util.n(type, path, value, data)
}

describe("reporter dot", function () {
    it("is not itself a reporter", function () {
        t.throws(function () { dot(n("start", [])) }, TypeError)
        t.throws(function () { dot(n("enter", [p("test", 0)])) }, TypeError)
        t.throws(function () { dot(n("leave", [p("test", 0)])) }, TypeError)
        t.throws(function () { dot(n("pass", [p("test", 0)])) }, TypeError)
        t.throws(function () { dot(n("fail", [p("test", 0)])) }, TypeError)
        t.throws(function () { dot(n("skip", [p("test", 0)])) }, TypeError)
        t.throws(function () { dot(n("end", [])) }, TypeError)
    })

    function stack(err) {
        var lines = ("    " + err.stack.replace(/^ +/gm, "      "))
            .split(/\r?\n/g)

        lines[0] = "    " + c("fail", lines[0].slice(4))

        for (var i = 1; i < lines.length; i++) {
            lines[i] = "      " + c("fail", lines[i].slice(6))
        }

        return lines
    }

    function Options(list) {
        this.list = list
        this.acc = ""
    }

    methods(Options, {
        print: function (line) {
            var self = this

            return Promise.fromCallback(function (callback) {
                if (self.acc !== "") {
                    line += self.acc
                    self.acc = ""
                }

                var lines = line.split("\n")

                // So lines are printed consistently.
                for (var i = 0; i < lines.length; i++) {
                    self.list.push(lines[i])
                }

                return callback()
            })
        },

        write: function (str) {
            var self = this

            return Promise.fromCallback(function (callback) {
                var index = str.indexOf("\n")

                if (index < 0) {
                    self.acc += str
                    return callback()
                }

                self.list.push(self.acc + str.slice(0, index))

                var lines = str.slice(index + 1).split("\n")

                self.acc = lines.pop()

                for (var i = 0; i < lines.length; i++) {
                    self.list.push(lines[i])
                }

                return callback()
            })
        },

        reset: function () {
            if (this.acc !== "") {
                this.list.push(this.acc)
                this.acc = ""
            }
        },
    })

    function test(name, opts) {
        it(name, function () {
            var list = []
            var reporter = dot(new Options(list))

            return Promise.each(opts.input, function (i) {
                return resolveAny(reporter, undefined, i)
            })
            .then(function () {
                t.match(list, opts.output)
            })
        })
    }

    function run(useColors) { // eslint-disable-line max-statements
        Console.useColors(useColors)
        beforeEach(function () { Console.useColors(useColors) })
        afterEach(function () { Console.useColors(oldUseColors) })

        var pass = c("fast", Symbols.Dot)
        var fail = c("fail", Symbols.Dot)
        var skip = c("skip", Symbols.Dot)

        test("empty test", {
            input: [
                n("start", []),
                n("end", []),
            ],
            output: [
                "",
                c("plain", "  0 tests"),
                "",
            ],
        })

        test("passing 2", {
            input: [
                n("start", []),
                n("pass", [p("test", 0)]),
                n("pass", [p("test", 1)]),
                n("end", []),
            ],
            output: [
                "",
                "  " + pass + pass,
                "",
                c("bright pass", "  ") + c("green", "2 passing"),
                "",
            ],
        })

        var sentinel = new Error("sentinel")

        test("fail 2 with Error", {
            input: [
                n("start", []),
                n("fail", [p("one", 0)], sentinel),
                n("fail", [p("two", 1)], sentinel),
                n("end", []),
            ],
            output: [].concat([
                "",
                "  " + fail + fail,
                "",
                c("bright fail", "  ") + c("fail", "2 failing"),
                "",
                "  " + c("plain", "1) one:"),
            ], stack(sentinel), [
                "",
                "  " + c("plain", "2) two:"),
            ], stack(sentinel), [
                "",
            ]),
        })

        test("pass + fail with Error", {
            input: [
                n("start", []),
                n("pass", [p("one", 0)]),
                n("fail", [p("two", 1)], sentinel),
                n("end", []),
            ],
            output: [].concat([
                "",
                "  " + pass + fail,
                "",
                c("bright pass", "  ") + c("green", "1 passing"),
                c("bright fail", "  ") + c("fail", "1 failing"),
                "",
                "  " + c("plain", "1) two:"),
            ], stack(sentinel), [
                "",
            ]),
        })

        test("fail with Error + pass", {
            input: [
                n("start", []),
                n("fail", [p("one", 0)], sentinel),
                n("pass", [p("two", 1)]),
                n("end", []),
            ],
            output: [].concat([
                "",
                "  " + fail + pass,
                "",
                c("bright pass", "  ") + c("green", "1 passing"),
                c("bright fail", "  ") + c("fail", "1 failing"),
                "",
                "  " + c("plain", "1) one:"),
            ], stack(sentinel), [
                "",
            ]),
        })

        var AssertionError = t.reflect().AssertionError
        var assertion = new AssertionError("Expected 1 to equal 2", 1, 2)

        test("fail 2 with AssertionError", {
            input: [
                n("start", []),
                n("fail", [p("one", 0)], assertion),
                n("fail", [p("two", 1)], assertion),
                n("end", []),
            ],
            output: [].concat([
                "",
                "  " + fail + fail,
                "",
                c("bright fail", "  ") + c("fail", "2 failing"),
                "",
                "  " + c("plain", "1) one:"),
            ], stack(assertion), [
                "",
                "  " + c("plain", "2) two:"),
            ], stack(assertion), [
                "",
            ]),
        })

        test("pass + fail with AssertionError", {
            input: [
                n("start", []),
                n("pass", [p("one", 0)]),
                n("fail", [p("two", 1)], assertion),
                n("end", []),
            ],
            output: [].concat([
                "",
                "  " + pass + fail,
                "",
                c("bright pass", "  ") + c("green", "1 passing"),
                c("bright fail", "  ") + c("fail", "1 failing"),
                "",
                "  " + c("plain", "1) two:"),
            ], stack(assertion), [
                "",
            ]),
        })

        test("fail with AssertionError + pass", {
            input: [
                n("start", []),
                n("fail", [p("one", 0)], assertion),
                n("pass", [p("two", 1)]),
                n("end", []),
            ],
            output: [].concat([
                "",
                "  " + fail + pass,
                "",
                c("bright pass", "  ") + c("green", "1 passing"),
                c("bright fail", "  ") + c("fail", "1 failing"),
                "",
                "  " + c("plain", "1) one:"),
            ], stack(assertion), [
                "",
            ]),
        })

        test("skip 2", {
            input: [
                n("start", []),
                n("skip", [p("one", 0)]),
                n("skip", [p("two", 1)]),
                n("end", []),
            ],
            output: [
                "",
                "  " + skip + skip,
                "",
                c("skip", "  2 skipped"),
                "",
            ],
        })

        test("pass + skip", {
            input: [
                n("start", []),
                n("pass", [p("one", 0)]),
                n("skip", [p("two", 1)]),
                n("end", []),
            ],
            output: [
                "",
                "  " + pass + skip,
                "",
                c("bright pass", "  ") + c("green", "1 passing"),
                c("skip", "  1 skipped"),
                "",
            ],
        })

        test("skip + pass", {
            input: [
                n("start", []),
                n("skip", [p("one", 0)]),
                n("pass", [p("two", 1)]),
                n("end", []),
            ],
            output: [
                "",
                "  " + skip + pass,
                "",
                c("bright pass", "  ") + c("green", "1 passing"),
                c("skip", "  1 skipped"),
                "",
            ],
        })

        test("fail + skip", {
            input: [
                n("start", []),
                n("fail", [p("one", 0)], sentinel),
                n("skip", [p("two", 1)]),
                n("end", []),
            ],
            output: [].concat([
                "",
                "  " + fail + skip,
                "",
                c("skip", "  1 skipped"),
                c("bright fail", "  ") + c("fail", "1 failing"),
                "",
                "  " + c("plain", "1) one:"),
            ], stack(sentinel), [
                "",
            ]),
        })

        test("skip + fail", {
            input: [
                n("start", []),
                n("skip", [p("one", 0)]),
                n("fail", [p("two", 1)], sentinel),
                n("end", []),
            ],
            output: [].concat([
                "",
                "  " + skip + fail,
                "",
                c("skip", "  1 skipped"),
                c("bright fail", "  ") + c("fail", "1 failing"),
                "",
                "  " + c("plain", "1) two:"),
            ], stack(sentinel), [
                "",
            ]),
        })

        var extra = (function () {
            var e = new Error()
            var parts = []
            var stack

            e.name = ""
            stack = e.stack.split(/\r?\n/g).slice(1)

            parts.push("    " + c("fail", "- " + stack[0].trim()))

            for (var i = 1; i < stack.length; i++) {
                parts.push("      " + c("fail", stack[i].trim()))
            }

            return {
                stack: stack.join("\n"),
                parts: parts,
            }
        })()

        test("extra pass", {
            input: [
                n("start", []),
                n("enter", [p("test", 0)]),
                n("enter", [p("test", 0), p("inner", 0)]),
                n("pass", [p("test", 0), p("inner", 0), p("fail", 0)]),
                n("leave", [p("test", 0), p("inner", 0)]),
                n("extra", [p("test", 0), p("inner", 0), p("fail", 0)],
                    {count: 2, value: undefined, stack: extra.stack}),
                n("extra", [p("test", 0), p("inner", 0), p("fail", 0)],
                    {count: 3, value: sentinel, stack: extra.stack}),
                n("leave", [p("test", 0)]),
                n("end", []),
            ],
            output: [].concat([
                "",
                "  " + pass + pass + pass,
                "",
                c("bright pass", "  ") + c("green", "3 passing"),
                c("bright fail", "  ") + c("fail", "1 failing"),
                "",
                "  " + c("plain", "1) test inner fail: (extra)"),
                "    " + c("fail", "- value: undefined"),
            ], extra.parts, [
                "",
                "  " + c("plain", "2) test inner fail: (extra)"),
                "    " + c("fail", "- value: [Error: sentinel]"),
            ], extra.parts, [
                "",
            ]),
        })

        var badType = new TypeError("undefined is not a function")

        test("extra fail", {
            input: [
                n("start", []),
                n("enter", [p("test", 0)]),
                n("enter", [p("test", 0), p("inner", 0)]),
                n("fail", [p("test", 0), p("inner", 0), p("fail", 0)], badType),
                n("leave", [p("test", 0), p("inner", 0)]),
                n("extra", [p("test", 0), p("inner", 0), p("fail", 0)],
                    {count: 2, value: undefined, stack: extra.stack}),
                n("extra", [p("test", 0), p("inner", 0), p("fail", 0)],
                    {count: 3, value: sentinel, stack: extra.stack}),
                n("leave", [p("test", 0)]),
                n("end", []),
            ],
            output: [].concat([
                "",
                "  " + pass + pass + fail,
                "",
                c("bright pass", "  ") + c("green", "2 passing"),
                c("bright fail", "  ") + c("fail", "1 failing"),
                "",
                "  " + c("plain", "1) test inner fail:"),
            ], stack(badType), [
                "",
                "  " + c("plain", "2) test inner fail: (extra)"),
                "    " + c("fail", "- value: undefined"),
            ], extra.parts, [
                "",
                "  " + c("plain", "3) test inner fail: (extra)"),
                "    " + c("fail", "- value: [Error: sentinel]"),
            ], extra.parts, [
                "",
            ]),
        })

        test("internal errors", {
            input: [
                n("start", []),
                n("enter", [p("test", 0)]),
                n("enter", [p("test", 0), p("inner", 0)]),
                n("fail", [p("test", 0), p("inner", 0), p("fail", 0)], badType),
                n("error", [p("test", 0), p("inner", 0)], badType),
            ],
            output: [].concat([
                "",
                "  " + pass + pass + fail,
                "",
            ], badType.stack.split(/\r?\n/g)),
        })

        test("long passing sequence", {
            /* eslint-disable max-len */

            input: [
                n("start", []),
                n("enter", [p("core (basic)", 0)]),
                n("pass", [p("core (basic)", 0), p("has `base()`", 0)]),
                n("pass", [p("core (basic)", 0), p("has `test()`", 1)]),
                n("pass", [p("core (basic)", 0), p("has `parent()`", 2)]),
                n("pass", [p("core (basic)", 0), p("can accept a string + function", 3)]),
                n("pass", [p("core (basic)", 0), p("can accept a string", 4)]),
                n("pass", [p("core (basic)", 0), p("returns the current instance when given a callback", 5)]),
                n("pass", [p("core (basic)", 0), p("returns a prototypal clone when not given a callback", 6)]),
                n("pass", [p("core (basic)", 0), p("runs block tests within tests", 7)]),
                n("pass", [p("core (basic)", 0), p("runs successful inline tests within tests", 8)]),
                n("pass", [p("core (basic)", 0), p("accepts a callback with `t.run()`", 9)]),
                n("leave", [p("core (basic)", 0)]),
                n("enter", [p("cli normalize glob", 1)]),
                n("enter", [p("cli normalize glob", 1), p("current directory", 0)]),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("normalizes a file", 0)]),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("normalizes a glob", 1)]),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("retains trailing slashes", 2)]),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("retains negative", 3)]),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("retains negative + trailing slashes", 4)]),
                n("leave", [p("cli normalize glob", 1), p("current directory", 0)]),
                n("enter", [p("cli normalize glob", 1), p("absolute directory", 1)]),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("normalizes a file", 0)]),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("normalizes a glob", 1)]),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("retains trailing slashes", 2)]),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("retains negative", 3)]),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("retains negative + trailing slashes", 4)]),
                n("leave", [p("cli normalize glob", 1), p("absolute directory", 1)]),
                n("enter", [p("cli normalize glob", 1), p("relative directory", 2)]),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("normalizes a file", 0)]),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("normalizes a glob", 1)]),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("retains trailing slashes", 2)]),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("retains negative", 3)]),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("retains negative + trailing slashes", 4)]),
                n("leave", [p("cli normalize glob", 1), p("relative directory", 2)]),
                n("enter", [p("cli normalize glob", 1), p("edge cases", 3)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes `.` with a cwd of `.`", 0)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes `..` with a cwd of `.`", 1)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes `.` with a cwd of `..`", 2)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes directories with a cwd of `..`", 3)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("removes excess `.`", 4)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("removes excess `..`", 5)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("removes excess combined junk", 6)]),
                n("leave", [p("cli normalize glob", 1), p("edge cases", 3)]),
                n("leave", [p("cli normalize glob", 1)]),
                n("enter", [p("core (timeouts)", 2)]),
                n("pass", [p("core (timeouts)", 2), p("succeeds with own", 0)]),
                n("pass", [p("core (timeouts)", 2), p("fails with own", 1)]),
                n("pass", [p("core (timeouts)", 2), p("succeeds with inherited", 2)]),
                n("pass", [p("core (timeouts)", 2), p("fails with inherited", 3)]),
                n("pass", [p("core (timeouts)", 2), p("gets own set timeout", 4)]),
                n("pass", [p("core (timeouts)", 2), p("gets own inline set timeout", 5)]),
                n("pass", [p("core (timeouts)", 2), p("gets own sync inner timeout", 6)]),
                n("pass", [p("core (timeouts)", 2), p("gets default timeout", 7)]),
                n("leave", [p("core (timeouts)", 2)]),
                n("end", []),
            ],

            output: [
                "",
                "  " +
                // core (basic)
                    pass +
                    pass + pass + pass + pass + pass + pass + pass + pass +
                    pass + pass +

                // cli normalize glob
                    pass +

                // cli normalize glob current directory
                    pass +
                    pass + pass + pass + pass + pass +

                // cli normalize glob absolute directory
                    pass +
                    pass + pass + pass + pass + pass +

                // cli normalize glob relative directory
                    pass +
                    pass + pass + pass + pass + pass +

                // cli normalize glob edge cases
                    pass +
                    pass + pass + pass + pass + pass + pass + pass +

                // core (timeouts)
                    pass +
                    pass + pass + pass + pass + pass + pass + pass + pass,
                "",
                c("bright pass", "  ") + c("green", "47 passing"),
                "",
            ],

            /* eslint-enable max-len */
        })

        test("long mixed bag", {
            /* eslint-disable max-len */

            input: [
                n("start", []),
                n("enter", [p("core (basic)", 0)]),
                n("pass", [p("core (basic)", 0), p("has `base()`", 0)]),
                n("pass", [p("core (basic)", 0), p("has `test()`", 1)]),
                n("pass", [p("core (basic)", 0), p("has `parent()`", 2)]),
                n("skip", [p("core (basic)", 0), p("can accept a string + function", 3)]),
                n("pass", [p("core (basic)", 0), p("can accept a string", 4)]),
                n("pass", [p("core (basic)", 0), p("returns the current instance when given a callback", 5)]),
                n("fail", [p("core (basic)", 0), p("returns a prototypal clone when not given a callback", 6)], badType),
                n("pass", [p("core (basic)", 0), p("runs block tests within tests", 7)]),
                n("pass", [p("core (basic)", 0), p("runs successful inline tests within tests", 8)]),
                n("pass", [p("core (basic)", 0), p("accepts a callback with `t.run()`", 9)]),
                n("leave", [p("core (basic)", 0)]),
                n("enter", [p("cli normalize glob", 1)]),
                n("enter", [p("cli normalize glob", 1), p("current directory", 0)]),
                n("fail", [p("cli normalize glob", 1), p("current directory", 0), p("normalizes a file", 0)], sentinel),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("normalizes a glob", 1)]),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("retains trailing slashes", 2)]),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("retains negative", 3)]),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("retains negative + trailing slashes", 4)]),
                n("leave", [p("cli normalize glob", 1), p("current directory", 0)]),
                n("enter", [p("cli normalize glob", 1), p("absolute directory", 1)]),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("normalizes a file", 0)]),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("normalizes a glob", 1)]),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("retains trailing slashes", 2)]),
                n("skip", [p("cli normalize glob", 1), p("absolute directory", 1), p("retains negative", 3)]),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("retains negative + trailing slashes", 4)]),
                n("leave", [p("cli normalize glob", 1), p("absolute directory", 1)]),
                n("enter", [p("cli normalize glob", 1), p("relative directory", 2)]),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("normalizes a file", 0)]),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("normalizes a glob", 1)]),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("retains trailing slashes", 2)]),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("retains negative", 3)]),
                n("fail", [p("cli normalize glob", 1), p("relative directory", 2), p("retains negative + trailing slashes", 4)], badType),
                n("leave", [p("cli normalize glob", 1), p("relative directory", 2)]),
                n("enter", [p("cli normalize glob", 1), p("edge cases", 3)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes `.` with a cwd of `.`", 0)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes `..` with a cwd of `.`", 1)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes `.` with a cwd of `..`", 2)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes directories with a cwd of `..`", 3)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("removes excess `.`", 4)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("removes excess `..`", 5)]),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("removes excess combined junk", 6)]),
                n("leave", [p("cli normalize glob", 1), p("edge cases", 3)]),
                n("leave", [p("cli normalize glob", 1)]),
                n("enter", [p("core (timeouts)", 2)]),
                n("skip", [p("core (timeouts)", 2), p("succeeds with own", 0)]),
                n("pass", [p("core (timeouts)", 2), p("fails with own", 1)]),
                n("pass", [p("core (timeouts)", 2), p("succeeds with inherited", 2)]),
                n("pass", [p("core (timeouts)", 2), p("fails with inherited", 3)]),
                n("pass", [p("core (timeouts)", 2), p("gets own set timeout", 4)]),
                n("extra", [p("core (timeouts)", 2), p("fails with own", 1)],
                    {count: 2, value: badType, stack: extra.stack}),
                n("fail", [p("core (timeouts)", 2), p("gets own inline set timeout", 5)], sentinel),
                n("skip", [p("core (timeouts)", 2), p("gets own sync inner timeout", 6)]),
                n("pass", [p("core (timeouts)", 2), p("gets default timeout", 7)]),
                n("leave", [p("core (timeouts)", 2)]),
                n("end", []),
            ],

            output: [].concat([
                "",
                "  " +
                // core (basic)
                    pass +
                    pass + pass + pass + skip + pass + pass + fail + pass +
                    pass + pass +

                // cli normalize glob
                    pass +

                // cli normalize glob current directory
                    pass +
                    fail + pass + pass + pass + pass +

                // cli normalize glob absolute directory
                    pass +
                    pass + pass + pass + skip + pass +

                // cli normalize glob relative directory
                    pass +
                    pass + pass + pass + pass + fail +

                // cli normalize glob edge cases
                    pass +
                    pass + pass + pass + pass + pass + pass + pass +

                // core (timeouts)
                    pass +
                    skip + pass + pass + pass + pass + fail + skip + pass,
                "",
                c("bright pass", "  ") + c("green", "39 passing"),
                c("skip", "  4 skipped"),
                c("bright fail", "  ") + c("fail", "5 failing"),
                "",
                "  " + c("plain", "1) core (basic) returns a prototypal clone when not given a callback:"),
            ], stack(badType), [
                "",
                "  " + c("plain", "2) cli normalize glob current directory normalizes a file:"),
            ], stack(sentinel), [
                "",
                "  " + c("plain", "3) cli normalize glob relative directory retains negative + trailing slashes:"),
            ], stack(badType), [
                "",
                "  " + c("plain", "4) core (timeouts) fails with own: (extra)"),
                "    " + c("fail", "- value: [TypeError: undefined is not a function]"),
            ], extra.parts, [
                "",
                "  " + c("plain", "5) core (timeouts) gets own inline set timeout:"),
            ], stack(sentinel), [
                "",
            ]),

            /* eslint-enable max-len */
        })

        context("restarting", function () {
            test("empty test", {
                input: [
                    n("start", []),
                    n("end", []),
                    n("start", []),
                    n("end", []),
                ],
                output: [
                    "",
                    c("plain", "  0 tests"),
                    "",
                    "",
                    c("plain", "  0 tests"),
                    "",
                ],
            })

            test("passing 2", {
                input: [
                    n("start", []),
                    n("pass", [p("test", 0)]),
                    n("pass", [p("test", 1)]),
                    n("end", []),
                    n("start", []),
                    n("pass", [p("test", 0)]),
                    n("pass", [p("test", 1)]),
                    n("end", []),
                ],
                output: [
                    "",
                    "  " + pass + pass,
                    "",
                    c("bright pass", "  ") + c("green", "2 passing"),
                    "",
                    "",
                    "  " + pass + pass,
                    "",
                    c("bright pass", "  ") + c("green", "2 passing"),
                    "",
                ],
            })

            var sentinel = new Error("sentinel")

            test("fail 2 with Error", {
                input: [
                    n("start", []),
                    n("fail", [p("one", 0)], sentinel),
                    n("fail", [p("two", 1)], sentinel),
                    n("end", []),
                    n("start", []),
                    n("fail", [p("one", 0)], sentinel),
                    n("fail", [p("two", 1)], sentinel),
                    n("end", []),
                ],
                output: [].concat([
                    "",
                    "  " + fail + fail,
                    "",
                    c("bright fail", "  ") + c("fail", "2 failing"),
                    "",
                    "  " + c("plain", "1) one:"),
                ], stack(sentinel), [
                    "",
                    "  " + c("plain", "2) two:"),
                ], stack(sentinel), [
                    "",
                    "",
                    "  " + fail + fail,
                    "",
                    c("bright fail", "  ") + c("fail", "2 failing"),
                    "",
                    "  " + c("plain", "1) one:"),
                ], stack(sentinel), [
                    "",
                    "  " + c("plain", "2) two:"),
                ], stack(sentinel), [
                    "",
                ]),
            })

            test("pass + fail with Error", {
                input: [
                    n("start", []),
                    n("pass", [p("one", 0)]),
                    n("fail", [p("two", 1)], sentinel),
                    n("end", []),
                    n("start", []),
                    n("pass", [p("one", 0)]),
                    n("fail", [p("two", 1)], sentinel),
                    n("end", []),
                ],
                output: [].concat([
                    "",
                    "  " + pass + fail,
                    "",
                    c("bright pass", "  ") + c("green", "1 passing"),
                    c("bright fail", "  ") + c("fail", "1 failing"),
                    "",
                    "  " + c("plain", "1) two:"),
                ], stack(sentinel), [
                    "",
                    "",
                    "  " + pass + fail,
                    "",
                    c("bright pass", "  ") + c("green", "1 passing"),
                    c("bright fail", "  ") + c("fail", "1 failing"),
                    "",
                    "  " + c("plain", "1) two:"),
                ], stack(sentinel), [
                    "",
                ]),
            })

            test("fail with Error + pass", {
                input: [
                    n("start", []),
                    n("fail", [p("one", 0)], sentinel),
                    n("pass", [p("two", 1)]),
                    n("end", []),
                    n("start", []),
                    n("fail", [p("one", 0)], sentinel),
                    n("pass", [p("two", 1)]),
                    n("end", []),
                ],
                output: [].concat([
                    "",
                    "  " + fail + pass,
                    "",
                    c("bright pass", "  ") + c("green", "1 passing"),
                    c("bright fail", "  ") + c("fail", "1 failing"),
                    "",
                    "  " + c("plain", "1) one:"),
                ], stack(sentinel), [
                    "",
                    "",
                    "  " + fail + pass,
                    "",
                    c("bright pass", "  ") + c("green", "1 passing"),
                    c("bright fail", "  ") + c("fail", "1 failing"),
                    "",
                    "  " + c("plain", "1) one:"),
                ], stack(sentinel), [
                    "",
                ]),
            })

            var assertion = new AssertionError("Expected 1 to equal 2", 1, 2)

            test("fail 2 with AssertionError", {
                input: [
                    n("start", []),
                    n("fail", [p("one", 0)], assertion),
                    n("fail", [p("two", 1)], assertion),
                    n("end", []),
                    n("start", []),
                    n("fail", [p("one", 0)], assertion),
                    n("fail", [p("two", 1)], assertion),
                    n("end", []),
                ],
                output: [].concat([
                    "",
                    "  " + fail + fail,
                    "",
                    c("bright fail", "  ") + c("fail", "2 failing"),
                    "",
                    "  " + c("plain", "1) one:"),
                ], stack(assertion), [
                    "",
                    "  " + c("plain", "2) two:"),
                ], stack(assertion), [
                    "",
                    "",
                    "  " + fail + fail,
                    "",
                    c("bright fail", "  ") + c("fail", "2 failing"),
                    "",
                    "  " + c("plain", "1) one:"),
                ], stack(assertion), [
                    "",
                    "  " + c("plain", "2) two:"),
                ], stack(assertion), [
                    "",
                ]),
            })

            test("pass + fail with AssertionError", {
                input: [
                    n("start", []),
                    n("pass", [p("one", 0)]),
                    n("fail", [p("two", 1)], assertion),
                    n("end", []),
                    n("start", []),
                    n("pass", [p("one", 0)]),
                    n("fail", [p("two", 1)], assertion),
                    n("end", []),
                ],
                output: [].concat([
                    "",
                    "  " + pass + fail,
                    "",
                    c("bright pass", "  ") + c("green", "1 passing"),
                    c("bright fail", "  ") + c("fail", "1 failing"),
                    "",
                    "  " + c("plain", "1) two:"),
                ], stack(assertion), [
                    "",
                    "",
                    "  " + pass + fail,
                    "",
                    c("bright pass", "  ") + c("green", "1 passing"),
                    c("bright fail", "  ") + c("fail", "1 failing"),
                    "",
                    "  " + c("plain", "1) two:"),
                ], stack(assertion), [
                    "",
                ]),
            })

            test("fail with AssertionError + pass", {
                input: [
                    n("start", []),
                    n("fail", [p("one", 0)], assertion),
                    n("pass", [p("two", 1)]),
                    n("end", []),
                    n("start", []),
                    n("fail", [p("one", 0)], assertion),
                    n("pass", [p("two", 1)]),
                    n("end", []),
                ],
                output: [].concat([
                    "",
                    "  " + fail + pass,
                    "",
                    c("bright pass", "  ") + c("green", "1 passing"),
                    c("bright fail", "  ") + c("fail", "1 failing"),
                    "",
                    "  " + c("plain", "1) one:"),
                ], stack(assertion), [
                    "",
                    "",
                    "  " + fail + pass,
                    "",
                    c("bright pass", "  ") + c("green", "1 passing"),
                    c("bright fail", "  ") + c("fail", "1 failing"),
                    "",
                    "  " + c("plain", "1) one:"),
                ], stack(assertion), [
                    "",
                ]),
            })
        })
    }

    context("no color", function () { run(false) })
    context("with color", function () { run(true) })

    context("speed", function () {
        // Speed affects `"pass"` and `"enter"` events only.
        var fast = c("fast", Symbols.Dot)
        var medium = c("medium", Symbols.Dot)
        var slow = c("slow", Symbols.Dot)

        function at(speed) {
            if (speed === "slow") return {duration: 80, slow: 75}
            if (speed === "medium") return {duration: 40, slow: 75}
            if (speed === "fast") return {duration: 20, slow: 75}
            throw new RangeError("Unknown speed: `" + speed + "`")
        }

        test("is marked with color", {
            /* eslint-disable max-len */

            input: [
                n("start", []),
                n("enter", [p("core (basic)", 0)], undefined, at("fast")),
                n("pass", [p("core (basic)", 0), p("has `base()`", 0)], undefined, at("fast")),
                n("pass", [p("core (basic)", 0), p("has `test()`", 1)], undefined, at("fast")),
                n("pass", [p("core (basic)", 0), p("has `parent()`", 2)], undefined, at("fast")),
                n("pass", [p("core (basic)", 0), p("can accept a string + function", 3)], undefined, at("fast")),
                n("pass", [p("core (basic)", 0), p("can accept a string", 4)], undefined, at("fast")),
                n("pass", [p("core (basic)", 0), p("returns the current instance when given a callback", 5)], undefined, at("medium")),
                n("pass", [p("core (basic)", 0), p("returns a prototypal clone when not given a callback", 6)], undefined, at("medium")),
                n("pass", [p("core (basic)", 0), p("runs block tests within tests", 7)], undefined, at("fast")),
                n("pass", [p("core (basic)", 0), p("runs successful inline tests within tests", 8)], undefined, at("fast")),
                n("pass", [p("core (basic)", 0), p("accepts a callback with `t.run()`", 9)], undefined, at("fast")),
                n("leave", [p("core (basic)", 0)]),
                n("enter", [p("cli normalize glob", 1)], undefined, at("fast")),
                n("enter", [p("cli normalize glob", 1), p("current directory", 0)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("normalizes a file", 0)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("normalizes a glob", 1)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("retains trailing slashes", 2)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("retains negative", 3)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("current directory", 0), p("retains negative + trailing slashes", 4)], undefined, at("fast")),
                n("leave", [p("cli normalize glob", 1), p("current directory", 0)]),
                n("enter", [p("cli normalize glob", 1), p("absolute directory", 1)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("normalizes a file", 0)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("normalizes a glob", 1)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("retains trailing slashes", 2)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("retains negative", 3)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("absolute directory", 1), p("retains negative + trailing slashes", 4)], undefined, at("fast")),
                n("leave", [p("cli normalize glob", 1), p("absolute directory", 1)]),
                n("enter", [p("cli normalize glob", 1), p("relative directory", 2)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("normalizes a file", 0)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("normalizes a glob", 1)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("retains trailing slashes", 2)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("retains negative", 3)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("relative directory", 2), p("retains negative + trailing slashes", 4)], undefined, at("fast")),
                n("leave", [p("cli normalize glob", 1), p("relative directory", 2)]),
                n("enter", [p("cli normalize glob", 1), p("edge cases", 3)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes `.` with a cwd of `.`", 0)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes `..` with a cwd of `.`", 1)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes `.` with a cwd of `..`", 2)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("normalizes directories with a cwd of `..`", 3)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("removes excess `.`", 4)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("removes excess `..`", 5)], undefined, at("fast")),
                n("pass", [p("cli normalize glob", 1), p("edge cases", 3), p("removes excess combined junk", 6)], undefined, at("fast")),
                n("leave", [p("cli normalize glob", 1), p("edge cases", 3)]),
                n("leave", [p("cli normalize glob", 1)]),
                n("enter", [p("core (timeouts)", 2)], undefined, at("fast")),
                n("pass", [p("core (timeouts)", 2), p("succeeds with own", 0)], undefined, at("medium")),
                n("pass", [p("core (timeouts)", 2), p("fails with own", 1)], undefined, at("medium")),
                n("pass", [p("core (timeouts)", 2), p("succeeds with inherited", 2)], undefined, at("slow")),
                n("pass", [p("core (timeouts)", 2), p("fails with inherited", 3)], undefined, at("slow")),
                n("pass", [p("core (timeouts)", 2), p("gets own set timeout", 4)], undefined, at("fast")),
                n("pass", [p("core (timeouts)", 2), p("gets own inline set timeout", 5)], undefined, at("fast")),
                n("pass", [p("core (timeouts)", 2), p("gets own sync inner timeout", 6)], undefined, at("fast")),
                n("pass", [p("core (timeouts)", 2), p("gets default timeout", 7)], undefined, at("medium")),
                n("leave", [p("core (timeouts)", 2)]),
                n("end", []),
            ],

            output: [
                "",
                "  " +
                // core (basic)
                    fast +
                    fast + fast + fast + fast + fast + medium + medium + fast +
                    fast + fast +

                // cli normalize glob
                    fast +

                // cli normalize glob current directory
                    fast +
                    fast + fast + fast + fast + fast +

                // cli normalize glob absolute directory
                    fast +
                    fast + fast + fast + fast + fast +

                // cli normalize glob relative directory
                    fast +
                    fast + fast + fast + fast + fast +

                // cli normalize glob edge cases
                    fast +
                    fast + fast + fast + fast + fast + fast + fast +

                // core (timeouts)
                    fast +
                    medium + medium + slow + slow + fast + fast + fast + medium,
                "",
                c("bright pass", "  ") + c("green", "47 passing"),
                "",
            ],

            /* eslint-enable max-len */
        })
    })
})
