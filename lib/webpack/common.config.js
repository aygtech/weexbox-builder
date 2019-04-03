"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebpackBar = require("webpackbar");
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const util_1 = require("../util");
const context_1 = require("../update/context");
const vueLoader_1 = require("./vueLoader");
class CommonConfig {
    constructor() {
        this.context = new context_1.default();
        this.plugins = [
            new WebpackBar({
                name: 'WeexBox',
            }),
            new clean_webpack_plugin_1.default(),
        ];
        this.weexConfig = {
            mode: 'none',
            entry: util_1.default.entries(),
            output: {
                path: this.context.distPath,
                filename: `${this.context.wwwDic}/[name].js`,
            },
            resolve: {
                extensions: ['.mjs', '.js', '.vue', '.json'],
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            {
                                loader: 'babel-loader',
                            },
                        ],
                    },
                    {
                        test: /\.vue(\?[^?]+)?$/,
                        use: [
                            {
                                loader: 'weex-loader',
                                options: vueLoader_1.vueLoader({ useVue: false }),
                            },
                        ],
                    },
                ],
            },
            plugins: this.plugins,
            node: this.context.nodeConfiguration,
        };
    }
}
exports.default = CommonConfig;
