/* eslint-disable */
module.exports = {
  displayName: 'reactfrontend-ui-shared',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/reactfrontend/ui-shared',
};
