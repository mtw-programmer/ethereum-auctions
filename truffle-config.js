module.exports = {
  networks: {
    development: {
      host: '0.0.0.0',
      port: 7545,
      network_id: '*'
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
