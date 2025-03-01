# Things to Do

The following is a list of tasks that need to be completed. Each task has a
priority, an estimated time to complete, and a person assigned to it.

## Task List

- [ ] Implement a guard to allow users to specify input file paths with specific
      extensions only.
- [ ] Add path validation to input properties containing file paths to ensure
      that users can only access files within a specific directory. (i.e.,
      relative path checks)
  - [ ] Use a whitelist of allowed directories or paths to restrict access.
  - [ ] Implement a function that checks if the provided path is within the
        allowed directory.
- [ ] Add a feature that allows users to specify custom templates for README.md
      generation.
- [ ] Implement input validation and sanitization across all user inputs.
  - [ ] Allow users to specify custom template files or URLs. Enable variable
        replacements in templates using values from the Action metadata. Provide
        a preview of the generated README.md file before saving.
- [ ] Implement logging with sensitive data redaction.
  - [ ] Use tools like Snyk or Dependabot to regularly scan and update
        dependencies for known vulnerabilities.
- [ ] Review and update permissions in GitHub Actions workflow files.
  - [ ] Ensure that logs do not contain sensitive information by implementing a
        logging strategy that masks such data.
- [ ] Add contributor guidelines and code of conduct.

## In Progress

- [x] Integrate security scanning tools to identify vulnerabilities in
      dependencies.
  - [ ] Create SBOM export process for dependency analysis.
  - [ ] Use libraries like validator for comprehensive input validation and
        sanitization.
- [ ] Look into moving schema definitions for the Action into a separate
      package. This will help in maintaining consistency and reducing errors
      related to Markdown generation.
  - [x] Generated action.schema.json to repository.
  - [ ] Swap Zod with Ajv to validate schema after moving Zod definitions
        outside of the Action repository.

## Done ✓

- [x] Add pull request templates for different types of contributions (bug
      fixes, feature requests, etc.).
- [x] Replace string builder approach to Markdown format with a lightweight
      template engine.
- [x] Remove the "buy me coffee" link from the generated README.md file and
      replace with less flashy "made by [Your Name]" message with a link back to
      this origin repository.
- [x] Replace hardcoded Markdown syntax with ts-markdown or similar library.
- [x] Enforce minimum code coverage requirements to ensure target quality of the
      85% code coverage rate.
