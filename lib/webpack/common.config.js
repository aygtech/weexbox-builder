"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpackbar_1 = require("webpackbar");
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const util_1 = require("../util");
const context_1 = require("../update/context");
const vueLoader_1 = require("./vueLoader");
class CommonConfig {
    constructor() {
        this.context = new context_1.default();
        this.plugins = [
            new webpackbar_1.default({
                name: 'WeexBox',
                profile: true,
            }),
            new clean_webpack_plugin_1.default(),
        ];
        this.weexConfig = {
            mode: 'none',
            entry: util_1.default.entries(),
            output: {
                path: this.context.distPath,
                filename: '[name].js',
            },
            resolve: {
                extensions: ['.mjs', '.js', '.vue', '.json'],
            },
            module: {
                rules: [
                    {
                        test: /\.(js|vue)$/,
                        enforce: 'pre',
                        include: [util_1.default.projectPath(this.context.sourceDir)],
                        loader: 'eslint-loader',
                        options: {
                            formatter: require('eslint-friendly-formatter'),
                        },
                    },
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
