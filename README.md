# Update Action README

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Work in progress

. . .

# GitHub Action: Update Action README

This GitHub Action automates the creation process for a static site README
documentation for GitHub Actions. It is designed to integrate seamlessly into
your CI/CD workflow.

## 🚀 Usage

To use this action, add the following step to your workflow:

```yaml
jobs:
  my_job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run My Custom Action
        uses: my-org/my-action@v1
        with:
          input1: 'value1'
          input2: 'value2'
```

## 📥 Inputs

| Name     | Description           | Required | Default         |
| -------- | --------------------- | -------- | --------------- |
| `input1` | Description of input1 | ✅ Yes   | -               |
| `input2` | Description of input2 | ❌ No    | `default_value` |

## 📤 Outputs

| Name      | Description                         |
| --------- | ----------------------------------- |
| `output1` | Provides the processed data result. |
| `output2` | Status message of the action.       |

## 🔧 Example Workflow

Here’s a complete example of a workflow using this action:

```yaml
name: Example Workflow
on: [push]

jobs:
  example_job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Use My Custom Action
        id: my_action
        uses: my-org/my-action@v1
        with:
          input1: "example_value"

      - name: Output Results
        run: echo "The action returned: ${{ steps.my_action.outputs.output1 }}"
```

## 📄 Action Configuration (`action.yml`)

For reference, here’s the `action.yml` file:

```yaml
name: 'My Custom Action'
description: 'A brief explanation of what this action does.'
inputs:
  input1:
    description: 'The first input parameter.'
    required: true
  input2:
    description: 'The second input parameter.'
    required: false
    default: 'default_value'
outputs:
  output1:
    description: 'The main result of the action.'
  output2:
    description: 'A status message.'
runs:
  using: 'node16'
  main: 'dist/index.js'
```

## 📚 Additional Information

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [My Custom Action Repository](https://github.com/my-org/my-action)
- [Issues & Feature Requests](https://github.com/my-org/my-action/issues)
