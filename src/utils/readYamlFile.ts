import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';

import { DEFAULT_ENCODING } from '../constants.js';

type Document = Record<string, unknown>;

/**
 * Reads a YAML file from disk and returns its parsed content.
 */
export async function readYamlFile<T extends Document>(
  filePath: string
): Promise<T> {
  const fileContent = await readFile(filePath, {
    encoding: DEFAULT_ENCODING,
    flag: 'r'
  });

  if (typeof fileContent !== 'string') {
    throw new Error(
      `Expected YAML file ${filePath} content to be a string but got ${typeof fileContent}`
    );
  }

  if (!fileContent?.trim()) {
    throw new Error(`YAML file at ${filePath} is empty`);
  }

  return yaml.load(fileContent) as T;
}
