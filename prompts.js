const { input } = require('@inquirer/prompts');

const getUserInputs = async () => {
  const mainFolderName = await input({ message: 'Enter your component name' });
  const apiEndpoint = await input({ message: 'Enter your API endpoint' });
  const routeName = await input({ message: 'Enter your route name' });

  return { mainFolderName, apiEndpoint, routeName };
};

module.exports = {
  getUserInputs,
};
