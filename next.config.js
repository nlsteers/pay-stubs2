module.exports = async (phase, { defaultConfig }) => {
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
