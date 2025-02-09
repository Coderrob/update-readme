# Update README with Action Metadata

Update README with action metadata.

**Author:** Robert Lindley

**Branding:**

- **Color:** green
- **Icon:** book

## Inputs

| Name               | Description                                                                      | Default    | Required |
| ------------------ | -------------------------------------------------------------------------------- | ---------- | -------- |
| `readme-file-path` | The path to the README file. Defaults to 'README.md'.                            | README.md  | ❌ No    |
| `action-yaml-path` | The path to the action's YAML configuration file. This defaults to 'action.yml'. | action.yml | ✅ Yes   |
| `timeout-minutes`  | The maximum number of minutes to wait before timing out. Default is 5 minutes.   | 5          | ❌ No    |

## Outputs

This action does not define any outputs.

## Runs

**Type:** Node.js Action

- **Entry Point:** `./dist/index.js`

## Example Usage

```yaml
# Example workflow using this action
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Update README with Action Metadata
        uses: ./
        with:
          readme-file-path: <value>
          action-yaml-path: <value>
          timeout-minutes: <value>
```

_This documentation was automatically generated from the `action.yml`
definition._

<a href="https://www.buymeacoffee.com/coderrob" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-white.png" alt="Buy Me A Coffee" style="height: 25px !important;width: 100px !important;" ></a>
