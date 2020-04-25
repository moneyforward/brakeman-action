/// <reference types="node" />
import stream from 'stream';
export declare function createTransformStreams(): [stream.Transform, stream.Transform];
export default class Analyzer {
    private options;
    constructor(options?: string[]);
    analyze(): Promise<number>;
}
