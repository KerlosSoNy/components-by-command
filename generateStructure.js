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

export const get${componentName}s = createAsyncThunk(
  "${componentName.toLowerCase()}/get${componentName}s",
  async ({ pageSize, currenPage=1, search }:{pageSize: number|undefined | string, currenPage: number|undefined | string, search: string}) => {
    try {
      const response = await axios.get(\`${apiEndpoint}?per_page=\${pageSize}&page=\${currenPage}\`, {
        headers: {
          handle: search,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const get${componentName} = createAsyncThunk(
  "${componentName.toLowerCase()}/get${componentName}",
  async (id) => {
    try {
      const response = await axios.get(\`${apiEndpoint}/\${id}\`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const initialState = {
  ${componentName.toLowerCase()}s: [],
  ${componentName.toLowerCase()}: {},
};

const ${componentName}Slice = createSlice({
  name: '${componentName.toLowerCase()}',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get${componentName}s.fulfilled, (state, action) => {
      state.${componentName.toLowerCase()}s = action.payload;
    }).addCase(get${componentName}.fulfilled, (state, action) => {
      state.${componentName.toLowerCase()} = action.payload;
    });
  },
});

export default ${componentName}Slice.reducer;
`;


const updateStoreFile = (mainFolderName) => {
  const projectRoot = process.cwd();
  const storeFilePath = path.join(projectRoot, '..', 'lib', 'redux', 'store.ts');

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
        const content = defaultSliceContent(mainFolderName, apiEndpoint);
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath}`);
      }
    } else {
      folder.files.forEach(file => {
        const filePath = path.join(folderPath, file);
        if (!fs.existsSync(filePath)) {
          let content = `// ${file} content`;
          if (file.endsWith('.tsx')) {
            const componentName = path.basename(file, '.tsx');
            content = defaultComponentContent(componentName);
          }
          fs.writeFileSync(filePath, content);
          console.log(`Created file: ${filePath}`);
        }
      });
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
