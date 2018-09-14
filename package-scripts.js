
// const npsUtils = require('nps-utils')

const nodeArgs = '-r ts-node/register src/bootstrap.ts'

module.exports = {
  scripts: {
    default: {
      script: `node ${nodeArgs}`,
      description: 'Starts the graphql server.',
    },
    dev: {
      script: `nodemon --watch ./src --ignore \'./src/**/__tests__/**/*\' --ext ts -- --inspect=9222 ${nodeArgs}`,
      description: 'Runs the graphql app in development mode.',
    },
    test: {
      script: `jest --config ./jest.js --runInBand`,
      description: 'Runs the unit tests.',
    },
    lint: {
      script: `tslint --project .`,
      description: 'Lints the code.',
    },
    check: {
      script: 'nps lint && nps test',
      description: 'Runs the checks to validate the application (test & lint).',
    },
    generate: {
      module: {
        script: `yo graphql:module`,
        description: 'Generates a new module in the graphql application.',
      },
    },
  },
}
