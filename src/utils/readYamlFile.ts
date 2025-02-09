import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';

import { DEFAULT_BUFFER_ENCODING } from './constants.js';

type Document = Record<string, unknown>;

/**
 * Reads a YAML file from disk and returns its parsed content.
 */
export async function readYamlFile<T extends Document>(
  filePath: string
): Promise<T> {
  const fileContent = await readFile(filePath, {
    encoding: DEFAULT_BUFFER_ENCODING,
    flag: 'r'
  });
  return yaml.load(fileContent) as T;
}
