export const ENGINE_PARTS_DATA = [
  {
    id: 'engine-block',
    name: 'Engine Block (Cylinder Block)',
    category: 'Engine Block',
    function: 'Serves as the structural backbone of the engine, containing cylinder bores, water jackets for cooling, and oil galleries.',
    workingPrinciple: 'Houses reciprocating pistons inside cylinder bores and supports the crankshaft via main bearing saddles at the bottom end.',
    material: 'Gray Cast Iron or A356 Cast Aluminum Alloy with iron/plasma cylinder liners.',
    failureModes: [
      'Cylinder wall scoring / scuffing',
      'Deck surface warpage from severe overheating',
      'Crankcase block cracks along main webbing',
      'Bore out-of-round distortion'
    ],
    relatedParts: ['Cylinder Head', 'Crankshaft', 'Pistons', 'Main Bearing Caps']
  },
  {
    id: 'cylinder-head',
    name: 'Cylinder Head',
    category: 'Cylinder Head',
    function: 'Seals the top of the cylinder block, enclosing the combustion chamber and housing valves, spark plugs/injectors, and port passages.',
    workingPrinciple: 'Directs intake air/fuel mixture into cylinders and exhausts burnt gases through precision-angled valve seats and ports.',
    material: 'Cast Aluminum Alloy (356-T6) for heat dissipation and light weight.',
    failureModes: [
      'Head deck warpage causing head gasket failure',
      'Valvetrain valve seat recession',
      'Combustion chamber micro-cracks between valve seats',
      'Coolant passage corrosion'
    ],
    relatedParts: ['Engine Block', 'Valves', 'Valve Springs', 'Rocker Arms', 'Head Gasket']
  },
  {
    id: 'pistons',
    name: 'Pistons & Compression Rings',
    category: 'Pistons',
    function: 'Transforms expanding high-pressure combustion gas forces into mechanical linear reciprocating force.',
    workingPrinciple: 'Transmits gas pressure downward through the piston crown and wrist pin into the connecting rod.',
    material: 'Forged 4032/2618 Aluminum Alloy with molybdenum ring groove coatings.',
    failureModes: [
      'Piston crown detonation damage / melting',
      'Piston skirt scuffing due to oil starvation',
      'Ring land cracking under excessive boost pressure',
      'Wrist pin bushing wear'
    ],
    relatedParts: ['Connecting Rods', 'Engine Block', 'Crankshaft']
  },
  {
    id: 'connecting-rods',
    name: 'Connecting Rods',
    category: 'Connecting Rods',
    function: 'Links each piston wrist pin to the crankshaft throw journal, converting linear piston motion to rotation.',
    workingPrinciple: 'Executes complex planar motion (reciprocating at small end, rotating at big end) while carrying extreme tensile & compressive load cycles.',
    material: 'Forged 4340 Chrome-Moly Steel or Powdered Metal (PM) H-Beam design.',
    failureModes: [
      'Connecting rod bending under severe hydraulic lock or detonation',
      'Rod cap bolt stretch and failure',
      'Big-end rod bearing spun journal',
      'Small-end wrist pin bushing galling'
    ],
    relatedParts: ['Pistons', 'Crankshaft', 'Rod Bearings']
  },
  {
    id: 'crankshaft',
    name: 'Crankshaft',
    category: 'Crankshaft',
    function: 'Converts reciprocating piston motion into continuous output rotational torque delivered to the flywheel & transmission.',
    workingPrinciple: 'Offset crank pins convert linear push forces into rotational torque. Counterweights balance rotating rod/piston masses.',
    material: 'Forged 4340 Steel or Ductile Nodular Iron with nitrided/induction-hardened journals.',
    failureModes: [
      'Journal scoring from oil contamination',
      'Fillet radius fatigue stress cracking',
      'Torsional vibration damper failure leading to crankshaft snap',
      'Thrust bearing wear causing excessive crank endplay'
    ],
    relatedParts: ['Connecting Rods', 'Main Bearings', 'Flywheel', 'Harmonic Balancer']
  },
  {
    id: 'camshaft',
    name: 'Camshaft',
    category: 'Camshaft',
    function: 'Controls valve opening timing, duration, and lift via egg-shaped lobe profiles acting on lifters or rocker arms.',
    workingPrinciple: 'Rotates at exactly half crankshaft speed ($1/2$ RPM in 4-stroke cycle). Cam lobes push lifters upward at precise angles.',
    material: 'Chilled Cast Iron or Billet 8620 Steel with induction hardened lobes.',
    failureModes: [
      'Cam lobe wiping / flattening from excessive spring pressure or lack of ZDDP oil additive',
      'Cam journal scuffing',
      'Timing gear keyway shear'
    ],
    relatedParts: ['Lifters', 'Pushrods', 'Rocker Arms', 'Timing Chain']
  },
  {
    id: 'valves',
    name: 'Intake & Exhaust Valves',
    category: 'Valves',
    function: 'Seals intake and exhaust ports during compression & power strokes while allowing fresh air in and burned gases out.',
    workingPrinciple: 'Poppet valves open downward into combustion chamber when pushed by valvetrain, returning sealed via valve springs.',
    material: 'Intake: Stainless Steel (SUH3). Exhaust: High-temp Inconel 751 or sodium-filled hollow stems.',
    failureModes: [
      'Burnt exhaust valve margin from lean air/fuel mixture',
      'Valve stem carbon buildup causing sticking',
      'Valve head tuliping under thermal stress',
      'Bent valve stem from piston-to-valve contact'
    ],
    relatedParts: ['Cylinder Head', 'Valve Springs', 'Rocker Arms', 'Valve Guides']
  },
  {
    id: 'valve-springs',
    name: 'Valve Springs & Retainers',
    category: 'Valve Springs',
    function: 'Provides closing force to pull open valves tightly shut against seats and maintain valvetrain contact at high RPM.',
    workingPrinciple: 'Helical compression spring stores energy when compressed by rocker arm and releases it to close valve rapidly.',
    material: 'Silicon-Chromium-Vanadium Spring Steel Wire (OV-Cr-V).',
    failureModes: [
      'Valve float at high RPMs leading to float contact',
      'Spring wire fatigue fracture',
      'Loss of seat pressure over prolonged high-heat cycles'
    ],
    relatedParts: ['Valves', 'Rocker Arms', 'Valve Keepers']
  },
  {
    id: 'rocker-arms',
    name: 'Rocker Arms',
    category: 'Rocker Arms',
    function: 'Pivoting levers that transfer upward pushrod motion into downward valve opening force.',
    workingPrinciple: 'Acts as a 1st or 2nd class lever (typically 1.5:1 to 1.7:1 ratio) to multiply cam lift into greater valve lift.',
    material: 'Investment Cast Steel, Forged Aluminum with needle bearing roller tips.',
    failureModes: [
      'Roller tip bearing failure',
      'Fulcrum trunnion wear',
      'Rocker arm body fatigue flex or snapping'
    ],
    relatedParts: ['Pushrods', 'Valves', 'Valve Springs', 'Camshaft']
  },
  {
    id: 'pushrods',
    name: 'Pushrods',
    category: 'Pushrods',
    function: 'Transfers vertical motion from cam lifters in the engine block up to the rocker arms in the cylinder head.',
    workingPrinciple: 'Hollow steel tubes carry push force upward while allowing pressurized engine oil to travel inside up to the rockers.',
    material: 'Seamless 4130 Chromoly Steel tubing with case-hardened ball ends.',
    failureModes: [
      'Pushrod bending / deflection under valvetrain float',
      'Ball tip oil hole clogging',
      'Cup end galling'
    ],
    relatedParts: ['Lifters', 'Rocker Arms', 'Camshaft']
  },
  {
    id: 'lifters',
    name: 'Hydraulic Tappets / Lifters',
    category: 'Lifters',
    function: 'Rides directly on camshaft lobes and automatically compensates for valvetrain thermal expansion clearance.',
    workingPrinciple: 'Uses internal high-pressure engine oil plunger mechanism to eliminate valve lash noise automatically.',
    material: 'Hardened Steel Body with carbide roller wheels (Roller Lifters).',
    failureModes: [
      'Hydraulic lifter collapse causing valvetrain ticking',
      'Roller wheel pin failure',
      'Lifter body bore scoring'
    ],
    relatedParts: ['Camshaft', 'Pushrods', 'Engine Block']
  },
  {
    id: 'bearings',
    name: 'Main & Connecting Rod Bearings',
    category: 'Bearings',
    function: 'Provides low-friction hydrodynamic oil film support between rotating steel crankshaft journals and stationery block saddles / rod ends.',
    workingPrinciple: 'Pressurized engine oil ($30-60$ PSI) forms a dynamic oil wedge, preventing metal-to-metal contact during operation.',
    material: 'Tri-metal construction: Steel backing, Copper-Lead intermediate layer, Electroplated Babbitt top layer.',
    failureModes: [
      'Spun bearing due to loss of oil pressure or overheating',
      'Debris embedding and scoring',
      'Fatigue flaking / cavitation erosion'
    ],
    relatedParts: ['Crankshaft', 'Connecting Rods', 'Engine Block', 'Oil Pump']
  },
  {
    id: 'timing-system',
    name: 'Timing Chain & Sprockets',
    category: 'Timing System',
    function: 'Synchronizes crankshaft rotation with camshaft rotation so valves open and close at exact crankshaft angles.',
    workingPrinciple: 'Heavy-duty double roller chain links crankshaft timing sprocket to camshaft gear at a 1:2 drive ratio.',
    material: 'Heat-treated Alloy Steel chain with hydraulic tensioners and nylon guide shoes.',
    failureModes: [
      'Timing chain stretch causing valve timing retardation',
      'Hydraulic tensioner failure',
      'Plastic chain guide wear/shattering causing jumped timing'
    ],
    relatedParts: ['Crankshaft', 'Camshaft', 'Tensioners']
  },
  {
    id: 'intake-system',
    name: 'Intake Manifold & Throttle Body',
    category: 'Intake System',
    function: 'Distributes clean ambient air evenly into each cylinder head intake port.',
    workingPrinciple: 'Uses tuned runner lengths and plenum volume to maximize Helmholtz resonance charging at target engine speeds.',
    material: 'Cast Aluminum or Composite Nylon (PA66-GF30).',
    failureModes: [
      'Intake runner gasket vacuum leak',
      'Internal plenum oil pooling from PCV blowby',
      'Plastic runner crack under backfire'
    ],
    relatedParts: ['Cylinder Head', 'Throttle Body', 'Fuel Injectors']
  },
  {
    id: 'exhaust-system',
    name: 'Exhaust Headers (Manifolds)',
    category: 'Exhaust System',
    function: 'Collects hot exhaust gases from cylinder head ports and routes them safely out through catalytic converters and mufflers.',
    workingPrinciple: 'Tuned 4-into-1 individual primary tubes pull scavenged pressure waves to help draw remaining exhaust out of cylinders.',
    material: 'Tubular 304 Stainless Steel or Cast Nodular Iron.',
    failureModes: [
      'Header flange warping causing exhaust leak ticking',
      'Thermal stress cracking at collector welds',
      'Stud/bolt snapping due to heat cycling'
    ],
    relatedParts: ['Cylinder Head', 'Catalytic Converter', 'Oxygen Sensors']
  },
  {
    id: 'lubrication-system',
    name: 'Oil Pump & Oil Pan',
    category: 'Lubrication System',
    function: 'Stores engine oil, sweeps up oil, and circulates pressurized lubricant through all bearings, valvetrain, and galleries.',
    workingPrinciple: 'Positive displacement gerotor oil pump driven off crankshaft draws oil through pickup screen from oil pan sump.',
    material: 'Stamped Steel or Cast Aluminum oil pan with internal anti-slosh windage tray.',
    failureModes: [
      'Oil pump pressure relief valve sticking open (low pressure)',
      'Pickup screen clogging with sludge/RTV',
      'Oil pan drain plug stripping or sump puncture'
    ],
    relatedParts: ['Engine Block', 'Bearings', 'Oil Filter', 'Windage Tray']
  },
  {
    id: 'cooling-system',
    name: 'Water Pump & Thermostat',
    category: 'Cooling System',
    function: 'Circulates liquid coolant through engine block water jackets to maintain optimal operating temperature ($85-95^\circ\text{C}$).',
    workingPrinciple: 'Centrifugal impeller pumps coolant through block and head jackets, passing through radiator when thermostat opens.',
    material: 'Cast Aluminum housing with curved stainless impeller.',
    failureModes: [
      'Water pump bearing play causing shaft seal leak',
      'Thermostat stuck closed causing rapid engine overheating',
      'Impeller erosion'
    ],
    relatedParts: ['Engine Block', 'Cylinder Head', 'Radiator']
  },
  {
    id: 'fuel-system',
    name: 'Fuel Injectors & Fuel Rail',
    category: 'Fuel System',
    function: 'Delivers precisely metered fuel sprays directly into intake ports (PFI) or combustion chambers (GDI).',
    workingPrinciple: 'Solenoid or piezoelectric actuators open pintle valve for microsecond pulse widths controlled by engine ECU.',
    material: 'Stainless steel body with micro-ceramic orifice plates.',
    failureModes: [
      'Fuel injector clogging / carbon tip fouling',
      'Internal solenoid coil shorting',
      'O-ring seal hardening causing fuel leaks'
    ],
    relatedParts: ['Intake System', 'Cylinder Head', 'ECU']
  }
];
