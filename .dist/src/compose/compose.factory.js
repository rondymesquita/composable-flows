"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeComposeExecutor = void 0;
const compose_executor_pipeline_1 = require("./compose-executor-pipeline");
const makeComposeExecutor = (options, stageExecutor, stages) => {
    return new compose_executor_pipeline_1.ComposeExecutorPipeline(stageExecutor, stages);
};
exports.makeComposeExecutor = makeComposeExecutor;
