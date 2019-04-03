"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const md5_1 = require("../update/md5");
const copy_1 = require("../update/copy");
const ready_1 = require("../update/ready");
const develop_config_1 = require("./develop.config");
const test_config_1 = require("./test.config");
const preRelease_config_1 = require("./preRelease.config");
const release_config_1 = require("./release.config");
class Pack {
    static build(name) {
        let weexConfig;
        switch (name) {
            case 'develop':
                weexConfig = new develop_config_1.default().weexConfig;
                break;
            case 'test':
                weexConfig = new test_config_1.default().weexConfig;
                break;
            case 'preRelease':
                weexConfig = new preRelease_config_1.default().weexConfig;
                break;
            case 'release':
                weexConfig = new release_config_1.default().weexConfig;
                break;
            default:
                break;
        }
        console.log(JSON.stringify(weexConfig));
        webpack(weexConfig, (err, stats) => {
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
    static update(name) {
        md5_1.default.calculate().then(() => {
            copy_1.default.copy(name);
            ready_1.default.ready();
        });
    }
}
exports.default = Pack;
