#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { defaultSliceContent } = require('./folderStructure/defaultSliceContent');
const { defaultComponentContent } = require('./folderStructure/defaultComponentContent');

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

// Create directories and files recursively
const createDirectoriesAndFiles = (baseDir, structure, mainFolderName, apiEndpoint) => {
  structure.forEach(folder => {
    const folderPath = folder.name ? path.join(baseDir, folder.name) : baseDir;

    if (folder.name && !fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created folder: ${folderPath}`);
    } 

    // Handle files separately if the folder is 'redux'
    if (folder.name === 'redux') {
      const filePath = path.join(folderPath, `${mainFolderName}Slice.ts`);
      if (!fs.existsSync(filePath)) {
        const content = defaultSliceContent(mainFolderName.charAt(0).toUpperCase() + mainFolderName.slice(1), apiEndpoint);
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath} with default content`);
      }
    } else if(folder.name === 'validation'){
      const filePath = path.join(folderPath, `${mainFolderName}Schema.ts`);
      if (!fs.existsSync(filePath)) {
        let content = `// ${file} to Validate With Yup`;
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath} with default content`);
      }
    }else {
      // Handle other folders' files
      folder.files.forEach(file => {
        const filePath = path.join(folderPath, file);

        if (!fs.existsSync(filePath)) {
          let content = `// ${file} content`;

          if (file.endsWith('.tsx')) {
            const componentName = path.basename(file, '.tsx');  // Extract the component name from the file name
            content = defaultComponentContent(componentName.charAt(0).toUpperCase() + componentName.slice(1));   // Use the template function for component content
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

const mainFolderName = process.argv[2] || 'yourNewComponent'; 
const apiEndpoint = process.argv[3] || 'https://example.com/api';

const rootFolder = path.join('.', mainFolderName);
if (!fs.existsSync(rootFolder)) {
  fs.mkdirSync(rootFolder, { recursive: true });
  console.log(`Created root folder: ${rootFolder}`);
}

createDirectoriesAndFiles(rootFolder, folderStructure, mainFolderName, apiEndpoint);
