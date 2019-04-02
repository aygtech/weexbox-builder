"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
class Ready {
    static ready() {
        const context = new context_1.default();
        const config = fs_extra_1.readJsonSync(context.configFilePath);
        const version = config.release.replace(/\./g, '');
        const wwwFolderPath = context.wwwFolderPath;
        fs_extra_1.renameSync(wwwFolderPath, path_1.join(wwwFolderPath, `../${version}`));
        fs_extra_1.outputFileSync(context.versionFilePath, version);
    }
}
exports.default = Ready;
