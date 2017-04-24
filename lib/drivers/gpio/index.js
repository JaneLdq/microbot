var Drivers = {
  "led": require("./led"),
  "button": require("./button"),
  "temperature-sensor": require("./temperature-sensor")
};

module.exports = {
  drivers: Drivers
};