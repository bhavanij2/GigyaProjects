const {By, until} = require('selenium-webdriver');

const NAV_SHOW_WIDTH = 1280;

const goto = async ({driver, applitools}, link) => {
  console.log(`Going to page ${link.name}.`);

  await navigateToPage(driver, link, applitools.browsersInfo[0].width < NAV_SHOW_WIDTH);
};

const navigateToPage = async (driver, link, navHidden) => {
  const clickableLink = await getClickableMenuElement(driver, link.name, navHidden);
  try {
    await driver.sleep(1000);
    await clickableLink.click();
  } catch (error) {
    console.log(`Failed Clicking on clickable element ${link.name} ${error}`);
    console.log(`Failed to navigate to ${link.name}: ${error}`);
  }
  await driver.sleep(5000);
};

const getClickableMenuElement = async (driver, linkName, navHidden) => {
  let clickableElement;
  try {
    navHidden && await unhideNavMenu(driver);

    clickableElement = await driver.wait(
      until.elementLocated(
        // xpath is used to find the clickable parent of the child with the desired
        // link name of the left navigation menu, c7-menu.
        By.xpath(`//*[@class='c7-menu']//*//*[contains(.,'${linkName}')]//*`)
      )
    );
  } catch (error) {
    console.log(`Unable to retrieve a clickable element for '${linkName}': ${error}`);
  }
  return clickableElement;
};

const unhideNavMenu = async (driver) => {
  const menuIconElement = await driver.wait(
    until.elementLocated(
      // xpath gets the menu icon that is clicked to unhide the left nav.
      By.xpath("//i[contains(., 'menu')]")
    )
  );

  await menuIconElement.click();
};

module.exports = {
  goto
};
