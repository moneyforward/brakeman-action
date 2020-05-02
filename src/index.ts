import Analyzer from './analyzer';

console.log('::echo::%s', process.env['RUNNER_DEBUG'] === '1' ? 'on' : 'off');
(async (): Promise<void> => {
  const options = JSON.parse(process.env.INPUT_OPTIONS || '[]');
  const workingDirectory = process.env.INPUT_WORKING_DIRECTORY;
  workingDirectory && process.chdir(workingDirectory);
  const analyzer = new Analyzer(options);
  process.exitCode = await analyzer.analyze();
})().catch(reason => {
  console.log(`::error::${String(reason)}`);
  process.exit(1);
});
