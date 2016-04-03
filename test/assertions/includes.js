"use strict"

var t = require("../../lib/index").t
var fail = require("../../test-util/assertions.js").fail

describe("assertions (includes)", function () {
    it("correct aliases", function () {
        t.equal(t.includesMatchLoose, t.includesLooseDeep)
        t.equal(t.notIncludesMatchLooseAll, t.notIncludesLooseDeepAll)
        t.equal(t.includesMatchLooseAny, t.includesLooseDeepAny)
        t.equal(t.notIncludesMatchLoose, t.notIncludesLooseDeep)
    })

    describe("t.includes()", function () {
        it("checks numbers", function () {
            t.includes([1, 2, 3, 4, 5], 1)
            t.includes([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            fail("includes", ["1", 2, 3, 4, 5], 1)
            fail("includes", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.includes([obj1, 3, obj3, "foo"], [obj1, obj3])
            t.includes([obj1, obj2, obj3], [obj1, obj2, obj3])
            fail("includes", [obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            t.includes([{}, {}], [])
        })

        it("checks missing numbers", function () {
            fail("includes", [1, 2, 3, 4, 5], 10)
            fail("includes", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            fail("includes", [obj1, obj2, 3, "foo", {}], [{}])
            fail("includes", [obj1, obj2, obj3], [{}])
            fail("includes", [obj1, obj2, obj3], [[]])
        })
    })

    describe("t.notIncludesAll()", function () {
        it("checks numbers", function () {
            fail("notIncludesAll", [1, 2, 3, 4, 5], 1)
            fail("notIncludesAll", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            t.notIncludesAll(["1", 2, 3, 4, 5], 1)
            t.notIncludesAll(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            fail("notIncludesAll", [obj1, 3, obj3, "foo"], [obj1, obj3])
            fail("notIncludesAll", [obj1, obj2, obj3], [obj1, obj2, obj3])
            t.notIncludesAll([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            t.notIncludesAll([{}, {}], [])
        })

        it("checks missing numbers", function () {
            t.notIncludesAll([1, 2, 3, 4, 5], 10)
            t.notIncludesAll([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.notIncludesAll([obj1, obj2, 3, "foo", {}], [{}])
            t.notIncludesAll([obj1, obj2, obj3], [{}])
            t.notIncludesAll([obj1, obj2, obj3], [[]])
        })
    })

    describe("t.includesAny()", function () {
        it("checks numbers", function () {
            t.includesAny([1, 2, 3, 4, 5], 1)
            t.includesAny([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            fail("includesAny", ["1", 2, 3, 4, 5], 1)
            fail("includesAny", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.includesAny([obj1, 3, obj3, "foo"], [obj1, obj3])
            t.includesAny([obj1, obj2, obj3], [obj1, obj2, obj3])
            t.includesAny([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            t.includesAny([{}, {}], [])
        })

        it("checks missing numbers", function () {
            fail("includesAny", [1, 2, 3, 4, 5], 10)
            fail("includesAny", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            fail("includesAny", [obj1, obj2, 3, "foo", {}], [{}])
            fail("includesAny", [obj1, obj2, obj3], [{}])
            fail("includesAny", [obj1, obj2, obj3], [[]])
        })
    })

    describe("t.notIncludes()", function () {
        it("checks numbers", function () {
            fail("notIncludes", [1, 2, 3, 4, 5], 1)
            fail("notIncludes", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            t.notIncludes(["1", 2, 3, 4, 5], 1)
            t.notIncludes(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            fail("notIncludes", [obj1, 3, obj3, "foo"], [obj1, obj3])
            fail("notIncludes", [obj1, obj2, obj3], [obj1, obj2, obj3])
            fail("notIncludes", [obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            t.notIncludes([{}, {}], [])
        })

        it("checks missing numbers", function () {
            t.notIncludes([1, 2, 3, 4, 5], 10)
            t.notIncludes([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.notIncludes([obj1, obj2, 3, "foo", {}], [{}])
            t.notIncludes([obj1, obj2, obj3], [{}])
            t.notIncludes([obj1, obj2, obj3], [[]])
        })
    })

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    describe("t.includesLoose()", function () {
        it("checks numbers", function () {
            t.includesLoose([1, 2, 3, 4, 5], 1)
            t.includesLoose([1, 2, 3, 4, 5], [1])
        })

        it("is loose", function () {
            t.includesLoose(["1", 2, 3, 4, 5], 1)
            t.includesLoose(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.includesLoose([obj1, 3, obj3, "foo"], [obj1, obj3])
            t.includesLoose([obj1, obj2, obj3], [obj1, obj2, obj3])
            fail("includesLoose", [obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            t.includesLoose([{}, {}], [])
        })

        it("checks missing numbers", function () {
            fail("includesLoose", [1, 2, 3, 4, 5], 10)
            fail("includesLoose", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            fail("includesLoose", [obj1, obj2, 3, "foo", {}], [{}])
            fail("includesLoose", [obj1, obj2, obj3], [{}])
            fail("includesLoose", [obj1, obj2, obj3], [[]])
        })
    })

    describe("t.notIncludesLooseAll()", function () {
        it("checks numbers", function () {
            fail("notIncludesLooseAll", [1, 2, 3, 4, 5], 1)
            fail("notIncludesLooseAll", [1, 2, 3, 4, 5], [1])
        })

        it("is loose", function () {
            fail("notIncludesLooseAll", ["1", 2, 3, 4, 5], 1)
            fail("notIncludesLooseAll", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            fail("notIncludesLooseAll", [obj1, 3, obj3, "foo"], [obj1, obj3])
            fail("notIncludesLooseAll", [obj1, obj2, obj3], [obj1, obj2, obj3])
            t.notIncludesLooseAll([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            t.notIncludesLooseAll([{}, {}], [])
        })

        it("checks missing numbers", function () {
            t.notIncludesLooseAll([1, 2, 3, 4, 5], 10)
            t.notIncludesLooseAll([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.notIncludesLooseAll([obj1, obj2, 3, "foo", {}], [{}])
            t.notIncludesLooseAll([obj1, obj2, obj3], [{}])
            t.notIncludesLooseAll([obj1, obj2, obj3], [[]])
        })
    })

    describe("t.includesAny()", function () {
        it("checks numbers", function () {
            t.includesLooseAny([1, 2, 3, 4, 5], 1)
            t.includesLooseAny([1, 2, 3, 4, 5], [1])
        })

        it("is loose", function () {
            t.includesLooseAny(["1", 2, 3, 4, 5], 1)
            t.includesLooseAny(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.includesLooseAny([obj1, 3, obj3, "foo"], [obj1, obj3])
            t.includesLooseAny([obj1, obj2, obj3], [obj1, obj2, obj3])
            t.includesLooseAny([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            t.includesLooseAny([{}, {}], [])
        })

        it("checks missing numbers", function () {
            fail("includesLooseAny", [1, 2, 3, 4, 5], 10)
            fail("includesLooseAny", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            fail("includesLooseAny", [obj1, obj2, 3, "foo", {}], [{}])
            fail("includesLooseAny", [obj1, obj2, obj3], [{}])
            fail("includesLooseAny", [obj1, obj2, obj3], [[]])
        })
    })

    describe("t.notIncludesLoose()", function () {
        it("checks numbers", function () {
            fail("notIncludesLoose", [1, 2, 3, 4, 5], 1)
            fail("notIncludesLoose", [1, 2, 3, 4, 5], [1])
        })

        it("is loose", function () {
            fail("notIncludesLoose", ["1", 2, 3, 4, 5], 1)
            fail("notIncludesLoose", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            fail("notIncludesLoose", [obj1, 3, obj3, "foo"], [obj1, obj3])
            fail("notIncludesLoose", [obj1, obj2, obj3], [obj1, obj2, obj3])
            fail("notIncludesLoose", [obj1, 3, obj3, "foo"], [obj1, obj2, obj3])
        })

        it("checks nothing", function () {
            t.notIncludesLoose([{}, {}], [])
        })

        it("checks missing numbers", function () {
            t.notIncludesLoose([1, 2, 3, 4, 5], 10)
            t.notIncludesLoose([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.notIncludesLoose([obj1, obj2, 3, "foo", {}], [{}])
            t.notIncludesLoose([obj1, obj2, obj3], [{}])
            t.notIncludesLoose([obj1, obj2, obj3], [[]])
        })
    })

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    describe("t.includesDeep()", function () {
        it("checks numbers", function () {
            t.includesDeep([1, 2, 3, 4, 5], 1)
            t.includesDeep([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            fail("includesDeep", ["1", 2, 3, 4, 5], 1)
            fail("includesDeep", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.includesDeep([obj1, 3, obj3, "foo"], [obj1, obj3])
            t.includesDeep([obj1, obj2, obj3], [obj1, obj2, obj3])
            t.includesDeep([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])

            t.includesDeep([{foo: 1}, {bar: 2}, 3, "foo", {}], [{foo: 1}])
            t.includesDeep([{foo: 1}, {bar: 2}, {}], [{bar: 2}, {}])
            t.includesDeep([{foo: 1}, {bar: 2}, []], [[]])
        })

        it("checks nothing", function () {
            t.includesDeep([{}, {}], [])
        })

        it("checks missing numbers", function () {
            fail("includesDeep", [1, 2, 3, 4, 5], 10)
            fail("includesDeep", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            fail("includesDeep", [{foo: 1}, {bar: 2}, {}], [[]])
            fail("includesDeep", [{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("t.notIncludesDeepAll()", function () {
        it("checks numbers", function () {
            fail("notIncludesDeepAll", [1, 2, 3, 4, 5], 1)
            fail("notIncludesDeepAll", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            t.notIncludesDeepAll(["1", 2, 3, 4, 5], 1)
            t.notIncludesDeepAll(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            t.notIncludesDeepAll([{foo: 1}, 3, "foo"], ["foo", 1])
            t.notIncludesDeepAll([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 1}])
            fail("notIncludesDeepAll",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            t.notIncludesDeepAll([{}, {}], [])
        })

        it("checks missing numbers", function () {
            t.notIncludesDeepAll([1, 2, 3, 4, 5], 10)
            t.notIncludesDeepAll([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            t.notIncludesDeepAll([{foo: 1}, {bar: 2}, {}], [[]])
            t.notIncludesDeepAll([{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("t.includesDeepAny()", function () {
        it("checks numbers", function () {
            t.includesDeepAny([1, 2, 3, 4, 5], 1)
            t.includesDeepAny([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            fail("includesDeepAny", ["1", 2, 3, 4, 5], 1)
            fail("includesDeepAny", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            t.includesDeepAny([{foo: 1}, 3, "foo"], ["foo", 1])
            t.includesDeepAny([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 1}])
            t.includesDeepAny([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            t.includesDeepAny([{}, {}], [])
        })

        it("checks missing numbers", function () {
            fail("includesDeepAny", [1, 2, 3, 4, 5], 10)
            fail("includesDeepAny", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            fail("includesDeepAny", [{foo: 1}, {bar: 2}, {}], [[]])
            t.includesDeepAny([{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("t.notIncludesDeep()", function () {
        it("checks numbers", function () {
            fail("notIncludesDeep", [1, 2, 3, 4, 5], 1)
            fail("notIncludesDeep", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            t.notIncludesDeep(["1", 2, 3, 4, 5], 1)
            t.notIncludesDeep(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            fail("notIncludesDeep", [{foo: 1}, 3, "foo"], ["foo", 1])
            fail("notIncludesDeep", [{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 1}])
            fail("notIncludesDeep", [{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            t.notIncludesDeep([{}, {}], [])
        })

        it("checks missing numbers", function () {
            t.notIncludesDeep([1, 2, 3, 4, 5], 10)
            t.notIncludesDeep([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            t.notIncludesDeep([{foo: 1}, {bar: 2}, {}], [[]])
            fail("notIncludesDeep", [{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    describe("t.includesLooseDeep()", function () {
        it("checks numbers", function () {
            t.includesLooseDeep([1, 2, 3, 4, 5], 1)
            t.includesLooseDeep([1, 2, 3, 4, 5], [1])
        })

        it("is loose", function () {
            t.includesLooseDeep(["1", 2, 3, 4, 5], 1)
            t.includesLooseDeep(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.includesLooseDeep([obj1, 3, obj3, "foo"], [obj1, obj3])
            t.includesLooseDeep([obj1, obj2, obj3], [obj1, obj2, obj3])
            t.includesLooseDeep([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])

            t.includesLooseDeep([{foo: 1}, {bar: 2}, 3, "foo", {}], [{foo: 1}])
            t.includesLooseDeep([{foo: 1}, {bar: 2}, {}], [{bar: 2}, {}])
            t.includesLooseDeep([{foo: 1}, {bar: 2}, []], [[]])
        })

        it("checks nothing", function () {
            t.includesLooseDeep([{}, {}], [])
        })

        it("checks missing numbers", function () {
            fail("includesLooseDeep", [1, 2, 3, 4, 5], 10)
            fail("includesLooseDeep", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            fail("includesLooseDeep", [{foo: 1}, {bar: 2}, {}], [[]])
            fail("includesLooseDeep", [{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("t.notIncludesLooseDeepAll()", function () {
        it("checks numbers", function () {
            fail("notIncludesLooseDeepAll", [1, 2, 3, 4, 5], 1)
            fail("notIncludesLooseDeepAll", [1, 2, 3, 4, 5], [1])
        })

        it("is loose", function () {
            fail("notIncludesLooseDeepAll", ["1", 2, 3, 4, 5], 1)
            fail("notIncludesLooseDeepAll", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            t.notIncludesLooseDeepAll([{foo: 1}, 3, "foo"], ["foo", 1])

            t.notIncludesLooseDeepAll(
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 1}])

            fail("notIncludesLooseDeepAll",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            t.notIncludesLooseDeepAll([{}, {}], [])
        })

        it("checks missing numbers", function () {
            t.notIncludesLooseDeepAll([1, 2, 3, 4, 5], 10)
            t.notIncludesLooseDeepAll([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            t.notIncludesLooseDeepAll([{foo: 1}, {bar: 2}, {}], [[]])
            t.notIncludesLooseDeepAll([{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("t.includesLooseDeepAny()", function () {
        it("checks numbers", function () {
            t.includesLooseDeepAny([1, 2, 3, 4, 5], 1)
            t.includesLooseDeepAny([1, 2, 3, 4, 5], [1])
        })

        it("is loose", function () {
            t.includesLooseDeepAny(["1", 2, 3, 4, 5], 1)
            t.includesLooseDeepAny(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            t.includesLooseDeepAny([{foo: 1}, 3, "foo"], ["foo", 1])
            t.includesLooseDeepAny([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 1}])
            t.includesLooseDeepAny([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            t.includesLooseDeepAny([{}, {}], [])
        })

        it("checks missing numbers", function () {
            fail("includesLooseDeepAny", [1, 2, 3, 4, 5], 10)
            fail("includesLooseDeepAny", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            fail("includesLooseDeepAny", [{foo: 1}, {bar: 2}, {}], [[]])
            t.includesLooseDeepAny([{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("t.notIncludesLooseDeep()", function () {
        it("checks numbers", function () {
            fail("notIncludesLooseDeep", [1, 2, 3, 4, 5], 1)
            fail("notIncludesLooseDeep", [1, 2, 3, 4, 5], [1])
        })

        it("is loose", function () {
            fail("notIncludesLooseDeep", ["1", 2, 3, 4, 5], 1)
            fail("notIncludesLooseDeep", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            fail("notIncludesLooseDeep", [{foo: 1}, 3, "foo"], ["foo", 1])

            fail("notIncludesLooseDeep",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 1}])

            fail("notIncludesLooseDeep",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            t.notIncludesLooseDeep([{}, {}], [])
        })

        it("checks missing numbers", function () {
            t.notIncludesLooseDeep([1, 2, 3, 4, 5], 10)
            t.notIncludesLooseDeep([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            t.notIncludesLooseDeep([{foo: 1}, {bar: 2}, {}], [[]])

            fail("notIncludesLooseDeep",
                [{foo: 1}, {bar: 2}, {}],
                [[], {foo: 1}])
        })
    })

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    describe("t.includesMatch()", function () {
        it("checks numbers", function () {
            t.includesMatch([1, 2, 3, 4, 5], 1)
            t.includesMatch([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            fail("includesMatch", ["1", 2, 3, 4, 5], 1)
            fail("includesMatch", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            var obj1 = {}
            var obj2 = {}
            var obj3 = {}

            t.includesMatch([obj1, 3, obj3, "foo"], [obj1, obj3])
            t.includesMatch([obj1, obj2, obj3], [obj1, obj2, obj3])
            t.includesMatch([obj1, 3, obj3, "foo"], [obj1, obj2, obj3])

            t.includesMatch([{foo: 1}, {bar: 2}, 3, "foo", {}], [{foo: 1}])
            t.includesMatch([{foo: 1}, {bar: 2}, {}], [{bar: 2}, {}])
            t.includesMatch([{foo: 1}, {bar: 2}, []], [[]])
        })

        it("checks nothing", function () {
            t.includesMatch([{}, {}], [])
        })

        it("checks missing numbers", function () {
            fail("includesMatch", [1, 2, 3, 4, 5], 10)
            fail("includesMatch", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            fail("includesMatch", [{foo: 1}, {bar: 2}, {}], [[]])
            fail("includesMatch", [{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("t.notIncludesMatchAll()", function () {
        it("checks numbers", function () {
            fail("notIncludesMatchAll", [1, 2, 3, 4, 5], 1)
            fail("notIncludesMatchAll", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            t.notIncludesMatchAll(["1", 2, 3, 4, 5], 1)
            t.notIncludesMatchAll(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            t.notIncludesMatchAll([{foo: 1}, 3, "foo"], ["foo", 1])
            t.notIncludesMatchAll([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 1}])

            fail("notIncludesMatchAll",
                [{foo: 1}, {bar: 2}],
                [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            t.notIncludesMatchAll([{}, {}], [])
        })

        it("checks missing numbers", function () {
            t.notIncludesMatchAll([1, 2, 3, 4, 5], 10)
            t.notIncludesMatchAll([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            t.notIncludesMatchAll([{foo: 1}, {bar: 2}, {}], [[]])
            t.notIncludesMatchAll([{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("t.includesMatchAny()", function () {
        it("checks numbers", function () {
            t.includesMatchAny([1, 2, 3, 4, 5], 1)
            t.includesMatchAny([1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            fail("includesMatchAny", ["1", 2, 3, 4, 5], 1)
            fail("includesMatchAny", ["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            t.includesMatchAny([{foo: 1}, 3, "foo"], ["foo", 1])
            t.includesMatchAny([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 1}])
            t.includesMatchAny([{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            t.includesMatchAny([{}, {}], [])
        })

        it("checks missing numbers", function () {
            fail("includesMatchAny", [1, 2, 3, 4, 5], 10)
            fail("includesMatchAny", [1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            fail("includesMatchAny", [{foo: 1}, {bar: 2}, {}], [[]])
            t.includesMatchAny([{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })

    describe("t.notIncludesMatch()", function () {
        it("checks numbers", function () {
            fail("notIncludesMatch", [1, 2, 3, 4, 5], 1)
            fail("notIncludesMatch", [1, 2, 3, 4, 5], [1])
        })

        it("is strict", function () {
            t.notIncludesMatch(["1", 2, 3, 4, 5], 1)
            t.notIncludesMatch(["1", 2, 3, 4, 5], [1])
        })

        it("checks objects", function () {
            fail("notIncludesMatch", [{foo: 1}, 3, "foo"], ["foo", 1])
            fail("notIncludesMatch", [{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 1}])
            fail("notIncludesMatch", [{foo: 1}, {bar: 2}], [{foo: 1}, {bar: 2}])
        })

        it("checks nothing", function () {
            t.notIncludesMatch([{}, {}], [])
        })

        it("checks missing numbers", function () {
            t.notIncludesMatch([1, 2, 3, 4, 5], 10)
            t.notIncludesMatch([1, 2, 3, 4, 5], [10])
        })

        it("checks missing objects", function () {
            t.notIncludesMatch([{foo: 1}, {bar: 2}, {}], [[]])
            fail("notIncludesMatch", [{foo: 1}, {bar: 2}, {}], [[], {foo: 1}])
        })
    })
})