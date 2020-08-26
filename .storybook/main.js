module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
    })
    return config
  }
}
