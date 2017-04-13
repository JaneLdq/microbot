/**
 * pwmPin test for raspberrypi
 */
const PwmPin = lib("pwm-pin");

describe("PwmPin", () = > {
  const pin = new PwmPin({});

  it("needs tests", () = > {
    expect(pin).to.be.an.instanceOf(PwmPin);
  });
});