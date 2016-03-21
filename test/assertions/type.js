import t from "../../src/index.js"
import {fail, basic} from "../../test-util/assertions.js"
import {global} from "../../src/global.js"

const Symbol = typeof global.Symbol === "function" &&
        typeof global.Symbol() === "symbol"
    ? global.Symbol
    : undefined

suite("assertions (type)", () => {
    suite("t.type()", () => {
        test("checks good types", () => {
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
            t.type(() => {}, "function")
            t.type(undefined, "undefined")
            if (typeof Symbol === "function") t.type(Symbol(), "symbol")
        })

        test("checks bad types", () => {
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
            fail("type", () => {}, "nope")
            fail("type", undefined, "nope")
            if (typeof Symbol === "function") fail("type", Symbol(), "nope")
        })
    })

    suite("t.notType()", () => {
        test("checks good types", () => {
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
            fail("notType", () => {}, "function")
            fail("notType", undefined, "undefined")
            if (typeof Symbol === "function") {
                fail("notType", Symbol(), "symbol")
            }
        })

        test("checks bad types", () => {
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
            t.notType(() => {}, "nope")
            t.notType(undefined, "nope")
            if (typeof Symbol === "function") t.notType(Symbol(), "nope")
        })
    })

    function testType(name, callback) {
        basic(`t.${name}()`, () => {
            callback(t[name].bind(t), fail.bind(null, name))
        })

        const negated = `not${name[0].toUpperCase() + name.slice(1)}`

        basic(`t.${negated}()`, () => {
            callback(fail.bind(null, negated), t[negated].bind(t))
        })
    }

    testType("boolean", (is, not) => {
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
        not(() => {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    testType("number", (is, not) => {
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
        not(() => {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    testType("function", (is, not) => {
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
        is(() => {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    testType("object", (is, not) => {
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
        not(() => {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    testType("string", (is, not) => {
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
        not(() => {})
        not(undefined)
        not()
        if (typeof Symbol === "function") not(Symbol())
    })

    testType("symbol", (is, not) => {
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
        not(() => {})
        not(undefined)
        not()
        if (typeof Symbol === "function") is(Symbol())
    })

    testType("undefined", (is, not) => {
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
        not(() => {})
        is(undefined)
        is()
        if (typeof Symbol === "function") not(Symbol())
    })

    basic("t.true()", () => {
        t.true(true)
        fail("true", false)
        fail("true", null)
        fail("true")
        fail("true", undefined)
        fail("true", 1)
        fail("true", "")
        fail("true", "bar")
        fail("true", {})
        fail("true", [])
    })

    basic("t.notTrue()", () => {
        fail("notTrue", true)
        t.notTrue(false)
        t.notTrue(null)
        t.notTrue()
        t.notTrue(undefined)
        t.notTrue(1)
        t.notTrue("")
        t.notTrue("bar")
        t.notTrue({})
        t.notTrue([])
    })

    basic("t.false()", () => {
        fail("false", true)
        t.false(false)
        fail("false", null)
        fail("false")
        fail("false", undefined)
        fail("false", 1)
        fail("false", "")
        fail("false", "bar")
        fail("false", {})
        fail("false", [])
    })

    basic("t.notFalse()", () => {
        t.notFalse(true)
        fail("notFalse", false)
        t.notFalse(null)
        t.notFalse()
        t.notFalse(undefined)
        t.notFalse(1)
        t.notFalse("")
        t.notFalse("bar")
        t.notFalse({})
        t.notFalse([])
    })

    basic("t.null()", () => {
        fail("null", true)
        fail("null", false)
        t.null(null)
        fail("null")
        fail("null", undefined)
        fail("null", 1)
        fail("null", "")
        fail("null", "bar")
        fail("null", {})
        fail("null", [])
    })

    basic("t.notNull()", () => {
        t.notNull(true)
        t.notNull(false)
        fail("notNull", null)
        t.notNull()
        t.notNull(undefined)
        t.notNull(1)
        t.notNull("")
        t.notNull("bar")
        t.notNull({})
        t.notNull([])
    })

    basic("t.undefined()", () => {
        fail("undefined", true)
        fail("undefined", false)
        fail("undefined", null)
        t.undefined()
        t.undefined(undefined)
        fail("undefined", 1)
        fail("undefined", "")
        fail("undefined", "bar")
        fail("undefined", {})
        fail("undefined", [])
    })

    basic("t.notNull()", () => {
        t.notUndefined(true)
        t.notUndefined(false)
        t.notUndefined(null)
        fail("notUndefined")
        fail("notUndefined", undefined)
        t.notUndefined(1)
        t.notUndefined("")
        t.notUndefined("bar")
        t.notUndefined({})
        t.notUndefined([])
    })

    basic("t.array()", () => {
        fail("array", true)
        fail("array", false)
        fail("array", null)
        fail("array")
        fail("array", undefined)
        fail("array", 1)
        fail("array", "")
        fail("array", "bar")
        fail("array", {})
        t.array([])
    })

    basic("t.notArray()", () => {
        t.notArray(true)
        t.notArray(false)
        t.notArray(null)
        t.notArray()
        t.notArray(undefined)
        t.notArray(1)
        t.notArray("")
        t.notArray("bar")
        t.notArray({})
        fail("notArray", [])
    })

    basic("t.instanceof()", () => {
        class A {}
        t.instanceof(new A(), A)
        t.instanceof(new A(), Object)

        class B extends A {}

        t.instanceof(new B(), B)
        t.instanceof(new B(), A)

        fail("instanceof", new A(), B)
        fail("instanceof", [], RegExp)
    })

    basic("t.notInstanceof()", () => {
        class A {}
        fail("notInstanceof", new A(), A)
        fail("notInstanceof", new A(), Object)

        class B extends A {}

        fail("notInstanceof", new B(), B)
        fail("notInstanceof", new B(), A)

        t.notInstanceof(new A(), B)
        t.notInstanceof([], RegExp)
    })
})
