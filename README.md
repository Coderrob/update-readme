# Update README with Action Metadata

Updates a README.md file with metadata from an action's YAML configuration file.
This includes information such as the action name, description, inputs, outputs,
and other relevant details. This ensures that the README is always up-to-date
with the latest information about the action.

## Branding

| Attribute | Value |
| --------- | ----- |
| Color     | green |
| Icon      | book  |

## Inputs

| Name             | Description                                                                                                                                     | Default      | Required | Deprecation |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------- | ----------- |
| readme-file-path | The path to the README.md file that should be updated. This is relative to the repository root. If not specified, it defaults to 'README.md'.   | ./README.md  | ✅ Yes   | -           |
| action-file-path | The path to the YAML configuration file for the action. This is relative to the repository root. If not specified, it defaults to 'action.yml'. | ./action.yml | ✅ Yes   | -           |

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

This action uses a Node.js runtime configuration.

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
              action-file-path: <value>

## Acknowledgments

This project leverages Markdown generation techniques from
[coderrob.com](https://coderrob.com), developed by **Robert Lindley**.
