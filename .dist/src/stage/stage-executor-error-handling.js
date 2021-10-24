"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageExecutorErrorHandling = void 0;
class StageExecutorErrorHandling {
    async execute(stage, params) {
        let stageResult;
        try {
            stageResult = (await stage(params));
        }
        catch (err) {
            console.error(err);
        }
        return stageResult;
    }
}
exports.StageExecutorErrorHandling = StageExecutorErrorHandling;
