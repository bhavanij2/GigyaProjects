const { Eyes, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, StitchMode } = require('@applitools/eyes-selenium');
const { ConsoleLogHandler } = require('@applitools/eyes-sdk-core');

const initEyes = async () => {
  const eyes = await new Eyes(new VisualGridRunner());
  eyes.setLogHandler(new ConsoleLogHandler(true));
  return eyes;
};

const browserConfig = (size) => {
  const browsers = {
    medium: {
      stitchMode: StitchMode.CSS,
      browsersInfo: [
        {
          width: 768,
          height: 625,
          name: BrowserType.FIREFOX,
        },
        {
          width: 768,
          height: 625,
          name: BrowserType.CHROME,
        },
      ]
    },
    large: {
      browsersInfo: [
        {
          width: 1024,
          height: 625,
          name: BrowserType.FIREFOX,
        },
        {
          width: 1024,
          height: 625,
          name: BrowserType.CHROME,
        },
        {
          deviceName: DeviceName.iPad,
          screenOrientation: ScreenOrientation.LANDSCAPE,
        }
      ]
    },
    xlarge: {
      browsersInfo: [
        {
          width: 1440,
          height: 625,
          name: BrowserType.FIREFOX,
        },
        {
          width: 1440,
          height: 625,
          name: BrowserType.CHROME,
        },
        {
          deviceName: DeviceName.iPad_Pro,
          screenOrientation: ScreenOrientation.LANDSCAPE,
        }
      ]
    }
  }
  return browsers[size];
}

module.exports = {
  initEyes,
  browserConfig
};
