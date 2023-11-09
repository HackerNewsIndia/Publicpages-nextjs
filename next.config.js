/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.plugins.push(
      new options.webpack.container.ModuleFederationPlugin({
        name: "publicpages",
        filename: "remoteEntry.js",
        exposes: {
          "./PublicBlogSpace": "./components/PublicBlogSpace.js",
        },
        shared: [
          {
            react: {
              eager: true,
              singleton: true,
              requiredVersion: false,
            },
          },
          {
            "react-dom": {
              eager: true,
              singleton: true,
              requiredVersion: false,
            },
          },
        ],
      })
    );
    return config;
  },
};

module.exports = nextConfig;

// // // remote/next.config.js
// // const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

// // const nextConfig = {
// //   reactStrictMode: true,
// //   webpack(config, { isServer }) {
// //     config.plugins.push(
// //       new NextFederationPlugin({
// //         name: "publicpages",
// //         filename: "static/chunks/remoteEntry.js",
// //         exposes: {
// //           // specify exposed pages and components
// //           //  './SomePage': './pages/somePage.js',
// //           "./PublicBlogSpace": "./components/PublicBlogSpace.js",
// //         },
// //         shared: {
// //           // specify shared dependencies
// //           // read more in Shared Dependencies section
// //         },
// //       })
// //     );

// //     return config;
// //   },
// // };

// // const { ModuleFederationPlugin } = require("webpack").container;

// // module.exports = {
// //   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
// //     config.plugins.push(
// //       new ModuleFederationPlugin({
// //         name: "publicpages",
// //         filename: "remoteEntry.js",
// //         exposes: {
// //           "./PublicBlogSpace": "./components/PublicBlogSpace.js",
// //         },
// //         shared: ["react", "react-dom"],
// //       })
// //     );

// //     return config;
// //   },
// // };

// // const { withFederatedSidecar } = require("@module federation/nextjs-mf");
// // module.exports = withFederatedSidecar({
// //   name: "publicpages",
// //   filename: "static/chunks/remoteEntry.js",
// //   exposes: {
// //     "./PublicBlogSpace": "./components/PublicBlogSpace.js",
// //   },
// //   shared: {},
// // })({
// //   // your original next.config.js export
// //   reactStrictMode: true,
// // });
