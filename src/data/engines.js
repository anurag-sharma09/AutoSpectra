export const ENGINES_DATA = [
  {
    id: 'v8-ohv',
    name: '90° V8 OHV (Pushrod)',
    type: 'V8',
    cylinders: 8,
    displacement: '5.7L / 350 cu in',
    configuration: '90° V-Angle, Crossplane Crankshaft',
    valvetrain: 'OHV 16-Valve (Single Cam-in-Block)',
    firingOrder: '1-8-7-2-6-5-4-3',
    powerOutput: '380 - 450 HP @ 5,800 RPM',
    torqueOutput: '400 - 460 lb-ft @ 4,200 RPM',
    description: 'Classic American muscle and truck architecture featuring a single camshaft inside the engine block pushing lifters, pushrods, and rocker arms to actuate 16 valves across twin cylinder banks at a 90° angle.',
    workingPrinciple: 'Crossplane crankshaft fires cylinders every 90° of rotation. High low-end torque density with a compact overall package length.',
    applications: ['Muscle Cars', 'Heavy Trucks & SUVs', 'Motorsport & Drag Racing', 'Marine Engines'],
    advantages: [
      'Compact overall length and low height',
      'Fewer moving parts than DOHC engines',
      'Exceptional low-RPM torque delivery',
      'Proven durability and low manufacturing cost'
    ],
    limitations: [
      'Valvetrain inertia limits maximum RPM (< 7,000 RPM)',
      'Two valves per cylinder limits high-RPM airflow efficiency',
      'Unequal exhaust pulse timing gives signature V8 rumble'
    ],
    previewModel: 'v8-ohv'
  },
  {
    id: 'inline-4',
    name: 'Inline-4 DOHC 16-Valve',
    type: 'Inline',
    cylinders: 4,
    displacement: '2.0L / 122 cu in',
    configuration: 'Straight-4 Vertical, Flatplane Crankshaft',
    valvetrain: 'DOHC 16-Valve (Dual Overhead Cams)',
    firingOrder: '1-3-4-2',
    powerOutput: '180 - 310 HP @ 6,500 RPM',
    torqueOutput: '190 - 295 lb-ft @ 3,800 RPM',
    description: 'The world\'s most popular passenger car engine layout. Features 4 cylinders aligned in a single straight row with twin overhead camshafts operating 4 valves per cylinder directly.',
    workingPrinciple: 'Pistons 1 & 4 move together, opposite to Pistons 2 & 3. Secondary dynamic imbalance occurs at high RPM, often mitigated by counter-rotating balance shafts.',
    applications: ['Compact & Midsize Cars', 'Hot Hatches', 'Motorcycles', 'Hybrid Powertrains'],
    advantages: [
      'High thermal and volumetric efficiency',
      'Compact width fits transverse FWD engine bays',
      'Simple single-head casting design',
      'Low production and maintenance costs'
    ],
    limitations: [
      'Secondary vertical vibration at higher displacements (> 2.4L)',
      'Limited power output potential compared to multi-bank engines'
    ],
    previewModel: 'inline-4'
  },
  {
    id: 'v6-dohc',
    name: '60° V6 DOHC Twin-Turbo',
    type: 'V6',
    cylinders: 6,
    displacement: '3.5L / 213 cu in',
    configuration: '60° V-Angle, 6-Throw Crankshaft',
    valvetrain: 'DOHC 24-Valve (Quad Cams with VVT)',
    firingOrder: '1-2-3-4-5-6',
    powerOutput: '330 - 450 HP @ 6,000 RPM',
    torqueOutput: '380 - 510 lb-ft @ 3,500 RPM',
    description: 'A versatile performance engine balancing power and space efficiency. Uses two cylinder banks of 3 cylinders angled at 60 degrees with twin overhead cams per bank.',
    workingPrinciple: 'A 60° bank angle allows even 120° firing intervals without requiring split crankshaft journal pins, offering smooth power delivery and high boost capability.',
    applications: ['Sports Sedans', 'Performance SUVs', 'Pickup Trucks', 'Modern Sports Cars'],
    advantages: [
      'Shorter than Inline-6, fits longitudinal and transverse setups',
      'Excellent balance of power, weight, and fuel efficiency',
      'Ideal geometry for twin-turbocharger packaging'
    ],
    limitations: [
      'Complex quad-cam valvetrain timing system',
      'Requires split journal pins if built at 90° angle'
    ],
    previewModel: 'v6-dohc'
  },
  {
    id: 'boxer-4',
    name: 'Flat-4 Boxer Engine',
    type: 'Boxer',
    cylinders: 4,
    displacement: '2.5L / 150 cu in',
    configuration: '180° Horizontally Opposed',
    valvetrain: 'DOHC 16-Valve',
    firingOrder: '1-3-2-4',
    powerOutput: '182 - 310 HP @ 6,000 RPM',
    torqueOutput: '176 - 290 lb-ft @ 4,000 RPM',
    description: 'Opposing cylinder pistons move horizontally toward and away from each other simultaneously, like boxers punching gloves. Features a very flat profile and low center of gravity.',
    workingPrinciple: 'Primary and secondary forces cancel out naturally as opposing pistons move in opposite directions, providing smooth mechanical balance without heavy balance shafts.',
    applications: ['Subaru Vehicles', 'Porsche Sports Cars', 'Aircraft (Lycoming)', 'Vintage VW Beetle'],
    advantages: [
      'Ultra-low center of gravity enhances vehicle handling',
      'Natural mechanical balance eliminates rotational vibration',
      'Short crankshaft reduces engine length'
    ],
    limitations: [
      'Wide engine width restricts steering angles & engine bay access',
      'Dual cylinder heads double valvetrain component counts',
      'Oil seals prone to gravity pooling wear over time'
    ],
    previewModel: 'boxer-4'
  },
  {
    id: 'radial-7',
    name: '7-Cylinder Aircraft Radial Engine',
    type: 'Radial',
    cylinders: 7,
    displacement: '11.0L / 670 cu in',
    configuration: '360° Circular Bank Around Master Rod',
    valvetrain: 'OHV Pushrod with Cam Ring System',
    firingOrder: '1-3-5-7-2-4-6',
    powerOutput: '300 - 450 HP @ 2,300 RPM',
    torqueOutput: '700+ lb-ft @ 1,800 RPM',
    description: 'Classic aviation engine where cylinders radiate outward from a central crankcase like wheel spokes. All connecting rods articulate around a single master rod connected to the crankshaft.',
    workingPrinciple: 'Fires every odd cylinder on round 1 (1-3-5-7), then even cylinders on round 2 (2-4-6), completing a smooth 720° 4-stroke cycle.',
    applications: ['WWII Fighter/Transport Aircraft', 'Vintage Aviation', 'Heavy Agricultural Airplanes'],
    advantages: [
      'Direct air-cooling eliminates heavy liquid radiators & coolant leaks',
      'High power-to-weight ratio for aviation',
      'Short single-throw crankshaft is exceptionally rigid'
    ],
    limitations: [
      'Large frontal surface area creates high aerodynamic drag',
      'Oil pooling in lower cylinders risks hydraulic lock on startup'
    ],
    previewModel: 'radial-7'
  },
  {
    id: 'w12',
    name: 'W12 Twin-Turbo Engine',
    type: 'W-Engine',
    cylinders: 12,
    displacement: '6.0L / 366 cu in',
    configuration: '72° Main V, Dual 15° VR6 Cylinder Banks',
    valvetrain: 'DOHC 48-Valve (Quad Cams)',
    firingOrder: '1-12-5-8-3-10-6-7-2-11-4-9',
    powerOutput: '626 - 650 HP @ 6,000 RPM',
    torqueOutput: '664 lb-ft @ 1,350 RPM',
    description: 'A masterpiece of compact high-cylinder packaging created by joining two narrow-angle 15° VR6 cylinder banks onto a single crankshaft at a 72° V angle.',
    workingPrinciple: 'Combines 12 cylinders into a package shorter than a standard V8, distributing power strokes every 60° of crankshaft rotation for turbine-smooth acceleration.',
    applications: ['Bentley Continental GT & Flying Spur', 'Audi A8 W12', 'Volkswagen Phaeton'],
    advantages: [
      '12-cylinder displacement in a compact package length',
      'Incredible torque output from low RPMs',
      'Ultra-smooth operation with zero second-order vibrations'
    ],
    limitations: [
      'Extremely complex packaging, intake plumbing, and thermal management',
      'High weight and dense maintenance requirements'
    ],
    previewModel: 'w12'
  },
  {
    id: 'rotary-wankel',
    name: 'Twin-Rotor Wankel Rotary Engine',
    type: 'Rotary',
    cylinders: 2, // Rotors
    displacement: '1.3L / 80 cu in (Effective 2.6L)',
    configuration: 'Epitrochoid Housing with Triangular Rotors',
    valvetrain: 'Ported Intake & Exhaust (No Valves)',
    firingOrder: 'Rotor 1 -> Rotor 2 Continuous',
    powerOutput: '232 HP @ 8,500 RPM',
    torqueOutput: '159 lb-ft @ 5,500 RPM',
    description: 'Replaces reciprocating pistons with a triangular rotor spinning inside an oval epitrochoid housing. Performs intake, compression, power, and exhaust strokes simultaneously across 3 rotor faces.',
    workingPrinciple: 'The eccentric shaft turns 3 times for every single rotor revolution. Power stroke occurs over 270° of shaft rotation vs 180° in piston engines.',
    applications: ['Mazda RX-7 & RX-8', 'Le Mans Winner Mazda 787B', 'Experimental Aviation'],
    advantages: [
      'Zero reciprocating motion allows ultra-high RPMs (> 9,000 RPM)',
      'Exceptionally light and compact physical dimensions',
      'Fewer moving parts (no valves, springs, or camshafts)'
    ],
    limitations: [
      'Apex seals subject to friction wear and oil consumption',
      'Low thermal efficiency due to long combustion chamber surface'
    ],
    previewModel: 'rotary-wankel'
  },
  {
    id: 'single-cylinder',
    name: 'Single-Cylinder 4-Stroke Utility Engine',
    type: 'Single-Cylinder',
    cylinders: 1,
    displacement: '0.25L / 15 cu in (250cc)',
    configuration: 'Single Vertical Cylinder',
    valvetrain: 'OHV 2-Valve',
    firingOrder: '1',
    powerOutput: '15 - 25 HP @ 7,500 RPM',
    torqueOutput: '18 lb-ft @ 5,500 RPM',
    description: 'The fundamental building block of internal combustion engine study. Uses a single piston, connecting rod, and counterweighted crankshaft.',
    workingPrinciple: 'Delivers 1 power stroke for every 2 full revolutions (720°) of crankshaft spin. Relies heavily on flywheel inertia to maintain momentum during non-power strokes.',
    applications: ['Motorcycles & Dirt Bikes', 'Lawn Equipment & Generators', 'Go-Karts', 'Engineering Education'],
    advantages: [
      'Simplest possible internal combustion engine mechanism',
      'Ultra-low manufacturing cost and light weight',
      'Perfect for teaching fundamental 4-stroke thermodynamics'
    ],
    limitations: [
      'High vibration levels require large flywheel or counterweights',
      'Uneven power delivery with long pause between power strokes'
    ],
    previewModel: 'single-cylinder'
  },
  {
    id: 'opposed-piston',
    name: 'Opposed-Piston 2-Stroke Diesel',
    type: 'Opposed-Piston',
    cylinders: 3, // 6 Pistons
    displacement: '6.7L / 408 cu in',
    configuration: '2 Opposing Pistons Per Cylinder, Twin Crankshafts',
    valvetrain: 'Uniflow Ported Intake & Exhaust',
    firingOrder: '1-2-3 Synchronized',
    powerOutput: '450 HP @ 2,200 RPM',
    torqueOutput: '1,100 lb-ft @ 1,300 RPM',
    description: 'An extraordinary design featuring two pistons moving toward each other inside the same cylinder sleeve. Traps combustion pressure between piston crowns, eliminating cylinder heads entirely.',
    workingPrinciple: 'Intake ports at one end and exhaust ports at the other create efficient uniflow scavenging as pistons uncover ports near bottom dead center.',
    applications: ['Achates Power Commercial Engines', 'Junkers Jumo Aviation', 'Locomotives & Submarines'],
    advantages: [
      'No cylinder heads or valves, drastically reducing heat losses',
      'Extreme thermal efficiency (> 50% thermal efficiency)',
      'High power density per displacement unit'
    ],
    limitations: [
      'Requires dual crankshafts connected via gear train or chains',
      'Complex lubrication control around exhaust ports'
    ],
    previewModel: 'opposed-piston'
  }
];
