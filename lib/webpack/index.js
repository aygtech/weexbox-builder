"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const md5_1 = require("../update/md5");
const copy_1 = require("../update/copy");
const ready_1 = require("../update/ready");
class Pack {
    constructor(name) {
        const webpackConfig = require(`./${name}.config`);
        webpack(webpackConfig, (err, stats) => {
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                warnings: false,
                entrypoints: false,
                assets: false,
                hash: false,
                version: false,
                timings: false,
                builtAt: false,
            }));
            if (err == null) {
                this.update(name);
            }
        });
    }
    update(name) {
        md5_1.default.calculate().then(() => {
            copy_1.default.copy(name);
            ready_1.default.ready();
        });
    }
}
exports.default = Pack;
