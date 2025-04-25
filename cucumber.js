module.exports = {
    default: {
        require: [
            'ts-node/register/transpile-only',
            'tsconfig-paths/register',
            'features/steps/**/*.ts',
            'features/support/**/*.ts'
        ],
        requireModule: ['ts-node/register'],
        format: [
            'progress',
            'html:cucumber-report.html'
        ],
        formatOptions: {
            snippetInterface: 'synchronous'
        },
        publishQuiet: true
    }
};