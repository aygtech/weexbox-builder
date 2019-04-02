"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
class Util {
    static projectPath(path) {
        return path_1.join(process.cwd(), path);
    }
}
exports.default = Util;
