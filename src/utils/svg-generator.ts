import fs from 'fs';

import * as exec from '@actions/exec';

export class SVGGenerator {
  private puml: string;
  private filePath: string;

  constructor(puml: string, filePath: string) {
    this.puml = puml;
    this.filePath = filePath;
  }

  async generate(): Promise<void> {
    const tempFilePath = 'diagram.puml';
    fs.writeFileSync(tempFilePath, this.puml);
    try {
      await exec.exec('plantuml', ['-tsvg', tempFilePath]);
      fs.renameSync('diagram.svg', this.filePath);
    } catch (error) {
      throw new Error(`PlantUML execution failed: ${error}`);
    } finally {
      fs.unlinkSync(tempFilePath);
    }
  }
}
