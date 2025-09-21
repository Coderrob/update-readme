import { BrandingRenderer } from '../../../src/generators/renderers/branding-renderer.js';

describe('BrandingRenderer', () => {
  it('should render the branding section correctly', async () => {
    expect(
      await new BrandingRenderer({
        color: 'green',
        icon: 'book'
      }).render()
    ).toEqual(`
## Branding

| Attribute | Value |
| --------- | ----- |
| Color     | green |
| Icon      | book  |`);
  });
});
