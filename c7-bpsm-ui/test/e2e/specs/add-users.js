const expect = require('chai').expect;
const { By, until } = require('selenium-webdriver');
const { goto } = require('../utils/navigation');
const { initEyes } = require('../utils/applitools');

let eyes = null;

describe('Add Users', async function() {
  let driver;
  before(async () => {
    driver = global.driver;
    await goto({driver, applitools: global.applitools}, { name: 'User Admin'});
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

  it('Add Users Landing Page', async function() {
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:first-child'))).click();
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:last-child'))).click();
    await driver.sleep(1000);
    await eyes.checkWindow('Landing Page');
    await eyes.close(false).then(function (results) {
      console.log(`${this.title} results: ${results}`);
      expect(results._status).to.equal('Passed');
    });
  });

  it('Invalid Email Validation', async function() {
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:first-child'))).click();
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:last-child'))).click();
    await driver.wait(until.elementLocated(By.css('.email-container input'))).sendKeys('jeff');
    await driver.sleep(3000);
    await eyes.checkWindow('Invalid Email');
    await eyes.close(false).then(function (results) {
      console.log(`${this.title} results: ${results}`);
      expect(results._status).to.equal('Passed');
    });
  });

  it('Unavailable Email Validation', async function() {
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:first-child'))).click();
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:last-child'))).click();
    await driver.wait(until.elementLocated(By.css('.email-container input'))).sendKeys('jeff.o.mitchell@monsanto.com');
    await driver.sleep(3000);
    await eyes.checkWindow('Unavailable Email');
    await eyes.close(false).then(function (results) {
      console.log(`${this.title} results: ${results}`);
      expect(results._status).to.equal('Passed');
    });
  });

  it('Show Add Role Modal', async function() {
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:first-child'))).click();
    await driver.wait(until.elementLocated(By.css('.mdc-tab-bar button:last-child'))).click();
    await driver.wait(until.elementLocated(By.css('.ua-roles-table button:last-child'))).click();
    await driver.sleep(1000);
    eyes.setForceFullPageScreenshot(false);
    await eyes.checkWindow('Add Role Modal');
    eyes.setForceFullPageScreenshot(true);

    // Dismiss Modal
    await driver.findElement(By.xpath("//footer/button")).click();

    await eyes.close(false).then(function (results) {
      console.log(`${this.title} results: ${results}`);
      expect(results._status).to.equal('Passed');
    });
  });

  afterEach(async function() {
    eyes.abortIfNotClosed();
  });
});
