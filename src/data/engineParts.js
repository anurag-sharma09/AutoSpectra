export const ENGINE_PARTS_DATA = [
  {
    id: 'engine-block',
    name: 'Engine Block (Cylinder Block)',
    category: 'Engine Block',
    function: 'Serves as the structural backbone of the engine, containing cylinder bores, water jackets for cooling, and oil galleries.',
    workingPrinciple: 'Houses reciprocating pistons inside cylinder bores and supports the crankshaft via main bearing saddles at the bottom end.',
    material: 'Gray Cast Iron or A356 Cast Aluminum Alloy with iron/plasma cylinder liners.',
    keyFeatures: [
      'Precision honed cylinder bores with cross-hatch micro-texture',
      'Integrated coolant water jacket passages surrounding cylinders',
      'Main bearing saddles with 2 or 4-bolt main cap retention',
      'Internal oil galleries supplying 30-60 PSI lubrication'
    ],
    typicalLocation: 'Central engine crankcase structural core',
    connectedComponents: ['Cylinder Head', 'Crankshaft', 'Pistons', 'Oil Pan'],
    movementType: 'Stationary Structural Base',
    maintenanceNotes: 'Inspect deck flatness with precision straightedge. Check bore taper and out-of-round using dial bore gauge during rebuilds.',
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
    keyFeatures: [
      'Hemispherical or wedge combustion chamber geometry',
      'Hardened steel valve seat inserts and bronze guides',
      'High-velocity intake & exhaust port flow runners',
      'Integrated spark plug / injector mounting wells'
    ],
    typicalLocation: 'Bolted to top of Engine Block over Head Gasket',
    connectedComponents: ['Engine Block', 'Valves', 'Valve Springs', 'Rocker Arms', 'Camshaft'],
    movementType: 'Stationary Sealed Deck',
    maintenanceNotes: 'Torque head bolts in multi-stage sequence per factory spec. Always replace head gasket upon disassembly.',
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
    keyFeatures: [
      'Dual compression rings and 3-piece oil control ring pack',
      'Full-floating wrist pin with retaining circlips',
      'Low-friction skirt PTFE / Moly coating',
      'Precision CNC valve relief pockets cut into crown'
    ],
    typicalLocation: 'Inside Cylinder Block Bores',
    connectedComponents: ['Connecting Rods', 'Engine Block', 'Crankshaft'],
    movementType: 'High-speed Linear Reciprocating',
    maintenanceNotes: 'Stagger piston ring gaps 120° apart before insertion using ring compressor tool.',
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
    keyFeatures: [
      'Fracture-split big-end rod cap for exact alignment',
      'Bronze small-end wrist pin bushing',
      'High-tensile ARP rod bolts',
      'Precision balanced mass end-to-end'
    ],
    typicalLocation: 'Between Piston Wrist Pin and Crankshaft Journal',
    connectedComponents: ['Pistons', 'Crankshaft', 'Rod Bearings'],
    movementType: 'Planar Oscillating & Rotational',
    maintenanceNotes: 'Check rod bearing oil clearance using Plastigauge ($0.0015 - 0.0025$ in.). Never inter-mix rod caps.',
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
    keyFeatures: [
      'Induction-hardened & micro-polished main & rod journals',
      'Aerodynamic precision-weighted counterweights',
      'Cross-drilled oil passages for rod bearing lubrication',
      'Integrated harmonic balancer snout and rear seal flange'
    ],
    typicalLocation: 'Bottom of Engine Block Crankcase',
    connectedComponents: ['Connecting Rods', 'Main Bearings', 'Flywheel', 'Harmonic Balancer'],
    movementType: 'Continuous Rotary Motion',
    maintenanceNotes: 'Measure crankshaft runout with dial indicator. Inspect oil seal contact surfaces for grooves.',
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
    keyFeatures: [
      'Asymmetrical high-lift lobe profiles for maximum airflow',
      'Precision ground journal bearing surfaces',
      'Integrated distributor drive gear / timing gear flange',
      'Drilled oil feed galleries for valvetrain oiling'
    ],
    typicalLocation: 'Engine Block (OHV) or Cylinder Head (OHC/DOHC)',
    connectedComponents: ['Lifters', 'Pushrods', 'Rocker Arms', 'Timing Chain'],
    movementType: '1/2 Speed Rotational',
    maintenanceNotes: 'Apply high-zinc (ZDDP) break-in lube on lobes during new flat-tappet installation.',
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
    keyFeatures: [
      '45° multi-angle precision ground valve face',
      'Hard chrome-plated stem for wear resistance',
      'Single or double lock keeper grooves at stem tip',
      'Swirl-polished under-head for optimized airflow'
    ],
    typicalLocation: 'Mounted vertically or angled inside Cylinder Head',
    connectedComponents: ['Cylinder Head', 'Valve Springs', 'Rocker Arms', 'Valve Guides'],
    movementType: 'High-speed Linear Reciprocating Poppet',
    maintenanceNotes: 'Lap valve faces into seats using fine lapping compound to ensure 100% vacuum seal.',
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
    keyFeatures: [
      'Beehive or dual concentric coil spring design',
      'Lightweight CNC machined chromoly or titanium retainers',
      'Shot-peened wire finish for fatigue resistance',
      'Hardened steel valve spring seat locator'
    ],
    typicalLocation: 'Top deck of Cylinder Head surrounding Valve Stem',
    connectedComponents: ['Valves', 'Rocker Arms', 'Valve Keepers'],
    movementType: 'High-frequency Axial Compression',
    maintenanceNotes: 'Test installed height spring seat pressure using valvetrain spring tester gauge.',
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
    keyFeatures: [
      'Friction-reducing roller tip wheel on valve stem',
      'Needle bearing fulcrum trunnion',
      'Precision lift multiplication ratio (1.5:1, 1.6:1, 1.7:1)',
      'Internal oil drip hole for valve stem tip cooling'
    ],
    typicalLocation: 'Top of Cylinder Head on Rocker Shaft / Studs',
    connectedComponents: ['Pushrods', 'Valves', 'Valve Springs', 'Camshaft'],
    movementType: 'Pivoting Angular Oscillation',
    maintenanceNotes: 'Adjust hydraulic valve pre-load (1/2 turn past zero lash) or solid lifter cold lash.',
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
    keyFeatures: [
      'Seamless cold-drawn chromoly wall construction',
      'Case-hardened 5/16" or 3/8" ball ends',
      'Hollow center channel for pressurized valvetrain oiling',
      'High column strength resisting high-RPM flex'
    ],
    typicalLocation: 'Passes through Engine Block & Head pushrod channels',
    connectedComponents: ['Lifters', 'Rocker Arms', 'Camshaft'],
    movementType: 'Linear Reciprocating Push/Pull',
    maintenanceNotes: 'Roll pushrod on glass table surface to verify zero deflection or wobble.',
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
    keyFeatures: [
      'Precision internal hydraulic check valve and plunger',
      'Carbide steel roller wheel with needle bearings',
      'Micro-honed outer body diameter',
      'Automatic zero-lash thermal compensation'
    ],
    typicalLocation: 'Engine Block Lifter Bores above Camshaft',
    connectedComponents: ['Camshaft', 'Pushrods', 'Engine Block'],
    movementType: 'Vertical Reciprocating Roller Tracking',
    maintenanceNotes: 'Pre-soak hydraulic lifters in clean engine oil prior to installation to prime internal check valve.',
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
    keyFeatures: [
      'Hydrodynamic wedge oil hole and circumferential groove',
      'Precision crush height to lock shell into saddle',
      'High fatigue strength tri-metal overlay',
      'Eccentric wall thickness for oil clearance optimization'
    ],
    typicalLocation: 'Inside Engine Block Saddles & Connecting Rod Big Ends',
    connectedComponents: ['Crankshaft', 'Connecting Rods', 'Engine Block', 'Oil Pump'],
    movementType: 'Stationary Hydrodynamic Slide Bearing',
    maintenanceNotes: 'Clean bearing backs dry before seating. Never touch bearing face with bare contaminated hands.',
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
    keyFeatures: [
      'Double roller chain construction for low stretch',
      'Induction hardened crank and cam sprockets',
      'Hydraulic engine oil pressure-fed chain tensioner',
      'Durable low-friction nylon chain guide dampers'
    ],
    typicalLocation: 'Front of Engine behind Timing Cover',
    connectedComponents: ['Crankshaft', 'Camshaft', 'Tensioners'],
    movementType: 'Synchronized Continuous Loop Drive',
    maintenanceNotes: 'Align timing marks (dots/links) exactly per engine service manual to prevent piston-valve collision.',
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
    keyFeatures: [
      'Equal length tuned intake runner tubes',
      'Smooth internal plenum volume minimizing flow turbulence',
      'Integrated fuel rail & injector mounting bosses',
      'Throttle body mounting flange with idle air bypass'
    ],
    typicalLocation: 'Bolted to top/side intake ports of Cylinder Head',
    connectedComponents: ['Cylinder Head', 'Throttle Body', 'Fuel Injectors'],
    movementType: 'Static Fluid Induction Conduit',
    maintenanceNotes: 'Inspect runner seals for vacuum leaks using smoke machine or carb spray while idling.',
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
    keyFeatures: [
      'Equal-length mandrel-bent stainless primary tubes',
      'High-flow 4-into-1 merge collector pyramid',
      'Thick 3/8" CNC laser-cut cylinder head flange',
      'Heat-resistant ceramic or stainless surface coating'
    ],
    typicalLocation: 'Bolted to exhaust ports on side of Cylinder Head',
    connectedComponents: ['Cylinder Head', 'Catalytic Converter', 'Oxygen Sensors'],
    movementType: 'High-Temperature Static Exhaust Conduit',
    maintenanceNotes: 'Use dead-soft copper or multi-layer steel (MLS) header gaskets with locking header bolts.',
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
    keyFeatures: [
      'High-volume trochoid gerotor pump gears',
      'Internal spring-loaded pressure relief bypass valve',
      'Deep oil pan sump with anti-slosh baffle tray',
      'Mesh oil pickup screen trapping large particulate'
    ],
    typicalLocation: 'Bottom of Engine Block sealing the crankcase',
    connectedComponents: ['Engine Block', 'Bearings', 'Oil Filter', 'Windage Tray'],
    movementType: 'Rotary Fluid Pressurization & Sump Storage',
    maintenanceNotes: 'Always replace oil pan gasket and drain plug crush washer at oil service intervals.',
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
    keyFeatures: [
      'Curved anti-cavitation centrifugal impeller',
      'Heavy-duty double-row shaft ball bearing assembly',
      'High-pressure mechanical shaft face seal with weep hole',
      'Wax-pellet thermostat valve opening at calibrated temp'
    ],
    typicalLocation: 'Front of Engine Block driven by serpentine belt',
    connectedComponents: ['Engine Block', 'Cylinder Head', 'Radiator'],
    movementType: 'High-Flow Centrifugal Fluid Recirculation',
    maintenanceNotes: 'Check water pump weep hole for active coolant leakage indicating shaft seal failure.',
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
    keyFeatures: [
      'High-speed electromagnetic solenoid actuator',
      'Multi-hole laser-drilled atomizer spray nozzle',
      'Viton high-temperature upper & lower sealing O-rings',
      'Internal micro basket filter screen'
    ],
    typicalLocation: 'Mounted into Intake Manifold or Cylinder Head direct injection ports',
    connectedComponents: ['Intake System', 'Cylinder Head', 'ECU'],
    movementType: 'High-Frequency Pulse Electromechanical Actuation',
    maintenanceNotes: 'Lubricate injector O-rings with clean engine oil prior to pressing into fuel rail to avoid tearing.',
    failureModes: [
      'Fuel injector clogging / carbon tip fouling',
      'Internal solenoid coil shorting',
      'O-ring seal hardening causing fuel leaks'
    ],
    relatedParts: ['Intake System', 'Cylinder Head', 'ECU']
  }
];
