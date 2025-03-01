/*
 *
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

import { UpdateReadmeAction } from './action.js';
import { getInputValue } from './inputs.js';
import { Input } from './types.js';

(async () => {
  await new UpdateReadmeAction({
    [Input.ACTION_FILE_PATH]: getInputValue[Input.ACTION_FILE_PATH],
    [Input.README_FILE_PATH]: getInputValue[Input.README_FILE_PATH],
    [Input.ACTION_REPOSITORY]: getInputValue[Input.ACTION_REPOSITORY]
  }).execute();
})();
