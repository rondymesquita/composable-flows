"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
describe('ComposableFlow Options', () => {
    it('should continue the pipeline on stage fail when stopOnError is false', async () => {
        const callOrder = [];
        const syncStageAlpha = {
            handle: jest.fn().mockImplementation(() => {
                callOrder.push('syncStageAlpha');
                return Promise.reject(new Error('alpha stage error'));
            }),
        };
        const syncStageBeta = {
            handle: jest.fn().mockImplementation(() => {
                callOrder.push('syncStageBeta');
                return Promise.resolve('beta-result');
            }),
        };
        const options = {
            stopOnError: false,
        };
        const sut = new src_1.ComposableFlow([syncStageAlpha.handle, syncStageBeta.handle], options);
        expect(syncStageAlpha.handle).toBeCalledTimes(0);
        expect(syncStageBeta.handle).toBeCalledTimes(0);
        const param = 'email@email.com';
        const result = await sut.execute(param);
        expect(result).toEqual('beta-result');
        expect(syncStageAlpha.handle).toBeCalledTimes(1);
        expect(syncStageAlpha.handle).toBeCalledWith([param]);
        expect(syncStageBeta.handle).toBeCalledTimes(1);
        expect(syncStageBeta.handle).toBeCalledWith([param]);
        expect(callOrder).toEqual(['syncStageAlpha', 'syncStageBeta']);
    });
    it('should pass result of stage as param to the next when mode is pipeline', async () => {
        const callOrder = [];
        const syncStageAlpha = {
            handle: jest.fn().mockImplementation(() => {
                callOrder.push('syncStageAlpha');
                return Promise.resolve('alpha-result');
            }),
        };
        const syncStageBeta = {
            handle: jest.fn().mockImplementation(() => {
                callOrder.push('syncStageBeta');
                return Promise.resolve('beta-result');
            }),
        };
        const options = {
            mode: src_1.Mode.PIPELINE,
        };
        const sut = new src_1.ComposableFlow([syncStageAlpha.handle, syncStageBeta.handle], options);
        expect(syncStageAlpha.handle).toBeCalledTimes(0);
        expect(syncStageBeta.handle).toBeCalledTimes(0);
        const param = 'email@email.com';
        const result = await sut.execute(param);
        expect(result).toEqual('beta-result');
        expect(syncStageAlpha.handle).toBeCalledTimes(1);
        expect(syncStageAlpha.handle).toBeCalledWith([param]);
        expect(syncStageBeta.handle).toBeCalledTimes(1);
        expect(syncStageBeta.handle).toBeCalledWith([param]);
        expect(callOrder).toEqual(['syncStageAlpha', 'syncStageBeta']);
    });
});
