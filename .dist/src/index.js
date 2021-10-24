"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposableFlow = exports.Options = exports.Mode = void 0;
const compose_1 = require("./compose");
const stage_1 = require("./stage");
var Mode;
(function (Mode) {
    Mode["PIPELINE"] = "PIPELINE";
    Mode["DEFAULT"] = "DEFAULT";
})(Mode = exports.Mode || (exports.Mode = {}));
class Options {
}
exports.Options = Options;
const DEFAULT_OPTIONS = {
    stopOnError: true,
    mode: Mode.DEFAULT,
};
const isOptionsInstance = (value) => {
    return 'stopOnError' in value;
};
class ComposableFlow {
    constructor(param, options) {
        this.stages = [];
        if (param && param instanceof Array) {
            this.stages = param;
        }
        if (param && isOptionsInstance(param)) {
            this.options = param;
        }
        this.options = Object.assign(DEFAULT_OPTIONS, options);
        this.stageExecutor = (0, stage_1.makeStageExecutor)(this.options);
        this.composeExecutor = (0, compose_1.makeComposeExecutor)(this.options, this.stageExecutor, this.stages);
    }
    async execute(...params) {
        const result = await this.composeExecutor.execute(params);
        return result;
    }
}
exports.ComposableFlow = ComposableFlow;
