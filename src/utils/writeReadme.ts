import { writeFile } from 'fs/promises';

// import * as path from 'path';
import { DEFAULT_BUFFER_ENCODING } from './constants.js';

/**
 * Writes or updates the README.md file in the given directory.
 */
export const writeReadme = async (
  filePath: string,
  content: string
): Promise<void> => {
  // const readmePath = path.join(dir, 'README.md');

  /**
   * Optionally: Merge existing content with new content if needed.
   * For this example, we simply replace it.
   */
  /*
  try {
    const existingContent = await fs.readFile(readmePath, DEFAULT_BUFFER_ENCODING);
    . . . handle merging logic here. . .
  } catch (error) {
    // File does not exist – that’s fine. Everything's fine.
  }
  */

  await writeFile(filePath, content, DEFAULT_BUFFER_ENCODING);
};
