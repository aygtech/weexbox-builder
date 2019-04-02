"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const path = require("path");
const autoprefixer = require("autoprefixer");
const postcssPluginPx2rem = require("postcss-plugin-px2rem");
const weexVuePrecompiler = require("weex-vue-precompiler");
const webpackMerge = require("webpack-merge");
const postcssPluginWeex = require("postcss-plugin-weex");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const os = require("os");
const fse = require("fs-extra");
const DEBUG = require("debug");
const utils_1 = require("./utils");
const vueLoader_1 = require("./vueLoader");
const WebpackBuilder_1 = require("./WebpackBuilder");
const debug = DEBUG('weex:compile');
class WeexBuilder extends WebpackBuilder_1.default {
    constructor(source, dest, options) {
        super(source, dest, options);
        this.vueTemplateFloder = '.temp';
        this.defaultWeexConfigName = 'weex.config.js';
        this.entryFileName = 'entry.js';
        this.routerFileName = 'router.js';
        this.pluginFileName = 'plugins/plugins.js';
        this.pluginConfigFileName = 'plugins/plugins.json';
        this.isWin = /^win/.test(process.platform);
        this.isSigleWebRender = false;
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
    }
    resolveConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const destExt = path.extname(this.dest);
            const sourceExt = path.extname(this.rawSource);
            let outputPath;
            let outputFilename;
            const plugins = [
                new webpack.BannerPlugin({
                    banner: '// { "framework": "Vue"}\n',
                    raw: true,
                    exclude: 'Vue',
                }),
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify(this.options.prod ? 'production' : 'development'),
                    },
                }),
            ];
            if (this.options.filename) {
                outputFilename = this.options.filename;
            }
            else {
                outputFilename = '[name].js';
            }
            if (destExt && this.dest[this.dest.length - 1] !== '/' && sourceExt) {
                outputPath = path.dirname(this.dest);
                outputFilename = path.basename(this.dest);
            }
            else {
                outputPath = this.dest;
            }
            if (this.options.onProgress) {
                plugins.push(new webpack.ProgressPlugin(this.options.onProgress));
            }
            const hasVueRouter = (content) => {
                return /(\.\/)?router/.test(content);
            };
            const getEntryFileContent = (source, routerpath) => {
                const hasPluginInstalled = fse.existsSync(path.resolve(this.pluginFileName));
                let dependence = `import Vue from 'vue'\n`;
                dependence += `import weex from 'weex-vue-render'\n`;
                let relativePluginPath = path.resolve(this.pluginConfigFileName);
                let entryContents = fse.readFileSync(source).toString();
                let contents = '';
                entryContents = dependence + entryContents;
                entryContents = entryContents.replace(/\/\* weex initialized/, match => `weex.init(Vue)\n${match}`);
                if (this.isWin) {
                    relativePluginPath = relativePluginPath.replace(/\\/g, '\\\\');
                }
                if (hasPluginInstalled) {
                    contents += `\n// If detact plugins/plugin.js is exist, import and the plugin.js\n`;
                    contents += `import plugins from '${relativePluginPath}';\n`;
                    contents += `plugins.forEach(function (plugin) {\n\tweex.install(plugin)\n});\n\n`;
                    entryContents = entryContents.replace(/\.\/router/, routerpath);
                    entryContents = entryContents.replace(/weex\.init/, match => `${contents}${match}`);
                }
                return entryContents;
            };
            const getRouterFileContent = source => {
                const dependence = `import Vue from 'vue'\n`;
                let routerContents = fse.readFileSync(source).toString();
                routerContents = dependence + routerContents;
                return routerContents;
            };
            const getWebRouterEntryFile = (entry, router) => {
                const entryFile = path.resolve(this.vueTemplateFloder, this.entryFileName);
                const routerFile = path.resolve(this.vueTemplateFloder, this.routerFileName);
                fse.outputFileSync(entryFile, getEntryFileContent(entry, routerFile));
                fse.outputFileSync(routerFile, getRouterFileContent(router));
                return {
                    index: entryFile,
                };
            };
            const getWebEntryFileContent = (entryPath, vueFilePath, base) => {
                const hasPluginInstalled = fse.existsSync(path.resolve(this.pluginFileName));
                let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath);
                let relativeEntryPath = path.resolve(base, this.entryFileName);
                let relativePluginPath = path.resolve(this.pluginConfigFileName);
                let contents = '';
                let entryContents = '';
                if (fse.existsSync(relativeEntryPath)) {
                    entryContents = fse.readFileSync(relativeEntryPath, 'utf8');
                }
                if (this.isWin) {
                    relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\');
                    relativePluginPath = relativePluginPath.replace(/\\/g, '\\\\');
                }
                if (hasPluginInstalled) {
                    contents += `\n// If detact plugins/plugin.js is exist, import and the plugin.js\n`;
                    contents += `import plugins from '${relativePluginPath}';\n`;
                    contents += `plugins.forEach(function (plugin) {\n\tweex.install(plugin)\n});\n\n`;
                    entryContents = entryContents.replace(/weex\.init/, match => `${contents}${match}`);
                    contents = '';
                }
                contents += `
    const App = require('${relativeVuePath}');
    new Vue(Vue.util.extend({el: '#root'}, App));
    `;
                return entryContents + contents;
            };
            const getWeexEntryFileContent = (entryPath, vueFilePath) => {
                let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath);
                let contents = '';
                if (this.isWin) {
                    relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\');
                }
                contents += `import App from '${relativeVuePath}'
App.el = '#root'
new Vue(App)
    `;
                return contents;
            };
            const getNormalEntryFile = (entries, base, isweb) => {
                let result = {};
                entries.forEach(entry => {
                    const extname = path.extname(entry);
                    const basename = entry.replace(`${base}${this.isWin ? '\\' : '/'}`, '').replace(extname, '');
                    const templatePathForWeb = path.resolve(this.vueTemplateFloder, basename + '.web.js');
                    const templatePathForNative = path.resolve(this.vueTemplateFloder, basename + '.js');
                    if (isweb) {
                        fse.outputFileSync(templatePathForWeb, getWebEntryFileContent(templatePathForWeb, entry, base));
                        result[basename] = templatePathForWeb;
                    }
                    else {
                        fse.outputFileSync(templatePathForNative, getWeexEntryFileContent(templatePathForNative, entry));
                        result[basename] = templatePathForNative;
                    }
                });
                return result;
            };
            const resolveSourceEntry = (source, base, options) => __awaiter(this, void 0, void 0, function* () {
                const entryFile = path.join(base, this.entryFileName);
                const routerFile = path.join(base, this.routerFileName);
                const existEntry = yield fse.pathExists(entryFile);
                let entrys = {};
                if (existEntry) {
                    const content = yield fse.readFile(entryFile, 'utf8');
                    if (hasVueRouter(content)) {
                        if (options.web) {
                            entrys = getWebRouterEntryFile(entryFile, routerFile);
                        }
                        else {
                            entrys = {
                                index: entryFile,
                            };
                        }
                    }
                    else {
                        entrys = getNormalEntryFile(source, base, options.web);
                    }
                }
                else {
                    this.isSigleWebRender = true;
                    entrys = getNormalEntryFile(source, base, options.web);
                }
                return entrys;
            });
            const webpackConfig = () => __awaiter(this, void 0, void 0, function* () {
                const entrys = yield resolveSourceEntry(this.source, this.base, this.options);
                let configs = {
                    entry: entrys,
                    output: {
                        path: outputPath,
                        filename: outputFilename,
                    },
                    watch: this.options.watch || false,
                    watchOptions: {
                        aggregateTimeout: 300,
                        ignored: /\.temp/,
                    },
                    devtool: this.options.devtool || 'eval-source-map',
                    resolve: {
                        extensions: ['.js', '.vue', '.json'],
                        alias: {
                            '@': this.base || path.resolve('src'),
                        },
                    },
                    module: {
                        rules: [
                            {
                                test: /\.js$/,
                                use: [
                                    {
                                        loader: 'babel-loader',
                                        options: {
                                            presets: [
                                                path.join(__dirname, '../node_modules/babel-preset-es2015'),
                                                path.join(__dirname, '../node_modules/babel-preset-stage-0'),
                                            ],
                                        },
                                    },
                                ],
                            },
                            {
                                test: /\.we$/,
                                use: [
                                    {
                                        loader: 'weex-loader',
                                    },
                                ],
                            },
                        ],
                    },
                    resolveLoader: {
                        modules: [path.join(__dirname, '../node_modules'), path.resolve('node_modules')],
                        extensions: ['.js', '.json'],
                        mainFields: ['loader', 'main'],
                        moduleExtensions: ['-loader'],
                    },
                    plugins: plugins,
                };
                if (this.options.web) {
                    configs.module.rules.push({
                        test: /\.vue(\?[^?]+)?$/,
                        use: [
                            {
                                loader: 'vue-loader',
                                options: Object.assign(vueLoader_1.vueLoader({ useVue: true, usePostCSS: false }), {
                                    optimizeSSR: false,
                                    postcss: [
                                        postcssPluginWeex(),
                                        autoprefixer({
                                            browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12'],
                                        }),
                                        postcssPluginPx2rem({
                                            rootValue: 75,
                                            minPixelValue: 1.01,
                                        }),
                                    ],
                                    compilerModules: [
                                        {
                                            postTransformNode: el => {
                                                weexVuePrecompiler()(el);
                                            },
                                        },
                                    ],
                                }),
                            },
                        ],
                    });
                }
                else {
                    configs.module.rules.push({
                        test: /\.(we|vue)(\?[^?]+)?$/,
                        use: [
                            {
                                loader: 'weex-loader',
                                options: vueLoader_1.vueLoader({ useVue: false }),
                            },
                        ],
                    });
                    configs.node = this.nodeConfiguration;
                }
                if (this.options.min) {
                    configs.plugins.unshift(new UglifyJsPlugin({
                        sourceMap: true,
                        parallel: os.cpus().length - 1,
                    }));
                }
                return configs;
            });
            let config = yield webpackConfig();
            return config;
        });
    }
    build(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let configs = yield this.resolveConfig();
            debug(this.options.web ? 'web -->' : 'weex -->', JSON.stringify(configs, null, 2));
            let mergeConfigs;
            if (this.source.length === 0) {
                return callback('no ' + (this.options.ext || '') + ' files found in source "' + this.rawSource + '"');
            }
            if (this.options.config) {
                if (utils_1.exist(this.options.config)) {
                    try {
                        mergeConfigs = require(path.resolve(this.options.config));
                        if (mergeConfigs.web && this.options.web) {
                            configs = webpackMerge(configs, mergeConfigs.web);
                        }
                        else if (mergeConfigs.weex && !this.options.web) {
                            configs = webpackMerge(configs, mergeConfigs.weex);
                        }
                        else if (!mergeConfigs.web && !mergeConfigs.weex) {
                            configs = webpackMerge(configs, mergeConfigs);
                        }
                    }
                    catch (e) {
                        debug('read config error --> ', e);
                    }
                }
            }
            else {
                let defatultConfig = path.resolve(this.defaultWeexConfigName);
                if (utils_1.exist(defatultConfig)) {
                    try {
                        mergeConfigs = require(path.resolve(defatultConfig));
                        if (mergeConfigs.web && this.options.web) {
                            configs = webpackMerge(configs, mergeConfigs.web);
                        }
                        else if (mergeConfigs.weex && !this.options.web) {
                            configs = webpackMerge(configs, mergeConfigs.weex);
                        }
                        else if (!mergeConfigs.web && !mergeConfigs.weex) {
                            configs = webpackMerge(configs, mergeConfigs);
                        }
                    }
                    catch (e) {
                        debug('read config error --> ', e);
                    }
                }
            }
            if (this.options.outputConfig) {
                console.log(JSON.stringify(configs, null, 2));
            }
            const compiler = webpack(configs);
            const formatResult = (err, stats) => {
                const result = {
                    toString: () => stats.toString({
                        warnings: false,
                        version: false,
                        hash: false,
                        assets: true,
                        modules: false,
                        chunkModules: false,
                        chunkOrigins: false,
                        children: false,
                        chunks: false,
                        colors: true,
                    }),
                };
                if (err) {
                    console.error(err.stack || err);
                    if (err.details) {
                        console.error(err.details);
                    }
                    return callback && callback(err);
                }
                const info = stats.toJson();
                if (stats.hasErrors()) {
                    return callback && callback(info.errors);
                }
                info['isSigleWebRender'] = this.isSigleWebRender;
                callback && callback(err, result, info);
            };
            if (configs.watch) {
                compiler.watch({
                    ignored: /node_modules/,
                    poll: 1000,
                }, formatResult);
            }
            else {
                compiler.run(formatResult);
            }
        });
    }
}
exports.WeexBuilder = WeexBuilder;
exports.default = WeexBuilder;
