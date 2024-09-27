module.exports = {
  apps: [{
    name: 'DeanLauroWebsite',
    script: './server.js',
    watch: true,
    ignore_watch: ['node_modules', 'logs'], // Directories to ignore
    watch_options: {
      followSymlinks: false,
      usePolling: true
    }
  }]
};