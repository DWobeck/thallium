"use strict"

// Note that this entire section may be flaky on slower machines. Thankfully,
// these have been tested against a slower machine, so it should hopefully not
// be too bad.
describe("core (slow) (FLAKE)", function () {
    var n = Util.n
    var p = Util.p

    function speed(data, type) {
        switch (type) {
        case "fast": t.between(data.duration, 0, data.slow / 2); break
        case "medium": t.between(data.duration, data.slow / 2, data.slow); break
        case "slow": t.above(data.duration, data.slow); break
        default: throw new RangeError("Unknown type: `" + type + "`")
        }
    }

    it("succeeds with own", function () {
        var tt = t.base()
        var ret = []

        tt.reporter(Util.push(ret, true))

        tt.async("test", function (tt, done) {
            // It's highly unlikely the engine will take this long to finish.
            tt.slow(10)
            done()
        })

        return tt.run().then(function () {
            t.match(ret, [
                n("start", [], undefined, -1, 75),
                n("pass", [p("test", 0)], undefined, ret[1].duration, ret[1].slow), // eslint-disable-line max-len
                n("end", [], undefined, -1, 75),
            ])

            speed(ret[1], "fast")
        })
    })

    it("hits middle with own", function () {
        var tt = t.base()
        var ret = []

        tt.reporter(Util.push(ret, true))

        tt.async("test", function (tt, done) {
            // It's highly unlikely the engine will take this long to finish.
            tt.slow(100)
            Util.setTimeout(function () { done() }, 60)
        })

        return tt.run().then(function () {
            t.match(ret, [
                n("start", [], undefined, -1, 75),
                n("pass", [p("test", 0)], undefined, ret[1].duration, ret[1].slow), // eslint-disable-line max-len
                n("end", [], undefined, -1, 75),
            ])

            t.equal(ret[1].slow, 100)
            speed(ret[1], "medium")
        })
    })

    it("fails with own", function () {
        var tt = t.base()
        var ret = []

        tt.reporter(Util.push(ret, true))

        tt.async("test", function (tt, done) {
            tt.slow(50)
            // It's highly unlikely the engine will take this long to finish
            Util.setTimeout(function () { done() }, 200)
        })

        return tt.run().then(function () {
            t.match(ret, [
                n("start", [], undefined, -1, 75),
                n("pass", [p("test", 0)], undefined, ret[1].duration, ret[1].slow), // eslint-disable-line max-len
                n("end", [], undefined, -1, 75),
            ])

            t.equal(ret[1].slow, 50)
            speed(ret[1], "slow")
        })
    })

    it("succeeds with inherited", function () {
        var tt = t.base()
        var ret = []

        tt.reporter(Util.push(ret, true))

        tt.test("test")
        .slow(50)
        .async("inner", function (tt, done) { done() })

        return tt.run().then(function () {
            t.match(ret, [
                n("start", [], undefined, -1, 75),
                n("enter", [p("test", 0)], undefined, ret[1].duration, ret[1].slow), // eslint-disable-line max-len
                n("pass", [p("test", 0), p("inner", 0)], undefined, ret[2].duration, ret[2].slow), // eslint-disable-line max-len
                n("leave", [p("test", 0)], undefined, -1, 50),
                n("end", [], undefined, -1, 75),
            ])

            t.equal(ret[1].slow, 50)
            t.equal(ret[2].slow, 50)
            speed(ret[1], "fast")
            speed(ret[2], "fast")
        })
    })

    it("fails with inherited", function () {
        var tt = t.base()
        var ret = []

        tt.reporter(Util.push(ret, true))

        tt.test("test")
        .slow(50)
        .async("inner", function (tt, done) {
            Util.setTimeout(function () { done() }, 200)
        })

        return tt.run().then(function () {
            t.match(ret, [
                n("start", [], undefined, -1, 75),
                n("enter", [p("test", 0)], undefined, ret[1].duration, ret[1].slow), // eslint-disable-line max-len
                n("pass", [p("test", 0), p("inner", 0)], undefined, ret[2].duration, ret[2].slow), // eslint-disable-line max-len
                n("leave", [p("test", 0)], undefined, -1, 50),
                n("end", [], undefined, -1, 75),
            ])

            t.equal(ret[1].slow, 50)
            t.equal(ret[2].slow, 50)
            speed(ret[1], "fast")
            speed(ret[2], "slow")
        })
    })

    it("gets own block slow", function () {
        var tt = t.base()
        var active, raw

        tt.test("test", function (tt) {
            tt.slow(50)
            active = tt.reflect().activeSlow()
            raw = tt.reflect().slow()
        })

        return tt.run().then(function () {
            t.equal(active, 50)
            t.equal(raw, 50)
        })
    })

    it("gets own inline slow", function () {
        var tt = t.base()
        var ttt = tt.test("test").slow(50)

        t.equal(ttt.reflect().activeSlow(), 50)
        t.equal(ttt.reflect().slow(), 50)
    })

    it("gets inherited block slow", function () {
        var tt = t.base()
        var active, raw

        tt.test("test")
        .slow(50)
        .test("inner", function (tt) {
            active = tt.reflect().activeSlow()
            raw = tt.reflect().slow()
        })

        return tt.run().then(function () {
            t.equal(active, 50)
            t.equal(raw, 0)
        })
    })

    it("gets inherited inline slow", function () {
        var tt = t.base()
        var ttt = tt.test("test")
        .slow(50)
        .test("inner")

        t.equal(ttt.reflect().activeSlow(), 50)
        t.equal(ttt.reflect().slow(), 0)
    })

    it("gets default slow", function () {
        var tt = t.base()
        var active, raw

        tt.test("test", function (tt) {
            active = tt.reflect().activeSlow()
            raw = tt.reflect().slow()
        })

        return tt.run().then(function () {
            t.equal(active, 75)
            t.equal(raw, 0)
        })
    })
})
