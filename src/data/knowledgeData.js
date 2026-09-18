export const KNOWLEDGE_DATA = [
  {
    id: '4-stroke-cycle',
    title: 'The 4-Stroke Otto Cycle Principles',
    category: 'Fundamentals',
    readTime: '6 min read',
    summary: 'Master the fundamental 4-phase thermodynamic cycle (Intake, Compression, Power, Exhaust) that powers over 95% of modern internal combustion engines.',
    sections: [
      {
        heading: '1. Intake Stroke (Suck)',
        content: 'The intake valve opens while the piston moves downward from Top Dead Center (TDC) to Bottom Dead Center (BDC). This downward motion creates a low-pressure vacuum inside the cylinder, drawing in a fresh charge of air/fuel mixture (or pure air in GDI/diesel engines).'
      },
      {
        heading: '2. Compression Stroke (Squeeze)',
        content: 'Both intake and exhaust valves close securely. The piston travels upward from BDC to TDC, compressing the trapped fuel-air charge to roughly $1/9$th to $1/12$th of its original volume ($9:1$ to $12:1$ compression ratio). This compression elevates mixture temperature and pressure, maximizing thermodynamic efficiency.'
      },
      {
        heading: '3. Power Stroke (Bang)',
        content: 'Just before the piston reaches TDC ($\approx 10^\circ - 20^\circ$ Before TDC), the spark plug fires an intense high-voltage electrical arc. The fuel-air mixture ignites rapidly, causing thermal expansion. Rapidly expanding combustion gases force the piston violently downward toward BDC, producing rotational torque on the crankshaft.'
      },
      {
        heading: '4. Exhaust Stroke (Blow)',
        content: 'Near BDC, the exhaust valve opens. The piston travels upward from BDC back to TDC, physically sweeping the burned exhaust gases out through the cylinder head exhaust port into the exhaust manifold.'
      }
    ],
    keyFormula: 'Total Cycle Rotation = 720^\\circ \\text{ (2 Full Crankshaft Revolutions Per 1 Power Stroke)}',
    diagramType: 'stroke-cycle'
  },
  {
    id: 'valvetrain-designs',
    title: 'Valvetrain Architectures: OHV vs SOHC vs DOHC',
    category: 'Valvetrain Physics',
    readTime: '8 min read',
    summary: 'Compare overhead valve pushrod designs against single and dual overhead camshaft systems to understand mechanical limits, inertia, and airflow characteristics.',
    sections: [
      {
        heading: 'OHV (Overhead Valve / Pushrod)',
        content: 'Uses a single camshaft mounted low inside the engine block. Long steel pushrods extend upward to actuate rocker arms on the cylinder head. Compact packaging height and high low-end torque, but heavy valvetrain reciprocating mass limits maximum engine RPM.'
      },
      {
        heading: 'SOHC (Single Overhead Camshaft)',
        content: 'Places one camshaft directly on top of each cylinder head bank. Eliminates pushrods entirely, using cam lobes to actuate rocker arms directly. Reduces moving mass, enabling higher RPM limits.'
      },
      {
        heading: 'DOHC (Dual Overhead Camshaft)',
        content: 'Features TWO camshafts per cylinder head (one dedicated for intake valves, one for exhaust valves). Enables 4 valves per cylinder (2 intake, 2 exhaust), dramatically improving high-RPM volumetric airflow efficiency and allowing independent variable valve timing (VVT).'
      }
    ],
    keyFormula: '\\text{Camshaft Speed} = \\frac{1}{2} \\cdot \\text{Crankshaft Speed}',
    diagramType: 'valvetrain'
  },
  {
    id: 'forced-induction',
    title: 'Forced Induction: Turbochargers vs Superchargers',
    category: 'Performance',
    readTime: '7 min read',
    summary: 'Explore how compressors force high-density oxygen into combustion chambers to significantly boost horsepower and volumetric efficiency.',
    sections: [
      {
        heading: 'Turbochargers (Exhaust Gas Driven)',
        content: 'Uses hot waste exhaust gas kinetic energy flowing through a turbine housing to spin a turbine wheel up to $150,000+\\text{ RPM}$. A connected shaft spins a compressor wheel, forcing pressurized air into the intake manifold. Free energy recovery, but introduces "turbo lag" spool time.'
      },
      {
        heading: 'Superchargers (Mechanically Driven)',
        content: 'Mechanically driven directly off the crankshaft via a serpentine belt. Delivers instantaneous positive-displacement boost pressure from idle without lag, but consumes mechanical engine power ("parasitic loss") to spin the compressor.'
      }
    ],
    keyFormula: 'P_{\\text{boost}} = P_{\\text{ambient}} \\cdot (\\text{Pressure Ratio} - 1)',
    diagramType: 'turbo'
  },
  {
    id: 'engine-balancing',
    title: 'Engine Balancing & Vibration Physics',
    category: 'Mechanical Engineering',
    readTime: '10 min read',
    summary: 'Understand primary and secondary inertial forces, counterweight placement, and split journal geometries across Inline, V, Boxer, and Radial layouts.',
    sections: [
      {
        heading: 'Primary vs Secondary Forces',
        content: 'Primary forces occur at engine speed ($1\\times$ RPM) due to piston reciprocating mass acceleration. Secondary forces occur at twice engine speed ($2\\times$ RPM) caused by connecting rod angularity and unequal piston acceleration speeds at TDC vs BDC.'
      },
      {
        heading: 'Crossplane vs Flatplane V8 Crankshafts',
        content: 'Crossplane V8s space crank throws at 90° intervals, perfectly balancing primary and secondary forces for smooth operation, but require heavy counterweights. Flatplane V8s space throws at 180°, allowing lightweight rev-happy designs at the cost of high secondary vibration.'
      }
    ],
    keyFormula: 'F_{\\text{inertia}} = m \\cdot r \\cdot \\omega^2 \\left(\\cos \\theta + \\frac{r}{l} \\cos 2\\theta\\right)',
    diagramType: 'balancing'
  }
];
