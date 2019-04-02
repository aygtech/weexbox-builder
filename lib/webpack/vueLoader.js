"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.vueLoader = (options) => {
    return {
        loaders: utils_1.cssLoaders({
            sourceMap: options && options.sourceMapEnabled,
            useVue: options && options.useVue,
            usePostCSS: options && options.usePostCSS,
        }),
    };
};
