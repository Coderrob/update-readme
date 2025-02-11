import { NodeVersion } from '../types.js';
import { ActionSchema } from './action.schema.js';

describe('ActionSchema', () => {
  describe('Node', () => {
    it('should successfully validate Node action', () =>
      expect(
        ActionSchema.safeParse({
          name: 'Test Action',
          description: 'This is a test action',
          inputs: {},
          outputs: {},
          runs: {
            using: NodeVersion.NODE18,
            main: 'index.js'
          }
        }).success
      ).toEqual(true));

    it('should fail to validate Node action missing main entrypoint', () =>
      expect(
        ActionSchema.safeParse({
          name: 'Test Action',
          description: 'This is a test action',
          inputs: {},
          outputs: {},
          runs: {
            using: NodeVersion.NODE18,
            main: ''
          }
        }).success
      ).toEqual(false));
  });
});
