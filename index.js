#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { input } = require('@inquirer/prompts');

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

const newComponent = (componentName) => `
import React from 'react';

export default function ${componentName}(){
    return (
      <div>
        <h1>${componentName}</h1>
        <p>This is an extended component!</p>
      </div>
    );
}
`;

const defaultSliceContent = (componentName, apiEndpoint) => `
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import axiosInstance from "../../../lib/axios/axios";

export const get${componentName}s = createAsyncThunk(
  "${componentName.toLowerCase()}Slice/get${componentName}s",
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

export const delete${componentName} = createAsyncThunk(
    "${componentName.toLowerCase()}Slice/delete${componentName}",
    async (id: number) => {
      try {
        await axiosInstance.delete(\`${apiEndpoint}/\${id}\`);
      } catch (error) {
        console.error(error);
        return error;
  }
},
);

export const get${componentName} = createAsyncThunk(
  "${componentName.toLowerCase()}Slice/get${componentName}",
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

  const importStatement =`import ${mainFolderName}Slice from '../../pages/${mainFolderName}/redux/${mainFolderName}Slice';\n`;
  const reducerSnippet = `${mainFolderName}: ${mainFolderName}Slice,\n`;

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
    import ${mainFolderName}Slice from '../../pages/${mainFolderName}/redux/${mainFolderName}Slice';

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
    } else if (folder.name === 'styles') { 
      const filePath = path.join(folderPath, 'style.css');
      if (!fs.existsSync(filePath)) {
        const content = `/* ${filePath} */`;
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath}`);
      }
    } else {
      folder.files.forEach(file => {
        const filePath = path.join(folderPath, file);
        if (!fs.existsSync(filePath)) {
          let content = `// ${file} content`;
          
          // Check if the file is 'index.tsx' and use the extended component template
          if (file === 'index.tsx') {
            content = newComponent(`${mainFolderName.charAt(0).toUpperCase()}${mainFolderName.slice(1)}`);
          } else if (file.endsWith('.tsx')) {
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

const updateRoutesFile = (mainFolderName, routeName) => {
  const projectRoot = process.cwd();
  const routesFilePath = path.join(projectRoot, '..', 'lib', 'routes', 'routes.tsx');

  // Define import and route code snippets
  const importStatement = `import ${mainFolderName.charAt(0).toUpperCase()}${mainFolderName.slice(1)} from '../../pages/${mainFolderName}';\n`;
  const routeSnippet = `{
    path: "/${routeName}",
    element: <${mainFolderName.charAt(0).toUpperCase()}${mainFolderName.slice(1)} />
  },\n`;

  // Check if routes file exists
  if (fs.existsSync(routesFilePath)) {
    let routesFileContent = fs.readFileSync(routesFilePath, 'utf8');

    // Add import if it doesn’t exist
    if (!routesFileContent.includes(importStatement)) {
      routesFileContent = importStatement + routesFileContent;
    }

    // Add route to routes array if it doesn’t exist
    if (!routesFileContent.includes(`path: "/${mainFolderName.toLowerCase()}"`)) {
      routesFileContent = routesFileContent.replace(
        /(createBrowserRouter\(\s*\[)/,
        `$1\n${routeSnippet}`
      );
    }

    fs.writeFileSync(routesFilePath, routesFileContent);
    console.log(`Updated ${routesFilePath} with a route for ${mainFolderName}`);
  } else {
    // If routes file doesn't exist, create it
    const initialRoutesContent = `
    import ${mainFolderName.charAt(0).toUpperCase()}${mainFolderName.slice(1)} from '../../pages/${mainFolderName}';
    import { createBrowserRouter } from "react-router-dom";
    import App from "../../App";
    
    export const routes = createBrowserRouter([
      {
        path: "/",
        element: <App />
      },
      {
        path: "/${routeName}",
        element: <${mainFolderName.charAt(0).toUpperCase()}${mainFolderName.slice(1)} />
      }
    ]);
    `;

    fs.writeFileSync(routesFilePath, initialRoutesContent);
    console.log(`Created ${routesFilePath} and added a route for ${mainFolderName}`);
  }
};


const main = async () => {
  const mainFolderName = await input({ message: 'Enter your file name' });
  const apiEndpoint = await input({ message: 'Enter your API endpoint name' });
  const routeName = await input({ message: 'what should be the route' });
  
  const rootFolder = path.join('.', mainFolderName);
  if (!fs.existsSync(rootFolder)) {
    fs.mkdirSync(rootFolder, { recursive: true });
    console.log(`Created root folder: ${rootFolder}`);
  }

  createDirectoriesAndFiles(rootFolder, folderStructure, mainFolderName, apiEndpoint);
  updateStoreFile(mainFolderName);
  updateRoutesFile(mainFolderName,routeName);
};

main();