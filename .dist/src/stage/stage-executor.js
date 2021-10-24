"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageExecutor = void 0;
class StageExecutor {
    async execute(stage, params) {
        const stageResult = (await stage(params));
        return stageResult;
    }
}
exports.StageExecutor = StageExecutor;
