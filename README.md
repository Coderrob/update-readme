# Update Action README

Update the README for an action based on its YAML configuration.

**Author:** Robert "coderrob" Lindley

**Branding:**

- **Color:** black
- **Icon:** book-open

## Inputs

| Name               | Description                                                                        | Default      | Required |
| ------------------ | ---------------------------------------------------------------------------------- | ------------ | -------- |
| `action-yaml-path` | The path to the action's YAML configuration file. This defaults to './action.yml'. | ./action.yml | Yes      |
| `timeout-minutes`  | The maximum number of minutes to wait before timing out. Default is 5 minutes.     | 5            | No       |

## Outputs

This action does not define any outputs.

## Runs

**Type:** Node.js Action

- **Entry Point:** `dist/index.mjs`

## Example Usage

```yaml
# Example workflow using this action
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Update Action README
        uses: ./
        with:
          action-yaml-path: <value>
          timeout-minutes: <value>
```

_This documentation was automatically generated from the `action.yml`
definition._
