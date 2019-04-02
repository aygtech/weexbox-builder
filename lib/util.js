"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const glob_1 = require("glob");
const context_1 = require("./update/context");
class Util {
    static projectPath(path) {
        return path_1.join(process.cwd(), path);
    }
    static entries() {
        const context = new context_1.default();
        const pagePath = this.projectPath(context.sourceDir);
        const entries = new Map();
        glob_1.sync(pagePath).forEach((indexEntry) => {
            const tmp = indexEntry.split('/').splice(-3);
            const moduleName = `${tmp.slice(0, 1).toString()}/${tmp.slice(1, 2).toString()}`;
            entries[moduleName] = [indexEntry];
        });
        return entries;
    }
}
exports.default = Util;
