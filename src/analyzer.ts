import stream from 'stream';
import { StaticCodeAnalyzer, Transformers, tool } from '@moneyforward/sca-action-core';

export default class Analyzer extends StaticCodeAnalyzer {
  private static readonly command = 'brakeman';

  constructor(options: string[] = []) {
    super(Analyzer.command, options.concat(['--no-progress', '--no-exit-on-warn', '-f', 'json']), undefined, 2);
  }

  protected prepare(): Promise<unknown> {
    return tool.installGem(true, Analyzer.command);
  }

  protected createTransformStreams(): Transformers {
    const buffers: Buffer[] = [];
    const transformer = new stream.Transform({
      readableObjectMode: true,
      transform: function (buffer, _encoding, done): void {
        buffers.push(buffer);
        done();
      },
      flush: function (done): void {
        const result = JSON.parse(Buffer.concat(buffers).toString());
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
    });
    return [transformer, transformer];
  }
}
