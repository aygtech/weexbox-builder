"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const util_1 = require("../util");
const fs_extra_1 = require("fs-extra");
const lodash_1 = require("lodash");
class Context {
    constructor() {
        this.ignoreFileName = 'update-ignore.txt';
        this.configFileName = 'update-config.json';
        this.md5FileName = 'update-md5.json';
        this.defaultIgnoreList = ['.DS_Store', this.md5FileName, this.configFileName, '.gitignore', '.gitkeep', '.git'];
        this.versionFileName = 'update-version.txt';
        this.homePath = util_1.default.projectPath('deploy');
        this.wwwFolderPath = path_1.join(this.homePath, 'www');
        this.configPath = util_1.default.projectPath('config');
        this.ignoreFilePath = path_1.join(this.configPath, this.ignoreFileName);
        this.defaultConfigFilePath = path_1.join(this.configPath, this.configFileName);
        this.configFilePath = path_1.join(this.wwwFolderPath, this.configFileName);
        this.md5FilePath = path_1.join(this.wwwFolderPath, this.md5FileName);
        this.versionFilePath = path_1.join(this.homePath, this.versionFileName);
        this.staticPath = path_1.join(this.homePath, 'static');
        this.android = util_1.default.projectPath('platforms/android/app/src/main/assets/weexbox-update');
        this.ios = util_1.default.projectPath('platforms/ios/weexbox-update');
        this.androidStaticPath = path_1.join(this.android, 'static');
        this.iosStaticPath = path_1.join(this.ios, 'static');
        this.weexboxConfigPath = util_1.default.projectPath('config/weexbox-config.js');
        this.ignoredList = this.getIgnoredFiles(this.ignoreFilePath);
    }
    getIgnoredFiles(path) {
        const projectIgnore = this.readIgnoredFilesProjectConfig(path);
        const ignoredList = lodash_1.union(this.defaultIgnoreList, projectIgnore);
        lodash_1.remove(ignoredList, (item) => {
            return item.indexOf('#') === 0 || lodash_1.trim(item).length === 0;
        });
        return ignoredList;
    }
    readIgnoredFilesProjectConfig(path) {
        let fileContent;
        try {
            fileContent = fs_extra_1.readFileSync(path, 'utf8');
        }
        catch (e) {
            return [];
        }
        return lodash_1.trim(fileContent).split(/\n/);
    }
}
exports.default = Context;
