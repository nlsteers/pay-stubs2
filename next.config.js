// eslint-disable-next-line @typescript-eslint/no-var-requires
const backgroundJobs = require("./backgroundTasks")
const environment = process.env.NODE_ENV

module.exports = async (phase, { defaultConfig }) => {
  backgroundJobs(environment);
  return {
    serverRuntimeConfig: {
      stubsUsername: process.env.STUBS_USER,
      stubsPassword: process.env.STUBS_PASSWORD,
    },
    publicRuntimeConfig: {
      staticFolder: 'public',
    },
  }
}
