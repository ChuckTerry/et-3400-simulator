/**
 * @fileoverview This file contains functions used in the build process to
 * modify the simulator SVG and prepare it for use in HTML pages.
 */

/**
 * A class for preparing the simulator SVG for use in HTML pages.
 */
class SimulatorSvg {
  /**
   * @constructor
   * @param {string} svgString the SVG string to modify.
   */
  constructor(svgString) {
    /** @type {string} The SVG string. */
    this.string = svgString;
  }

  /**
   * Hides the power LED glow.
   * @returns {SimulatorSvg} self.
   */
  hidePowerLedGlow() {
    this.string = this.string.split('glow" class="').join('glow" class="hidden ');
    return this;
  }

  /**
   * Processes all modifications.
   * @returns {SimulatorSvg} self.
   */
  processAll() {
    return this.hidePowerLedGlow();
  }

  /**
   * Returns the current SVG string.
   * @returns {string} the current SVG string.
   */
  toString() {
    return this.string;
  }
}

/**
 * Prepares the given SVG string for use in HTML pages.
 * @param {string} svgString the SVG string to modify.
 * @param {boolean} auto whether to automatically process the SVG string.
 * @returns {string|SimulatorSvg} Prepared SVG string or a SimulatorSvg object.
 */
export function prepSvg(svgString, auto = true) {
  const svg = new SimulatorSvg(svgString);
  return auto ? svg.processAll().toString() : svg;
}
