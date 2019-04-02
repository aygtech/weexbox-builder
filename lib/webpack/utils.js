"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.loadModulePath = (moduleName, extra) => {
    try {
        const localPath = require.resolve(path.join(__dirname, '../node_modules', moduleName, extra || ''));
        return localPath.slice(0, localPath.lastIndexOf(moduleName) + moduleName.length);
    }
    catch (e) {
        return moduleName;
    }
};
exports.cssLoaders = (options) => {
    options = options || {};
    const cssLoader = {
        loader: exports.loadModulePath('css-loader'),
        options: {
            sourceMap: options.sourceMap,
        },
    };
    const postcssLoader = {
        loader: exports.loadModulePath('postcss-loader'),
        options: {
            sourceMap: options.sourceMap,
        },
    };
    const generateLoaders = (loader, loaderOptions) => {
        const loaders = options.useVue ? [cssLoader] : [];
        if (options.usePostCSS) {
            loaders.push(postcssLoader);
        }
        if (loader) {
            loaders.push({
                loader: exports.loadModulePath(loader + '-loader'),
                options: Object.assign({}, loaderOptions, {
                    sourceMap: !!options.sourceMap,
                }),
            });
        }
        if (options.useVue) {
            return [exports.loadModulePath('vue-style-loader')].concat(loaders);
        }
        else {
            return loaders;
        }
    };
    return {
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus'),
    };
};
exports.exist = (path) => {
    try {
        fs.existsSync(path);
    }
    catch (e) {
        return false;
    }
    return true;
};
