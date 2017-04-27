/**
 * http://usejsdoc.org/
 */
const Utils = module.exports = {
		
 /**
   * A wrapper around setInterval to provide a more english-like syntax
   * (e.g. "every 5 seconds, do this thing")
   * @param {Number} interval delay between action invocations
   * @param {Function} action function to trigger every time interval elapses
   * @example every((5).seconds(), function() {});
   * @return {intervalID} setInterval ID to pass to clearInterval()
   */

every: function every(interval, action) {
      return setInterval(action, interval);
},
  /**
   * Calculates PWM Period and Duty based on provided params.
   *
   * @param {Number} scaledDuty the scaled duty value
   * @param {Number} freq frequency to use
   * @param {Number} pulseWidth pulse width
   * @param {String} [polarity=high] polarity value (high or low)
   * @return {Object} calculated period and duty encapsulated in an object
   */
  periodAndDuty: function(scaledDuty, freq, pulseWidth, polarity) {
    var period, duty, maxDuty;

    polarity = polarity || "high";
    period = Math.round(1.0e9 / freq);

    if (pulseWidth != null) {
      var pulseWidthMin = pulseWidth.min * 1000,
          pulseWidthMax = pulseWidth.max * 1000;

      maxDuty = pulseWidthMax - pulseWidthMin;
      duty = Math.round(pulseWidthMin + (maxDuty * scaledDuty));
    } else {
      duty = Math.round(period * scaledDuty);
    }

    if (polarity === "low") {
      duty = period - duty;
    }

    return { period: period, duty: duty };
  }
};