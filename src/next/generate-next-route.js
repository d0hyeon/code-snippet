// generateRoute.js
const fs = require('fs');
const path = require('path');

let routeConfig = {
  appDir: 'app',
  output: '/src/app-route.ts',
};
const nextConfigPath = path.join(__dirname, 'next.route.config.js');

if (fs.existsSync(nextConfigPath)) {
  const config = require(nextConfigPath);
  if (config) {
    routeConfig = { ...routeConfig, ...config };
  }
}

// Resolve the app directory dynamically from nextConfig
const APP_DIR = path.resolve(__dirname, 'src/app');
const OUTPUT_FILE = path.join(__dirname, 'src/app-route.ts');

// Resolve the app directory dynamically from nextConfig
// const APP_DIR = nextConfig.appDir
//   ? path.resolve(__dirname, '/' + nextConfig.appDir)
//   : path.join(__dirname + '/src/app');
// const OUTPUT_FILE = path.join(__dirname, 'src/app-route.ts');

/**
 * Convert a file path to a route path.
 * @param {string} filePath
 * @returns {string}
 */
const convertPathToRoute = (filePath) => {
  let route = filePath.replace(/\\/g, '/'); // Normalize Windows paths
  route = route.replace(/\/page\.tsx$/, ''); // Remove page.tsx suffix
  route = route.replace(/\[([^\]]+)\]/g, ':$1'); // Convert [param] to :param
  route = route.replace(/\/\([^\)]+\)\//g, '/'); // Remove folder names with parentheses
  route = route.replace(/^app/, ''); // Remove the "app" prefix
  route = route.replace(/\(\D+\)\//g, '');
  route = route === '' ? '/' : route; // Root path adjustment

  return `/${route}`;
};

/**
 * Recursively scan the app directory and extract routes with "routeName" export.
 * @param {string} dir
 * @returns {object}
 */
const extractRoutes = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes = {};
  const routeNames = new Set();

  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      Object.assign(routes, extractRoutes(fullPath));
    } else if (entry.name === 'page.tsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      const match = content.match(
        /export const routeName\s*=\s*['"]([^'"]+)['"]/,
      );

      if (match) {
        const routeKey = match[1];
        if (routeNames.has(routeKey)) {
          throw new Error(
            `Duplicate routeName detected: "${routeKey}" in file ${fullPath}`,
          );
        }

        routeNames.add(routeKey);
        const relativePath = path.relative(APP_DIR, fullPath);
        const routePath = convertPathToRoute(relativePath);
        routes[routeKey] = routePath;
      }
    }
  });

  return routes;
};

/**
 * Generate the app-route.ts file.
 */
const generateRouteFile = () => {
  try {
    const routes = extractRoutes(APP_DIR);
    const content = `export const APP_ROUTE = ${JSON.stringify(routes, null, 2)} as const;
`;

    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    console.log(`Routes file generated at: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Error generating routes: ${error.message}`);
  }
};

generateRouteFile();
