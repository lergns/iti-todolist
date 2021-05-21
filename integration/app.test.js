// yarn test:integration --> to run snapshot test
// yarn run jest:integration --updateSnapshot --> to set current UI of component as value to be compared to

describe("addItemForm", () => {
  it("base example, visually looks correct", async () => {
    // APIs from jest-puppeteer
    await page.goto(
      "http://localhost:9009/iframe.html?id=todolistapp-additemform--add-item-form-example&viewMode=story"
    );
    const image = await page.screenshot();

    // API from jest-image-snapshot
    expect(image).toMatchImageSnapshot();
  });
});

describe("appWithRedux", () => {
  it("base example, visually looks correct", async () => {
    await page.goto(
      "http://localhost:9009/iframe.html?id=todolistapp-appwithredux--app-with-redux-example&viewMode=story"
    );
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot();
  });
});

describe("editableSpan", () => {
  it("base example, visually looks correct", async () => {
    await page.goto(
      "http://localhost:9009/iframe.html?id=todolistapp-editablespan--editable-span-example&viewMode=story"
    );
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot();
  });
});

describe("taskIsDone", () => {
  it("base example, visually looks correct", async () => {
    await page.goto(
      "http://localhost:9009/iframe.html?id=todolistapp-task--task-is-done-example&viewMode=story"
    );
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot();
  });
});

describe("taskIsUndone", () => {
  it("base example, visually looks correct", async () => {
    await page.goto(
      "http://localhost:9009/iframe.html?id=todolistapp-task--task-is-undone-example&viewMode=story"
    );
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot();
  });
});
