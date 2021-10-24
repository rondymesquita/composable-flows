"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeStageExecutor = void 0;
const stage_executor_error_handling_1 = require("./stage-executor-error-handling");
const stage_executor_1 = require("./stage-executor");
const makeStageExecutor = (options) => {
    if (options.stopOnError) {
        return new stage_executor_1.StageExecutor();
    }
    else {
        return new stage_executor_error_handling_1.StageExecutorErrorHandling();
    }
};
exports.makeStageExecutor = makeStageExecutor;
