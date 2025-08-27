module.exports = {
    apps: [
      {
        name: "nextjs-dev",
        script: "node_modules/.bin/next",
        args: "dev -p 3000",
        env: {
          NODE_ENV: "development",
        },
      },
    ],
  };
  