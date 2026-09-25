// ============================================================================
// 🌌 ATELIER MATEMÁTICO — EL CANON DE LAS 100 LEYES DEL COSMOS
// Las 100 Ecuaciones, Teoremas y Principios que Definieron la Civilización
// Clasificadas en 5 Épocas Históricas · Curaduría en Silicio Nativo & Timonel F2
// ============================================================================

(function(root) {
  'use strict';

  const ARTWORKS_100 = [
    // ═════════════════════════════════════════════════════════════════════════
    // ÉPOCA I: ANTIGÜEDAD, GEOMETRÍA & MECÁNICA CLÁSICA TEMPRANA (001 – 020)
    // Estrato Celeste: Anillo I (R = 18m, φ ∈ [+0.15, +0.28] rad sobre el horizonte)
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 0, badge: "001", epoch: 1, epochName: "Antigüedad & Geometría", year: "~530 a.C.", author: "Pitágoras de Samos",
      title: "El Teorema de Pitágoras", sub: "La Métrica Fundamental del Espacio Euclídeo", cat: "GEOMETRÍA SAGRADA · ~530 a.C.",
      eq: "a² + b² = c²\n‖x‖² = ⟨x, x⟩", eqShort: "a² + b² = c²", metric: "Métrica Euclídea: g_ij = δ_ij",
      hist: "Pitágoras descubrió que en todo triángulo rectángulo la suma de las áreas de los cuadrados de los catetos es idéntica al área de la hipotenusa, fundando la noción misma de distancia en el cosmos.",
      poem: '"Tres líneas se encuentran en ángulo recto y revelan que la distancia es la raíz cuadrada de la armonía."',
      radius: 18, theta: 0.00, phi: 0.15, archetype: "pythagoras", pal: 0
    },
    {
      id: 1, badge: "002", epoch: 1, epochName: "Antigüedad & Geometría", year: "~250 a.C.", author: "Arquímedes de Siracusa",
      title: "La Ley de la Palanca", sub: "Equilibrio Estático y Momentos de Fuerza", cat: "ESTÁTICA CLÁSICA · ~250 a.C.",
      eq: "F₁ · d₁ = F₂ · d₂\n∑ τ = 0", eqShort: "F₁ · d₁ = F₂ · d₂", metric: "Residuo de Momento: ‖∑ τ‖ = 0.000",
      hist: 'Arquímedes sentenció: "Dadme un punto de apoyo y moveré el mundo". Formuló rigurosamente la ley de los momentos estáticos que rige desde las grúas de los puertos antiguos hasta las articulaciones de la robótica moderna.',
      poem: '"Un brazo largo vence al peso de las montañas si el fulcro descansa en la certeza."',
      radius: 18, theta: 0.31, phi: 0.22, archetype: "lever", pal: 1
    },
    {
      id: 2, badge: "003", epoch: 1, epochName: "Antigüedad & Geometría", year: "~250 a.C.", author: "Arquímedes de Siracusa",
      title: "El Principio de Flotación", sub: "Hidrostática y Empuje Gravitatorio", cat: "MECÁNICA DE FLUIDOS · ~250 a.C.",
      eq: "E = ρ_f · g · V_desp\nF_net = E - P", eqShort: "E = ρ · g · V", metric: "Equilibrio Boyante: E - mg = 0",
      hist: 'Tras sumergirse en los baños de Siracusa y gritar "¡Eureka!", Arquímedes dedujo que todo cuerpo sumergido experimenta un empuje vertical hacia arriba igual al peso del volumen de fluido desalojado.',
      poem: '"El agua reconoce el volumen intruso y lo eleva con la fuerza exacta del espacio que cedió."',
      radius: 18, theta: 0.63, phi: 0.17, archetype: "buoyancy", pal: 2
    },
    {
      id: 3, badge: "004", epoch: 1, epochName: "Antigüedad & Geometría", year: "1202", author: "Leonardo de Pisa (Fibonacci)",
      title: "La Espiral Áurea de Fibonacci", sub: "Filotaxis y Proporción Divina", cat: "MATEMÁTICA MEDIEVAL · 1202",
      eq: "F_{n} = F_{n-1} + F_{n-2}\nlim (F_{n+1}/F_n) = φ = (1+√5)/2 ≈ 1.618033", eqShort: "F_n = F_{n-1} + F_{n-2}", metric: "Convergencia Áurea: |φ_n - φ| < 1e-12",
      hist: "En su Liber Abaci de 1202, Fibonacci introdujo la sucesión donde cada término es la suma de los dos anteriores, desvelando el número áureo que empaqueta las semillas de los girasoles y las espirales de las galaxias.",
      poem: '"El caracol y la flor cuentan con los mismos números sin haber aprendido jamás a sumar."',
      radius: 18, theta: 0.94, phi: 0.26, archetype: "fibonacci", pal: 3
    },
    {
      id: 4, badge: "005", epoch: 1, epochName: "Antigüedad & Geometría", year: "1604", author: "Galileo Galilei",
      title: "La Ley de Caída Libre", sub: "Cinemática Uniformemente Acelerada", cat: "FÍSICA EXPERIMENTAL · 1604",
      eq: "s(t) = ½ g t²\nv² = 2 g s", eqShort: "s = ½ g t²", metric: "Aceleración Local: g = 9.80665 m/s²",
      hist: "Al dejar caer esferas por planos inclinados de madera, Galileo desmintió a Aristóteles: en el vacío, una pluma y una bola de cañón caen con idéntica aceleración sin importar su masa.",
      poem: '"La gravedad no juzga el peso del plomo ni la ligereza del plumón: a todos otorga el mismo compás."',
      radius: 18, theta: 1.26, phi: 0.19, archetype: "gravity_drop", pal: 0
    },
    {
      id: 5, badge: "006", epoch: 1, epochName: "Antigüedad & Geometría", year: "1609", author: "Johannes Kepler",
      title: "Primera Ley de Kepler", sub: "La Elipse Planetaria Cósmica", cat: "MECÁNICA CELESTE · 1609",
      eq: "r(θ) = p / (1 + e · cos θ)\ne = √(1 - b²/a²)", eqShort: "r = p / (1 + e cos θ)", metric: "Excentricidad Orbital: 0 ≤ e < 1",
      hist: "Kepler rompió con dos milenios de círculos aristotélicos: las órbitas planetarias no son círculos perfectos, sino elipses donde el Sol ocupa uno de los focos sagrados.",
      poem: '"El círculo se inclinó hasta volverse elipse para que el Sol descansara en el foco de su soledad."',
      radius: 18, theta: 1.57, phi: 0.25, archetype: "kepler_ellipse", pal: 1
    },
    {
      id: 6, badge: "007", epoch: 1, epochName: "Antigüedad & Geometría", year: "1609", author: "Johannes Kepler",
      title: "Segunda Ley de Kepler", sub: "Ley de las Áreas y Momento Angular", cat: "MECÁNICA CELESTE · 1609",
      eq: "dA/dt = ½ r² θ̇ = L / (2m) = cte", eqShort: "dA/dt = cte", metric: "Momento Angular: dL/dt = 0",
      hist: "El vector que une al Sol con un planeta barre áreas iguales en intervalos de tiempo iguales. Al acercarse al perihelio el planeta acelera, conservando rígidamente su momento angular.",
      poem: '"Un hilo invisible barre el cielo: más rápido cerca del fuego, sereno en el frío del abismo."',
      radius: 18, theta: 1.88, phi: 0.16, archetype: "kepler_area", pal: 2
    },
    {
      id: 7, badge: "008", epoch: 1, epochName: "Antigüedad & Geometría", year: "1619", author: "Johannes Kepler",
      title: "Tercera Ley de Kepler", sub: "La Armonía de los Mundos", cat: "MECÁNICA CELESTE · 1619",
      eq: "T² / a³ = 4π² / (G(M + m)) = k", eqShort: "T² = k · a³", metric: "Constante Kepleriana: k_sol ≈ 2.97e-19 s²/m³",
      hist: 'En "Harmonices Mundi", Kepler conectó el tiempo y el espacio sideral: el cuadrado del período orbital es proporcional al cubo del semieje mayor, tejiendo la sinfonía matemática del sistema solar.',
      poem: '"El año de cada mundo canta la misma nota cuando su tiempo se eleva al cuadrado y su distancia al cubo."',
      radius: 18, theta: 2.20, phi: 0.27, archetype: "kepler_harmonic", pal: 3
    },
    {
      id: 8, badge: "009", epoch: 1, epochName: "Antigüedad & Geometría", year: "1621", author: "Willebrord Snell / René Descartes",
      title: "La Ley de Refracción de Snell", sub: "El Quiebre de la Luz en la Frontera", cat: "ÓPTICA GEOMÉTRICA · 1621",
      eq: "n₁ · sin θ₁ = n₂ · sin θ₂\nv₁ / v₂ = sin θ₁ / sin θ₂", eqShort: "n₁ sin θ₁ = n₂ sin θ₂", metric: "Índice de Refracción: n = c / v ≥ 1",
      hist: "Snell y Descartes descubrieron cómo la luz dobla su trayectoria al pasar del aire al agua o al vidrio, preservando el principio de que los rayos siempre eligen el camino de tiempo mínimo.",
      poem: '"Al tocar el agua, la luz se inclina con reverencia para no perder un solo instante de su viaje."',
      radius: 18, theta: 2.51, phi: 0.18, archetype: "snell_refract", pal: 0
    },
    {
      id: 9, badge: "010", epoch: 1, epochName: "Antigüedad & Geometría", year: "1637", author: "René Descartes",
      title: "Geometría Analítica Cartesiana", sub: "La Unificación de la Forma y el Número", cat: "ÁLGEBRA & GEOMETRÍA · 1637",
      eq: "y = m x + b\nx² + y² = r²\nf(x, y) = 0", eqShort: "f(x, y) = 0", metric: "Espacio Coordenado: ℝ × ℝ",
      hist: "Descartes unió el álgebra con la geometría mediante el plano de coordenadas ortogonales. A partir de 1637, cualquier curva geométrica pudo ser escrita y manipulada como una ecuación algebraica pura.",
      poem: '"Un eje horizontal y otro vertical bastaron para que la geometría pudiera pensarse a sí misma como número."',
      radius: 18, theta: 2.83, phi: 0.24, archetype: "cartesian", pal: 1
    },
    {
      id: 10, badge: "011", epoch: 1, epochName: "Antigüedad & Geometría", year: "1637", author: "Pierre de Fermat / Andrew Wiles",
      title: "El Último Teorema de Fermat", sub: "La Imposibilidad Aritmética de las Potencias", cat: "TEORÍA DE NÚMEROS · 1637 / 1994",
      eq: "aⁿ + bⁿ = cⁿ (a,b,c > 0, n > 2) ⇒ ∅\nModularity Theorem (Wiles)", eqShort: "aⁿ + bⁿ ≠ cⁿ  (n > 2)", metric: "Frontera Aritmética: 0 Soluciones Enteras",
      hist: "Fermat garabateó en el margen de su Diofanto que no cabía su demostración. El acertijo resistió 358 años hasta que Andrew Wiles lo conquistó en 1994 a través de curvas elípticas y formas modulares.",
      poem: '"El cuadrado acoge la suma con agrado, pero el cubo y el infinito cierran la puerta para siempre."',
      radius: 18, theta: 3.14, phi: 0.16, archetype: "fermat_last", pal: 2
    },
    {
      id: 11, badge: "012", epoch: 1, epochName: "Antigüedad & Geometría", year: "1662", author: "Pierre de Fermat",
      title: "Principio de Fermat de Tiempo Mínimo", sub: "La Semilla del Cálculo de Variaciones", cat: "ÓPTICA VARIACIONAL · 1662",
      eq: "δ ∫_{A}^{B} n(s) ds = 0\nt = ∫ dt = mínimo", eqShort: "δ ∫ n ds = 0", metric: "Variación Primera: δS = 0",
      hist: "Fermat demostró que la luz no viaja por la distancia geométrica más corta, sino por la trayectoria que le toma el menor tiempo posible, inaugurando el principio variacional que gobierna toda la física moderna.",
      poem: '"La luz calcula sin pensar y escoge entre infinitos senderos aquel que le exige menos tiempo de vida."',
      radius: 18, theta: 3.45, phi: 0.28, archetype: "fermat_principle", pal: 3
    },
    {
      id: 12, badge: "013", epoch: 1, epochName: "Antigüedad & Geometría", year: "1676", author: "Robert Hooke",
      title: "La Ley de Elasticidad de Hooke", sub: "La Fuerza Restauradora Armónica", cat: "ELASTICIDAD CLÁSICA · 1676",
      eq: "F = -k · x\nU = ½ k x²\nσ = E · ε", eqShort: "F = -k · x", metric: "Linealidad Hookeana: R² > 0.9999",
      hist: 'En 1676 Hooke publicó el anagrama "ceiiinosssttuv" (Ut tensio, sic vis): como es la deformación, así es la fuerza. La base del oscilador armónico simple, la mecánica de sólidos y la ingeniería estructural.',
      poem: '"Tensa la cuerda y resistirá; suéltala y correrá a buscar el reposo con la fuerza exacta del agravio."',
      radius: 18, theta: 3.77, phi: 0.17, archetype: "hooke_spring", pal: 0
    },
    {
      id: 13, badge: "014", epoch: 1, epochName: "Antigüedad & Geometría", year: "1687", author: "Isaac Newton",
      title: "Primera Ley de Newton (Inercia)", sub: "La Persistencia Inquebrantable del Movimiento", cat: "MECÁNICA NEWTONIANA · 1687",
      eq: "∑ F = 0 ⟹ v = cte\ndp/dt = 0", eqShort: "∑ F = 0 ⟹ v = cte", metric: "Conservación de Momentum: Δp = 0",
      hist: "Publicada en los Principia Mathematica de 1687, establece que todo cuerpo preserva su estado de reposo o movimiento rectilíneo uniforme a menos que fuerzas externas lo obliguen a cambiar.",
      poem: '"El reposo y el vuelo recto son hermanos gemelos: solo el choque del mundo los despierta."',
      radius: 18, theta: 4.08, phi: 0.23, archetype: "newton_inertia", pal: 1
    },
    {
      id: 14, badge: "015", epoch: 1, epochName: "Antigüedad & Geometría", year: "1687", author: "Isaac Newton",
      title: "Segunda Ley de Newton (F = ma)", sub: "El Motor Dinámico del Universo Mecánico", cat: "MECÁNICA NEWTONIANA · 1687",
      eq: "F = dp/dt = m · a\na = d²x / dt²", eqShort: "F = m · a", metric: "Fuerza Neta: F - ma = 0",
      hist: "La ley más célebre de la historia de la física. Vincula directamente la causa (fuerza) con el efecto cinemático (aceleración), gobernando desde las órbitas lunares hasta el diseño de cohetes interplanetarios.",
      poem: '"La masa resiste el empuje, pero cede al cambio: cada gramo de materia cobra su tributo en aceleración."',
      radius: 18, theta: 4.40, phi: 0.15, archetype: "newton_fma", pal: 2
    },
    {
      id: 15, badge: "016", epoch: 1, epochName: "Antigüedad & Geometría", year: "1687", author: "Isaac Newton",
      title: "Tercera Ley de Newton (Acción y Reacción)", sub: "La Simetría Fundamental de las Fuerzas", cat: "MECÁNICA NEWTONIANA · 1687",
      eq: "F₁₂ = -F₂₁\nF₁₂ + F₂₁ = 0", eqShort: "F₁₂ = -F₂₁", metric: "Simetría de Interacción: ‖F₁₂ + F₂₁‖ = 0",
      hist: "Toda fuerza en el universo nace de a pares. No existe el empuje solitario: si pisas la Tierra, la Tierra te empuja hacia arriba con idéntica magnitud. Es el fundamento del vuelo a reacción.",
      poem: '"Nadie empuja al cosmos sin ser empujado con igual furia y en sentido exactamente contrario."',
      radius: 18, theta: 4.71, phi: 0.25, archetype: "newton_reaction", pal: 3
    },
    {
      id: 16, badge: "017", epoch: 1, epochName: "Antigüedad & Geometría", year: "1687", author: "Isaac Newton",
      title: "Ley de Gravitación Universal", sub: "La Atracción Invisible que Sujeta los Astros", cat: "GRAVITACIÓN CLÁSICA · 1687",
      eq: "F = G · (m₁ · m₂) / r²\nG ≈ 6.67430 × 10⁻¹¹ N·m²/kg²", eqShort: "F = G (m₁ m₂) / r²", metric: "Invariante Gravitatorio: G = cte",
      hist: "Newton unificó la caída de la manzana con la órbita de la Luna en una sola ecuación universal: toda partícula de materia atrae a cualquier otra con fuerza proporcional al producto de sus masas e inverso al cuadrado de su distancia.",
      poem: '"La misma cuerda invisible que hace caer la manzana madura al suelo sujeta a la Luna en su vals perpetuo."',
      radius: 18, theta: 5.03, phi: 0.19, archetype: "gravitation_universal", pal: 0
    },
    {
      id: 17, badge: "018", epoch: 1, epochName: "Antigüedad & Geometría", year: "1701", author: "Isaac Newton",
      title: "Ley de Enfriamiento de Newton", sub: "La Disipación Térmica Convectiva", cat: "TERMODINÁMICA TEMPRANA · 1701",
      eq: "dT/dt = -k · (T - T_env)\nT(t) = T_env + (T₀ - T_env) e^{-kt}", eqShort: "dT/dt = -k(T - T_env)", metric: "Decaimiento Exponencial: T(t) → T_env",
      hist: "Newton formuló que la velocidad de pérdida de calor de un cuerpo caliente es directamente proporcional a la diferencia de temperatura entre el cuerpo y el medio circundante.",
      poem: '"El fuego cede su calor al aire circundante con una prisa que se vuelve melancólica al enfriarse."',
      radius: 18, theta: 5.34, phi: 0.27, archetype: "thermal_cooling", pal: 1
    },
    {
      id: 18, badge: "019", epoch: 1, epochName: "Antigüedad & Geometría", year: "1675", author: "Isaac Newton / Gottfried Leibniz",
      title: "El Teorema Fundamental del Cálculo", sub: "El Vínculo Inverso entre Derivada e Integral", cat: "ANÁLISIS MATEMÁTICO · 1675",
      eq: "d/dx [ ∫_{a}^{x} f(t) dt ] = f(x)\n∫_{a}^{b} f'(x) dx = f(b) - f(a)", eqShort: "∫_{a}^{b} f'(x) dx = f(b) - f(a)", metric: "Error de Cuadratura: ‖I_exact - I_num‖ → 0",
      hist: "Descubierto de forma independiente por Newton y Leibniz, demostró que la diferenciación (pendientes instantáneas) y la integración (acumulación de áreas) son operaciones recíprocas perfectas.",
      poem: '"El cambio acumulado paso a paso no es más que la resta entre el destino final y el punto de partida."',
      radius: 18, theta: 5.65, phi: 0.16, archetype: "calculus_fundamental", pal: 2
    },
    {
      id: 19, badge: "020", epoch: 1, epochName: "Antigüedad & Geometría", year: "1752", author: "Leonhard Euler",
      title: "Característica Polihédrica de Euler", sub: "El Nacimiento de la Topología", cat: "TOPOLOGÍA DISCRETA · 1752",
      eq: "V - E + F = 2\nχ(M) = 2 - 2g", eqShort: "V - E + F = 2", metric: "Invariante Topológico: χ = 2",
      hist: "Euler descubrió que en cualquier poliedro convexo cerrado, el número de vértices menos el de aristas más el de caras siempre suma exactamente dos. Un invariante topológico inmune a cualquier deformación continua.",
      poem: '"Dobla el cuerpo, estira sus caras: mientras no abras una herida en la piedra, la suma siempre dará dos."',
      radius: 18, theta: 5.97, phi: 0.24, archetype: "euler_polyhedra", pal: 3
    },

    // ═════════════════════════════════════════════════════════════════════════
    // ÉPOCA II: LA ILUSTRACIÓN, ONDAS & MECÁNICA ANALÍTICA (021 – 040)
    // Estrato Celeste: Anillo II (R = 24m, φ ∈ [+0.32, +0.48] rad)
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 20, badge: "021", epoch: 2, epochName: "Ilustración & Ondas", year: "1748", author: "Leonhard Euler",
      title: "La Identidad Sagrada de Euler", sub: "La Ecuación Más Bella de la Matemática", cat: "ANÁLISIS COMPLEJO · 1748",
      eq: "e^{iπ} + 1 = 0\ne^{iθ} = cos θ + i sin θ", eqShort: "e^{iπ} + 1 = 0", metric: "Residuo Trascendental: |e^{iπ} + 1| = 0.000000",
      hist: "Elegida unánimemente por matemáticos y físicos como la ecuación más hermosa jamás escrita: reúne en una sola línea los cinco números fundamentales del cosmos: 0, 1, e, π e i.",
      poem: '"Cinco constantes que nacieron en reinos extraños se abrazan en silencio para igualar la nada."',
      radius: 24, theta: 0.16, phi: 0.34, archetype: "euler_identity", pal: 0
    },
    {
      id: 21, badge: "022", epoch: 2, epochName: "Ilustración & Ondas", year: "1738", author: "Daniel Bernoulli",
      title: "La Ecuación de Bernoulli", sub: "Conservación de Energía Hidrodinámica", cat: "MECÁNICA DE FLUIDOS · 1738",
      eq: "p + ½ ρ v² + ρ g h = cte\nΔp = -½ ρ Δ(v²)", eqShort: "p + ½ ρ v² = cte", metric: "Conservación de Presión Total: ΔP = 0",
      hist: "Bernoulli descubrió que cuando la velocidad de un fluido aumenta, su presión estática disminuye proporcionalmente. Es la ecuación que explica por qué los aviones se elevan en el aire.",
      poem: '"El aire apresurado aligera su carga: al correr sobre el ala, la presión cede y el gigante despega."',
      radius: 24, theta: 0.47, phi: 0.42, archetype: "bernoulli_fluid", pal: 1
    },
    {
      id: 22, badge: "023", epoch: 2, epochName: "Ilustración & Ondas", year: "1747", author: "Jean le Rond d'Alembert",
      title: "Ecuación de Onda Unidimensional", sub: "La Propagación de las Ondas Clásicas", cat: "FÍSICA ONDULATORIA · 1747",
      eq: "∂²u/∂t² = c² · ∂²u/∂x²\nu(x,t) = f(x - ct) + g(x + ct)", eqShort: "∂²u/∂t² = c² ∂²u/∂x²", metric: "Velocidad de Fase: c = √(T / μ)",
      hist: "D'Alembert modeló matemáticamente la vibración de una cuerda tensa de violín y descubrió la ecuación diferencial parcial que describe el sonido, las ondas sísmicas y la luz.",
      poem: '"Una perturbación que avanza hacia el futuro se cruza con su reflejo sin herirse jamás."',
      radius: 24, theta: 0.79, phi: 0.38, archetype: "wave_dalembert", pal: 2
    },
    {
      id: 23, badge: "024", epoch: 2, epochName: "Ilustración & Ondas", year: "1788", author: "Joseph-Louis Lagrange",
      title: "Ecuaciones de Euler-Lagrange", sub: "El Principio de Mínima Acción", cat: "MECÁNICA ANALÍTICA · 1788",
      eq: "d/dt (∂L/∂q̇_i) - ∂L/∂q_i = 0\nL = T - V\nδS = δ ∫ L dt = 0", eqShort: "d/dt(∂L/∂q̇) - ∂L/∂q = 0", metric: "Acción Estacionaria: δS = 0",
      hist: "Lagrange reformuló toda la física sin dibujar un solo diagrama geométrico: la trayectoria real de cualquier sistema físico es aquella que hace estacionaria la acción S.",
      poem: '"La naturaleza es sobria y elegante: entre todos los caminos posibles, elige siempre el que menos cuesta."',
      radius: 24, theta: 1.10, phi: 0.46, archetype: "euler_lagrange", pal: 3
    },
    {
      id: 24, badge: "025", epoch: 2, epochName: "Ilustración & Ondas", year: "1750", author: "Leonhard Euler / Daniel Bernoulli",
      title: "Ecuación de Vigas de Euler-Bernoulli", sub: "La Resistencia Estructural de la Materia", cat: "INGENIERÍA ESTRUCTURAL · 1750",
      eq: "EI · d⁴w/dx⁴ = q(x)\nM(x) = -EI · d²w/dx²", eqShort: "EI · d⁴w/dx⁴ = q(x)", metric: "Flexión Elástica: σ_max ≤ σ_adm",
      hist: "La ecuación pilar de la ingeniería civil y mecánica. Permitió calcular por primera vez la deflexión y esfuerzos internos en vigas de acero y hormigón, haciendo posibles puentes y rascacielos.",
      poem: '"El acero se curva bajo el peso de la torre, pero la matemática le dice exactamente cuánto puede ceder sin quebrarse."',
      radius: 24, theta: 1.41, phi: 0.35, archetype: "euler_beam", pal: 0
    },
    {
      id: 25, badge: "026", epoch: 2, epochName: "Ilustración & Ondas", year: "1785", author: "Charles-Augustin de Coulomb",
      title: "Ley Electrostática de Coulomb", sub: "La Atracción y Repulsión de las Cargas", cat: "ELECTROSTÁTICA · 1785",
      eq: "F = (1 / 4πε₀) · (q₁ q₂) / r²\nE = q / (4πε₀ r²)", eqShort: "F = k_e (q₁ q₂) / r²", metric: "Permitividad de Vacío: ε₀ ≈ 8.854e-12 F/m",
      hist: "Usando una balanza de torsión de precisión milimétrica, Coulomb demostró que la fuerza entre dos cargas eléctricas decrece con el cuadrado de la distancia, análogo a la gravedad de Newton.",
      poem: '"Cargas opuestas se buscan con fervor cósmico; cargas iguales se repelen con la misma obstinación."',
      radius: 24, theta: 1.73, phi: 0.44, archetype: "coulomb_force", pal: 1
    },
    {
      id: 26, badge: "027", epoch: 2, epochName: "Ilustración & Ondas", year: "1787", author: "Ernst Chladni",
      title: "Los Cantos de Chladni", sub: "Morfología Nodal Cimática", cat: "CIMÁTICA ACÚSTICA · 1787",
      eq: "w(x,y) = sin(nπx)sin(mπy) - sin(mπx)sin(nπy) = 0\n∇²w + k²w = 0", eqShort: "w(x,y) = 0  (Líneas Nodales)", metric: "Residuo de Helmholtz: ‖(∇²+k²)w‖ ≤ 1e-5",
      hist: "Chladni pasó un arco de violín por el borde de placas metálicas cubiertas de arena fina y reveló los mandalas sagrados del sonido: la arena huye de las zonas vibrantes hacia los nodos de quietud.",
      poem: '"El sonido canta y la arena baila hasta encontrar el reposo en las líneas exactas del silencio."',
      radius: 24, theta: 2.04, phi: 0.33, archetype: "chladni", pal: 2
    },
    {
      id: 27, badge: "028", epoch: 2, epochName: "Ilustración & Ondas", year: "1834", author: "Émile Clapeyron",
      title: "Ley de los Gases Ideales", sub: "La Termodinámica Clásica de la Presión", cat: "TERMODINÁMICA · 1834",
      eq: "P · V = n · R · T\nR ≈ 8.31446 J/(mol·K)", eqShort: "P · V = n · R · T", metric: "Constante Universal de los Gases: R",
      hist: "Clapeyron unificó las leyes empíricas de Boyle, Charles, Gay-Lussac y Avogadro en una sola ecuación de estado que rige el comportamiento macroscópico de los gases térmicos.",
      poem: '"Presión, volumen y calor: tres hilos que la materia invisible anuda en un equilibrio incorruptible."',
      radius: 24, theta: 2.36, phi: 0.47, archetype: "ideal_gas", pal: 3
    },
    {
      id: 28, badge: "029", epoch: 2, epochName: "Ilustración & Ondas", year: "1789", author: "Pierre-Simon Laplace",
      title: "La Ecuación de Laplace", sub: "El Potencial Armónico y la Suavidad Pura", cat: "TEORÍA DEL POTENCIAL · 1789",
      eq: "∇²ϕ = ∂²ϕ/∂x² + ∂²ϕ/∂y² + ∂²ϕ/∂z² = 0\nΔϕ = 0", eqShort: "∇²ϕ = 0", metric: "Propiedad del Valor Medio: ϕ(x₀) = ⟨ϕ⟩_S",
      hist: "Laplace descubrió la ecuación diferencial parcial que describe campos gravitatorios, electrostáticos y térmicos en el vacío. Sus soluciones son las funciones armónicas, las más suaves de las matemáticas.",
      poem: '"En el vacío sereno, el valor de cada punto es el promedio exacto de todos sus vecinos."',
      radius: 24, theta: 2.67, phi: 0.36, archetype: "laplace_harmonic", pal: 0
    },
    {
      id: 29, badge: "030", epoch: 2, epochName: "Ilustración & Ondas", year: "1813", author: "Siméon Denis Poisson",
      title: "La Ecuación de Poisson", sub: "La Respuesta del Espacio a la Presencia de Materia", cat: "FÍSICA MATEMÁTICA · 1813",
      eq: "∇²ϕ = -ρ / ε₀\n∇²ϕ = 4π G ρ", eqShort: "∇²ϕ = -ρ / ε₀", metric: "Residuo de Fuente: ‖∇²ϕ + ρ/ε₀‖ ≤ 1e-6",
      hist: "Poisson extendió la ecuación de Laplace a regiones donde sí existe materia o carga eléctrica distribuida, sentando las bases teóricas de la electrostática y la gravitación newtoniana continua.",
      poem: '"Donde nace una masa o una carga, el espacio responde curvando su potencial en torno a ella."',
      radius: 24, theta: 2.98, phi: 0.45, archetype: "poisson_potential", pal: 1
    },
    {
      id: 30, badge: "031", epoch: 2, epochName: "Ilustración & Ondas", year: "1822", author: "Joseph Fourier",
      title: "La Serie y Transformada de Fourier", sub: "La Descomposición Armónica de la Realidad", cat: "ANÁLISIS ESPECTRAL · 1822",
      eq: "f(t) = ∫_{-∞}^{∞} F(ω) e^{iωt} dω\nF(ω) = 1/(2π) ∫ f(t) e^{-iωt} dt", eqShort: "F(ω) = ∫ f(t) e^{-iωt} dt", metric: "Teorema de Parseval: ∫|f|² = 1/(2π)∫|F|²",
      hist: 'Fourier proclamó en su "Théorie analytique de la chaleur" que cualquier señal continua o discontinua puede descomponerse en una suma infinita de senos y cosenos elementales, fundando el procesamiento de señales.',
      poem: '"Cualquier melodía del mundo, por intrincada que parezca, no es más que una suma de notas puras."',
      radius: 24, theta: 3.30, phi: 0.32, archetype: "fourier_spectral", pal: 2
    },
    {
      id: 31, badge: "032", epoch: 2, epochName: "Ilustración & Ondas", year: "1822", author: "Joseph Fourier",
      title: "La Ecuación de Difusión del Calor", sub: "La Homogeneización Entrópica Térmica", cat: "TERMODINÁMICA CONTINUA · 1822",
      eq: "∂u/∂t = α · ∇²u\nq = -k · ∇u", eqShort: "∂u/∂t = α ∇²u", metric: "Difusividad Térmica: α = k / (ρ c_p)",
      hist: "Modeló cómo el calor fluye de las regiones calientes a las frías a través de sólidos. La misma ecuación gobierna la difusión molecular, la dispersión de contaminantes y el alisamiento browniano.",
      poem: '"Las diferencias se apagan con el tiempo: el calor busca el frío hasta que la tibieza reina en el universo."',
      radius: 24, theta: 3.61, phi: 0.48, archetype: "fourier_heat", pal: 3
    },
    {
      id: 32, badge: "033", epoch: 2, epochName: "Ilustración & Ondas", year: "1824", author: "Sadi Carnot",
      title: "El Teorema de Carnot", sub: "El Límite Máximo de la Eficiencia Térmica", cat: "TERMODINÁMICA · 1824",
      eq: "η_Carnot = 1 - (T_C / T_H)\nW_max = Q_H · (1 - T_C / T_H)", eqShort: "η_max = 1 - T_C / T_H", metric: "Eficiencia Reversible: η ≤ η_Carnot",
      hist: "Con solo 28 años, Sadi Carnot demostró que ninguna máquina térmica puede ser más eficiente que un ciclo reversible ideal operando entre dos fuentes de temperatura, fijando el límite superior de la Revolución Industrial.",
      poem: '"Ni el fuego más voraz puede convertir todo su calor en trabajo: la naturaleza siempre exige su diezmo frío."',
      radius: 24, theta: 3.93, phi: 0.37, archetype: "carnot_cycle", pal: 0
    },
    {
      id: 33, badge: "034", epoch: 2, epochName: "Ilustración & Ondas", year: "1827", author: "Georg Simon Ohm",
      title: "La Ley de Conducción de Ohm", sub: "La Resistencia Lineal al Paso de Electrones", cat: "ELECTRODINÁMICA · 1827",
      eq: "V = I · R\nJ = σ · E\nP = I² · R", eqShort: "V = I · R", metric: "Conductividad: σ = n q² τ / m",
      hist: "Ohm descubrió la relación lineal directa entre la diferencia de potencial aplicada a un conductor y la corriente resultante. Inicialmente rechazada por la academia alemana, se convirtió en la base de la electrotecnia.",
      poem: '"El voltaje empuja con firmeza y la corriente avanza, pagando en calor el roce con los átomos."',
      radius: 24, theta: 4.24, phi: 0.43, archetype: "ohm_conduction", pal: 1
    },
    {
      id: 34, badge: "035", epoch: 2, epochName: "Ilustración & Ondas", year: "1831", author: "Michael Faraday",
      title: "Ley de Inducción de Faraday", sub: "El Nacimiento de la Electricidad Dinámica", cat: "ELECTROMAGNETISMO · 1831",
      eq: "ℰ = -dΦ_B / dt\n∮ E · dl = -d/dt ∬ B · dA", eqShort: "ℰ = -dΦ_B / dt", metric: "Flujo Magnético: Φ_B = ∬ B · dA",
      hist: "Faraday descubrió que un imán en movimiento genera electricidad en una bobina de alambre. Esta ecuación simple encendió el mundo moderno, permitiendo la invención de los generadores y motores eléctricos.",
      poem: '"Mueve un imán en la penumbra y un río de luz correrá silencioso por el cobre."',
      radius: 24, theta: 4.56, phi: 0.34, archetype: "faraday_induction", pal: 2
    },
    {
      id: 35, badge: "036", epoch: 2, epochName: "Ilustración & Ondas", year: "1834", author: "John Scott Russell / Korteweg & de Vries",
      title: "El Solitón Hidrodinámico de Russell (KdV)", sub: "La Onda Solitaria que No Muere", cat: "ONDAS NO LINEALES · 1834",
      eq: "∂u/∂t + u · ∂u/∂x + δ² · ∂³u/∂x³ = 0\nu(x,t) = 2κ² · sech²(κ(x - 4κ² t))", eqShort: "∂u/∂t + u ∂u/∂x + δ² ∂³u/∂x³ = 0", metric: "Invariante de Masa KdV: I₁ = ∫ u dx = cte",
      hist: "En 1834 en el canal de Edimburgo, Russell persiguió a caballo una ola de agua de 9 metros de largo que avanzaba durante kilómetros sin deformarse ni perder altura, descubriendo los solitones.",
      poem: '"Una ola solitaria cabalga por el canal sin romperse jamás: la no-linealidad y la dispersión se perdonan mutuamente."',
      radius: 24, theta: 4.87, phi: 0.46, archetype: "kdv_soliton", pal: 3
    },
    {
      id: 36, badge: "037", epoch: 2, epochName: "Ilustración & Ondas", year: "1833", author: "William Rowan Hamilton",
      title: "Mecánica Canónica de Hamilton", sub: "El Espacio de Fases Simpléctico", cat: "MECÁNICA CLÁSICA · 1833",
      eq: "q̇ = ∂H/∂p\nṗ = -∂H/∂q\nH(q, p) = T(p) + V(q)", eqShort: "q̇ = ∂H/∂p,  ṗ = -∂H/∂q", metric: "Volumen de Fase (Liouville): dΩ/dt = 0",
      hist: "Hamilton reformuló la mecánica sustituyendo velocidades por momentos en un espacio geométrico de 2n dimensiones (espacio de fases). Esta estructura simpléctica fue el puente directo hacia la mecánica cuántica.",
      poem: '"Posición y momento se persiguen en el espacio de fases como amantes que giran sin tocarse jamás."',
      radius: 24, theta: 5.18, phi: 0.35, archetype: "hamilton_phase", pal: 0
    },
    {
      id: 37, badge: "038", epoch: 2, epochName: "Ilustración & Ondas", year: "1843", author: "William Rowan Hamilton",
      title: "Álgebra de Cuaterniones de Hamilton", sub: "La Rotación Pura en Cuatro Dimensiones", cat: "ÁLGEBRA HIPERCOMPLEJA · 1843",
      eq: "i² = j² = k² = i j k = -1\nq = w + x i + y j + z k", eqShort: "i² = j² = k² = ijk = -1", metric: "Norma Cuaterniónica: |q|² = w²+x²+y²+z²",
      hist: 'Paseando por el puente Brougham en Dublín, Hamilton grabó con su navaja en la piedra la fórmula que extiende los números complejos a 4D, permitiendo rotaciones en 3D libres del bloqueo de cardán ("gimbal lock").',
      poem: '"Tres unidades imaginarias que se niegan a conmutar para hacer girar el espacio sin tropezar."',
      radius: 24, theta: 5.50, phi: 0.41, archetype: "quaternion", pal: 1
    },
    {
      id: 38, badge: "039", epoch: 2, epochName: "Ilustración & Ondas", year: "1842", author: "Christian Doppler",
      title: "El Efecto Doppler", sub: "El Desplazamiento Frecuencial del Movimiento", cat: "ONDAS & RELATIVIDAD · 1842",
      eq: "f = f₀ · (v ± v_r) / (v ∓ v_s)\nz = Δλ / λ₀ = v / c", eqShort: "f = f₀ (v ± v_r) / (v ∓ v_s)", metric: "Desplazamiento al Rojo: 1 + z = a_now / a_then",
      hist: "Doppler explicó por qué el silbato de un tren suena más agudo cuando se acerca y más grave cuando se aleja. Décadas después, Hubble usó este efecto en la luz para descubrir la expansión del universo.",
      poem: '"La velocidad aprieta las ondas hacia el azul cuando el viajero se acerca, y las estira hacia el rojo cuando se marcha."',
      radius: 24, theta: 5.81, phi: 0.45, archetype: "doppler", pal: 2
    },
    {
      id: 39, badge: "040", epoch: 2, epochName: "Ilustración & Ondas", year: "1845", author: "Claude Navier & George Stokes",
      title: "Vórtices de Navier-Stokes", sub: "Turbulencia, Singularidad y Dinámica de Fluidos", cat: "PROBLEMA DEL MILENIO · 1845",
      eq: "ρ(∂u/∂t + (u·∇)u) = -∇p + μ∇²u + f\n∇·u = 0", eqShort: "ρ(∂u/∂t + u·∇u) = -∇p + μ∇²u", metric: "Enstrofía: Ω = ½ ∫ |ω|² dV < ∞",
      hist: "Las ecuaciones que gobiernan el flujo de fluidos incompresibles: desde las olas del mar hasta el aire sobre un ala de avión. El Clay Mathematics Institute ofrece $1.000.000 USD a quien demuestre si sus soluciones siempre permanecen suaves o pueden desarrollar singularidades infinitas.",
      poem: '"Tubos de remolinos microscópicos trenzándose como músculos de luz en el corazón de la tormenta."',
      radius: 24, theta: 6.13, phi: 0.38, archetype: "navier_stokes", pal: 3
    },

    // ═════════════════════════════════════════════════════════════════════════
    // ÉPOCA III: TERMODINÁMICA & ELECTROMAGNETISMO (041 – 060)
    // Estrato Celeste: Anillo III (R = 30m, φ ∈ [+0.52, +0.70] rad)
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 40, badge: "041", epoch: 3, epochName: "Termodinámica & Luz", year: "1865", author: "James Clerk Maxwell",
      title: "Primera Ecuación de Maxwell (Gauss Eléctrica)", sub: "Las Fuentes Escalares del Campo Eléctrico", cat: "ELECTROMAGNETISMO · 1865",
      eq: "∇ · E = ρ / ε₀\n∯ E · dA = Q_enc / ε₀", eqShort: "∇ · E = ρ / ε₀", metric: "Conservación de Carga: ∇·J + ∂ρ/∂t = 0",
      hist: "Maxwell demostró que las líneas de campo eléctrico nacen en las cargas positivas y mueren en las cargas negativas. La divergencia del campo es proporcional a la densidad local de carga.",
      poem: '"La carga eléctrica emana sus líneas invisibles al espacio como un manantial que alimenta el vacío."',
      radius: 30, theta: 0.00, phi: 0.54, archetype: "maxwell_gauss_e", pal: 0
    },
    {
      id: 41, badge: "042", epoch: 3, epochName: "Termodinámica & Luz", year: "1865", author: "James Clerk Maxwell",
      title: "Segunda Ecuación de Maxwell (Gauss Magnética)", sub: "La Inexistencia de Monopolos Magnéticos", cat: "ELECTROMAGNETISMO · 1865",
      eq: "∇ · B = 0\n∯ B · dA = 0", eqShort: "∇ · B = 0", metric: "Ausencia de Monopolos: ∮ B·dA = 0",
      hist: "Las líneas de campo magnético no tienen principio ni final: siempre se cierran sobre sí mismas. Si partes un imán por la mitad, obtienes dos imanes completos con norte y sur, jamás un monopolo solitario.",
      poem: '"El magnetismo desconoce el principio y el fin: sus lazos son bucles infinitos que jamás nacen ni mueren."',
      radius: 30, theta: 0.31, phi: 0.62, archetype: "maxwell_gauss_b", pal: 1
    },
    {
      id: 42, badge: "043", epoch: 3, epochName: "Termodinámica & Luz", year: "1865", author: "James Clerk Maxwell",
      title: "Tercera Ecuación de Maxwell (Faraday-Maxwell)", sub: "La Creación de Electricidad por Magnetismo Dinámico", cat: "ELECTROMAGNETISMO · 1865",
      eq: "∇ × E = -∂B/∂t\n∮ E · dl = -d/dt ∬ B · dA", eqShort: "∇ × E = -∂B/∂t", metric: "Inducción Rotacional: ∇×E + ∂B/∂t = 0",
      hist: "Un campo magnético que varía en el tiempo enrolla en torno a sí un campo eléctrico. Esta torsión mutua es el primer engranaje de la propagación de la radiación electromagnética.",
      poem: '"Cuando el imán palpita en el tiempo, el campo eléctrico se enrolla a su alrededor en una espiral viva."',
      radius: 30, theta: 0.63, phi: 0.55, archetype: "maxwell_faraday", pal: 2
    },
    {
      id: 43, badge: "044", epoch: 3, epochName: "Termodinámica & Luz", year: "1865", author: "James Clerk Maxwell",
      title: "Cuarta Ecuación de Maxwell (Ampère-Maxwell)", sub: "La Corriente de Desplazamiento que Cerró la Física", cat: "ELECTROMAGNETISMO · 1865",
      eq: "∇ × B = μ₀ J + μ₀ ε₀ ∂E/∂t\n∮ B · dl = μ₀ I + μ₀ ε₀ dΦ_E/dt", eqShort: "∇ × B = μ₀ J + μ₀ ε₀ ∂E/∂t", metric: "Corriente de Desplazamiento: J_D = ε₀ ∂E/∂t",
      hist: "El golpe de genio cumbre de Maxwell: añadió el término de corriente de desplazamiento ∂E/∂t por pura simetría matemática. Ese término reveló de inmediato que la luz es una onda electromagnética.",
      poem: '"Un soplo de electricidad que cambia engendra magnetismo; el magnetismo despierta a la electricidad: la luz ha nacido."',
      radius: 30, theta: 0.94, phi: 0.68, archetype: "maxwell_ampere", pal: 3
    },
    {
      id: 44, badge: "045", epoch: 3, epochName: "Termodinámica & Luz", year: "1865", author: "James Clerk Maxwell",
      title: "La Velocidad de la Luz en el Vacío", sub: "La Constante Universal Cósmica", cat: "ELECTRODINÁMICA · 1865",
      eq: "c = 1 / √(ε₀ · μ₀) ≈ 299,792,458 m/s\n∇²E - (1/c²) ∂²E/∂t² = 0", eqShort: "c = 1 / √(ε₀ μ₀)", metric: "Velocidad de la Luz: c = 299792458 m/s (Exacto)",
      hist: 'Al combinar las constantes de la electricidad (ε₀) y el magnetismo (μ₀), Maxwell calculó una velocidad de 310.740 km/s y exclamó: "Apenas podemos evitar la conclusión de que la luz consiste en las ondulaciones transversales del mismo medio".',
      poem: '"Trescientas mil leguas en un solo latido: la luz viaja tejiendo el espacio con la aguja de la electricidad y el hilo del magnetismo."',
      radius: 30, theta: 1.26, phi: 0.58, archetype: "light_speed", pal: 0
    },
    {
      id: 45, badge: "046", epoch: 3, epochName: "Termodinámica & Luz", year: "1895", author: "Hendrik Lorentz",
      title: "La Fuerza Electromagnética de Lorentz", sub: "La Trayectoria Helicoidal de las Cargas", cat: "ELECTRODINÁMICA CLÁSICA · 1895",
      eq: "F = q · (E + v × B)\nr_c = m v_⊥ / (q B)", eqShort: "F = q(E + v × B)", metric: "Radio de Giro (Larmor): r_L = p_⊥ / (q B)",
      hist: "Lorentz completó la electrodinámica clásica especificando cómo el campo electromagnético combinado acelera una partícula cargada, haciéndola girar en trayectorias helicoidales en campos magnéticos.",
      poem: '"La carga eléctrica no puede avanzar en línea recta cuando un imán la mira: gira en hélices cautivas de luz."',
      radius: 30, theta: 1.57, phi: 0.65, archetype: "lorentz_force", pal: 1
    },
    {
      id: 46, badge: "047", epoch: 3, epochName: "Termodinámica & Luz", year: "1850", author: "Rudolf Clausius",
      title: "Primera Ley de la Termodinámica", sub: "La Conservación Universal de la Energía", cat: "TERMODINÁMICA · 1850",
      eq: "dU = δQ - δW\n∮ dU = 0", eqShort: "dU = δQ - δW", metric: "Invariante Energético: ∮ dU = 0",
      hist: 'Clausius formuló el principio de conservación de energía en sistemas térmicos: "La energía del universo es constante". El calor y el trabajo son dos monedas de la misma energía interna indestructible.',
      poem: '"La energía no se crea de la nada ni muere en el olvido: solo muda de ropaje entre el calor del fuego y el empuje del trabajo."',
      radius: 30, theta: 1.88, phi: 0.53, archetype: "first_law_thermo", pal: 2
    },
    {
      id: 47, badge: "048", epoch: 3, epochName: "Termodinámica & Luz", year: "1865", author: "Rudolf Clausius",
      title: "Segunda Ley de la Termodinámica (Entropía)", sub: "La Flecha Irreversible del Tiempo", cat: "TERMODINÁMICA · 1865",
      eq: "dS ≥ δQ / T\nΔS_universo ≥ 0", eqShort: "ΔS ≥ 0", metric: "Flecha del Tiempo: dS/dt ≥ 0",
      hist: 'Clausius inventó el término "entropía" del griego trope (transformación). Formuló que en cualquier proceso espontáneo la entropía total del universo aumenta inexorablemente, definiendo la dirección hacia el futuro.',
      poem: '"Una copa que cae al suelo se rompe en mil pedazos; mil pedazos jamás se alzan solos para volver a ser copa."',
      radius: 30, theta: 2.20, phi: 0.69, archetype: "second_law_entropy", pal: 3
    },
    {
      id: 48, badge: "049", epoch: 3, epochName: "Termodinámica & Luz", year: "1877", author: "Ludwig Boltzmann",
      title: "La Entropía Estadística de Boltzmann", sub: "El Puente Microscópico entre Desorden y Probabilidad", cat: "MECÁNICA ESTADÍSTICA · 1877",
      eq: "S = k_B · ln W\nk_B ≈ 1.380649 × 10⁻²³ J/K", eqShort: "S = k_B · ln W", metric: "Constante de Boltzmann: k_B",
      hist: "Grabada en su lápida en Viena, conecta la entropía macroscópica (S) con el número de microestados microscópicos compatibles (W). Explicó por primera vez la termodinámica como probabilidad pura de átomos en colisión.",
      poem: '"El orden es un milagro escaso; el desorden, una marea insaciable de millones de combinaciones posibles."',
      radius: 30, theta: 2.51, phi: 0.56, archetype: "boltzmann_entropy", pal: 0
    },
    {
      id: 49, badge: "050", epoch: 3, epochName: "Termodinámica & Luz", year: "1871", author: "James Clerk Maxwell & Ludwig Boltzmann",
      title: "Distribución de Maxwell-Boltzmann", sub: "La Campana de Velocidades Moleculares", cat: "MECÁNICA ESTADÍSTICA · 1871",
      eq: "f(v) = 4π (m / 2π k_B T)^{3/2} · v² · e^{-m v² / 2 k_B T}", eqShort: "f(v) ∝ v² e^{-m v² / 2k_B T}", metric: "Velocidad Más Probable: v_p = √(2 k_B T / m)",
      hist: "Describe cómo se distribuyen las velocidades de millones de partículas en un gas térmico en equilibrio. Algunas van lentas, pocas alcanzan velocidades enormes, y la gran mayoría danza en la cúspide de la campana.",
      poem: '"En un suspiro de aire caliente hay trillones de danzarines: la mayoría gira en cadencia serena, unos pocos vuelan como cometas."',
      radius: 30, theta: 2.83, phi: 0.64, archetype: "maxwell_boltzmann_dist", pal: 1
    },
    {
      id: 50, badge: "051", epoch: 3, epochName: "Termodinámica & Luz", year: "1859", author: "Bernhard Riemann",
      title: "Los Ceros Críticos de Riemann", sub: "El Secreto Oculto de la Distribución de Primos", cat: "PROBLEMA DEL MILENIO · 1859",
      eq: "ζ(s) = ∑_{n=1}^{∞} n^{-s} = ∏_p (1 - p^{-s})⁻¹\nRe(s) = ½ (Ceros No Triviales)", eqShort: "ζ(s) = 0 ⟹ Re(s) = ½", metric: "Residuo Crítico: |Re(s_0) - 0.5| < 1e-15",
      hist: 'Bernhard Riemann conjeturó en 1859 que todos los ceros no triviales de la función zeta yacen exactamente sobre la recta crítica Re(s) = 1/2. El Problema del Milenio más codiciado del planeta, con $1.000.000 USD de recompensa.',
      poem: '"Los números primos guardan su música secreta en una cuerda afinada en la mitad exacta del plano complejo."',
      radius: 30, theta: 3.14, phi: 0.52, archetype: "riemann_zeta", pal: 2
    },
    {
      id: 51, badge: "052", epoch: 3, epochName: "Termodinámica & Luz", year: "1854", author: "Bernhard Riemann",
      title: "Métrica Riemanniana y Curvatura Tensorial", sub: "El Espacio No Euclidiano Curvado", cat: "GEOMETRÍA DIFERENCIAL · 1854",
      eq: "ds² = g_{μν} dx^μ dx^ν\nR^ρ_{σμν} = ∂_μ Γ^ρ_{νσ} - ∂_ν Γ^ρ_{μσ} + Γ^ρ_{μλ}Γ^λ_{νσ} - Γ^ρ_{νλ}Γ^λ_{μσ}", eqShort: "ds² = g_{μν} dx^μ dx^ν", metric: "Tensor de Curvatura de Riemann: R^ρ_{σμν}",
      hist: "En su conferencia de habilitación de 1854 ante Gauss, Riemann reinventó la geometría: el espacio no tiene por qué ser plano. Definió el tensor métrico g_μν, proporcionando el lenguaje exacto que Einstein necesitaría 60 años después.",
      poem: '"La recta euclídea era solo una ilusión: el espacio es un tejido que se curva, se estira y respira."',
      radius: 30, theta: 3.45, phi: 0.67, archetype: "riemann_metric", pal: 3
    },
    {
      id: 52, badge: "053", epoch: 3, epochName: "Termodinámica & Luz", year: "1879", author: "Josef Stefan & Ludwig Boltzmann",
      title: "Ley de Radiación de Stefan-Boltzmann", sub: "La Potencia Emisiva del Cuerpo Negro", cat: "RADIACIÓN TÉRMICA · 1879",
      eq: "j* = σ · T⁴\nσ = 2π⁵ k_B⁴ / (15 c² h³) ≈ 5.670374 × 10⁻⁸ W/(m²·K⁴)", eqShort: "j* = σ · T⁴", metric: "Constante de Stefan-Boltzmann: σ",
      hist: "Stefan descubrió empíricamente y Boltzmann derivó teóricamente que la energía total irradiada por un cuerpo negro por unidad de superficie crece con la cuarta potencia de su temperatura absoluta.",
      poem: '"Duplica el calor de una estrella y su brillo no se duplicará: brillará con la furia multiplicada de dieciséis soles."',
      radius: 30, theta: 3.77, phi: 0.59, archetype: "stefan_boltzmann", pal: 0
    },
    {
      id: 53, badge: "054", epoch: 3, epochName: "Termodinámica & Luz", year: "1893", author: "Wilhelm Wien",
      title: "Ley de Desplazamiento de Wien", sub: "El Color de la Temperatura Estelar", cat: "FÍSICA TÉRMICA · 1893",
      eq: "λ_{max} · T = b\nb ≈ 2.89777 × 10⁻³ m·K", eqShort: "λ_max · T = b", metric: "Constante de Wien: b ≈ 2.898e-3 m·K",
      hist: "Wien demostró que la longitud de onda de emisión máxima de un cuerpo negro es inversamente proporcional a su temperatura. Permite medir la temperatura de estrellas lejanas simplemente observando su color.",
      poem: '"El fuego frío arde en rojo melancólico; el calor ardiente despierta el azul y viaja hacia el ultravioleta invisible."',
      radius: 30, theta: 4.08, phi: 0.63, archetype: "wien_displacement", pal: 1
    },
    {
      id: 54, badge: "055", epoch: 3, epochName: "Termodinámica & Luz", year: "1873", author: "William Kingdon Clifford",
      title: "Álgebra Dual y Diferenciación Automática", sub: "El Infinitesimal Puro donde ε² = 0", cat: "ÁLGEBRA DIFERENCIAL · 1873",
      eq: "f(x + d · ε) = f(x) + d · f'(x) · ε   (ε² = 0)\na + b ε ∈ 𝔻", eqShort: "f(x + ε) = f(x) + ε f'(x)", metric: "Error de Truncamiento Numérico: 0.000000",
      hist: "Clifford concibió los números duales introduciendo una unidad ε tal que ε ≠ 0 pero ε² = 0. En la era moderna, esta elegante estructura algebraica es el motor del autodiff que entrena todas las redes neuronales profundas.",
      poem: '"Un número infinitesimal tan sutil que su cuadrado se desvanece en la nada, regalándonos derivadas exactas sin error."',
      radius: 30, theta: 4.40, phi: 0.54, archetype: "clifford_dual", pal: 2
    },
    {
      id: 55, badge: "056", epoch: 3, epochName: "Termodinámica & Luz", year: "1899", author: "Hendrik Lorentz",
      title: "Las Transformaciones de Lorentz", sub: "La Dilatación Temporal y Contracción Espacial", cat: "RELATIVIDAD ESPECIAL · 1899",
      eq: "t' = γ (t - v x / c²)\nx' = γ (x - v t)\nγ = 1 / √(1 - v²/c²)", eqShort: "x' = γ(x - vt),  t' = γ(t - vx/c²)", metric: "Factor de Lorentz: γ ≥ 1",
      hist: "Lorentz dedujo las ecuaciones de transformación de coordenadas que preservan invariantes las ecuaciones de Maxwell entre marcos de referencia en movimiento relativo, allanando el camino para Einstein.",
      poem: '"A velocidades cercanas a la luz, el reloj ajeno camina despacio y la regla del viajero encoge sus milímetros."',
      radius: 30, theta: 4.71, phi: 0.66, archetype: "lorentz_transform", pal: 3
    },
    {
      id: 56, badge: "057", epoch: 3, epochName: "Termodinámica & Luz", year: "1900", author: "Henri Bénard",
      title: "Celdas Convectivas de Bénard", sub: "Autoorganización Térmica Hexagonal", cat: "PATRONES DE CONVECCIÓN · 1900",
      eq: "Ra = (g β ΔT d³) / (ν α) > Ra_c ≈ 1708\n∇·u = 0,  ∂T/∂t + u·∇T = α ∇²T", eqShort: "Ra > Ra_c  (Hexágonos de Convección)", metric: "Número de Rayleigh Crítico: Ra_c ≈ 1708",
      hist: "Al calentar una fina capa de aceite de ballena desde abajo, Bénard descubrió que al superar un gradiente térmico crítico el fluido se autoorganiza espontáneamente en una cuadrícula hexagonal de celdas convectivas.",
      poem: '"El calor que asciende y el frío que desciende firman una tregua y tejen panales de abejas invisibles en el aceite."',
      radius: 30, theta: 5.03, phi: 0.57, archetype: "benard_convection", pal: 0
    },
    {
      id: 57, badge: "058", epoch: 3, epochName: "Termodinámica & Luz", year: "1936", author: "Apolonio de Pérgamo / Frederick Soddy",
      title: "Empaquetamiento Fractal de Apolonio", sub: "Círculos Besadores y Curvatura Entera", cat: "GEOMETRÍA FRACTAL · 1936",
      eq: "2 (k₁² + k₂² + k₃² + k₄²) = (k₁ + k₂ + k₃ + k₄)²\nk_i = 1 / r_i", eqShort: "2 ∑ k_i² = (∑ k_i)²", metric: "Dimensión Fractal de Hausdorff: D ≈ 1.30568",
      hist: "Soddy redescubrió y versificó en la revista Nature el teorema de Descartes para círculos tangentes recíprocos. La iteración infinita engendra el tamiz apoloniano, uno de los fractales más antiguos y simétricos.",
      poem: '"Cuatro círculos se besan en la mejilla sin herirse; de los huecos que dejan nacen otros cuatro en un abrazo infinito."',
      radius: 30, theta: 5.34, phi: 0.65, archetype: "apollonian", pal: 1
    },
    {
      id: 58, badge: "059", epoch: 3, epochName: "Termodinámica & Luz", year: "1908", author: "Georgy Voronoi",
      title: "Teselación Espacial de Voronoi", sub: "La Frontera de Proximidad y Equidad Geométrica", cat: "GEOMETRÍA COMPUTACIONAL · 1908",
      eq: "V(p_i) = { x ∈ ℝ² : ‖x - p_i‖ ≤ ‖x - p_j‖, ∀ j ≠ i }\nDel(P) = Dual(Vor(P))", eqShort: "V(p_i) = { x : ‖x - p_i‖ ≤ ‖x - p_j‖ }", metric: "Planaridad de Delaunay: Delaunay Triangulation Dual",
      hist: "Voronoi formalizó la partición del espacio donde cada región contiene todos los puntos más cercanos a su semilla generadora que a cualquier otra. Describe desde la estructura celular de las hojas hasta la distribución de galaxias.",
      poem: '"Traza una frontera en la mitad exacta entre dos vecinos y el mapa se llenará de polígonos de perfecta justicia."',
      radius: 30, theta: 5.65, phi: 0.53, archetype: "voronoi", pal: 2
    },
    {
      id: 59, badge: "060", epoch: 3, epochName: "Termodinámica & Luz", year: "1913", author: "Richard von Mises",
      title: "Criterio de Fluencia de Von Mises", sub: "El Límite Plástico de la Resistencia Material", cat: "MECÁNICA DE MEDIOS CONTINUOS · 1913",
      eq: "σ_v = √½ [(σ₁ - σ₂)² + (σ₂ - σ₃)² + (σ₃ - σ₁)²] ≤ σ_y\nJ₂ = ½ s_{ij} s_{ij} ≤ k²", eqShort: "σ_v = √(3 J₂) ≤ σ_y", metric: "Invariante Desviador: J₂ ≤ k²",
      hist: "Von Mises demostró que la plastificación de los metales bajo cargas multiaxiales complejas no depende de la presión hidrostática, sino únicamente del segundo invariante del tensor desviador de esfuerzos J₂.",
      poem: '"El metal resiste mientras la distorsión cabe en sus átomos; cuando la energía desborda el límite, la forma cede."',
      radius: 30, theta: 5.97, phi: 0.68, archetype: "von_mises", pal: 3
    },

    // ═════════════════════════════════════════════════════════════════════════
    // ÉPOCA IV: RELATIVIDAD & MECÁNICA CUÁNTICA (061 – 080)
    // Estrato Celeste: Anillo IV (R = 36m, φ ∈ [+0.75, +0.96] rad)
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 60, badge: "061", epoch: 4, epochName: "Relatividad & Cuántica", year: "1900", author: "Max Planck",
      title: "Cuantización de la Energía de Planck", sub: "El Nacimiento del Fotón y la Era Cuántica", cat: "MECÁNICA CUÁNTICA · 1900",
      eq: "E = h · ν = ℏ · ω\nB_λ(T) = (2hc²/λ⁵) / (e^{hc/λk_B T} - 1)\nℏ ≈ 1.0545718 × 10⁻³⁴ J·s", eqShort: "E = h · ν", metric: "Constante de Planck: h = 6.62607015e-34 J·s",
      hist: "Desesperado por resolver la catástrofe ultravioleta de la radiación térmica, Planck introdujo la revolucionaria hipótesis de que la energía no se emite de forma continua, sino en paquetes discretos e indivisibles llamados cuantos.",
      poem: '"La luz no fluye como agua mansa: gotea grano a grano en paquetes de energía indivisible."',
      radius: 36, theta: 0.16, phi: 0.77, archetype: "planck_quantum", pal: 0
    },
    {
      id: 61, badge: "062", epoch: 4, epochName: "Relatividad & Cuántica", year: "1905", author: "Albert Einstein",
      title: "El Efecto Fotoeléctrico de Einstein", sub: "La Naturaleza Corpuscular de la Luz", cat: "FÍSICA CUÁNTICA · 1905",
      eq: "E_{k,max} = h · ν - Φ\ne V_0 = h ν - W", eqShort: "E_k = h ν - Φ", metric: "Frecuencia Umbral: ν_0 = Φ / h",
      hist: "El único descubrimiento por el que Einstein recibió el Premio Nobel de Física. Explicó que los electrones son expulsados de un metal solo si los fotones incidentes superan la energía umbral de la función trabajo del material.",
      poem: '"Un rayo de luz roja golpea el metal sin éxito; un tenue destello azul basta para arrancar electrones de golpe."',
      radius: 36, theta: 0.47, phi: 0.88, archetype: "photoelectric", pal: 1
    },
    {
      id: 62, badge: "063", epoch: 4, epochName: "Relatividad & Cuántica", year: "1905", author: "Albert Einstein",
      title: "Equivalencia Masa-Energía (E = mc²)", sub: "La Identidad Suprema de la Materia", cat: "RELATIVIDAD ESPECIAL · 1905",
      eq: "E = m · c²\nE² = (p c)² + (m₀ c²)²", eqShort: "E = m · c²", metric: "Invariante Cuadrimomento: p_μ p^μ = -m₀² c²",
      hist: "La ecuación más célebre de la historia humana. Reveló que la masa no es otra cosa que energía densamente concentrada y confinada, vinculada por el cuadrado de la colosal velocidad de la luz.",
      poem: '"Un gramo de materia ordinaria duerme abrazado a la energía de una tempestad cósmica."',
      radius: 36, theta: 0.79, phi: 0.81, archetype: "mass_energy", pal: 2
    },
    {
      id: 63, badge: "064", epoch: 4, epochName: "Relatividad & Cuántica", year: "1908", author: "Hermann Minkowski",
      title: "El Intervalo Espaciotemporal de Minkowski", sub: "El Espacio-Tiempo Cuatridimensional Unificado", cat: "GEOMETRÍA RELATIVISTA · 1908",
      eq: "ds² = -c² dt² + dx² + dy² + dz²\nη_{μν} = diag(-1, 1, 1, 1)", eqShort: "ds² = -c² dt² + dx² + dy² + dz²", metric: "Invariante de Lorentz: ds²_A = ds²_B",
      hist: '"De ahora en adelante el espacio por sí mismo y el tiempo por sí mismo están condenados a desvanecerse en meras sombras, y solo una especie de unión entre ambos preservará una realidad independiente."',
      poem: '"El tiempo es la cuarta hebra del tapiz: si aceleras en el espacio, pagas el peaje frenando tu paso en el tiempo."',
      radius: 36, theta: 1.10, phi: 0.93, archetype: "minkowski_spacetime", pal: 3
    },
    {
      id: 64, badge: "065", epoch: 4, epochName: "Relatividad & Cuántica", year: "1915", author: "Albert Einstein",
      title: "Ecuación de Campo de la Relatividad General", sub: "La Curvatura Gravitatoria del Cosmos", cat: "RELATIVIDAD GENERAL · 1915",
      eq: "G_{μν} + Λ g_{μν} = (8πG / c⁴) · T_{μν}\nR_{μν} - ½ R g_{μν} = (8πG / c⁴) T_{μν}", eqShort: "G_{μν} + Λ g_{μν} = (8πG / c⁴) T_{μν}", metric: "Conservación de Energía-Momento: ∇_μ T^{μν} = 0",
      hist: "John Wheeler resumió esta obra maestra en 1973: 'El espacio-tiempo le dice a la materia cómo moverse; la materia le dice al espacio-tiempo cómo curvarse'. Reemplazó la atracción newtoniana por geometría pura.",
      poem: '"El Sol no jala a los planetas con sogas de fuerza: ahueca el espacio con su peso y los planetas ruedan en la hondura."',
      radius: 36, theta: 1.41, phi: 0.78, archetype: "einstein_field", pal: 0
    },
    {
      id: 65, badge: "066", epoch: 4, epochName: "Relatividad & Cuántica", year: "1916", author: "Karl Schwarzschild",
      title: "El Radio del Agujero Negro de Schwarzschild", sub: "El Horizonte de Sucesos Ineludible", cat: "ASTROFÍSICA RELATIVISTA · 1916",
      eq: "r_s = 2 G M / c²\nds² = -(1 - r_s/r) c² dt² + (1 - r_s/r)⁻¹ dr² + r² dΩ²", eqShort: "r_s = 2GM / c²", metric: "Horizonte de Sucesos: g_00(r_s) = 0",
      hist: "En las trincheras de la Primera Guerra Mundial, Schwarzschild calculó la primera solución exacta a las ecuaciones de Einstein: si una masa se comprime bajo su radio crítico r_s, ni la propia luz puede escapar jamás.",
      poem: '"Comprime la Tierra en el tamaño de una canica y el tiempo se detendrá en seco en su frontera de sombra."',
      radius: 36, theta: 1.73, phi: 0.91, archetype: "schwarzschild_bh", pal: 1
    },
    {
      id: 66, badge: "067", epoch: 4, epochName: "Relatividad & Cuántica", year: "1924", author: "Louis de Broglie",
      title: "Longitud de Onda Cuántica de De Broglie", sub: "La Dualidad Onda-Corpúsculo de la Materia", cat: "FÍSICA CUÁNTICA · 1924",
      eq: "λ = h / p = h / (m · v)\np = ℏ · k", eqShort: "λ = h / p", metric: "Relación de Broglie: p = ℏ k",
      hist: "De Broglie propuso en su tesis doctoral que si la luz (una onda) actúa a veces como partícula, la materia (como un electrón) también debe poseer una longitud de onda ondulatoria inherente.",
      poem: '"Todo átomo de tu cuerpo ondea como una ola en el mar; su masa es tan grande que su temblor es invisible."',
      radius: 36, theta: 2.04, phi: 0.84, archetype: "de_broglie_wave", pal: 2
    },
    {
      id: 67, badge: "068", epoch: 4, epochName: "Relatividad & Cuántica", year: "1926", author: "Erwin Schrödinger",
      title: "La Ecuación de Onda Cuántica de Schrödinger", sub: "La Evolución Temporal de la Amplitud de Probabilidad", cat: "MECÁNICA CUÁNTICA · 1926",
      eq: "i ℏ · ∂ψ/∂t = Ĥ ψ\nĤ = - (ℏ² / 2m) ∇² + V(r)", eqShort: "i ℏ · ∂ψ/∂t = Ĥ ψ", metric: "Unitaridad Cuántica: d/dt ⟨ψ|ψ⟩ = 0",
      hist: "La ley fundamental que gobierna la química y la física atómica. Reemplazó las trayectorias newtonianas puntuales por una función de onda compleja ψ cuya norma al cuadrado es la probabilidad de encontrar la partícula.",
      poem: '"El electrón no está aquí ni allá: habita como una nube de posibilidades que solo el acto de mirar colapsa."',
      radius: 36, theta: 2.36, phi: 0.95, archetype: "schrodinger", pal: 3
    },
    {
      id: 68, badge: "069", epoch: 4, epochName: "Relatividad & Cuántica", year: "1927", author: "Werner Heisenberg",
      title: "Principio de Incertidumbre de Heisenberg", sub: "El Límite Epistemológico del Conocimiento Físico", cat: "FUNDAMENTOS CUÁNTICOS · 1927",
      eq: "Δx · Δp ≥ ℏ / 2\n[x̂, p̂] = i ℏ · I\nΔE · Δt ≥ ℏ / 2", eqShort: "Δx · Δp ≥ ℏ / 2", metric: "Conmutador Canónico: [x, p] = iℏ",
      hist: "Heisenberg demostró que es físicamente imposible conocer simultáneamente y con precisión infinita la posición y el momento de una partícula subatómica. No es un defecto del instrumento: es la naturaleza de la realidad.",
      poem: '"Cuanto más nítido ves dónde descansa la partícula, más ciego quedas ante el ímpetu de su vuelo."',
      radius: 36, theta: 2.67, phi: 0.79, archetype: "heisenberg_uncertainty", pal: 0
    },
    {
      id: 69, badge: "070", epoch: 4, epochName: "Relatividad & Cuántica", year: "1928", author: "Paul Dirac",
      title: "La Ecuación Relativista de Dirac", sub: "La Predicción Teórica de la Antimateria", cat: "TEORÍA CUÁNTICA DE CAMPOS · 1928",
      eq: "(i γ^μ ∂_μ - m) ψ = 0\n{γ^μ, γ^ν} = 2 η^{μν} · I₄", eqShort: "(i γ^μ ∂_μ - m) ψ = 0", metric: "Álgebra de Clifford-Dirac: {γ^μ, γ^ν} = 2η^μν",
      hist: "Al unificar la mecánica cuántica con la relatividad especial mediante matrices de 4×4, Dirac descubrió soluciones con energía negativa. En lugar de descartarlas, predijo la existencia del positrón y la antimateria.",
      poem: '"Cada partícula de luz y materia tiene un hermano especular que camina con carga opuesta hacia el reencuentro."',
      radius: 36, theta: 2.98, phi: 0.89, archetype: "dirac_equation", pal: 1
    },
    {
      id: 70, badge: "071", epoch: 4, epochName: "Relatividad & Cuántica", year: "1931", author: "Heinz Hopf",
      title: "La Fibración Topológica de Hopf", sub: "El Entrelazamiento Sagrado de la 3-Esfera", cat: "TOPOLOGÍA ALGEBRAICA · 1931",
      eq: "π: S³ → S²\n(z₀, z₁) ↦ z₀ / z₁\nFiber: S¹ (Great Circles)", eqShort: "π: S³ → S²  (Fibras S¹)", metric: "Invariante de Hopf: H(f) ∈ ℤ",
      hist: "Hopf descubrió que la 3-esfera en cuatro dimensiones puede descomponerse en una familia infinita de círculos entrelazados (fibras S¹), de tal forma que dos fibras cualesquiera siempre tienen número de enlace igual a uno.",
      poem: '"Círculos perfectos en cuatro dimensiones llenan el espacio abrazándose sin cortarse jamás."',
      radius: 36, theta: 3.30, phi: 0.82, archetype: "hopf_fibration", pal: 2
    },
    {
      id: 71, badge: "072", epoch: 4, epochName: "Relatividad & Cuántica", year: "1929", author: "Edwin Hubble & Georges Lemaître",
      title: "La Ley de Expansión Cósmica de Hubble", sub: "La Fuga de las Galaxias y el Nacimiento del Big Bang", cat: "COSMOLOGÍA OBSERVACIONAL · 1929",
      eq: "v = H₀ · d\nH₀ ≈ 70 (km/s) / Mpc", eqShort: "v = H₀ · d", metric: "Parámetro de Hubble: H(t) = ȧ / a",
      hist: "Al medir el corrimiento al rojo de las nebulosas espirales desde el telescopio del Monte Wilson, Hubble demostró que las galaxias se alejan de nosotros con velocidad proporcional a su distancia: el cosmos entero se expande.",
      poem: '"El universo no es un salón estático: es un lienzo elástico que se estira y aleja a las galaxias unas de otras."',
      radius: 36, theta: 3.61, phi: 0.94, archetype: "hubble_expansion", pal: 3
    },
    {
      id: 72, badge: "073", epoch: 4, epochName: "Relatividad & Cuántica", year: "1922", author: "Alexander Friedmann",
      title: "Las Ecuaciones Cosmológicas de Friedmann", sub: "La Dinámica Global del Espacio-Tiempo", cat: "COSMOLOGÍA RELATIVISTA · 1922",
      eq: "(ȧ/a)² = (8πG/3) ρ - (k c²/a²) + (Λ c²/3)\nä/a = - (4πG/3)(ρ + 3p/c²) + (Λ c²/3)", eqShort: "(ȧ/a)² = (8πG/3)ρ - kc²/a²", metric: "Métrica FLRW: ds² = -c²dt² + a(t)² dΣ_k²",
      hist: "Friedmann resolvió las ecuaciones de campo de Einstein para un universo homogéneo e isótropo, demostrando matemáticamente que el cosmos debe estar o expandiéndose o contrayéndose, pero jamás estático.",
      poem: '"La densidad de la materia y la energía oscura deciden el destino final: ¿expansión infinita o colapso supremo?"',
      radius: 36, theta: 3.93, phi: 0.76, archetype: "friedmann_cosmos", pal: 0
    },
    {
      id: 73, badge: "074", epoch: 4, epochName: "Relatividad & Cuántica", year: "1918", author: "Emmy Noether",
      title: "El Teorema de Noether", sub: "La Identidad Sagrada entre Simetría y Conservación", cat: "FÍSICA TEÓRICA · 1918",
      eq: "δS = 0 con simetría continua ⟹ ∂_μ J^μ = 0\nQ = ∫ J⁰ d³x = cte", eqShort: "Simetría Continua ⟹ Carga Conservada", metric: "Corriente de Noether Conservada: ∂_μ J^μ = 0",
      hist: "Considerado por Einstein como el teorema más profundo de la física teórica. Demostró que a cada simetría continua del espacio-tiempo le corresponde una ley de conservación exacta: tiempo ⟹ energía; espacio ⟹ momento.",
      poem: '"Si las leyes de la física no cambian hoy ni mañana, la energía se conservará por los siglos de los siglos."',
      radius: 36, theta: 4.24, phi: 0.90, archetype: "noether_symmetry", pal: 1
    },
    {
      id: 74, badge: "075", epoch: 4, epochName: "Relatividad & Cuántica", year: "1925", author: "Wolfgang Pauli",
      title: "Principio de Exclusión de Pauli", sub: "El Andamiaje Cuántico de la Materia Sólida", cat: "FÍSICA ATÓMICA · 1925",
      eq: "ψ(x₁, x₂) = -ψ(x₂, x₁)\n|ψ(x, x)|² = 0\nΔn_fermion ∈ {0, 1}", eqShort: "ψ(1, 2) = -ψ(2, 1)", metric: "Antisimetría Fermiónica: P₁₂ ψ = -ψ",
      hist: "Dos fermiones idénticos (como electrones o quarks) no pueden ocupar simultáneamente el mismo estado cuántico. Este principio impide que los átomos colapsen, explicando la tabla periódica y la solidez de la materia.",
      poem: '"Dos electrones gemelos no pueden pisar la misma baldosa: de su mutuo pudor nace la firmeza de la piedra."',
      radius: 36, theta: 4.56, phi: 0.83, archetype: "pauli_exclusion", pal: 2
    },
    {
      id: 75, badge: "076", epoch: 4, epochName: "Relatividad & Cuántica", year: "1924", author: "Satyendra Nath Bose & Albert Einstein",
      title: "El Condensado de Bose-Einstein", sub: "El Superátomo Gigante a Cero Absoluto", cat: "FÍSICA CUÁNTICA MACROSCÓPICA · 1924",
      eq: "N₀ / N = 1 - (T / T_c)^{3/2}\nT_c = (2πℏ²/m k_B) (n / ζ(3/2))^{2/3}", eqShort: "N₀ = N (1 - (T/T_c)^{3/2})", metric: "Longitud de Onda Térmica: λ_th > d_interatom",
      hist: "Bose y Einstein predijeron que a temperaturas nanokelvin cerca del cero absoluto, los bosones colapsan en el mismo estado fundamental cuántico, actuando al unísono como una sola onda gigante.",
      poem: '"En el frío supremo, millones de átomos pierden su individualidad y respiran como un solo ser de luz."',
      radius: 36, theta: 4.87, phi: 0.96, archetype: "bose_einstein", pal: 3
    },
    {
      id: 76, badge: "077", epoch: 4, epochName: "Relatividad & Cuántica", year: "1974", author: "Jacob Bekenstein & Stephen Hawking",
      title: "Entropía de Agujeros Negros de Bekenstein-Hawking", sub: "La Información Inscrita en el Horizonte de Sucesos", cat: "GRAVEDAD CUÁNTICA · 1974",
      eq: "S_{BH} = (k_B · c³ · A) / (4 G ℏ) = k_B · A / (4 ℓ_P²)\nℓ_P = √(ℏ G / c³)", eqShort: "S_{BH} = k_B A / (4 ℓ_P²)", metric: "Área de Planck: ℓ_P² ≈ 2.612e-70 m²",
      hist: "Unificó la termodinámica, la gravedad y la física cuántica en una sola ecuación: la entropía máxima que puede contener una región del espacio no depende de su volumen tridimensional, sino del área bidimensional de su horizonte.",
      poem: '"Toda la memoria de una estrella que cae en el abismo queda grabada como un holograma en la piel de su frontera."',
      radius: 36, theta: 5.18, phi: 0.77, archetype: "black_hole_entropy", pal: 0
    },
    {
      id: 77, badge: "078", epoch: 4, epochName: "Relatividad & Cuántica", year: "1974", author: "Stephen Hawking",
      title: "La Radiación Térmica de Hawking", sub: "La Evaporación Cuántica del Horizonte", cat: "GRAVEDAD CUÁNTICA · 1974",
      eq: "T_H = ℏ c³ / (8π G M k_B)\ndM/dt = - ℏ c⁴ / (15360 π G² M²)", eqShort: "T_H = ℏ c³ / (8π G M k_B)", metric: "Temperatura de Hawking: T_H ∝ 1/M",
      hist: "Hawking demostró que debido a fluctuaciones cuánticas del vacío en el horizonte de sucesos (pares partícula-antipartícula), los agujeros negros no son totalmente negros: emiten radiación térmica y se evaporan con el tiempo.",
      poem: '"El vacío roba una chispa en la orilla del abismo y condena al gigante negro a apagarse lentamente en la noche cósmica."',
      radius: 36, theta: 5.50, phi: 0.92, archetype: "hawking_radiation", pal: 1
    },
    {
      id: 78, badge: "079", epoch: 4, epochName: "Relatividad & Cuántica", year: "1954", author: "Chen-Ning Yang & Robert Mills",
      title: "Teoría de Calibre No Abeliana de Yang-Mills", sub: "El Andamiaje de las Fuerzas Nucleares", cat: "PROBLEMA DEL MILENIO · 1954",
      eq: "ℒ = - ¼ F^a_{μν} F^{a μν}\nF^a_{μν} = ∂_μ A^a_ν - ∂_ν A^a_μ + g f^{abc} A^b_μ A^c_ν\nΔm > 0 (Mass Gap)", eqShort: "ℒ = - ¼ F^a_{μν} F^{a μν}", metric: "Salto de Masa Cuántico: Δm > 0",
      hist: "Yang y Mills extendieron las simetrías de calibre abelianas del electromagnetismo al grupo no abeliano SU(N). Es el cimiento de la fuerza nuclear fuerte y débil. El Clay Institute ofrece $1.000.000 USD por demostrar rigurosamente su salto de masa (mass gap).",
      poem: '"Los gluones no solo llevan la fuerza: se atraen a sí mismos con la furia no lineal de una geometría sagrada."',
      radius: 36, theta: 5.81, phi: 0.85, archetype: "yang_mills", pal: 2
    },
    {
      id: 79, badge: "080", epoch: 4, epochName: "Relatividad & Cuántica", year: "1964", author: "Peter Higgs & François Englert",
      title: "El Mecanismo de Higgs y Masa Elemental", sub: "La Ruptura Espontánea de Simetría Electrodébil", cat: "FÍSICA DE PARTÍCULAS · 1964",
      eq: "V(ϕ) = μ² (ϕ† ϕ) + λ (ϕ† ϕ)²   (μ² < 0)\nv = √(-μ² / λ) ≈ 246 GeV\nm_f = y_f · v / √2", eqShort: "V(ϕ) = μ² |ϕ|² + λ |ϕ|⁴", metric: "Valor de Expectación de Vacío: v ≈ 246 GeV",
      hist: "El potencial de sombrero mexicano del campo de Higgs: a altas energías reina la simetría, pero al enfriarse el universo la simetría se rompe espontáneamente y las partículas adquieren masa inercial al rozar con el campo.",
      poem: '"El universo era ligero como la luz hasta que el campo de Higgs se enfrió y regaló su peso a la materia."',
      radius: 36, theta: 6.13, phi: 0.94, archetype: "higgs_mechanism", pal: 3
    },

    // ═════════════════════════════════════════════════════════════════════════
    // ÉPOCA V: CAOS, INFORMACIÓN & ENIGMAS DEL MILENIO (081 – 100)
    // Estrato Celeste: Anillo V (R = 42m, φ ∈ [+1.02, +1.28] rad en el alto cénit)
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 80, badge: "081", epoch: 5, epochName: "Caos & Milenio", year: "1931", author: "Kurt Gödel",
      title: "Teorema de Incompletitud de Gödel", sub: "Los Límites Intrínsecos de la Verdad Formal", cat: "LÓGICA MATEMÁTICA · 1931",
      eq: "G ↔ ¬Prov(⌈G⌉)\nConsistente(T) ⟹ T ⊬ G  y  T ⊬ ¬G", eqShort: "G ↔ ¬Prov(⌈G⌉)", metric: "Incompletitud Aritmética: ∃ Proposiciones Indecidibles",
      hist: "Con solo 25 años, Kurt Gödel demolió el sueño de Hilbert de un sistema axiomático completo y consistente para toda la matemática: en cualquier sistema lo bastante potente siempre existirán verdades indemostrables.",
      poem: '"La verdad es un océano más vasto que las redes de cualquier lógica inventada por el hombre."',
      radius: 42, theta: 0.00, phi: 1.05, archetype: "godel_incompleteness", pal: 0
    },
    {
      id: 81, badge: "082", epoch: 5, epochName: "Caos & Milenio", year: "1936", author: "Alan Turing",
      title: "La Máquina Universal de Turing", sub: "La Definición Matemática de Computación", cat: "CIENCIAS DE LA COMPUTACIÓN · 1936",
      eq: "M = ⟨Q, Σ, Γ, δ, q₀, B, F⟩\nδ: Q × Γ → Q × Γ × {L, R}\nHalting Problem: H(M, w) ∈ Indecidible", eqShort: "δ: Q × Γ → Q × Γ × {L, R}", metric: "Turing-Completitud: Universal Machine U",
      hist: "Turing concibió en 1936 una máquina abstracta con una cinta infinita capaz de simular cualquier algoritmo imaginable, fundando la informática moderna y demostrando la indecidibilidad del problema de la parada.",
      poem: '"Una cinta de papel que avanza y retrocede en silencio contiene en su código todas las máquinas del porvenir."',
      radius: 42, theta: 0.31, phi: 1.18, archetype: "turing_machine", pal: 1
    },
    {
      id: 82, badge: "083", epoch: 5, epochName: "Caos & Milenio", year: "1948", author: "Claude Shannon",
      title: "La Entropía de la Información de Shannon", sub: "La Cuantificación del Conocimiento y la Incertidumbre", cat: "TEORÍA DE LA INFORMACIÓN · 1948",
      eq: "H(X) = - ∑_{i=1}^{n} P(x_i) · log₂ P(x_i)\nI(X; Y) = H(X) - H(X|Y)", eqShort: "H(X) = - ∑ P(x) log₂ P(x)", metric: "Entropía de Shannon en Bits: H ≥ 0",
      hist: "En su célebre artículo de 1948, Shannon fundó la era digital al definir el bit como unidad elemental de información y demostrar que la sorpresa o incertidumbre de un mensaje es idéntica a la fórmula de la entropía de Boltzmann.",
      poem: '"Un mensaje predecible no enseña nada; en lo inesperado reside todo el valor de la información."',
      radius: 42, theta: 0.63, phi: 1.10, archetype: "shannon_entropy", pal: 2
    },
    {
      id: 83, badge: "084", epoch: 5, epochName: "Caos & Milenio", year: "1948", author: "Claude Shannon & Ralph Hartley",
      title: "Capacidad de Canal de Shannon-Hartley", sub: "El Límite Físico de Transmisión de Datos", cat: "TELECOMUNICACIONES · 1948",
      eq: "C = B · log₂ (1 + S/N)\nEb/N0 ≥ ln 2 ≈ -1.59 dB", eqShort: "C = B · log₂(1 + SNR)", metric: "Límite de Shannon: C [bits/s]",
      hist: "Establece la tasa máxima teórica a la que se puede transmitir información sin error a través de un canal ruidoso de ancho de banda B. Es el principio que rige desde el WiFi y el 5G hasta las sondas Voyager en el espacio profundo.",
      poem: '"Aunque el ruido del abismo ruja sin descanso, la matemática sabe cómo colar la verdad limpia a través del estruendo."',
      radius: 42, theta: 0.94, phi: 1.25, archetype: "shannon_capacity", pal: 3
    },
    {
      id: 84, badge: "085", epoch: 5, epochName: "Caos & Milenio", year: "1952", author: "Alan Turing",
      title: "El Telar de Morfogénesis de Turing", sub: "La Creación de Patrones Biológicos Espontáneos", cat: "BIOLOGÍA TEÓRICA · 1952",
      eq: "∂u/∂t = D_u ∇²u + f(u, v)\n∂v/∂t = D_v ∇²v + g(u, v)\nD_v ≫ D_u  (Inestabilidad de Turing)", eqShort: "∂u/∂t = D_u ∇²u - uv² + F(1-u)", metric: "Longitud de Onda Crítica: λ_c ≈ 2π √(D_u/k)",
      hist: "Dos años antes de su muerte, Turing demostró cómo dos sustancias químicas homogéneas (un activador y un inhibidor) difundiéndose a diferentes velocidades bastan para quebrar la simetría y tejer las manchas del leopardo y las rayas de la cebra.",
      poem: '"La naturaleza no necesitó pincel para pintar la piel del leopardo: solo dos moléculas jugando a perseguirse."',
      radius: 42, theta: 1.26, phi: 1.12, archetype: "turing_morphogenesis", pal: 0
    },
    {
      id: 85, badge: "086", epoch: 5, epochName: "Caos & Milenio", year: "1951", author: "Boris Belousov & Anatoly Zhabotinsky",
      title: "Reacción Química de Belousov-Zhabotinsky", sub: "El Reloj Químico No Lineal Lejos del Equilibrio", cat: "SISTEMAS DISIPATIVOS · 1951",
      eq: "dx/dt = s(y - x y + x - q x²)\ndy/dt = s⁻¹(-y - x y + z)\ndz/dt = w(x - z)  (Ondas Espirales)", eqShort: "Ondas Espirales BZ Químicas", metric: "Período de Oscilación Límite: T_osc",
      hist: "Belousov mezcló sales de cerio y ácido cítrico esperando una disolución monótona, pero la mezcla osciló rítmicamente entre amarillo y transparente. Es el modelo clásico de ondas químicas que imita el ritmo cardíaco.",
      poem: '"Un matraz donde el líquido respira y pulsa como un corazón líquido que se niega a alcanzar el reposo."',
      radius: 42, theta: 1.57, phi: 1.22, archetype: "belousov_zhabotinsky", pal: 1
    },
    {
      id: 86, badge: "087", epoch: 5, epochName: "Caos & Milenio", year: "1963", author: "Edward Lorenz",
      title: "El Atractor Caótico de Lorenz", sub: "El Efecto Mariposa y el Caos Determinista", cat: "TEORÍA DEL CAOS · 1963",
      eq: "dx/dt = σ(y - x)\ndy/dt = x(ρ - z) - y\ndz/dt = x y - β z\nσ = 10, ρ = 28, β = 8/3", eqShort: "dx/dt=10(y-x), dy/dt=x(28-z)-y", metric: "Exponente Máximo de Lyapunov: λ₁ ≈ +0.9056",
      hist: "Edward Lorenz redondeó 0.506127 a 0.506 en su simulación atmosférica y descubrió que una millonésima de diferencia desata trayectorias radicalmente divergentes: el caos determinista donde el aleteo de una mariposa puede provocar un tornado.",
      poem: '"Dos alas nacen de un suspiro y giran sin tocarse jamás: el porvenir es determinista pero incalculable."',
      radius: 42, theta: 1.88, phi: 1.06, archetype: "lorenz_attractor", pal: 2
    },
    {
      id: 87, badge: "088", epoch: 5, epochName: "Caos & Milenio", year: "1976", author: "Otto Rössler",
      title: "La Cinta Plegada de Rössler", sub: "La Herradura de Smale en Dinámica Continua", cat: "TOPOLOGÍA CAÓTICA · 1976",
      eq: "dx/dt = -y - z\ndy/dt = x + a y\ndz/dt = b + z(x - c)\na = 0.2, b = 0.2, c = 5.7", eqShort: "dx/dt = -y-z, dy/dt = x+ay", metric: "Dimensión Fractal de Correlación: D ≈ 2.01",
      hist: "Inspirado por el panadero que estira y pliega una masa sobre sí misma, Rössler diseñó el atractor caótico dimensionalmente más simple posible, demostrando cómo una sola no-linealidad genera fractales infinitos.",
      poem: '"El tiempo es una masa de pan que el universo estira suavemente y dobla sobre sí misma sin cesar."',
      radius: 42, theta: 2.20, phi: 1.27, archetype: "rossler_attractor", pal: 3
    },
    {
      id: 88, badge: "089", epoch: 5, epochName: "Caos & Milenio", year: "1976", author: "Robert May & Mitchell Feigenbaum",
      title: "El Mapa Logístico y Universalidad de Feigenbaum", sub: "La Cascada de Duplicación de Período al Caos", cat: "DINÁMICA NO LINEAL · 1976",
      eq: "x_{n+1} = r · x_n (1 - x_n)\nlim (r_n - r_{n-1}) / (r_{n+1} - r_n) = δ ≈ 4.6692016\nα ≈ 2.5029078", eqShort: "x_{n+1} = r x_n (1 - x_n)", metric: "Constante Universal de Feigenbaum: δ ≈ 4.66920",
      hist: "Robert May descubrió que una simple ecuación biológica de poblaciones genera un árbol infinito de bifurcaciones, y Feigenbaum demostró que la razón geométrica entre bifurcaciones converge a una constante universal δ idéntica en toda la física.",
      poem: '"Un solo camino se bifurca en dos, luego en cuatro, en ocho: en la cascada infinita aguarda el reino del caos."',
      radius: 42, theta: 2.51, phi: 1.15, archetype: "logistic_feigenbaum", pal: 0
    },
    {
      id: 89, badge: "090", epoch: 5, epochName: "Caos & Milenio", year: "1980", author: "Benoît Mandelbrot & Gaston Julia",
      title: "El Conjunto Fractal de Mandelbrot", sub: "La Huella Digital Infinita de la Geometría Compleja", cat: "FRACTALES COMPLEJOS · 1980",
      eq: "z_{n+1} = z_n² + c\nM = { c ∈ ℂ : lim_{n→∞} |z_n| ≤ 2 }\nDim_H(∂M) = 2", eqShort: "z_{n+1} = z_n² + c", metric: "Frontera Conexa de Mandelbrot: Shishikura Dim = 2",
      hist: "Benoît Mandelbrot descubrió la figura más compleja de la matemática: una ecuación cuadrática de cuatro caracteres z²+c que genera una frontera fractal inagotable con infinitos vástagos autosimilares a cualquier escala de aumento.",
      poem: '"Acércate a la frontera tanto como desees: jamás encontrarás el final de los palacios que engendra un simple cuadrado."',
      radius: 42, theta: 2.83, phi: 1.24, archetype: "mandelbrot_julia", pal: 1
    },
    {
      id: 90, badge: "091", epoch: 5, epochName: "Caos & Milenio", year: "1975", author: "Yoshiki Kuramoto",
      title: "Sincronización de Fase de Kuramoto", sub: "El Orden Colectivo Emergente de Osciladores", cat: "SISTEMAS COMPLEJOS · 1975",
      eq: "dθ_i / dt = ω_i + (K / N) ∑_{j=1}^{N} sin(θ_j - θ_i)\nr e^{iψ} = (1/N) ∑ e^{iθ_j}", eqShort: "dθ_i/dt = ω_i + (K/N) ∑ sin(θ_j - θ_i)", metric: "Parámetro de Orden de Kuramoto: 0 ≤ r ≤ 1",
      hist: "Modela cómo miles de osciladores con frecuencias naturales distintas logran sincronizarse de pronto al superar un acoplamiento crítico K: luciérnagas titilando al unísono, neuronas del cerebro y la red eléctrica.",
      poem: '"Miles de voces dispersas que cantan a destiempo se escuchan unas a otras y rompen a cantar al unísono."',
      radius: 42, theta: 3.14, phi: 1.04, archetype: "kuramoto_sync", pal: 2
    },
    {
      id: 91, badge: "092", epoch: 5, epochName: "Caos & Milenio", year: "1908", author: "Paul Langevin",
      title: "La Ecuación Estocástica de Langevin", sub: "El Movimiento Browniano con Fuerza Fluctuante", cat: "FÍSICA ESTOCÁSTICA · 1908",
      eq: "m · dv/dt = -γ · v + ξ(t)\n⟨ξ(t)⟩ = 0,  ⟨ξ(t) ξ(t')⟩ = 2 k_B T γ · δ(t - t')", eqShort: "m dv/dt = -γ v + ξ(t)", metric: "Teorema de Fluctuación-Disipación: D = k_B T / γ",
      hist: "Langevin unificó la fricción viscosa determinista con los choques térmicos aleatorios ξ(t) del solvente, creando la primera ecuación diferencial estocástica de la historia y el teorema de fluctuación-disipación.",
      poem: '"El polen en el agua parece dudar en cada paso: la fricción lo frena, pero el martilleo de los átomos lo mantiene vivo."',
      radius: 42, theta: 3.45, phi: 1.28, archetype: "langevin_stochastic", pal: 3
    },
    {
      id: 92, badge: "093", epoch: 5, epochName: "Caos & Milenio", year: "1973", author: "Fischer Black & Myron Scholes",
      title: "Ecuación de Opciones de Black-Scholes", sub: "La Geometría de la Cobertura Financiera", cat: "MATEMÁTICA FINANCIERA · 1973",
      eq: "∂V/∂t + ½ σ² S² (∂²V/∂S²) + r S (∂V/∂S) - r V = 0\ndS = μ S dt + σ S dW_t", eqShort: "∂V/∂t + ½ σ² S² ∂²V/∂S² + rS ∂V/∂S - rV = 0", metric: "Arbitrage-Free Pricing: dΠ = r Π dt",
      hist: "Demostró que el riesgo de una opción financiera puede eliminarse por completo mediante una cartera de cobertura dinámica delta-neutral, transformando los mercados financieros globales y ganando el Premio Nobel en 1997.",
      poem: '"El azar del mercado no puede predecirse, pero puede neutralizarse con la balanza exacta del cálculo continuo."',
      radius: 42, theta: 3.77, phi: 1.14, archetype: "black_scholes", pal: 0
    },
    {
      id: 93, badge: "094", epoch: 5, epochName: "Caos & Milenio", year: "1983", author: "Stephen Wolfram & Matthew Cook",
      title: "Autómata Celular Regla 110 (Turing Completo)", sub: "La Complejidad Suprema a Partir de Reglas Mínimas", cat: "COMPUTACIÓN UNIVERSAL · 1983 / 2004",
      eq: "s_i^{t+1} = (s_{i-1}^t ⊕ s_i^t ⊕ s_{i+1}^t ...) = Rule 110\n01101110_2 = 110", eqShort: "Rule 110: Local CA → Universal Computation", metric: "Clase 4 de Wolfram: Complejidad en el Borde del Caos",
      hist: "Wolfram identificó y Matthew Cook demostró formalmente que un autómata celular 1D con la regla local elemental número 110 es Turing completo: puede ejecutar cualquier algoritmo computable del universo mediante colisiones de solitones discretos.",
      poem: '"Una hilera de casillas blancas y negras obedeciendo una regla escolar basta para emular todo el pensamiento del cosmos."',
      radius: 42, theta: 4.08, phi: 1.23, archetype: "rule_110", pal: 1
    },
    {
      id: 94, badge: "095", epoch: 5, epochName: "Caos & Milenio", year: "1986", author: "Chris Langton",
      title: "La Hormiga de Langton", sub: "El Orden Emergente tras el Caos Aparente", cat: "VIDA ARTIFICIAL · 1986",
      eq: "Blanca ⟹ Giro 90° D, Invierte, Avanza 1\nNegra  ⟹ Giro 90° I, Invierte, Avanza 1\nt > 10,000 ⟹ Highway (Period 104)", eqShort: "Langton Ant: 104-step Emergent Highway", metric: "Período Asintótico de Autopista: T = 104 pasos",
      hist: "Una hormiga virtual sigue dos reglas pueriles en una cuadrícula. Durante 10.000 pasos vaga en un caos aparentemente inextricable hasta que, de forma súbita e inevitable, comienza a construir una autopista perfecta de 104 pasos que avanza al infinito.",
      poem: '"Diez mil pasos de aparente delirio ciego dan a luz, de pronto, una marcha impecable hacia la eternidad."',
      radius: 42, theta: 4.40, phi: 1.08, archetype: "langton_ant", pal: 2
    },
    {
      id: 95, badge: "096", epoch: 5, epochName: "Caos & Milenio", year: "1990", author: "Haruo Yoshida",
      title: "El Integrador Simpléctico de 4º Orden de Yoshida", sub: "La Conservación Numérica Exacta de la Energía", cat: "MECÁNICA CELESTE COMPUTACIONAL · 1990",
      eq: "z_{n+1} = exp(c_i Δt D_A) exp(d_i Δt D_B) z_n\nw₁ = 1 / (2 - 2^{1/3}),  w₀ = -2^{1/3} w₁", eqShort: "z_{n+1} = ∏ exp(c_i Δt D_A) exp(d_i Δt D_B) z_n", metric: "Deriva Energética Secular: ΔH ≤ 1e-15 J",
      hist: "Haruo Yoshida dedujo coeficientes analíticos de cuarto orden que preservan la estructura simpléctica y la energía hamiltoniana exacta en simulaciones planetarias de millones de años sin perder un solo julio de energía.",
      poem: '"Dos cuerpos celestes orbitan en la máquina durante eones sin que el redondeo les robe jamás su distancia sagrada."',
      radius: 42, theta: 4.71, phi: 1.26, archetype: "yoshida_symplectic", pal: 3
    },
    {
      id: 96, badge: "097", epoch: 5, epochName: "Caos & Milenio", year: "1993", author: "Andrew Beal",
      title: "El Desierto de la Conjetura de Beal", sub: "La Repulsión de las Potencias Coprimas", cat: "TEORÍA DE NÚMEROS · 1993",
      eq: "A^x + B^y = C^z  (x, y, z > 2) ⟹ gcd(A, B, C) > 1\nPremio Beal: $1,000,000 USD", eqShort: "A^x + B^y = C^z (x,y,z>2) ⟹ gcd > 1", metric: "Exclusión Coprima: 100% Sin Soluciones para gcd=1",
      hist: "Andrew Beal ofreció $1.000.000 USD a quien resuelva la generalización del teorema de Fermat: si una suma de dos potencias da una tercera potencia (exponentes mayores que 2), las tres bases deben compartir obligatoriamente un factor primo común.",
      poem: '"En el desierto de las potencias puras, los números solitarios jamás logran sumarse sin un lazo de sangre prima."',
      radius: 42, theta: 5.03, phi: 1.11, archetype: "beal_conjecture", pal: 0
    },
    {
      id: 97, badge: "098", epoch: 5, epochName: "Caos & Milenio", year: "2002", author: "Grigori Perelman",
      title: "El Flujo de Ricci de Perelman (Poincaré)", sub: "El Alisamiento Métrico a la 3-Esfera", cat: "PROBLEMA DEL MILENIO RESUELTO · 2002",
      eq: "∂g_{ij} / ∂t = -2 R_{ij}\nℱ = ∫ (R + |∇f|²) e^{-f} dV\nConjetura de Poincaré: M³ cerrada y simplemente conexa ≅ S³", eqShort: "∂g_{ij}/∂t = -2 R_{ij}  ⟹ M³ ≅ S³", metric: "Curvatura Escalar Monótona: dℱ/dt ≥ 0",
      hist: "Grigori Perelman demostró la Conjetura de Poincaré usando el flujo de Ricci con cirugía métrica para alisar toda variedad 3D arrugada hasta converger en una esfera tridimensional perfecta. Rechazó la Medalla Fields y el millón de dólares.",
      poem: '"El calor geométrico plancha cada arruga del espacio hasta devolver a la forma la pureza de la primera esfera."',
      radius: 42, theta: 5.34, phi: 1.25, archetype: "ricci_flow", pal: 1
    },
    {
      id: 98, badge: "099", epoch: 5, epochName: "Caos & Milenio", year: "1971", author: "Stephen Cook",
      title: "P versus NP y Complejidad Computacional", sub: "La Gran Pregunta del Pensamiento Humano", cat: "PROBLEMA DEL MILENIO · 1971",
      eq: "P ≟ NP\nSAT ∈ NP-Completo (Cook-Levin Theorem)\n¿Verificar en tiempo polinómico implica resolver en tiempo polinómico?", eqShort: "P ≟ NP  (¿Es Verificar = Resolver?)", metric: "Complejidad Asintótica: P ⊆ NP ⊆ PSPACE",
      hist: "Formulado por Cook en 1971: ¿es resolver un enigma tan fácil como verificar una solución ya dada? Si P=NP, encontrar una cura contra el cáncer o una demostración matemática sería tan rápido como chequearla.",
      poem: '"Apreciar la belleza de una sinfonía toma un instante; componerla exigió la vida entera: ¿es el esfuerzo una ley infranqueable?"',
      radius: 42, theta: 5.65, phi: 1.07, archetype: "p_vs_np", pal: 2
    },
    {
      id: 99, badge: "100", epoch: 5, epochName: "Caos & Milenio", year: "1970s", author: "Glashow, Weinberg, Salam & Veltman",
      title: "El Lagrangiano del Modelo Estándar", sub: "La Ecuación que Describe Todo lo que Tocamos", cat: "FÍSICA FUNDAMENTAL · 1970s",
      eq: "ℒ_{SM} = - ¼ F_{μν} F^{μν} + i ψ̄ ⧸D ψ + |D_μ ϕ|² - V(ϕ) + ψ̄_i Y_{ij} ψ_j ϕ + h.c.\nSU(3)_C × SU(2)_L × U(1)_Y", eqShort: "ℒ_{SM} = -¼ F² + iψ̄⧸Dψ + |Dϕ|² - V(ϕ) + Yψ̄ψϕ", metric: "Grupo de Calibre: SU(3) × SU(2) × U(1)",
      hist: "La ecuación cumbre de la física moderna: resume en una sola línea compacta todas las partículas elementales conocidas (quarks, leptones, bosones de calibre y el bosón de Higgs) y tres de las cuatro fuerzas fundamentales del universo.",
      poem: '"Todo lo que el hombre ha mirado, tocado o sentido desde el inicio del tiempo cabe en esta solitaria línea de luz."',
      radius: 42, theta: 5.97, phi: 1.28, archetype: "standard_model", pal: 3
    }
  ];

  // Exportar para navegador y entornos node
  root.ARTWORKS_100 = ARTWORKS_100;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ARTWORKS_100 };
  }

})(typeof window !== 'undefined' ? window : global);
