import * as yaml from 'js-yaml';
import { readFile } from 'fs/promises';
import { DEFAULT_BUFFER_ENCODING } from './constants.js';

/**
 * Reads a YAML file from disk and returns its parsed content.
 */
export const readYamlFile = async (filePath: string): Promise<unknown> => {
  const fileContent = await readFile(filePath, {
    encoding: DEFAULT_BUFFER_ENCODING
  });
  return yaml.load(fileContent);
};
