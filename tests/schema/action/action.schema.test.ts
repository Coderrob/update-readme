/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { NodeVersion } from '../../../src/types.js';
import { ActionSchema } from '../../../src/schema/action.schema.js';

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
