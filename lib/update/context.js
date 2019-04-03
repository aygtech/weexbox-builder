"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const util_1 = require("../util");
class Context {
    constructor() {
        this.nodeConfiguration = {
            global: false,
            Buffer: false,
            __filename: false,
            __dirname: false,
            setImmediate: false,
            clearImmediate: false,
            assert: false,
            buffer: false,
            child_process: false,
            cluster: false,
            console: false,
            constants: false,
            crypto: false,
            dgram: false,
            dns: false,
            domain: false,
            events: false,
            fs: false,
            http: false,
            https: false,
            module: false,
            net: false,
            os: false,
            path: false,
            process: false,
            punycode: false,
            querystring: false,
            readline: false,
            repl: false,
            stream: false,
            string_decoder: false,
            sys: false,
            timers: false,
            tls: false,
            tty: false,
            url: false,
            util: false,
            vm: false,
            zlib: false,
        };
        this.sourceDir = 'src';
        this.distDir = 'dist';
        this.wwwDic = 'www';
        this.staticDir = 'static';
        this.configFileName = 'update-config.json';
        this.md5FileName = 'update-md5.json';
        this.versionFileName = 'update-version.txt';
        this.distPath = util_1.default.projectPath(this.distDir);
        this.wwwFolderPath = path_1.join(this.distPath, this.wwwDic);
        this.configPath = util_1.default.projectPath('config');
        this.defaultConfigFilePath = path_1.join(this.configPath, this.configFileName);
        this.configFilePath = path_1.join(this.wwwFolderPath, this.configFileName);
        this.md5FilePath = path_1.join(this.wwwFolderPath, this.md5FileName);
        this.versionFilePath = path_1.join(this.distPath, this.versionFileName);
        this.staticPath = path_1.join(this.distPath, this.staticDir);
        this.android = util_1.default.projectPath('platforms/android/app/src/main/assets/weexbox-update');
        this.ios = util_1.default.projectPath('platforms/ios/weexbox-update');
        this.androidStaticPath = path_1.join(this.android, this.staticDir);
        this.iosStaticPath = path_1.join(this.ios, this.staticDir);
        this.weexboxConfigPath = util_1.default.projectPath('config/weexbox-config.js');
    }
}
exports.default = Context;
