#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

console.log('Script started');

const folderStructure = [
  {
    name: '',
    files: ['index.tsx'],
    subfolders: []
  },
  {
    name: 'components',
    files: ['button.tsx'],
    subfolders: []
  },
  {
    name: 'validation',
    files: ['validation.ts'],
    subfolders: []
  },
  {
    name: 'redux',
    files: [],
    subfolders: []
  },
  {
    name: 'styles',
    files: ['styles.css'],
    subfolders: []
  },
];

const defaultComponentContent = (componentName) => `
export default function ${componentName}(){
    return (
      <div>
        <h1>${componentName}</h1>
      </div>
    );
}
`;

const defaultSliceContent = (componentName, apiEndpoint) => `
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

// Define async thunks and slice here...
`;

const updateStoreFile = (mainFolderName) => {
  const projectRoot = process.cwd();
  const storeFilePath = path.join(projectRoot, 'src', 'lib', 'redux', 'store.ts');

  const importStatement = `import ${mainFolderName}Slice from './${mainFolderName}/${mainFolderName}Slice';\n`;
  const reducerSnippet = `    ${mainFolderName}: ${mainFolderName}Slice,\n`;

  if (fs.existsSync(storeFilePath)) {
      let storeFileContent = fs.readFileSync(storeFilePath, 'utf8');

      if (!storeFileContent.includes(importStatement)) {
          storeFileContent = importStatement + storeFileContent;
      }

      if (!storeFileContent.includes(`${mainFolderName}: ${mainFolderName}Slice`)) {
          storeFileContent = storeFileContent.replace(
              /(reducer\s*:\s*\{)/,
              `$1\n${reducerSnippet}`
          );
      }

      fs.writeFileSync(storeFilePath, storeFileContent);
      console.log(`Updated ${storeFilePath} with ${mainFolderName}Slice in reducer`);
  } else {
      const initialStoreContent = `
      import { configureStore } from '@reduxjs/toolkit';
      import ${mainFolderName}Slice from './${mainFolderName}/${mainFolderName}Slice';

      export const store = configureStore({
        reducer: {
            ${mainFolderName}: ${mainFolderName}Slice,
        },
});`;

      fs.writeFileSync(storeFilePath, initialStoreContent);
      console.log(`Created ${storeFilePath} and added ${mainFolderName}Slice in the reducer`);
  }
};


const createDirectoriesAndFiles = (baseDir, structure, mainFolderName, apiEndpoint) => {
  structure.forEach(folder => {
    const folderPath = folder.name ? path.join(baseDir, folder.name) : baseDir;

    if (folder.name && !fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created folder: ${folderPath}`);
    } 

    if (folder.name === 'redux') {
      const filePath = path.join(folderPath, `${mainFolderName}Slice.ts`);
      if (!fs.existsSync(filePath)) {
        const content = defaultSliceContent(mainFolderName.charAt(0).toUpperCase() + mainFolderName.slice(1), apiEndpoint);
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath} with default content`);
      }
    } else if (folder.name === 'validation') {
      const filePath = path.join(folderPath, `${mainFolderName}Schema.ts`);
      if (!fs.existsSync(filePath)) {
        let content = `// to Validate With Yup => npm yup`;
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath} with default content`);
      }
    } else {
      folder.files.forEach(file => {
        const filePath = path.join(folderPath, file);

        if (!fs.existsSync(filePath)) {
          let content = `// ${file} content`;
          if (file.endsWith('.tsx')) {
            const componentName = path.basename(file, '.tsx');
            content = defaultComponentContent(componentName.charAt(0).toUpperCase() + componentName.slice(1));
          }

          fs.writeFileSync(filePath, content);
          console.log(`Created file: ${filePath} with default content`);
        }
      });
    }

    if (folder.subfolders && folder.subfolders.length > 0) {
      createDirectoriesAndFiles(folderPath, folder.subfolders, mainFolderName, apiEndpoint);
    }
  });
};

const main = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'mainFolderName',
      message: 'Enter the main folder name:',
    },
    {
      type: 'input',
      name: 'apiEndpoint',
      message: 'Enter the API endpoint:',
    },
  ]);

  const { mainFolderName, apiEndpoint } = answers;

  const rootFolder = path.join('.', mainFolderName);
  if (!fs.existsSync(rootFolder)) {
    fs.mkdirSync(rootFolder, { recursive: true });
    console.log(`Created root folder: ${rootFolder}`);
  }

  createDirectoriesAndFiles(rootFolder, folderStructure, mainFolderName, apiEndpoint);
  updateStoreFile(mainFolderName);
};

main();
