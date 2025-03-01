# Update README.md with Action Metadata

Updates a README.md file with metadata from an action's YAML configuration file.
This includes information such as the action name, description, inputs, outputs,
and other relevant details.

## Branding

| Attribute | Value |
| --------- | ----- |
| Color     | green |
| Icon      | book  |

## Inputs

| Name              | Description                                                                                                                                     | Default                         | Required |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | -------- |
| action-file-path  | The path to the YAML configuration file for the action. This is relative to the repository root. If not specified, it defaults to 'action.yml'. | ./action.yml                    | ✅ Yes   |
| action-repository | The repository where the action is located. This is used to generate links and references within the README.                                    | ${{ github.action_repository }} | ❌ No    |
| readme-file-path  | The path to the README.md file that should be updated. This is relative to the repository root. If not specified, it defaults to 'README.md'.   | ./README.md                     | ✅ Yes   |

## Outputs

This action does not define any outputs.

## Runs

**Execution Type:** node20

## Example Usage

    jobs:
      example:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout Source
            uses: actions/checkout@v2

          - name: Run Update README.md with Action Metadata
            uses: Coderrob/update-action-readme@main
            with:
              action-file-path: <value>
              action-repository: <value>
              readme-file-path: <value>

## Acknowledgments

This project leverages Markdown generation techniques from
[coderrob.com](https://coderrob.com), developed by **Robert Lindley**.
