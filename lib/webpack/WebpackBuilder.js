"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const sourcer = require('sourcer');
class WebpackBuilder {
    constructor(source, dest, options) {
        const root = options.root || process.cwd();
        const ext = path.extname(source);
        const defaultExt = ['vue'];
        if (!(options.ext && typeof options.ext === 'string')) {
            options.ext = defaultExt.join('|');
        }
        this.rawSource = source;
        if (ext) {
            this.source = [path.resolve(source)];
            this.base = options.base || path.resolve(source.replace(path.basename(source), ''));
        }
        else {
            this.source = sourcer.find(root, source, {
                recursive: true,
            });
            this.base = path.resolve(sourcer.base(source));
            if (options.ext) {
                const reg = new RegExp('\\.(' + options.ext + ')$');
                this.source = this.source.filter(s => reg.test(path.extname(s)));
            }
        }
        this.dest = path.resolve(dest);
        this.options = options;
    }
}
exports.default = WebpackBuilder;
