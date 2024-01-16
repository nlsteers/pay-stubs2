// eslint-disable-next-line @typescript-eslint/no-var-requires
const backgroundTasks = require("./backgroundTasks")
const environment = process.env.NODE_ENV

module.exports = async (phase, { defaultConfig }) => {
  backgroundTasks(environment);
  return {
    serverRuntimeConfig: {
      stubsUsername: process.env.STUBS_USER,
      stubsPassword: process.env.STUBS_PASSWORD,
      connectorUrl: process.env.CONNECTOR_URL,
    },
    publicRuntimeConfig: {
      staticFolder: 'public',
      threeDSUrl: process.env.THREEDS_URL
    },
  }
}
