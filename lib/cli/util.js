"use strict"

const Promise = require("bluebird")
const gs = require("glob-stream")
const fs = require("fs")
const path = require("path")

/**
 * The injected utilities for actually running the CLI.
 */

exports.load = require

exports.exists = file => {
    try {
        return fs.statSync(path.resolve(file)).isFile()
    } catch (e) {
        if (e.code === "ENOENT" || e.code === "EISDIR") return false
        throw e
    }
}

exports.chdir = process.chdir

exports.readGlob = glob => new Promise((resolve, reject) => {
    return gs.create(glob, {nodir: true})
    .on("data", m => require(m.path)) // eslint-disable-line global-require
    .on("end", resolve)
    .on("error", reject)
})