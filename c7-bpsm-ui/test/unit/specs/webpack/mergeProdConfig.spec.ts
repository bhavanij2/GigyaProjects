const testProdConfig = require('../../../../webpack/config');

describe('mergeProdConfig', () => {

  it('throws an error on invalid input', () => {
    const runBadConfig = () => {
      let badConfig = testProdConfig.generateCommonConfig({
        distPath: 'c7-bpsm',
        entryPointPath: './src/internal-main.ts',
        templateIndexHtmlPath: './public/internal-index.html',
      });

      badConfig = testProdConfig.generateProdConfig({
        config: badConfig,
      });
    };

    expect(runBadConfig).toThrowError();
  });

  let internalConfig = testProdConfig.generateCommonConfig({
    distPath: 'c7-bpsm',
    entryPointPath: './src/internal-main.ts',
    templateIndexHtmlPath: './public/internal-index.html',
  });

  internalConfig = testProdConfig.generateProdConfig({
    config: internalConfig,
    distPath: 'c7-bpsm',
  });

  let externalConfig = testProdConfig.generateCommonConfig({
    distPath: 'external-admin',
    entryPointPath: './src/external-main.ts',
    templateIndexHtmlPath: './public/external-index.html',
  });

  externalConfig = testProdConfig.generateProdConfig({
    config: externalConfig,
    distPath: 'external-admin',
  });

  it('sets mode to production', () => {
    expect(internalConfig.mode).toBe('production');
    expect(externalConfig.mode).toBe('production');
  });

  it('does not add devServer as a property', () => {
    expect(internalConfig.devServer).toBe(undefined);
    expect(externalConfig.devServer).toBe(undefined);
  });

  it('sets output publicPath to the distPath of adminType', () => {
    expect(internalConfig.output.publicPath).toBe('/c7-bpsm');
    expect(externalConfig.output.publicPath).toBe('/external-admin');
  });
});
