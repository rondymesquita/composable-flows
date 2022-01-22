'use strict'

module.exports = {
  preset: 'eslint',
  config: {
    preset: 'angular',
    writerOpts: {
      preset: 'eslint',
      groupBy: () => {},
      mainTemplate:
        '{{commitGroups.[0].commits.[0].type}}{{testContext}}template',
    },
  },
  // preset: 'angular',
  writerOpts: {
    preset: 'eslint',
  },
}

// angular, atom, codemirror, ember,
//eslint, express, jquery, jscs or jshint
