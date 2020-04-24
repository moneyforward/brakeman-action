import stream from 'stream';
import { analyzeCodeStatically, tool } from '@moneyforward/sca-action-core';

(async (): Promise<void> => {
  const command = 'brakeman';
  const args = ['--no-progress', '--no-exit-on-warn', '-f', 'json', '.'];
  const transformer = ((): stream.Transform => {
    const buffers: Buffer[] = [];
    return new stream.Transform({
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
          message: `[${warning.confidence}] ${warning.message}`,
          code: warning.check_name
        });
        this.push(null);
        done();
      }
    });
  })();
  process.exitCode = await analyzeCodeStatically(command, args, undefined, [transformer], tool.installGem(true, command));
})().catch(reason => {
  console.log(`::error::${String(reason)}`);
  process.exit(1);
});
