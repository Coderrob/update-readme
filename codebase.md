# Codebase Analysis and Reorganization Plan

## Current Structure Analysis

### Project Overview

This is a GitHub Action project that automatically updates README.md files with
the latest version information from action.yml files. The project uses
TypeScript, Jest for testing, Rollup for bundling, and follows modern Node.js
development practices.

### Current Directory Structure

```text
src/
├── constants.ts                 # Global constants
├── index.ts                     # Main entry point
├── inputs.ts                    # Input handling utilities
├── types.ts                     # Core type definitions
│
├── analyzers/                   # Analysis tools
│   ├── content-validator.ts     # Markdown content validation
│   ├── dependency-analyzer.ts   # Project dependency analysis
│   ├── index.ts                 # Analyzer exports
│   └── structure-analyzer.ts    # Directory structure analysis
│
├── core/                        # Core business logic
│   ├── action.ts                # Main UpdateReadmeAction class
│   ├── constants.ts             # Core-specific constants
│   ├── index.ts                 # Core exports
│   └── types.ts                 # Core type definitions
│
├── generators/                  # Content generation
│   ├── index.ts                 # Generator exports
│   ├── markdown/                # Markdown generation
│   │   ├── index.ts
│   │   ├── markdown-generator.ts # Main markdown generator
│   │   ├── template-config.ts   # Template configuration
│   │   └── template-engine.ts   # Template processing engine
│   └── renderers/               # Content renderers
│       ├── acknowledgment-renderer.ts
│       ├── branding-renderer.ts
│       ├── composite-run-renderer.ts
│       ├── example-usage-renderer.ts
│       ├── index.ts
│       ├── inputs-renderer.ts
│       ├── outputs-renderer.ts
│       ├── section-renderer.ts
│       ├── simple-run-renderer.ts
│       └── text-renderer.ts
│
├── schema/                      # Data validation schemas
│   ├── action/                  # Action-related schemas
│   │   ├── action.schema.ts
│   │   └── action.ts
│   ├── action.schema.test.ts
│   ├── action.schema.ts
│   ├── action.ts
│   ├── branding.schema.ts
│   ├── branding.ts
│   ├── common/
│   │   └── required.ts
│   ├── components/              # Duplicate schema components
│   │   ├── branding.schema.ts
│   │   ├── branding.ts
│   │   ├── input-entry.schema.ts
│   │   ├── input-entry.ts
│   │   ├── inputs.schema.ts
│   │   ├── inputs.ts
│   │   ├── output-entry.schema.ts
│   │   ├── output-entry.ts
│   │   └── outputs.schema.ts
│   │   └── outputs.ts
│   ├── composite/
│   │   ├── composite-runs.schema.ts
│   │   ├── composite-runs.ts
│   │   ├── composite-step.schema.ts
│   │   └── composite-step.ts
│   ├── constants.ts
│   ├── docker/
│   │   ├── docker-runs.schema.ts
│   │   └── docker-runs.ts
│   ├── index.ts
│   ├── input-entry.schema.ts
│   ├── input-entry.ts
│   ├── inputs.schema.ts
│   ├── inputs.ts
│   ├── node/
│   │   ├── node-runs.schema.ts
│   │   └── node-runs.ts
│   ├── output-entry.schema.ts
│   ├── output-entry.ts
│   ├── outputs.schema.ts
│   ├── outputs.ts
│   ├── runs/
│   │   ├── composite/
│   │   │   ├── composite-runs.schema.ts
│   │   │   ├── composite-runs.ts
│   │   │   ├── composite-step.schema.ts
│   │   │   └── composite-step.ts
│   │   ├── docker/
│   │   │   ├── docker-runs.schema.ts
│   │   │   └── docker-runs.ts
│   │   ├── node/
│   │   │   ├── node-runs.schema.ts
│   │   │   └── node-runs.ts
│   │   └── runs.schema.ts
│   │   └── runs.ts
│   ├── runs.schema.ts
│   └── runs.ts
│
└── utils/                       # Utility functions
    ├── guards.ts                # Type guards
    ├── index.ts                 # Utility exports
    ├── mermaid-flowchart-generator.ts
    ├── read-yaml-file.ts
    ├── readme-generator.ts
```

## Code Duplication Analysis

Using jscpd analysis, the codebase shows minimal duplication:

- No significant code duplication detected (>10 lines, >50 tokens)
- Some structural patterns exist but are appropriately abstracted

However, structural duplication exists in:

1. **Schema Organization**: Multiple nested directories with similar structures
2. **Renderer Patterns**: Similar implementation patterns across renderers
3. **Type Definitions**: Scattered type definitions across multiple files

## Current Architecture Issues

### Problems Identified

1. **Schema Structure Complexity**

   - Deeply nested directories (schema/action/, schema/runs/composite/, etc.)
   - Duplicate schema files in different locations
   - Inconsistent organization between schema types

2. **Mixed Concerns**

   - Core business logic mixed with infrastructure concerns
   - Renderers contain both data transformation and presentation logic
   - Analyzers mix validation logic with business rules

3. **Interface Segregation Violations**

   - Large interfaces with multiple responsibilities
   - Tight coupling between components
   - Missing abstraction layers

4. **Template Engine Complexity**
   - Single large class handling multiple template concerns
   - Mixed template parsing, validation, and rendering logic

## Proposed Reorganization Plan

### Design Principles Applied

Following **SOLID**, **DRY**, **Clean Architecture**, and **Domain-Driven
Design** principles:

1. **Single Responsibility Principle**: Each module has one reason to change
2. **Open/Closed Principle**: Open for extension, closed for modification
3. **Liskov Substitution Principle**: Subtypes are substitutable for their base
   types
4. **Interface Segregation Principle**: Clients depend only on methods they use
5. **Dependency Inversion Principle**: Depend on abstractions, not concretions

### Martin Fowler Refactoring Patterns Applied

1. **Extract Class**: Break down large classes into smaller, focused classes
2. **Extract Interface**: Define clear contracts between components
3. **Move Method**: Relocate methods to classes with higher cohesion
4. **Replace Conditional with Polymorphism**: Use strategy pattern for varying
   behavior
5. **Introduce Parameter Object**: Group related parameters into objects

### GoF Design Patterns Applied

1. **Strategy Pattern**: For different rendering strategies
2. **Template Method Pattern**: For common rendering workflows
3. **Factory Pattern**: For creating appropriate analyzers/renderers
4. **Builder Pattern**: For complex object construction
5. **Composite Pattern**: For hierarchical content structures

### Proposed New Structure

```text
src/
├── domain/                      # Domain layer (business logic)
│   ├── actions/                 # Action-related domain logic
│   │   ├── interfaces/          # Domain interfaces
│   │   ├── services/            # Domain services
│   │   └── entities/            # Domain entities
│   ├── content/                 # Content domain
│   │   ├── interfaces/
│   │   ├── services/
│   │   └── entities/
│   └── validation/              # Validation domain
│       ├── interfaces/
│       ├── services/
│       └── entities/
│
├── application/                 # Application layer (use cases)
│   ├── interfaces/              # Application interfaces
│   ├── services/                # Application services
│   ├── dto/                     # Data Transfer Objects
│   └── handlers/                # Command/Query handlers
│
├── infrastructure/              # Infrastructure layer
│   ├── github/                  # GitHub-specific implementations
│   ├── file-system/             # File system operations
│   ├── template-engine/         # Template processing
│   ├── schema-validation/       # Schema validation
│   └── logging/                 # Logging infrastructure
│
├── presentation/                # Presentation layer
│   ├── cli/                     # Command-line interface
│   ├── renderers/               # Content renderers
│   │   ├── interfaces/          # Renderer contracts
│   │   ├── implementations/     # Concrete renderers
│   │   └── strategies/          # Rendering strategies
│   └── formatters/              # Output formatters
│
├── shared/                      # Shared kernel
│   ├── kernel/                  # Core shared functionality
│   │   ├── types/               # Shared type definitions
│   │   ├── interfaces/          # Shared interfaces
│   │   ├── constants/           # Shared constants
│   │   └── errors/              # Shared error types
│   └── utils/                   # Shared utilities
│       ├── guards/              # Type guards
│       ├── validation/          # Generic validation
│       ├── parsing/             # Generic parsing
│       └── formatting/          # Generic formatting
│
├── config/                      # Configuration
│   ├── schemas/                 # Zod schemas (consolidated)
│   ├── types/                   # Generated types
│   └── validation/              # Schema validation
│
└── bootstrap/                   # Application bootstrap
    ├── composition-root.ts      # Dependency injection setup
    ├── main.ts                  # Application entry point
    └── container.ts             # IoC container configuration
```

## Detailed Component Analysis and Refactoring

### 1. Schema Consolidation

**Current Issues:**

- Scattered schema definitions across multiple directories
- Duplicate schemas in different locations
- Inconsistent naming and organization

**Proposed Solution:**

```typescript
// config/schemas/index.ts - Single source of truth
export { ActionSchema } from './action.schema.js';
export { BrandingSchema } from './branding.schema.js';
export { InputsSchema } from './inputs.schema.js';
export { OutputsSchema } from './outputs.schema.js';
export { RunsSchema } from './runs.schema.js';
export { CompositeRunsSchema } from './composite-runs.schema.js';
export { DockerRunsSchema } from './docker-runs.schema.js';
export { NodeRunsSchema } from './node-runs.schema.js';

// config/types/index.ts - Generated types
export type { Action } from './action.js';
export type { Branding } from './branding.js';
// ... other generated types
```

### 2. Renderer Architecture Refactoring

**Current Issues:**

- Concrete renderers mixed with business logic
- No clear separation between rendering strategies
- Tight coupling between renderers and data models

**Proposed Solution (Strategy Pattern):**

```typescript
// presentation/renderers/interfaces/renderer.interface.ts
export interface IContentRenderer {
  canRender(contentType: ContentType): boolean;
  render(context: RenderContext): Promise<string>;
}

// presentation/renderers/strategies/renderer.strategy.ts
export abstract class BaseRendererStrategy implements IContentRenderer {
  abstract canRender(contentType: ContentType): boolean;
  abstract render(context: RenderContext): Promise<string>;

  protected async renderHeader(level: number, text: string): Promise<string> {
    // Common header rendering logic
  }

  protected async renderParagraph(text: string): Promise<string> {
    // Common paragraph rendering logic
  }
}

// presentation/renderers/implementations/markdown.renderer.ts
export class MarkdownAcknowledgmentRenderer extends BaseRendererStrategy {
  canRender(contentType: ContentType): boolean {
    return contentType === ContentType.ACKNOWLEDGMENT;
  }

  async render(context: RenderContext): Promise<string> {
    return this.renderAcknowledgment(context.data);
  }
}
```

### 3. Template Engine Decomposition

**Current Issues:**

- Single monolithic class handling multiple concerns
- Mixed parsing, validation, and rendering logic
- Difficult to test and extend

**Proposed Solution (Template Method Pattern):**

```typescript
// infrastructure/template-engine/interfaces/template.processor.ts
export interface ITemplateProcessor {
  process(template: string, context: TemplateContext): Promise<string>;
}

// infrastructure/template-engine/core/template.engine.ts
export abstract class BaseTemplateEngine implements ITemplateProcessor {
  async process(template: string, context: TemplateContext): Promise<string> {
    const parsed = await this.parseTemplate(template);
    const validated = await this.validateContext(parsed, context);
    const rendered = await this.renderTemplate(validated, context);
    return this.postProcess(rendered);
  }

  protected abstract parseTemplate(template: string): Promise<ParsedTemplate>;
  protected abstract validateContext(
    template: ParsedTemplate,
    context: TemplateContext
  ): Promise<ValidatedTemplate>;
  protected abstract renderTemplate(
    template: ValidatedTemplate,
    context: TemplateContext
  ): Promise<string>;
  protected abstract postProcess(result: string): Promise<string>;
}

// infrastructure/template-engine/implementations/handlebars.engine.ts
export class HandlebarsTemplateEngine extends BaseTemplateEngine {
  protected async parseTemplate(template: string): Promise<ParsedTemplate> {
    // Handlebars-specific parsing
  }
  // ... other implementations
}
```

### 4. Analyzer Refactoring

**Current Issues:**

- Mixed analysis logic with validation
- No clear separation between different analysis types
- Difficult to add new analyzers

**Proposed Solution (Factory + Strategy Pattern):**

```typescript
// domain/validation/interfaces/analyzer.interface.ts
export interface IAnalyzer<TInput, TResult> {
  analyze(input: TInput): Promise<TResult>;
  getName(): string;
  getVersion(): string;
}

// domain/validation/services/analyzer.factory.ts
export class AnalyzerFactory {
  static createAnalyzer(type: AnalyzerType): IAnalyzer<any, any> {
    switch (type) {
      case AnalyzerType.CONTENT:
        return new ContentAnalyzer();
      case AnalyzerType.DEPENDENCY:
        return new DependencyAnalyzer();
      case AnalyzerType.STRUCTURE:
        return new StructureAnalyzer();
      default:
        throw new Error(`Unknown analyzer type: ${type}`);
    }
  }
}

// domain/validation/implementations/content.analyzer.ts
export class ContentAnalyzer
  implements IAnalyzer<ContentInput, ContentAnalysis>
{
  async analyze(input: ContentInput): Promise<ContentAnalysis> {
    // Content analysis logic
  }

  getName(): string {
    return 'ContentAnalyzer';
  }

  getVersion(): string {
    return '1.0.0';
  }
}
```

### 5. Core Action Refactoring

**Current Issues:**

- Single class handling multiple responsibilities
- Mixed infrastructure and business logic
- Difficult to test in isolation

**Proposed Solution (Command Pattern + Dependency Injection):**

```typescript
// application/handlers/interfaces/command.handler.ts
export interface ICommandHandler<TCommand, TResult> {
  handle(command: TCommand): Promise<TResult>;
}

// application/handlers/update-readme.handler.ts
export class UpdateReadmeHandler
  implements ICommandHandler<UpdateReadmeCommand, void>
{
  constructor(
    private readonly actionReader: IActionReader,
    private readonly contentGenerator: IContentGenerator,
    private readonly fileWriter: IFileWriter,
    private readonly logger: ILogger
  ) {}

  async handle(command: UpdateReadmeCommand): Promise<void> {
    try {
      const action = await this.actionReader.read(command.actionPath);
      const content = await this.contentGenerator.generate(action);
      await this.fileWriter.write(command.readmePath, content);
      this.logger.info('README updated successfully');
    } catch (error) {
      this.logger.error('Failed to update README', error);
      throw error;
    }
  }
}

// bootstrap/composition-root.ts
export class CompositionRoot {
  static configure(): Container {
    const container = new Container();

    // Register interfaces with implementations
    container.register<IActionReader>('IActionReader', ActionReader);
    container.register<IContentGenerator>(
      'IContentGenerator',
      MarkdownGenerator
    );
    container.register<IFileWriter>('IFileWriter', FileSystemWriter);
    container.register<ILogger>('ILogger', ConsoleLogger);

    // Register command handlers
    container.register<ICommandHandler<UpdateReadmeCommand, void>>(
      'ICommandHandler<UpdateReadmeCommand, void>',
      UpdateReadmeHandler
    );

    return container;
  }
}
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

1. Create new directory structure
2. Extract shared kernel (types, interfaces, constants)
3. Consolidate schema definitions
4. Set up dependency injection container

### Phase 2: Domain Layer (Week 3-4)

1. Extract domain entities and value objects
2. Define domain interfaces and services
3. Implement domain logic with proper separation
4. Create domain tests

### Phase 3: Application Layer (Week 5-6)

1. Implement command/query handlers
2. Create DTOs for data transfer
3. Set up application services
4. Implement application layer tests

### Phase 4: Infrastructure Layer (Week 7-8)

1. Refactor template engine using Template Method pattern
2. Implement repository pattern for data access
3. Create infrastructure adapters
4. Implement infrastructure tests

### Phase 5: Presentation Layer (Week 9-10)

1. Refactor renderers using Strategy pattern
2. Implement presentation services
3. Create CLI interface
4. Implement presentation tests

### Phase 6: Integration and Testing (Week 11-12)

1. Integration testing across layers
2. Performance optimization
3. Documentation updates
4. Final validation

## Benefits of Proposed Architecture

### Maintainability

- **Single Responsibility**: Each class has one clear purpose
- **Dependency Injection**: Loose coupling between components
- **Interface Segregation**: Clients depend only on what they need

### Testability

- **Dependency Inversion**: Easy to mock dependencies
- **Interface-based Design**: Test against contracts, not implementations
- **Separated Concerns**: Each layer can be tested independently

### Extensibility

- **Open/Closed Principle**: New functionality without modifying existing code
- **Strategy Pattern**: Easy to add new rendering/processing strategies
- **Factory Pattern**: Simple addition of new analyzers/generators

### Code Quality

- **DRY Principle**: Eliminated duplication through proper abstraction
- **Clean Architecture**: Clear separation of concerns
- **SOLID Principles**: Robust, maintainable design

## Migration Strategy

### Incremental Migration

1. **Parallel Implementation**: Build new architecture alongside existing code
2. **Feature Flags**: Gradually migrate functionality using feature toggles
3. **Backward Compatibility**: Ensure existing API contracts remain valid
4. **Gradual Rollout**: Migrate components one at a time

### Risk Mitigation

1. **Comprehensive Testing**: Maintain high test coverage throughout migration
2. **Continuous Integration**: Automated testing on every change
3. **Code Reviews**: Peer review of architectural changes
4. **Rollback Plan**: Ability to revert changes if issues arise

This reorganization plan transforms the codebase from a procedural,
tightly-coupled structure into a maintainable, extensible, and testable
domain-driven architecture following industry best practices.</content>
<parameter name="filePath">c:\Users\user\Documents\dev\update-readme\codebase.md
