import { CompositeRuns } from '../../src/schema/composite/composite-runs.js';
import { MermaidFlowchartGenerator } from '../../src/utils/mermaid-flowchart-generator.js';

describe('MermaidFlowchartGenerator', () => {
  let runs: CompositeRuns;

  beforeEach(() => {
    runs = { using: 'composite', steps: [] };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    ordinal | steps                                                                                       | expectedFragments
    ${1}    | ${[{ id: 'step1', name: 'Init' }]}                                                          | ${['["Init"]']}
    ${2}    | ${[{ id: 'step1', name: 'Build', uses: 'actions/setup-node@v3' }]}                          | ${['["Build\\nuses: actions/setup-node@v3"]']}
    ${3}    | ${[{ id: 'step1', name: 'Lint', if: 'success()' }]}                                         | ${['{"if: success()"}', '["Lint"]']}
    ${4}    | ${[{ id: 'step1', name: 'Build' }, { id: 'step2', name: 'Test', uses: 'actions/test@v1' }]} | ${['["Build"]', '["Test\\nuses: actions/test@v1"]']}
    ${5}    | ${[{ id: 's1', name: 'Compile', if: 'always()', uses: 'actions/compile@v2' }]}              | ${['{"if: always()"}', '["Compile\\nuses: actions/compile@v2"]']}
  `(
    'should generate correct flowchart step $ordinal',
    ({ steps, expectedFragments }) => {
      runs.steps = steps;
      const result = new MermaidFlowchartGenerator(runs).generate();
      for (const fragment of expectedFragments) {
        expect(result).toContain(fragment);
      }
    }
  );
});
