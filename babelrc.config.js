const presets = [
    '@babel/preset-react',
    '@babel/preset-typescript',
    "@babel/preset-env",
];

const plugins = [
    '@babel/plugin-transform-spread',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
];

module.exports = { presets, plugins };