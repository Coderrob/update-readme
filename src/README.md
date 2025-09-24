# Source Code Organization

This directory contains the reorganized source code with a logical folder
structure.

## Directory Structure

```
src/
├── core/           # Core business logic and main entry points
│   ├── index.ts           # Main entry point
│   ├── types.ts           # Core type definitions and interfaces
│   ├── constants.ts       # Application constants
│   └── update-readme.action.ts  # Main action class
├── config/         # Configuration management and input handling
│   ├── action-inputs.ts   # GitHub Action input handling
│   ├── template-config.loader.ts  # Template configuration loading
│   └── template-config.manager.ts # Template configuration management
├── schema/         # Data validation and type definitions (Zod schemas)
│   ├── index.ts           # Schema exports
│   ├── action.schema.ts   # Main action schema validation
│   ├── branding.schema.ts # Branding schema
│   ├── inputs.schema.ts   # Inputs schema
│   ├── outputs.schema.ts  # Outputs schema
│   ├── runs.schema.ts     # Runs schema
│   └── ...               # Other specialized schemas
├── template/       # Template engine and rendering system
│   ├── template.engine.ts # Core template processing engine
│   ├── markdown.generator.ts # Main markdown generation
│   ├── readme.generator.ts # README file generation
│   ├── mermaid-flowchart,generator.ts # Mermaid diagram generation
│   ├── template-validation.error.ts # Template validation errors
│   └── renderers/        # Specialized rendering components
│       ├── index.ts      # Renderer exports
│       ├── branding.renderer.ts
│       ├── inputs.renderer.ts
│       ├── outputs.renderer.ts
│       └── ...          # Other specialized renderers
├── analysis/       # Content analysis and validation tools
│   ├── content.validator.ts # README content validation
│   ├── dependency.analyzer.ts # Dependency analysis and mermaid generation
│   └── structure.analyzer.ts # Project structure analysis
└── utils/          # Utility functions and helpers
    ├── guards.ts          # Type guards and utility functions
    └── read-yaml-file.ts  # YAML file reading utilities
```

## Design Principles

The reorganization follows these principles:

1. **Separation of Concerns**: Each directory has a specific responsibility
2. **Logical Grouping**: Related functionality is grouped together
3. **Clear Dependencies**: Dependencies flow from specific to general
4. **Intuitive Navigation**: Easy to find files based on their purpose

## Import Patterns

- Core types and interfaces: `import { ... } from './core/types.js'`
- Configuration: `import { ... } from './config/...js'`
- Schema validation: `import { ... } from './schema/...js'`
- Template rendering: `import { ... } from './template/...js'`
- Analysis tools: `import { ... } from './analysis/...js'`
- Utilities: `import { ... } from './utils/...js'`
