#!/usr/bin/env node
const path = require('path');
const { createDirectoriesAndFiles } = require('./fileUtils');
const { updateStoreFile } = require('./reduxUtils');
const { updateRoutesFile } = require('./routeUtils');
const { getUserInputs } = require('./prompts');

const main = async () => {
  const { mainFolderName, apiEndpoint, routeName } = await getUserInputs();

  const rootFolder = path.join('.', mainFolderName);
  createDirectoriesAndFiles(rootFolder, mainFolderName, apiEndpoint, routeName);
  updateStoreFile(mainFolderName);
  updateRoutesFile(routeName, mainFolderName);
};

main();
