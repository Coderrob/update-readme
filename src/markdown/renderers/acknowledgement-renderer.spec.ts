import { AcknowledgmentRenderer } from './acknowledgment-renderer.js';

describe('AcknowledgmentRenderer', () => {
  it('should render the acknowledgment section correctly', async () => {
    expect(await new AcknowledgmentRenderer().render()).toEqual(`
## Acknowledgments

This project leverages Markdown generation techniques from
[coderrob.com](https://coderrob.com), developed by **Robert Lindley**.
`);
  });
});
