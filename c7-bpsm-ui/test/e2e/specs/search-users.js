const expect = require('chai').expect;
const { By, until } = require('selenium-webdriver');
const { goto } = require('../utils/navigation');
const { initEyes } = require('../utils/applitools');

let eyes = null;

describe('Search Users', async function() {
  let driver;
  before(async () => {
    driver = global.driver;
    await goto({driver, applitools: global.applitools}, { name: 'User Admin'});
    driver.executeScript('window.scrollTo(0, 0)');
  });

  beforeEach(async function() {
    eyes = await initEyes();
    const conf = {
      testName: this.currentTest.title,
      forceFullPageScreenshot: true,
      ...global.applitools
    };
    eyes.setConfiguration(conf);
    return eyes.open(global.driver);
  });

  it('Search Users Landing Page', async function() {
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:last-child'))).click();
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:first-child'))).click();
    await driver.wait(until.elementLocated(By.css('.ua-form .mdc-typography--headline6'))).click();
    await driver.sleep(1000);
    await eyes.checkWindow('Landing Page');
    await eyes.close(false).then(function (results) {
      console.log(`${this.title} results: ${results}`);
      expect(results._status).to.equal('Passed');
    });
  });

  it('Search for Jeff and View Profile', async function() {
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:last-child'))).click();
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:first-child'))).click();

    // Search for Jeff
    await driver.wait(until.elementLocated(By.css('div.ua-form-row-first  div.c7-textfield-container input'))).sendKeys('jeff');
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.css('form.ua-form button.mdc-button__primary'))).click();
    await driver.sleep(3000);
    await eyes.checkWindow('Search for Jeff');

    // View the first Jeff in the search results
    await driver.wait(until.elementLocated(By.css('table tr.ua-result-table-row'))).click();
    await driver.sleep(2000);
    await eyes.checkWindow('User Profile');

    // Show the Role Modal
    await driver.wait(until.elementLocated(By.css('.ua-roles-table button:last-child'))).click();
    await driver.sleep(1000);
    eyes.setForceFullPageScreenshot(false);
    await eyes.checkWindow('Add Role Modal');
    eyes.setForceFullPageScreenshot(true);

    // Dismiss Modal
    await driver.wait(until.elementLocated(By.css('.role-control-modal button:first-child'))).click();

    await eyes.close(false).then(function (results) {
      console.log(`${this.title} results: ${results}`);
      expect(results._status).to.equal('Passed');
    });
  });

  afterEach(async function() {
    eyes.abortIfNotClosed();
  });
});
