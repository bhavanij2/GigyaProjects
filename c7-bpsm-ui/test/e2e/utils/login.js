const { By, until } = require('selenium-webdriver');

const wait = 40000;

const login = async (driver, user) => {
  console.log('logging in...')
  let attemptToLogin = true;
  try {
    await driver.get(user.url);
    await driver.sleep(2500);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="gigya-login-form"]/div[2]/div/div[1]/input')), 5000);
  } catch (err){
    attemptToLogin = false;
  }

  const loggedIn = attemptToLogin ? !! await submitCredentials(driver, user) : false;

  loggedIn
    ? console.log("Successfully logged in!")
    : () => {
      throw "Failed to log in!";
    };

  console.log('finished logging in');
  return loggedIn;
};

const submitCredentials = async (driver, user) => {
  const retryAttempts = 3;
  let count = 0;
  let success;
  const password = user.hasOwnProperty('password') ? user.password : process.env.PORTAL_PASSWORD;

  // retry logic for failed logins
  while (!success && count < retryAttempts){
    await driver.sleep(2000);
    count++;
    try {
      await driver.wait(until.elementLocated(By.xpath('//*[@id="gigya-login-form"]/div[2]/div/div[1]/input')), wait)
        .clear();
      await driver.wait(until.elementLocated(By.xpath('//*[@id="gigya-login-form"]/div[2]/div/div[1]/input')), wait)
        .sendKeys(user.username);
      await driver.wait(until.elementLocated(By.xpath('//*[@id="gigya-login-form"]/div[2]/div/div[2]/input')), wait)
        .clear();
      await driver.wait(until.elementLocated(By.xpath('//*[@id="gigya-login-form"]/div[2]/div/div[2]/input')), wait)
        .sendKeys(password);
      await driver
        .wait(until.elementLocated(By.xpath('//*[@id="gigya-login-form"]/div[2]/div/div[5]/input')), wait)
        .click();
      success = await driver
        .wait(until.elementLocated(By.xpath('/html/body/div/div/main/div')), wait);
    } catch (err) {
      success = null;
      console.log(`Login Attempt ${count} Failed: ${err}.`);
    }
  }

  return success;
};

module.exports = {
  login
};
