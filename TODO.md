# TODO.md

The following is a list of tasks that need to be completed. Each task has a
priority, an estimated time to complete, and a person assigned to it.

### Todo

- [ ] Implement a guard to allow users to specify input file paths with specific
      extensions only.

- [ ] Add path validation to input properties containing file paths to ensure
      that users can only access files within a specific directory. (i.e.,
      relative path checks)

  - [ ] Use a whitelist of allowed directories or paths to restrict access.
  - [ ] Implement a function that checks if the provided path is within the
        allowed directory.

- [ ] Replace string builder approach to README format with a lightweight
      template engine.

- [ ] Replace hard-coded markdown syntax with ts-markdown or similar library.

  - [ ] Consider using libraries like Handlebars or EJS for more robust and
        maintainable templating.

- [ ] Look into moving schema definitions for the Action into a separate
      package. This will help in maintaining consistency and reducing errors
      related to markdown generation.

- [ ] Enforce minimum code coverage requirements to ensure an 85% code coverage
      rate.

- [ ] Remove the "buy me coffee" link from the generated README file and replace
      with less flashy "made by [Your Name]" message with a link back to this
      origin repo.

- [ ] Add a feature that allows users to specify custom templates for README
      generation.

- [ ] Implement input validation and sanitization across all user inputs.

  - [ ] Allow users to specify custom template files or URLs. Enable variable
        replacements in templates using values from the Action metadata. Provide
        a preview of the generated README before saving.

- [ ] Integrate security scanning tools to identify vulnerabilities in
      dependencies.

  - [ ] Use libraries like validator for comprehensive input validation and
        sanitization.

- [ ] Implement logging with sensitive data redaction.

  - [ ] Use tools like Snyk or Dependabot to regularly scan and update
        dependencies for known vulnerabilities.

- [ ] Review and update permissions in GitHub Actions workflow files.

  - [ ] Ensure that logs do not contain sensitive information by implementing a
        logging strategy that masks such data.

- [ ] Add contributor guidelines and code of conduct.

### In Progress

- [x] Work on Github Repo TODO

### Done ✓

- [x] Add pull request templates for different types of contributions (bug
      fixes, feature requests, etc.).
