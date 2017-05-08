var Drivers = {
  "led": require("./led"),
  "button": require("./button"),
  "temperature-sensor": require("./temperature-sensor"),
  "blinkm": require("./blinkm")

};

module.exports = {
  drivers: Drivers
};
