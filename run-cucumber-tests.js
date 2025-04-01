// run-cucumber-tests.js
const { spawn } = require('child_process');
const waitOn = require('wait-on');

// Start the React application
console.log('Starting React application...');
const app = spawn('npm', ['run', 'start'], {
    stdio: 'inherit',
    shell: true,
    detached: true
});

// Function to handle cleanup
function cleanup() {
    console.log('Shutting down React application...');
    if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', app.pid, '/f', '/t'], { shell: true });
    } else {
        process.kill(-app.pid);
    }
}

// Handle script interruption
process.on('SIGINT', () => {
    cleanup();
    process.exit(1);
});

// Wait for the server to be ready
waitOn({
    resources: ['http-get://localhost:3000'],
    timeout: 120000
})
    .then(() => {
        console.log('React application is ready. Running Cucumber tests...');

        // Run the Cucumber tests
        const cucumber = spawn('npx', [
            'cross-env',
            'NODE_OPTIONS=--max-old-space-size=4096',
            'cucumber-js',
            '--config', 'cucumber.js'
        ], {
            stdio: 'inherit',
            shell: true,
            env: {
                ...process.env,
                TS_NODE_PROJECT: 'tsconfig.cucumber.json'
            }
        });

        cucumber.on('exit', (code) => {
            cleanup();
            process.exit(code);
        });
    })
    .catch((error) => {
        console.error('Error waiting for React application:', error);
        cleanup();
        process.exit(1);
    });