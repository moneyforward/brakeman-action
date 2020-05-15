import stream from 'stream';
import StaticCodeAnalyzer, { installer } from '@moneyforward/sca-action-core';
import { transform } from '@moneyforward/stream-util'

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

type Location = TemplateLocation | ModelLocation | ControllerLocation | MethodLocation;

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
  private static readonly command = 'brakeman';

  constructor(options: string[] = []) {
    super(Analyzer.command, options.concat(['--no-progress', '--no-exit-on-warn', '-f', 'json']), undefined, 2);
  }

  protected async prepare(): Promise<void> {
    console.log(`::group::Installing gems...`);
    try {
      await new installer.RubyGemsInstaller(true).execute([Analyzer.command]);
    } finally {
      console.log(`::endgroup::`)
    }
  }

  protected createTransformStreams(): stream.Transform[] {
    return [
      new transform.JSON(),
      new stream.Transform({
        objectMode: true,
        transform: function (result: Result, encoding, done): void {
          console.log(`::debug::Detected ${result.warnings.length} problem(s).`);
          for (const warning of result.warnings) this.push({
            file: warning.file,
            line: warning.line,
            column: 0,
            severity: 'warning',
            message: `[${warning.confidence}] ${warning.warning_type}: ${warning.message}`,
            code: warning.check_name
          });
          this.push(null);
          done();
        }
      })
    ]
  }
}
