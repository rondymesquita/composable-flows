"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposeExecutorPipeline = void 0;
class ComposeExecutorPipeline {
    constructor(stageExecutor, stages) {
        this.stageExecutor = stageExecutor;
        this.stages = stages;
    }
    async execute(params) {
        let lastStageResult;
        for (let i = 0; i < this.stages.length; i++) {
            const stage = this.stages[i];
            lastStageResult = await this.stageExecutor.execute(stage, params);
        }
        return lastStageResult;
    }
}
exports.ComposeExecutorPipeline = ComposeExecutorPipeline;
