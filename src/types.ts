/**
 * Input names for the action.
 */
export enum Input {
  README_FILE_PATH = 'readme-file-path',
  ACTION_FILE_PATH = 'action-file-path'
}

export enum NodeVersion {
  NODE16 = 'node16',
  NODE18 = 'node18',
  NODE20 = 'node20',
  NODE22 = 'node22'
}

export const CompositeRun = 'composite';
export const DockerRun = 'docker';

export type RunType = typeof CompositeRun | typeof DockerRun | `${NodeVersion}`;
