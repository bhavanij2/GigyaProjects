require('chromedriver');
const { Builder } = require('selenium-webdriver');
const uuidv4 = require('uuid/v4');

const { login } = require('../utils/login');
const { browserConfig } = require('../utils/applitools');
const { startCBT } = require('../utils/crossBrowserTesting');

before(() => {
  return new Promise( async (resolve) => {
    const viewportSize = browserConfig(process.env.VIEWPORT_SIZE);
    const batchId = process.env.BATCH_ID;

    global.applitools = {
      apiKey: process.env.APPLITOOLS_TOKEN,
      serverUrl: 'https://bayereyes.applitools.com',
      appName: 'C7 - External User Admin',
      batch: {
        name: 'C7 - National Admin',
        id: batchId || uuidv4(),
      },
      forceFullPageScreenshot: true,
      ...viewportSize
    };

    if(process.env.LOCAL_TESTING) {
      global.driver = await new Builder()
        .forBrowser('chrome')
        .build();
    } else {
      global.driver = await startCBT();
    }

    global.driver.manage().window().setRect({width: global.applitools.browsersInfo[0].width, height: 625});

    global.user = {
      baseUrl: 'https://my-agriportal-np.agro.services',
      url: 'https://my-agriportal-np.agro.services/portal/profile',
      username: 'jeff.o.mitchell@monsanto.com',
      testName: 'C7 - National Admin',
    };

    await login(global.driver, global.user);
    resolve();
  });
});

after(() => {
  console.log('Closing Resources');
  global.driver.quit();
});
