const fs = require('fs');
const path = require('path');

const updateStoreFile = (mainFolderName) => {
  const storeFilePath = path.join(process.cwd(), '..', 'lib', 'redux', 'store.ts');
  const importStatement = `import ${mainFolderName}Slice from '../../pages/${mainFolderName}/redux/${mainFolderName}Slice';\n`;
  const reducerSnippet = `${mainFolderName}: ${mainFolderName}Slice,\n`;

  if (fs.existsSync(storeFilePath)) {
    let storeFileContent = fs.readFileSync(storeFilePath, 'utf8');

    if (!storeFileContent.includes(importStatement)) {
      storeFileContent = importStatement + storeFileContent;
    }

    if (!storeFileContent.includes(`${mainFolderName}: ${mainFolderName}Slice`)) {
      storeFileContent = storeFileContent.replace(/(reducer\s*:\s*\{)/, `$1\n${reducerSnippet}`);
    }

    fs.writeFileSync(storeFilePath, storeFileContent);
    console.log(`Updated ${storeFilePath} with ${mainFolderName}Slice in reducer`);
  } else {
    const initialStoreContent = `
      import { configureStore } from '@reduxjs/toolkit';
      import ${mainFolderName}Slice from '../../pages/${mainFolderName}/redux/${mainFolderName}Slice';

      export const store = configureStore({
        reducer: {
          ${mainFolderName}: ${mainFolderName}Slice,
        },
      });
    `;

    fs.writeFileSync(storeFilePath, initialStoreContent);
    console.log(`Created ${storeFilePath} and added ${mainFolderName}Slice in the reducer`);
  }
};

module.exports = {
  updateStoreFile,
};
