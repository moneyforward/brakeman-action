import stream from 'stream';
import { analyzeCodeStatically, tool } from '@moneyforward/sca-action-core';

export function createTransformStreams(): [stream.Transform, stream.Transform] {
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

export default class Analyzer {
  constructor(private options: string[] = []) {
  }

  analyze(): Promise<number> {
    const command = 'brakeman';
    return analyzeCodeStatically(
      command,
      this.options.concat(['--no-progress', '--no-exit-on-warn', '-f', 'json', '.']),
      undefined,
      createTransformStreams(),
      tool.installGem(true, command),
      2
    );
  }
}
