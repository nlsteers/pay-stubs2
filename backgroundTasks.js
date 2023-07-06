const runBackgroundTask = (environment) => {
  if (environment === 'production') {
    setInterval(() => {
      console.log('Running background task...')
    }, 5000)
  } else if (environment === 'development') {
    console.warn('development mode, background tasks disabled')
  }
}

module.exports = runBackgroundTask
