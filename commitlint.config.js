module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'fix',
        'feature',
        'refactor',
        'test',
        'breaking',
        'removed',
        'changed',
        'chore',
      ],
    ],
    'footer-max-line-length': [0, 'always'],
    'body-max-line-length': [0, 'always'],
  },
};
