export const CALCULATORS_DATA = [
  {
    id: 'displacement',
    name: 'Engine Displacement Calculator',
    description: 'Calculates total engine displacement volume based on cylinder bore diameter, piston stroke length, and cylinder count.',
    formula: 'V_d = \\frac{\\pi}{4} \\cdot \\text{Bore}^2 \\cdot \\text{Stroke} \\cdot N',
    inputs: [
      { id: 'bore', label: 'Cylinder Bore (mm)', default: 101.6, min: 40, max: 150, step: 0.1 },
      { id: 'stroke', label: 'Piston Stroke (mm)', default: 88.4, min: 40, max: 150, step: 0.1 },
      { id: 'cylinders', label: 'Number of Cylinders', default: 8, min: 1, max: 16, step: 1 }
    ]
  },
  {
    id: 'compression-ratio',
    name: 'Compression Ratio Calculator',
    description: 'Determines static compression ratio ($CR$) by comparing total cylinder volume at BDC to combustion chamber clearance volume at TDC.',
    formula: 'CR = \\frac{V_{\\text{swept}} + V_{\\text{clearance}}}{V_{\\text{clearance}}}',
    inputs: [
      { id: 'singleCc', label: 'Single Cylinder Swept Vol (cc)', default: 715.7, min: 50, max: 2000, step: 1 },
      { id: 'clearanceCc', label: 'Clearance Chamber Vol (cc)', default: 75.3, min: 5, max: 300, step: 0.5 }
    ]
  },
  {
    id: 'piston-speed',
    name: 'Mean Piston Speed Calculator',
    description: 'Calculates mean linear velocity of the piston during stroke travel. High piston speeds ($> 22\\text{ m/s}$) increase stress on rods and wrist pins.',
    formula: 'v_{\\text{mean}} = \\frac{2 \\cdot \\text{Stroke}_{\\text{m}} \\cdot \\text{RPM}}{60}',
    inputs: [
      { id: 'strokeMm', label: 'Piston Stroke (mm)', default: 88.4, min: 40, max: 150, step: 0.1 },
      { id: 'rpm', label: 'Engine Speed (RPM)', default: 6500, min: 500, max: 15000, step: 100 }
    ]
  },
  {
    id: 'power-torque',
    name: 'Torque to Horsepower & Power Calculator',
    description: 'Computes brake horsepower ($HP$) and kilowatts ($kW$) from engine torque output at a given rotational RPM speed.',
    formula: 'HP = \\frac{\\text{Torque}_{\\text{lb-ft}} \\cdot \\text{RPM}}{5252}, \\quad kW = \\frac{\\text{Torque}_{\\text{Nm}} \\cdot \\text{RPM}}{9549}',
    inputs: [
      { id: 'torque', label: 'Engine Torque Output', default: 400, min: 10, max: 2000, step: 5 },
      { id: 'rpm', label: 'Engine Speed (RPM)', default: 5500, min: 500, max: 15000, step: 100 }
    ]
  },
  {
    id: 'kinematic-cycle',
    name: '4-Stroke Operational Frequency Calculator',
    description: 'Calculates physical rotation frequencies ($Hz$) for crankshaft, camshaft ($1/2$ speed), and total ignition power pulses per second.',
    formula: 'f_{\\text{crank}} = \\frac{\\text{RPM}}{60}, \\quad f_{\\text{power}} = \\frac{\\text{RPM}}{120} \\cdot N',
    inputs: [
      { id: 'rpm', label: 'Crankshaft RPM', default: 6000, min: 500, max: 15000, step: 100 },
      { id: 'cylinders', label: 'Cylinder Count', default: 8, min: 1, max: 16, step: 1 }
    ]
  }
];
