# Update README with Action Metadata

Update README with action metadata.

## Branding

| Attribute | Value |
| --------- | ----- |
| Color     | green |
| Icon      | book  |

## Inputs

| Name             | Description                                                                      | Default    | Required | Deprecation |
| ---------------- | -------------------------------------------------------------------------------- | ---------- | -------- | ----------- |
| readme-file-path | The path to the README file. Defaults to 'README.md'.                            | README.md  | ❌ No     | -           |
| action-yaml-path | The path to the action's YAML configuration file. This defaults to 'action.yml'. | action.yml | ✅ Yes    | -           |

## Outputs

This action does not define any outputs.

## Environment Variables

This action does not require any environment variables.

## Dependencies

This section provides a graph of dependencies relevant to this action.

    dependencies:
    - GitHub Actions Runner
    - Specific environment variables
    - Required files and configurations

## Runs

**Execution Type:** node20

This action uses an unrecognized runtime configuration.

## Example Usage

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

## Acknowledgments

This project leverages markdown generation techniques from [coderrob.com](https://coderrob.com), developed by **Robert Lindley**.