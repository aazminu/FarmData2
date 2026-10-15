/*
 * Utility functions for getting and working with extractQuantity.
 */

/**
 * Extract the value for a UNIT from a quantity string given by the farmOS API.
 *
 * These strings come in several formats:
 * - `"25 TRAYS (Count)"`
 * - `"2 TRAYS (Count), 102.5 FEET (Length/depth)"`
 * - `"Trays ( Count ) 3 TRAYS (Increment 2019-02-19_ts_LETTUCE-ICEBERG inventory), Tray Size ( Ratio ) 72 CELLS/TRAY, Seeds ( Count ) 216 SEEDS"`
 *
 * This function assumes that:
 * - there will be only one inventory value per `UNIT`. Note that farmOS allows one inventory value per (unit, label) pair but this function currently does not support that usage.
 * - the `UNIT` (e.g. `TRAYS`) will be preceded by a space, which is preceded by the desired value.
 *
 * @param {string} quantityString the quantity string from which to extract the value.
 * @param {string} unitName the name of the unit for which to extract the value.
 *
 * @returns {number} the value for the specified unit or `null` if no value is found for the unit.
 *
 * @category Utilities
 */
export function extractQuantity(quantityString, unitName) {
  if (typeof quantityString !== 'string' || typeof unitName !== 'string') {
    return null;
  }
  const trimmedUnit = unitName.trim();
  if (quantityString.length === 0 || trimmedUnit.length === 0) {
    return null;
  }

  const escapedUnit = trimmedUnit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `(?:^|[\\s(])([+-]?\\d+(?:\\.\\d+)?)\\s+${escapedUnit}(?=\\s|,|;|\\)|$)`
  );
  const match = quantityString.match(pattern);
  if (match) {
    const num = Number(match[1]);
    return Number.isNaN(num) ? null : num;
  }

  return null;
}

