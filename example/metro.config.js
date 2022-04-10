/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname, '..');
const packages = path.resolve(root, './packages');

// List all packages under `packages/`
const workspaces = fs
  .readdirSync(packages)
  .map((p) => path.join(packages, p))
  .filter(
    (p) =>
      fs.statSync(p).isDirectory() &&
      fs.existsSync(path.join(p, 'package.json'))
  );
console.log('workspaces: ', workspaces);

// Get the list of dependencies for all packages in the monorepo
const modules = []
  .concat(
    ...workspaces.map((it) => {
      const pak = JSON.parse(
        fs.readFileSync(path.join(it, 'package.json'), 'utf8')
      );
      // We need to make sure that only one version is loaded for peerDependencies
      // So we blacklist them at the root, and alias them to the versions in example's node_modules
      return pak.peerDependencies ? Object.keys(pak.peerDependencies) : [];
    })
  )
  .sort()
  .filter(
    (m, i, self) =>
      // Remove duplicates and package names of the packages in the monorepo
      self.lastIndexOf(m) === i && !m.startsWith('@react-native-core/')
  );

const config = {
  transformer: {},
  resolver: {},
  server: {},
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});

// We need to blacklist the peerDependencies we've collected in packages' node_modules
config.resolver.blockList = [
  new RegExp(`^${escape(path.join(root, 'node_modules', 'react'))}\\/.*$`),
  new RegExp(
    `^${escape(path.join(root, 'node_modules', 'react-native'))}\\/.*$`
  ),
].concat(
  ...workspaces.map((it) =>
    modules.map(
      (m) => new RegExp(`^${escape(path.join(it, 'node_modules', m))}\\/.*$`)
    )
  )
);

/**
 * Ensure any imports inside the shared 'components' folder resolve to the local node_modules folder
 */
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => path.join(process.cwd(), `node_modules/${name}`),
  }
);

/**
 *
 * Set to `root` b/c - Error: EISDIR: illegal operation on a directory.. (got this with __dirname)
 *  - error happens with first reload.
 */
config.projectRoot = root;
config.watchFolders = [root];

module.exports = config;
