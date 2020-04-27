import { StaticCodeAnalyzer, Transformers } from '@moneyforward/sca-action-core';
export default class Analyzer extends StaticCodeAnalyzer {
    private static readonly command;
    constructor(options?: string[]);
    protected prepare(): Promise<unknown>;
    protected createTransformStreams(): Transformers;
}
