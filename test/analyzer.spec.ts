import { expect } from 'chai';
import stream from 'stream';
import util from 'util'
import Analyzer, { Warning } from '../src/analyzer'

describe('Transform', () => {
  it('should return the problem object', async () => {
    const warning: Warning = {
      "warning_type": "Remote Code Execution",
      "warning_code": 110,
      "fingerprint": "d882f63ce96c28fb6c6e0982f2a171460e4b933bfd9b9a5421dca21eef3f76da",
      "check_name": "CookieSerialization",
      "message": "Use of unsafe cookie serialization strategy `:marshal` might lead to remote code execution",
      "file": "config/initializers/cookies_serializer.rb",
      "line": 5,
      "link": "https://brakemanscanner.org/docs/warning_types/unsafe_deserialization",
      "code": "Rails.application.config.action_dispatch.cookies_serializer = :marshal",
      "render_path": null,
      "location": null,
      "user_input": null,
      "confidence": "Medium"
    };
    const text = JSON.stringify({ "warnings": [warning] });
    const analyzer = new (class extends Analyzer {
      public constructor() {
        super();
      }
      public createTransformStreams(): stream.Transform[] {
        return super.createTransformStreams();
      }
    })();
    const streams = [stream.Readable.from(text), ...analyzer.createTransformStreams()];
    await util.promisify(stream.pipeline)(streams);
    for await (const problem of streams[streams.length - 1])
      expect(problem).to.deep.equal({
        file: 'config/initializers/cookies_serializer.rb',
        line: 5,
        column: 0,
        severity: 'warning',
        message: '[Medium] Remote Code Execution: Use of unsafe cookie serialization strategy `:marshal` might lead to remote code execution',
        code: 'CookieSerialization'
      });
  });
});
