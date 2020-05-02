# Code review using Brakeman

Analyze code statically by using Brakeman in Github actions

## Inputs

### `files`

Changes the path to a Rails application

### `options`

Changes `brakeman` command line options.

Specify the options in JSON array format.
e.g.: `'["-A", "--skip-libs"]'`

### `working_directory`

Changes the current working directory of the Node.js process

## Example usage

```yaml
name: Analyze code statically
"on": pull_request
jobs:
  brakeman:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Analyze code statically using Brakeman
        uses: moneyforward/brakeman-action@v0
```

## Contributing
Bug reports and pull requests are welcome on GitHub at https://github.com/moneyforward/brakeman-action

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
