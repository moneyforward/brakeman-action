const stream = require('stream');
const { analyzeCodeStatically, tool: { installGem } } = require('@moneyforward/sca-action-core');

(async () => {
  const command = 'brakeman';
  const args = ['--no-progress', '--no-exit-on-warn', '-f', 'json', '.'];
  const transformer = (() => {
    const buffers = [];
    return new stream.Transform({
      readableObjectMode: true,
      transform: function (buffer, encoding, done) {
        buffers.push(buffer);
        done();
      },
      flush: function (done) {
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
  process.exitCode |= await analyzeCodeStatically(command, args, undefined, [transformer], installGem(true, command));
})().catch(reason => {
  console.log(`::error::${String(reason)}`);
  process.exit(1);
});
