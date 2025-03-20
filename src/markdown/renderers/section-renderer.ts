import { Renderer } from '../../types.js';

/**
 * Base class for markdown sections.
 */
export abstract class SectionRenderer implements Renderer {
  abstract render(): Promise<string>;
}
