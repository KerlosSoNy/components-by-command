const fs = require('fs');
const path = require('path');

const folderStructure = [
  { name: '', files: ['index.tsx'], subfolders: [] },
  { name: 'components', files: ['button.tsx'], subfolders: [] },
  { name: 'validation', files: ['validation.ts'], subfolders: [] },
  { name: 'redux', files: [], subfolders: [] },
  { name: 'styles', files: ['styles.css'], subfolders: [] }
];

const defaultComponentContent = (componentName) => `
export default function ${componentName}() {
  return (
    <div>
      <h1>${componentName}</h1>
    </div>
  );
}`;

const newComponent = (componentName) => `
import React from 'react';

export default function ${componentName}() {
  return (
    <div>
      <h1>${componentName}</h1>
      <p>This is an extended component!</p>
    </div>
  );
}`;

const defaultSliceContent = (componentName, apiEndpoint) => `
// Redux slice content
// For ${componentName} with endpoint ${apiEndpoint}
`;

const createDirectoriesAndFiles = (baseDir, mainFolderName, apiEndpoint, routeName) => {
  folderStructure.forEach(folder => {
    const folderPath = folder.name ? path.join(baseDir, folder.name) : baseDir;

    if (folder.name && !fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created folder: ${folderPath}`);
    }

    folder.files.forEach(file => {
      const filePath = path.join(folderPath, file);
      if (!fs.existsSync(filePath)) {
        let content = `// ${file} content`;
        if (file === 'index.tsx') {
          content = newComponent(`${mainFolderName.charAt(0).toUpperCase()}${mainFolderName.slice(1)}`);
        } else if (file.endsWith('.tsx')) {
          content = defaultComponentContent(path.basename(file, '.tsx'));
        }
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath}`);
      }
    });

    if (folder.name === 'redux') {
      const reduxPath = path.join(folderPath, `${mainFolderName}Slice.ts`);
      if (!fs.existsSync(reduxPath)) {
        const sliceContent = defaultSliceContent(mainFolderName, apiEndpoint);
        fs.writeFileSync(reduxPath, sliceContent);
        console.log(`Created file: ${reduxPath}`);
      }
    }
  });
};

module.exports = {
  createDirectoriesAndFiles,
};
