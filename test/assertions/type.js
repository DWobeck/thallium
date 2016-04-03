"use strict"

/* global Symbol */

var t = require("../../lib/index.js").t
var Util = require("../../test-util/assertions.js")
var fail = Util.fail
var basic = Util.basic

describe("assertions (type)", function () {
    var hasSymbol = typeof Symbol === "function" && typeof Symbol() === "symbol"

    describe("t.type()", function () {
        it("checks good types", function () {
            t.type(true, "boolean")
            t.type(false, "boolean")
            t.type(0, "number")
            t.type(1, "number")
            t.type(NaN, "number")
            t.type(Infinity, "number")
            t.type("foo", "string")
            t.type("", "string")
            t.type(null, "object")
            t.type({}, "object")
            t.type([], "object")
            t.type(function () {}, "function")
            t.type(undefined, "undefined")
            if (hasSymbol) t.type(Symbol(), "symbol")
        })

        it("checks bad types", function () {
            fail("type", true, "nope")
            fail("type", false, "nope")
            fail("type", 0, "nope")
            fail("type", 1, "nope")
            fail("type", NaN, "nope")
            fail("type", Infinity, "nope")
            fail("type", "foo", "nope")
            fail("type", "", "nope")
            fail("type", null, "nope")
            fail("type", {}, "nope")
            fail("type", [], "nope")
            fail("type", function () {}, "nope")
            fail("type", undefined, "nope")
            if (hasSymbol) fail("type", Symbol(), "nope")
        })
    })

    describe("t.notType()", function () {
        it("checks good types", function () {
            fail("notType", true, "boolean")
            fail("notType", false, "boolean")
            fail("notType", 0, "number")
            fail("notType", 1, "number")
            fail("notType", NaN, "number")
            fail("notType", Infinity, "number")
            fail("notType", "foo", "string")
            fail("notType", "", "string")
            fail("notType", null, "object")
            fail("notType", {}, "object")
            fail("notType", [], "object")
            fail("notType", function () {}, "function")
            fail("notType", undefined, "undefined")
            if (hasSymbol) fail("notType", Symbol(), "symbol")
        })

        it("checks bad types", function () {
            t.notType(true, "nope")
            t.notType(false, "nope")
            t.notType(0, "nope")
            t.notType(1, "nope")
            t.notType(NaN, "nope")
            t.notType(Infinity, "nope")
            t.notType("foo", "nope")
            t.notType("", "nope")
            t.notType(null, "nope")
            t.notType({}, "nope")
            t.notType([], "nope")
            t.notType(function () {}, "nope")
            t.notType(undefined, "nope")
            if (hasSymbol) t.notType(Symbol(), "nope")
        })
    })

    function testType(name, callback) {
        function check(name) {
            return t[name].bind(t)
        }

        function fail(name) {
            return fail.bind(undefined, name)
        }

        basic("t." + name + "()", function () {
            callback(check(name), fail(name))
        })

        var negated = "not" + name[0].toUpperCase() + name.slice(1)

        basic("t." + negated + "()", function () {
            callback(fail(negated), check(negated))
        })
    }

    testType("boolean", function (is, not) {
        is(true)
        is(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (hasSymbol) not(Symbol())
    })

    testType("number", function (is, not) {
        not(true)
        not(false)
        is(0)
        is(1)
        is(NaN)
        is(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (hasSymbol) not(Symbol())
    })

    testType("function", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        is(function () {})
        not(undefined)
        not()
        if (hasSymbol) not(Symbol())
    })

    testType("object", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        is(null)
        is({})
        is([])
        not(function () {})
        not(undefined)
        not()
        if (hasSymbol) not(Symbol())
    })

    testType("string", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        is("foo")
        is("")
        not(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (hasSymbol) not(Symbol())
    })

    testType("symbol", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (hasSymbol) is(Symbol())
    })

    testType("undefined", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        not(function () {})
        is(undefined)
        is()
        if (hasSymbol) not(Symbol())
    })

    testType("true", function (is, not) {
        is(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (hasSymbol) not(Symbol())
    })

    testType("false", function (is, not) {
        not(true)
        is(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (hasSymbol) not(Symbol())
    })

    testType("null", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        is(null)
        not({})
        not([])
        not(function () {})
        not(undefined)
        not()
        if (hasSymbol) not(Symbol())
    })

    testType("exists", function (is, not) {
        is(true)
        is(false)
        is(0)
        is(1)
        is(NaN)
        is(Infinity)
        is("foo")
        is("")
        not(null)
        is({})
        is([])
        is(function () {})
        not(undefined)
        not()
        if (hasSymbol) is(Symbol())
    })

    testType("array", function (is, not) {
        not(true)
        not(false)
        not(0)
        not(1)
        not(NaN)
        not(Infinity)
        not("foo")
        not("")
        not(null)
        not({})
        is([])
        not(function () {})
        not(undefined)
        not()
        if (hasSymbol) not(Symbol())
    })

    basic("t.instanceof()", function () {
        function A() {}
        t.instanceof(new A(), A)
        t.instanceof(new A(), Object)

        function B() {}
        B.prototype = Object.create(A.prototype)
        B.prototype.constructor = B

        t.instanceof(new B(), B)
        t.instanceof(new B(), A)

        fail("instanceof", new A(), B)
        fail("instanceof", [], RegExp)
    })

    basic("t.notInstanceof()", function () {
        function A() {}
        fail("notInstanceof", new A(), A)
        fail("notInstanceof", new A(), Object)

        function B() {}
        B.prototype = Object.create(A.prototype)
        B.prototype.constructor = B

        fail("notInstanceof", new B(), B)
        fail("notInstanceof", new B(), A)

        t.notInstanceof(new A(), B)
        t.notInstanceof([], RegExp)
    })
})