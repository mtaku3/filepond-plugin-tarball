module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["eslint:recommended"],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [],
    "rules": {
      "import/extensions": "off",
      "import/no-unresolved": "off",
      "callback-return": "off",
    }
};

// "extends": [
//   "eslint-config-tc",
//   "eslint-config-typescript-tc",
// ],
// "rules": {
//   "import/extensions": "off",
// }
