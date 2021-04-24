module.exports = {
  getPort: () => {
    return process.env.PORT || 3168;
  },
  isProductionEnvironment: (env) => {
    return env === 'production';
  },
  isHosted: () => {
    return process.env.NODE_ENV === 'production';
  },
};
