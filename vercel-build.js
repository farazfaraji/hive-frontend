const { execSync } = require('child_process')

// Install dependencies
console.log('Installing dependencies...')
execSync('npm install', { stdio: 'inherit' })

// Build the frontend
console.log('Building frontend...')
execSync('npm run build', { stdio: 'inherit' })

// Build the backend
console.log('Building backend...')
execSync('npm run build:server', { stdio: 'inherit' })

console.log('Build completed successfully!')
