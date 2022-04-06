module.exports = {
  '**/*.ts?(x)': () => 'npm run lint:tsc -- -p tsconfig.json',
};
