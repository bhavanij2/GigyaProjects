const testDevConfig = require('../../../../webpack/config');

describe('mergeDevconfig', () => {

  it('throws an error on invalid input', () => {
    const runBadConfig = () => {
      let badConfig = testDevConfig.generateCommonConfig({
        distPath: 'c7-bpsm',
        entryPointPath: './src/internal-main.ts',
        templateIndexHtmlPath: './public/internal-index.html',
      });

      badConfig = testDevConfig.generateDevConfig({
        config: badConfig,
        distPath: 'c7-bpsm',
      });
    };

    expect(runBadConfig).toThrowError();
  });

  let devConfig = testDevConfig.generateCommonConfig({
    distPath: 'c7-bpsm',
    entryPointPath: './src/internal-main.ts',
    templateIndexHtmlPath: './public/internal-index.html',
  });

  devConfig = testDevConfig.generateDevConfig({
    config: devConfig,
    distPath: 'c7-bpsm',
    beforeMiddleware(app: any) {},
    port: 8085,
  });

  it('sets mode to develoment', () => {
    expect(devConfig.mode).toBe('development');
  });

  it('sets output publicPath to /', () => {
    expect(devConfig.output.publicPath).toBe('/');
  });

  it('adds devServer property to config object', () => {
    expect(devConfig.devServer).not.toBe(null);
  });

  it('sets devtool to inline-source-map', () => {
    expect(devConfig.devtool).toBe('inline-source-map');
  });
});
