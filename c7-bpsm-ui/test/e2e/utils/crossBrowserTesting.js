const webdriver = require('selenium-webdriver');

const startCBT = async () => {
    const capabilities = Object.assign( {
        password: process.env.CBT_TOKEN,
        username: process.env.CBT_USER
    },
    {
          browserName: 'Chrome',
          platform: 'Windows 10',
          version: '71x64',
          'record_video': 'true',
          'record_network': 'true',
          'screen_resolution': '1920x1080',
          name: 'C7 Portal Applitools',
      },
   );

    return getWebdriver(capabilities);
};

const getWebdriver = async (capabilities) => {
    let driver;
    try {
        driver = await new webdriver.Builder()
            .usingServer( 'http://hub.crossbrowsertesting.com:80/wd/hub' )
            .withCapabilities( capabilities )
            .build();
        // setting zoom for test consistency
        await driver.executeScript("document.body.style.zoom='100%'");
    } catch (err) {
        throw `Failed to build web driver: ${err}.`;
    }

    return driver;
};

module.exports = {
  startCBT
};
