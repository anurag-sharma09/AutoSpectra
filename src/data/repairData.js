export const REPAIR_DATA = [
  {
    id: 'overheating',
    symptom: 'Engine Overheating (High Coolant Temp Gauge)',
    category: 'Cooling System',
    severity: 'CRITICAL',
    description: 'Engine temperature exceeds normal operating limits ($> 105^\circ\text{C} / 220^\circ\text{F}$), steaming under hood, or high temp indicator warning light illuminated.',
    possibleCauses: [
      'Stuck closed thermostat preventing coolant flow to radiator',
      'Low coolant level due to external leak or blown head gasket',
      'Failing water pump impeller or broken drive belt',
      'Radiator electric cooling fan motor/relay failure',
      'Clogged radiator core fins or internal scale buildup'
    ],
    inspectionSteps: [
      'Allow engine to cool COMPLETELY before touching radiator cap.',
      'Check coolant expansion tank level and inspect for green/pink puddles under car.',
      'Squeeze top radiator hose (cold) to check for pressure.',
      'Start engine cold and observe if radiator fan turns on when temp rises.',
      'Feel upper and lower radiator hoses; if upper is burning hot and lower is cold, thermostat is stuck shut.'
    ],
    toolsNeeded: ['Infrared Thermometer', 'Coolant System Pressure Tester', 'Basic Socket Set', 'Funnel & Coolant Drain Pan'],
    workflow: [
      { step: 1, title: 'Visual Check', check: 'Check coolant level in reservoir tank.', test: 'Fluid below MIN mark?', action: 'Top up with 50/50 mix and pressure test for leaks.' },
      { step: 2, title: 'Hose Temp Test', check: 'Measure lower vs upper radiator hose temp.', test: 'Upper hot, lower cold?', action: 'Replace stuck thermostat assembly.' },
      { step: 3, title: 'Fan Operation', check: 'Turn on AC to force electric fan on.', test: 'Fan non-functional?', action: 'Inspect fan fuse, relay, or replace fan motor.' },
      { step: 4, title: 'Combustion Gas Test', check: 'Test coolant overflow for CO2 gases.', test: 'Fluid changes color to yellow?', action: 'Perform head gasket repair.' }
    ],
    safetyPrecautions: 'WARNING: NEVER open radiator cap while engine is hot! Scalding pressurized steam can cause severe burns.',
    professionalAdvice: 'If coolant shows milky white oil contamination or exhaust blows thick sweet white steam, consult an engine overhaul specialist for head gasket service.'
  },
  {
    id: 'low-oil-pressure',
    symptom: 'Low Oil Pressure Warning Light / Ticking Noise',
    category: 'Lubrication System',
    severity: 'CRITICAL',
    description: 'Oil pressure warning light stays illuminated after start, or digital oil pressure gauge displays below $10\text{ PSI}$ at idle accompanied by valvetrain noise.',
    possibleCauses: [
      'Critically low engine oil level',
      'Worn out oil pump or stuck pressure relief valve',
      'Excessive main or connecting rod bearing clearance',
      'Clogged oil pump pickup screen strainer',
      'Faulty oil pressure sender sensor unit'
    ],
    inspectionSteps: [
      'Stop engine immediately to prevent engine seizure.',
      'Pull oil dipstick, wipe clean, re-insert, and verify oil level on hatch pattern.',
      'Inspect dipstick oil quality for metallic sparkles or fuel dilution.',
      'Screw mechanical oil pressure gauge into pressure sender port to measure actual PSI.'
    ],
    toolsNeeded: ['Mechanical Oil Pressure Test Gauge Set', 'Dipstick', 'Filter Wrench', 'Catch Basin'],
    workflow: [
      { step: 1, title: 'Dipstick Check', check: 'Inspect dipstick oil height.', test: 'Oil level below ADD mark?', action: 'Add correct weight engine oil immediately.' },
      { step: 2, title: 'Mechanical Gauge Test', check: 'Thread mechanical gauge into oil sender port.', test: 'Actual pressure < 10 PSI at idle?', action: 'Drop oil pan and inspect pickup tube screen.' },
      { step: 3, title: 'Filter Inspection', check: 'Cut open oil filter element.', test: 'Gold/silver metal flakes present?', action: 'Main engine bearings worn out; engine teardown required.' }
    ],
    safetyPrecautions: 'CAUTION: Operating an engine with zero oil pressure will destroy crank bearings within 30 seconds.',
    professionalAdvice: 'If actual mechanical oil pressure is normal but light remains on, replace the sender switch unit.'
  },
  {
    id: 'engine-knocking',
    symptom: 'Engine Metallic Knocking / Deep Clunking Sound',
    category: 'Rotating Assembly',
    severity: 'HIGH',
    description: 'Rhythmic, deep metallic thumping sound from lower engine block that speeds up with RPM, or sharp pinging rattling noise during heavy acceleration.',
    possibleCauses: [
      'Rod bearing failure ("Rod Knock") from oil starvation',
      'Combustion detonation/pre-ignition pinging from low octane fuel or carbon hotspots',
      'Excessive piston skirt slap in cold cylinder bores',
      'Loose flywheel or torque converter flexplate bolts'
    ],
    inspectionSteps: [
      'Determine if noise is a low-frequency deep thud (crankshaft/rod) or high-pitched clatter (valvetrain).',
      'Disconnect spark plug wires one by one; if knocking disappears on a specific cylinder, that rod bearing is spun.',
      'Check fuel octane rating and ignition timing.'
    ],
    toolsNeeded: ['Mechanic Stethoscope', 'Spark Plug Wire Puller', 'Timing Light', 'Scan Tool'],
    workflow: [
      { step: 1, title: 'Stethoscope Pinpoint', check: 'Touch stethoscope probe along oil pan and block.', test: 'Loudest knock at oil pan base?', action: 'Rod bearing failure. Engine rebuild needed.' },
      { step: 2, title: 'Cylinder Cutout', check: 'Unplug fuel injector 1 by 1.', test: 'Knock disappears on cylinder 3?', action: 'Confirmed rod journal damage on cylinder 3.' }
    ],
    safetyPrecautions: 'Do not rev engine high when diagnosing rod knock; a thrown connecting rod can punch through the block wall.',
    professionalAdvice: 'Severe rod knock requires crankshaft regrinding and oversized replacement bearings.'
  },
  {
    id: 'excessive-smoke',
    symptom: 'Excessive Exhaust Smoke (Blue, White, or Black)',
    category: 'Combustion / Exhaust',
    severity: 'MEDIUM',
    description: 'Distinct smoke emitting from tailpipe: Blue/Gray (oil burning), White/Sweet (coolant burning), or Heavy Black (rich fuel mixture).',
    possibleCauses: [
      'Blue Smoke: Worn valve stem seals or oil rings allowing oil into combustion chamber',
      'White Smoke: Blown head gasket or cracked cylinder head leaking coolant',
      'Black Smoke: Stuck open fuel injector, dirty air filter, or faulty MAF sensor'
    ],
    inspectionSteps: [
      'Observe smoke color upon startup vs under heavy acceleration load.',
      'Check spark plug tips for oily deposits (blue smoke) or clean steam washed look (white smoke).',
      'Perform cylinder compression and leakdown tests.'
    ],
    toolsNeeded: ['Compression Tester Gauge', 'Spark Plug Socket', 'Exhaust Gas Leak Tester'],
    workflow: [
      { step: 1, title: 'Identify Color', check: 'Inspect smoke hue.', test: 'Is smoke blue with burning oil smell?', action: 'Perform valve seal or piston ring replacement.' },
      { step: 2, title: 'Compression Test', check: 'Measure PSI across all cylinders.', test: '2 adjacent cylinders low PSI?', action: 'Replace blown head gasket between cylinders.' }
    ],
    safetyPrecautions: 'Perform exhaust tests in a well-ventilated area to avoid carbon monoxide poisoning.',
    professionalAdvice: 'White steam that smells sweet indicates coolant combustion. Stop driving immediately to prevent hydraulic lock.'
  },
  {
    id: 'misfire-rough-idle',
    symptom: 'Engine Misfire / Rough Idle / Check Engine Flashing',
    category: 'Ignition / Fuel',
    severity: 'HIGH',
    description: 'Engine stumbles, shakes at stoplights, stutters during acceleration, with a flashing Check Engine Light (MIL) storing P0300-P0308 codes.',
    possibleCauses: [
      'Fouled, worn out, or incorrectly gapped spark plug',
      'Failing ignition coil pack or plug wire resistor',
      'Clogged or shorted fuel injector',
      'Vacuum leak around intake manifold gasket',
      'Low cylinder compression'
    ],
    inspectionSteps: [
      'Plug OBD2 scanner into diagnostic port to retrieve specific misfire cylinder code (e.g. P0303 = Cylinder 3).',
      'Swap ignition coil from suspect cylinder to clean cylinder and re-scan.',
      'Inspect spark plug ceramic insulator for hairline cracks or carbon tracking.'
    ],
    toolsNeeded: ['OBD2 Code Scanner', 'Spark Plug Gap Gauge', 'Multimeter'],
    workflow: [
      { step: 1, title: 'Read OBD Codes', check: 'Scan ECU for diagnostic trouble codes.', test: 'DTC P0302 present?', action: 'Focus troubleshooting on Cylinder 2.' },
      { step: 2, title: 'Coil Swap Test', check: 'Move coil #2 to cylinder #1.', test: 'Does misfire follow to Cylinder 1?', action: 'Replace defective ignition coil pack.' }
    ],
    safetyPrecautions: 'Never touch high-voltage ignition wires ($25,000+\text{V}$) while engine is cranking.',
    professionalAdvice: 'A flashing check engine light indicates active raw fuel dumping into catalytic converter. Fix immediately to avoid destroying converter.'
  }
];
