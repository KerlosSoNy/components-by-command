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
  // Store update logic...
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
