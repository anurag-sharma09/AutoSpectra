/**
 * Engine Engineering Calculations Utility
 */

/**
 * Calculates total engine displacement in cc, liters, and cu in.
 * @param {number} bore - Cylinder bore diameter in mm
 * @param {number} stroke - Piston stroke length in mm
 * @param {number} cylinders - Total number of cylinders
 */
export function calculateDisplacement(bore, stroke, cylinders) {
  if (!bore || !stroke || !cylinders || bore <= 0 || stroke <= 0 || cylinders <= 0) {
    return { cc: 0, liters: 0, cuIn: 0 };
  }
  const boreCm = bore / 10;
  const strokeCm = stroke / 10;
  const singleCylinderCc = (Math.PI / 4) * Math.pow(boreCm, 2) * strokeCm;
  const totalCc = singleCylinderCc * cylinders;
  const liters = totalCc / 1000;
  const cuIn = totalCc * 0.0610237;

  return {
    singleCylinderCc: Number(singleCylinderCc.toFixed(2)),
    cc: Number(totalCc.toFixed(2)),
    liters: Number(liters.toFixed(2)),
    cuIn: Number(cuIn.toFixed(1))
  };
}

/**
 * Calculates Compression Ratio or required clearance volume.
 * @param {number} displacementCc - Total engine displacement in cc
 * @param {number} cylinders - Number of cylinders
 * @param {number} clearanceCc - Combustion chamber clearance volume per cylinder in cc
 */
export function calculateCompressionRatio(singleCc, clearanceCc) {
  if (!singleCc || !clearanceCc || singleCc <= 0 || clearanceCc <= 0) {
    return { ratio: '0:1', cr: 0 };
  }
  const cr = (singleCc + clearanceCc) / clearanceCc;
  return {
    ratio: `${cr.toFixed(2)}:1`,
    cr: Number(cr.toFixed(2))
  };
}

/**
 * Calculates Mean Piston Speed in meters/sec and feet/min.
 * @param {number} strokeMm - Piston stroke in mm
 * @param {number} rpm - Engine rotation speed in RPM
 */
export function calculatePistonSpeed(strokeMm, rpm) {
  if (!strokeMm || !rpm || strokeMm <= 0 || rpm <= 0) {
    return { mPerSec: 0, ftPerMin: 0, rating: 'Normal' };
  }
  const strokeM = strokeMm / 1000;
  const mPerSec = (2 * strokeM * rpm) / 60;
  const ftPerMin = mPerSec * 196.85;

  let rating = 'Low (Under-Stressed)';
  if (mPerSec > 25) rating = 'Extreme (Race Engine Limit > 25 m/s)';
  else if (mPerSec > 20) rating = 'High Performance (20-25 m/s)';
  else if (mPerSec > 15) rating = 'Moderate Performance (15-20 m/s)';

  return {
    mPerSec: Number(mPerSec.toFixed(2)),
    ftPerMin: Number(ftPerMin.toFixed(0)),
    rating
  };
}

/**
 * Calculates Power vs Torque relationship.
 * @param {number} torque - Torque value
 * @param {number} rpm - Engine RPM
 * @param {string} unit - 'imperial' (lb-ft -> HP) or 'metric' (Nm -> kW)
 */
export function calculatePowerTorque(torque, rpm, unit = 'imperial') {
  if (!torque || !rpm || torque <= 0 || rpm <= 0) {
    return { horsepower: 0, kW: 0 };
  }
  if (unit === 'imperial') {
    const hp = (torque * rpm) / 5252;
    const kw = hp * 0.7457;
    return {
      horsepower: Number(hp.toFixed(1)),
      kW: Number(kw.toFixed(1))
    };
  } else {
    const kw = (torque * rpm) / 9549;
    const hp = kw / 0.7457;
    return {
      horsepower: Number(hp.toFixed(1)),
      kW: Number(kw.toFixed(1))
    };
  }
}

/**
 * Calculates 4-stroke operational frequencies.
 * @param {number} rpm - Crankshaft RPM
 * @param {number} cylinders - Number of cylinders
 */
export function calculateCycleFrequencies(rpm, cylinders) {
  if (!rpm || !cylinders || rpm <= 0 || cylinders <= 0) {
    return { crankHz: 0, camHz: 0, powerEventsPerSec: 0 };
  }
  const crankHz = rpm / 60;
  const camHz = crankHz / 2;
  const powerEventsPerSec = (rpm / 120) * cylinders;

  return {
    crankHz: Number(crankHz.toFixed(1)),
    camHz: Number(camHz.toFixed(1)),
    powerEventsPerSec: Number(powerEventsPerSec.toFixed(1))
  };
}
