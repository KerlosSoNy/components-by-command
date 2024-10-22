const fs = require('fs');
const path = require('path');

const updateRoutesFile = (routeName, componentName) => {
  const routesFilePath = path.join(process.cwd(), '..', 'lib', 'router', 'routes.ts');

  if (fs.exists(routesFilePath)) {
    let routesContent = fs.readFileSync(routesFilePath, 'utf8');

    const importStatement = `import ${componentName} from "../../pages/${componentName.toLowerCase()}/index";\n`;
    const routeSnippet = `{\n    path: "/${routeName}",\n    element: <${componentName} />\n},\n`;

    if (!routesContent.includes(importStatement)) {
      routesContent = importStatement + routesContent;
    }

    if (!routesContent.includes(`path: "/${routeName}"`)) {
      const insertPosition = routesContent.lastIndexOf(']);');
      routesContent = routesContent.slice(0, insertPosition) + routeSnippet + routesContent.slice(insertPosition);
    }

    fs.writeFileSync(routesFilePath, routesContent);
    console.log(`Updated ${routesFilePath} with route "/${routeName}" and component "${componentName}"`);
  } else {
    console.log(`Routes file not found at: ${routesFilePath}`);
  }
};

module.exports = {
  updateRoutesFile,
};
