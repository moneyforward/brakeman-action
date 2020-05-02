import { StaticCodeAnalyzer, Transformers } from '@moneyforward/sca-action-core';
interface ScanInfo {
    app_path: string;
    rails_version: string;
    security_warnings: number;
    start_time: string;
    end_time: string;
    duration: number;
    checks_performed: string[];
    number_of_controllers: number;
    number_of_models: number;
    number_of_templates: number;
    ruby_version: string;
    brakeman_version: string;
}
interface TemplateLocation {
    type: 'template';
    template: string;
}
interface ModelLocation {
    type: 'model';
    model: string;
}
interface ControllerLocation {
    type: 'controller';
    controller: string;
}
interface MethodLocation {
    type: 'method';
    class: string;
    method: string;
}
declare type Location = TemplateLocation | ModelLocation | ControllerLocation | MethodLocation;
export interface Warning {
    warning_type: string;
    warning_code: number;
    fingerprint: string;
    check_name: string;
    message: string;
    file: string;
    line: number;
    link: string;
    code: string;
    render_path: string | null;
    location: Location | null;
    user_input: string | null;
    confidence: 'High' | 'Medium' | 'Weak';
}
export interface Result {
    scan_info: ScanInfo;
    warnings: Warning[];
    ignored_warnings: Warning[];
    errors: {
        error: string;
        backtrace: string;
    }[];
    obsolete: string[];
}
export default class Analyzer extends StaticCodeAnalyzer {
    private static readonly command;
    constructor(options?: string[]);
    protected prepare(): Promise<unknown>;
    protected createTransformStreams(): Transformers;
}
export {};
