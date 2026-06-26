import { state } from '../utils/data.js';

export function renderArchitecture(container) {
  container.innerHTML = `
    <div class="section-head mb-24">
      <div>
        <h1>System Architecture</h1>
        <p class="muted">Interactive SCADA layout · Real-time power distribution and fluid routing</p>
      </div>
      <div style="margin-left:auto; display:flex; gap:10px;">
        <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; background:var(--deep); padding:6px 12px; border-radius:8px; border:1px solid var(--border);">
          <span style="display:inline-block; width:10px; height:10px; background:var(--blue); border-radius:50%; box-shadow:0 0 8px var(--blue);"></span>
          <span>Active Power Flow</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; background:var(--deep); padding:6px 12px; border-radius:8px; border:1px solid var(--border);">
          <span style="display:inline-block; width:10px; height:10px; background:#38bdf8; border-radius:3px; border: 2px dashed #0f172a;"></span>
          <span>Water Pipe Flow</span>
        </div>
      </div>
    </div>

    <div class="grid-21 mb-24" style="grid-template-columns: 3fr 1fr; gap: 20px;">
      <!-- Interactive SVG Card -->
      <div class="card" style="padding: 16px; min-height: 520px; display: flex; align-items: center; justify-content: center; position: relative;">
        <svg id="architecture-svg" viewBox="0 0 800 500" width="100%" height="100%" style="background: rgba(0,0,0,0.15); border-radius: 12px;">
          <defs>
            <!-- Glow Filters -->
            <filter id="glow-solar" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- GRID LINES (BACKGROUND MINING LEVELS) -->
          <line x1="50" y1="260" x2="750" y2="260" stroke="rgba(255,255,255,0.04)" stroke-width="2" />
          <text x="60" y="250" fill="rgba(255,255,255,0.25)" font-family="Outfit" font-size="11" font-weight="600">LEVEL -40m (Sump Alpha)</text>
          
          <line x1="50" y1="360" x2="750" y2="360" stroke="rgba(255,255,255,0.04)" stroke-width="2" />
          <text x="60" y="350" fill="rgba(255,255,255,0.25)" font-family="Outfit" font-size="11" font-weight="600">LEVEL -80m (Sump Beta)</text>

          <line x1="50" y1="460" x2="750" y2="460" stroke="rgba(255,255,255,0.04)" stroke-width="2" />
          <text x="60" y="450" fill="rgba(255,255,255,0.25)" font-family="Outfit" font-size="11" font-weight="600">LEVEL -120m (Deep Sump)</text>

          <!-- WATER PIPELINE INFRASTRUCTURE (Draining to surface) -->
          <!-- Sump Alpha drainage pipe -->
          <path d="M 280 270 L 280 180 L 730 180" fill="none" stroke="rgba(56, 189, 248, 0.2)" stroke-width="6" stroke-linecap="round"/>
          <path id="water-flow-alpha" d="M 280 270 L 280 180 L 730 180" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 5" class="power-flow-path" style="display:none;"/>
          
          <!-- Sump Beta drainage pipe -->
          <path d="M 520 370 L 520 190 L 730 190" fill="none" stroke="rgba(56, 189, 248, 0.2)" stroke-width="6" stroke-linecap="round"/>
          <path id="water-flow-beta" d="M 520 370 L 520 190 L 730 190" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 5" class="power-flow-path" style="display:none;"/>

          <!-- Deep workings drainage pipe -->
          <path d="M 280 470 L 260 470 L 260 210 L 730 210" fill="none" stroke="rgba(56, 189, 248, 0.2)" stroke-width="6" stroke-linecap="round"/>
          <path id="water-flow-delta" d="M 280 470 L 260 470 L 260 210 L 730 210" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 5" class="power-flow-path" style="display:none;"/>

          <!-- POWER BUSBARS (routing power from source to load) -->
          <!-- Solar -> Central Controller -->
          <path d="M 150 90 L 400 90 L 400 130" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" />
          <path id="power-flow-solar" d="M 150 90 L 400 90 L 400 130" fill="none" stroke="var(--solar)" stroke-width="3" class="power-flow-path" style="display:none;" />

          <!-- Biomass -> Central Controller -->
          <path d="M 650 90 L 400 90 L 400 130" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" />
          <path id="power-flow-biomass" d="M 650 90 L 400 90 L 400 130" fill="none" stroke="var(--green)" stroke-width="3" class="power-flow-path" style="display:none;" />

          <!-- Battery <-> Central Controller -->
          <path d="M 400 210 L 400 160" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" />
          <path id="power-flow-battery" d="M 400 210 L 400 160" fill="none" stroke="var(--blue)" stroke-width="3" class="power-flow-path" style="display:none;" />

          <!-- Controller -> Pump Alpha (Level -40m Left) -->
          <path d="M 380 150 L 160 150 L 160 270" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="3"/>
          <path id="power-flow-p1" d="M 380 150 L 160 150 L 160 270" fill="none" stroke="var(--blue)" stroke-width="2" class="power-flow-path" style="display:none;"/>

          <!-- Controller -> Pump Gamma (Level -40m Right) -->
          <path d="M 380 150 L 320 150 L 320 270" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="3"/>
          <path id="power-flow-p3" d="M 380 150 L 320 150 L 320 270" fill="none" stroke="var(--blue)" stroke-width="2" class="power-flow-path" style="display:none;"/>

          <!-- Controller -> Pump Beta (Level -80m) -->
          <path d="M 420 150 L 560 150 L 560 370" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="3"/>
          <path id="power-flow-p2" d="M 420 150 L 560 150 L 560 370" fill="none" stroke="var(--blue)" stroke-width="2" class="power-flow-path" style="display:none;"/>

          <!-- Controller -> Pump Delta (Level -120m) -->
          <path d="M 380 150 L 120 150 L 120 470 M 120 470 L 180 470" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="3"/>
          <path id="power-flow-p4" d="M 380 150 L 120 150 L 120 470 M 120 470 L 180 470" fill="none" stroke="var(--blue)" stroke-width="2" class="power-flow-path" style="display:none;"/>

          <!-- NODES: SOURCES -->
          <!-- Solar Arrays -->
          <g transform="translate(100, 50)" class="svg-node" onclick="showNodeDetails('solar')">
            <rect width="100" height="60" rx="8" fill="rgba(15,23,42,0.85)" stroke="var(--solar)" stroke-width="2" />
            <text x="50" y="24" fill="#ffffff" font-family="Outfit" font-size="11" font-weight="700" text-anchor="middle">☀️ SOLAR ARRAY</text>
            <text x="50" y="44" id="svg-solar-power" fill="var(--solar)" font-family="JetBrains Mono" font-size="12" font-weight="700" text-anchor="middle">0.0 kW</text>
          </g>

          <!-- Biomass Gasification Unit -->
          <g transform="translate(600, 50)" class="svg-node" onclick="showNodeDetails('biomass')">
            <rect width="100" height="60" rx="8" fill="rgba(15,23,42,0.85)" stroke="var(--green)" stroke-width="2" />
            <text x="50" y="24" fill="#ffffff" font-family="Outfit" font-size="11" font-weight="700" text-anchor="middle">🌿 BIOMASS UNIT</text>
            <text x="50" y="44" id="svg-biomass-power" fill="var(--green)" font-family="JetBrains Mono" font-size="12" font-weight="700" text-anchor="middle">0.0 kW</text>
          </g>

          <!-- Battery Energy Storage System (BESS) -->
          <g transform="translate(330, 210)" class="svg-node" onclick="showNodeDetails('battery')">
            <rect width="140" height="40" rx="8" fill="rgba(15,23,42,0.85)" stroke="var(--blue)" stroke-width="2" />
            <!-- Dynamic Battery Fill Bar -->
            <rect id="svg-battery-fill" x="6" y="6" width="128" height="28" rx="4" fill="rgba(0,184,255,0.15)" />
            <text x="70" y="24" id="svg-battery-soc" fill="#ffffff" font-family="Outfit" font-size="12" font-weight="700" text-anchor="middle">🔋 BATTERY: 0%</text>
          </g>

          <!-- Smart Telemetry Controller (SCADA Node) -->
          <g transform="translate(350, 120)" class="svg-node" onclick="showNodeDetails('controller')">
            <rect width="100" height="45" rx="6" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
            <text x="50" y="20" fill="#cbd5e1" font-family="Outfit" font-size="9" font-weight="700" text-anchor="middle">SCADA HUB</text>
            <text x="50" y="34" id="svg-grid-load" fill="var(--blue)" font-family="JetBrains Mono" font-size="10" font-weight="700" text-anchor="middle">LOAD: 0kW</text>
          </g>

          <!-- PUMPS & WATER BODIES -->
          <!-- LEVEL -40m LEFT: P-01 (Alpha) -->
          <g transform="translate(130, 270)" class="svg-node" onclick="showNodeDetails('P-01')">
            <circle id="svg-pump-p1-bg" cx="30" cy="30" r="26" fill="rgba(15,23,42,0.85)" stroke="var(--border)" stroke-width="2" />
            <text x="30" y="28" fill="#ffffff" font-family="Outfit" font-size="10" font-weight="700" text-anchor="middle">P-01</text>
            <text x="30" y="44" id="svg-pump-p1-status" fill="var(--muted)" font-family="Outfit" font-size="8" font-weight="700" text-anchor="middle">OFF</text>
          </g>
          <!-- LEVEL -40m RIGHT: Sump Alpha -->
          <g transform="translate(190, 275)">
            <rect width="60" height="30" rx="3" fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.3)" />
            <rect id="svg-sump1-fill" x="2" y="2" width="56" height="26" fill="rgba(56,189,248,0.35)" />
            <text x="30" y="18" id="svg-sump1-text" fill="#ffffff" font-family="Outfit" font-size="10" font-weight="600" text-anchor="middle">0%</text>
          </g>

          <!-- LEVEL -40m CENTER-RIGHT: P-03 (Gamma) -->
          <g transform="translate(290, 270)" class="svg-node" onclick="showNodeDetails('P-03')">
            <circle id="svg-pump-p3-bg" cx="30" cy="30" r="26" fill="rgba(15,23,42,0.85)" stroke="var(--border)" stroke-width="2" />
            <text x="30" y="28" fill="#ffffff" font-family="Outfit" font-size="10" font-weight="700" text-anchor="middle">P-03</text>
            <text x="30" y="44" id="svg-pump-p3-status" fill="var(--muted)" font-family="Outfit" font-size="8" font-weight="700" text-anchor="middle">OFF</text>
          </g>

          <!-- LEVEL -80m: P-02 (Beta) -->
          <g transform="translate(530, 370)" class="svg-node" onclick="showNodeDetails('P-02')">
            <circle id="svg-pump-p2-bg" cx="30" cy="30" r="26" fill="rgba(15,23,42,0.85)" stroke="var(--border)" stroke-width="2" />
            <text x="30" y="28" fill="#ffffff" font-family="Outfit" font-size="10" font-weight="700" text-anchor="middle">P-02</text>
            <text x="30" y="44" id="svg-pump-p2-status" fill="var(--muted)" font-family="Outfit" font-size="8" font-weight="700" text-anchor="middle">OFF</text>
          </g>
          <!-- LEVEL -80m RIGHT: Sump Beta -->
          <g transform="translate(595, 375)">
            <rect width="60" height="30" rx="3" fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.3)" />
            <rect id="svg-sump2-fill" x="2" y="2" width="56" height="26" fill="rgba(56,189,248,0.35)" />
            <text x="30" y="18" id="svg-sump2-text" fill="#ffffff" font-family="Outfit" font-size="10" font-weight="600" text-anchor="middle">0%</text>
          </g>

          <!-- LEVEL -120m: P-04 (Delta) -->
          <g transform="translate(180, 435)" class="svg-node" onclick="showNodeDetails('P-04')">
            <circle id="svg-pump-p4-bg" cx="30" cy="30" r="26" fill="rgba(15,23,42,0.85)" stroke="var(--border)" stroke-width="2" />
            <text x="30" y="28" fill="#ffffff" font-family="Outfit" font-size="10" font-weight="700" text-anchor="middle">P-04</text>
            <text x="30" y="44" id="svg-pump-p4-status" fill="var(--muted)" font-family="Outfit" font-size="8" font-weight="700" text-anchor="middle">OFF</text>
          </g>
          <!-- LEVEL -120m LEFT: Main Deep Sump -->
          <g transform="translate(50, 435)">
            <rect width="80" height="40" rx="4" fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.3)" />
            <rect id="svg-pit-fill" x="2" y="2" width="76" height="36" fill="rgba(56,189,248,0.35)" />
            <text x="40" y="24" id="svg-pit-text" fill="#ffffff" font-family="Outfit" font-size="11" font-weight="600" text-anchor="middle">0%</text>
          </g>

          <!-- SURFACE OUTLET / TREATMENT DISCHARGE -->
          <g transform="translate(680, 150)">
            <path d="M 10 10 L 30 20 L 10 30 Z" fill="rgba(0,184,255,0.2)" stroke="var(--blue)" stroke-width="1.5" />
            <text x="45" y="24" fill="#ffffff" font-family="Outfit" font-size="10" font-weight="700">DISCHARGE</text>
            <text x="45" y="38" id="svg-discharge-rate" fill="var(--blue)" font-family="JetBrains Mono" font-size="9" font-weight="700">0 L/m</text>
          </g>
        </svg>
      </div>

      <!-- Node Telemetry Inspector Card -->
      <div class="card" id="inspector-card" style="display:flex; flex-direction:column; justify-content:center; border-color: rgba(255, 255, 255, 0.05);">
        <div style="text-align: center; color: var(--muted); padding: 20px;" id="inspector-placeholder">
          <span style="font-size: 2.2rem; display:block; margin-bottom:12px;">📡</span>
          <h3>SCADA Node Inspector</h3>
          <p class="muted mt-16" style="font-size: 0.8rem;">Click on any component node in the diagram to inspect real-time telemetry streams and metrics.</p>
        </div>
        <div id="inspector-details" style="display: none;"></div>
      </div>
    </div>
  `;

  // Bind node click actions
  window.showNodeDetails = function(nodeId) {
    const placeholder = document.getElementById('inspector-placeholder');
    const detailsDiv = document.getElementById('inspector-details');
    const card = document.getElementById('inspector-card');

    if (!placeholder || !detailsDiv || !card) return;

    placeholder.style.display = 'none';
    detailsDiv.style.display = 'block';

    let html = '';
    
    if (nodeId === 'solar') {
      card.style.borderColor = 'var(--solar)';
      html = `
        <h3 style="color: var(--solar); font-size:1.15rem; margin-bottom:16px; display:flex; align-items:center; gap:8px;">☀️ Solar PV Array</h3>
        <p class="muted mb-16">High-efficiency string array supplying prime daylight operational power directly to dewatering busbars.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${inspRow('Solar Power Output', state.solar.power.toFixed(1) + ' kW')}
          ${inspRow('Bus Voltage', state.solar.voltage + ' V')}
          ${inspRow('Calculated Current', state.solar.current + ' A')}
          ${inspRow('PV Irradiance', state.solar.irradiance + ' W/m²')}
          ${inspRow('Panels Active', `${state.solar.active} / ${state.solar.panels}`)}
          ${inspRow('Array Status', state.solar.status.toUpperCase())}
        </div>
      `;
    } 
    else if (nodeId === 'biomass') {
      card.style.borderColor = 'var(--green)';
      html = `
        <h3 style="color: var(--green); font-size:1.15rem; margin-bottom:16px; display:flex; align-items:center; gap:8px;">🌿 Biomass Unit</h3>
        <p class="muted mb-16">Zero-waste gasification engine consuming local agricultural residues to maintain 24/7 autonomous baseload energy.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${inspRow('Biomass Power', state.biomass.power.toFixed(1) + ' kW')}
          ${inspRow('Thermal Fuel Level', state.biomass.fuelLevel.toFixed(1) + '%')}
          ${inspRow('Reactor Core Temp', state.biomass.temperature.toFixed(0) + ' °C')}
          ${inspRow('Unit Status', state.biomass.status.toUpperCase())}
        </div>
        <button class="btn btn-ghost mt-16" style="width:100%; justify-content:center; border-color:var(--green);" onclick="refillBiomassTrigger()">
          ⚡ Refill Agricultural Fuel
        </button>
      `;
    } 
    else if (nodeId === 'battery') {
      card.style.borderColor = 'var(--blue)';
      html = `
        <h3 style="color: var(--blue); font-size:1.15rem; margin-bottom:16px; display:flex; align-items:center; gap:8px;">🔋 Battery Storage</h3>
        <p class="muted mb-16">Lithium Iron Phosphate (LFP) chemistry bank damping solar load swings and ensuring overnight autonomy.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${inspRow('State of Charge', state.battery.soc.toFixed(1) + '%')}
          ${inspRow('Battery Voltage', state.battery.voltage + ' V')}
          ${inspRow('Current Flow', state.battery.current.toFixed(1) + ' A')}
          ${inspRow('System Health (SOH)', state.battery.health + '%')}
          ${inspRow('Reserve Autonomy', state.battery.estimatedHours + ' hrs')}
        </div>
      `;
    } 
    else if (nodeId === 'controller') {
      card.style.borderColor = 'rgba(255,255,255,0.2)';
      const totalLoad = state.pumps.filter(p => p.status === 'running').reduce((acc, p) => acc + p.power, 0);
      const totalGen = state.solar.power + state.biomass.power;
      html = `
        <h3 style="color: #cbd5e1; font-size:1.15rem; margin-bottom:16px; display:flex; align-items:center; gap:8px;">📟 SCADA Hub</h3>
        <p class="muted mb-16">Intelligent automation controller coordinating hybrid grid balance, pump protection, and telemetry flows.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${inspRow('Automation Mode', state.autoMode ? 'ACTIVE' : 'MANUAL OVERRIDE')}
          ${inspRow('Total Active Load', totalLoad.toFixed(1) + ' kW')}
          ${inspRow('Total Generation', totalGen.toFixed(1) + ' kW')}
          ${inspRow('Rainfall Monitor', state.environment.rainfall + ' mm/h')}
          ${inspRow('Telemetry Status', 'ENCRYPTED SSL')}
        </div>
      `;
    } 
    else if (nodeId.startsWith('P-')) {
      const p = state.pumps.find(pump => pump.id === nodeId);
      card.style.borderColor = p.status === 'running' ? 'var(--green)' : 'rgba(255,255,255,0.06)';
      html = `
        <h3 style="color: #ffffff; font-size:1.15rem; margin-bottom:4px; display:flex; align-items:center; gap:8px;">⚙️ ${p.name}</h3>
        <div class="muted mb-16">${p.id} · Priority: ${p.priority}</div>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom: 20px;">
          ${inspRow('Operating Status', p.status.toUpperCase())}
          ${inspRow('Current Zone', p.zone)}
          ${inspRow('Hydraulic Flow', p.status === 'running' ? p.flow.toFixed(1) + ' L/min' : '0.0 L/min')}
          ${inspRow('Motor Load Draw', p.power.toFixed(1) + ' kW')}
          ${inspRow('Discharge Pressure', p.status === 'running' ? p.pressure.toFixed(1) + ' bar' : '0.0 bar')}
          ${inspRow('Motor Winding Temp', p.temp.toFixed(0) + ' °C')}
          ${inspRow('Total Run Hours', p.hours.toFixed(0) + ' h')}
        </div>
        <div style="display:flex; gap:8px;">
          ${p.status === 'running'
            ? `<button class="btn btn-danger" style="flex:1; justify-content:center;" onclick="setPumpStatus('${p.id}','standby'); showNodeDetails('${p.id}');">Stop Pump</button>`
            : `<button class="btn btn-primary" style="flex:1; justify-content:center;" onclick="setPumpStatus('${p.id}','running'); showNodeDetails('${p.id}');">Start Pump</button>`
          }
        </div>
      `;
    }

    detailsDiv.innerHTML = html;
  };

  window.refillBiomassTrigger = function() {
    state.biomass.fuelLevel = 100.0;
    addAlert('success', 'Biomass Fuel Refilled', 'Gasification fuel hopper replenished to 100% capacity.');
    showNodeDetails('biomass');
  };

  function inspRow(label, val) {
    return `
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.03); font-size:0.84rem;">
        <span style="color:var(--muted);">${label}</span>
        <strong style="color:var(--text);">${val}</strong>
      </div>`;
  }

  // Update visual elements on ticks
  const updateSVGtelemetry = () => {
    // 1. Solar
    const solarText = document.getElementById('svg-solar-power');
    const solarFlow = document.getElementById('power-flow-solar');
    if (solarText) solarText.textContent = `${state.solar.power.toFixed(1)} kW`;
    if (solarFlow) solarFlow.style.display = state.solar.power > 0 ? 'block' : 'none';

    // 2. Biomass
    const bioText = document.getElementById('svg-biomass-power');
    const bioFlow = document.getElementById('power-flow-biomass');
    if (bioText) bioText.textContent = `${state.biomass.power.toFixed(1)} kW`;
    if (bioFlow) bioFlow.style.display = state.biomass.power > 0 ? 'block' : 'none';

    // 3. Battery
    const batSocText = document.getElementById('svg-battery-soc');
    const batFill = document.getElementById('svg-battery-fill');
    const batFlow = document.getElementById('power-flow-battery');
    if (batSocText) batSocText.textContent = `🔋 BESS: ${state.battery.soc.toFixed(0)}%`;
    if (batFill) {
      batFill.setAttribute('width', (128 * (state.battery.soc / 100)).toFixed(0));
      batFill.setAttribute('fill', state.battery.current < 0 ? 'rgba(16,185,129,0.25)' : 'rgba(0,184,255,0.25)');
    }
    if (batFlow) {
      batFlow.style.display = Math.abs(state.battery.current) > 0.5 ? 'block' : 'none';
      batFlow.setAttribute('stroke', state.battery.current < 0 ? 'var(--green)' : 'var(--blue)');
    }

    // 4. Controller Load
    const gridLoad = document.getElementById('svg-grid-load');
    const totalLoad = state.pumps.filter(p => p.status === 'running').reduce((acc, p) => acc + p.power, 0);
    if (gridLoad) gridLoad.textContent = `LOAD: ${totalLoad.toFixed(1)}kW`;

    // 5. Water Levels Fills
    const pitFill = document.getElementById('svg-pit-fill');
    const pitText = document.getElementById('svg-pit-text');
    if (pitFill && pitText) {
      pitFill.setAttribute('height', (36 * (state.water.pit.level / 100)).toFixed(0));
      pitFill.setAttribute('y', (38 - (36 * (state.water.pit.level / 100)) + 2).toFixed(0));
      pitText.textContent = `${state.water.pit.level.toFixed(0)}%`;
    }

    const sump1Fill = document.getElementById('svg-sump1-fill');
    const sump1Text = document.getElementById('svg-sump1-text');
    if (sump1Fill && sump1Text) {
      sump1Fill.setAttribute('height', (26 * (state.water.sump1.level / 100)).toFixed(0));
      sump1Fill.setAttribute('y', (28 - (26 * (state.water.sump1.level / 100)) + 2).toFixed(0));
      sump1Text.textContent = `${state.water.sump1.level.toFixed(0)}%`;
    }

    const sump2Fill = document.getElementById('svg-sump2-fill');
    const sump2Text = document.getElementById('svg-sump2-text');
    if (sump2Fill && sump2Text) {
      sump2Fill.setAttribute('height', (26 * (state.water.sump2.level / 100)).toFixed(0));
      sump2Fill.setAttribute('y', (28 - (26 * (state.water.sump2.level / 100)) + 2).toFixed(0));
      sump2Text.textContent = `${state.water.sump2.level.toFixed(0)}%`;
    }

    // 6. Pumps Status Circles & Flows
    const pumpsStatus = {
      'P-01': { bg: 'svg-pump-p1-bg', text: 'svg-pump-p1-status', power: 'power-flow-p1', water: 'water-flow-alpha' },
      'P-02': { bg: 'svg-pump-p2-bg', text: 'svg-pump-p2-status', power: 'power-flow-p2', water: 'water-flow-beta' },
      'P-03': { bg: 'svg-pump-p3-bg', text: 'svg-pump-p3-status', power: 'power-flow-p3', water: 'water-flow-alpha' },
      'P-04': { bg: 'svg-pump-p4-bg', text: 'svg-pump-p4-status', power: 'power-flow-p4', water: 'water-flow-delta' }
    };

    state.pumps.forEach(p => {
      const els = pumpsStatus[p.id];
      if (!els) return;

      const bgCircle = document.getElementById(els.bg);
      const statusText = document.getElementById(els.text);
      const pFlow = document.getElementById(els.power);
      const wFlow = document.getElementById(els.water);

      if (p.status === 'running') {
        if (bgCircle) bgCircle.setAttribute('stroke', 'var(--green)');
        if (statusText) { statusText.textContent = 'RUN'; statusText.setAttribute('fill', 'var(--green)'); }
        if (pFlow) pFlow.style.display = 'block';
        if (wFlow) wFlow.style.display = 'block';
      } else if (p.status === 'fault') {
        if (bgCircle) bgCircle.setAttribute('stroke', 'var(--red)');
        if (statusText) { statusText.textContent = 'FAULT'; statusText.setAttribute('fill', 'var(--red)'); }
        if (pFlow) pFlow.style.display = 'none';
        if (wFlow) wFlow.style.display = 'none';
      } else {
        if (bgCircle) bgCircle.setAttribute('stroke', 'var(--border)');
        if (statusText) { statusText.textContent = 'OFF'; statusText.setAttribute('fill', 'var(--muted)'); }
        if (pFlow) pFlow.style.display = 'none';
        if (wFlow) wFlow.style.display = 'none';
      }
    });

    // 7. Discharge Rate
    const dischargeText = document.getElementById('svg-discharge-rate');
    if (dischargeText) dischargeText.textContent = `${state.water.discharge.rate.toFixed(0)} L/m`;
  };

  // Perform initial update and bind listener
  updateSVGtelemetry();

  const handleTick = () => {
    updateSVGtelemetry();
    
    // Also refresh the inspector card if open
    const inspectorDetails = document.getElementById('inspector-details');
    if (inspectorDetails && inspectorDetails.style.display === 'block') {
      // Find what is currently open by checking title string
      const title = inspectorDetails.querySelector('h3').textContent;
      if (title.includes('Solar')) showNodeDetails('solar');
      else if (title.includes('Biomass')) showNodeDetails('biomass');
      else if (title.includes('Battery')) showNodeDetails('battery');
      else if (title.includes('SCADA')) showNodeDetails('controller');
      else if (title.includes('Pump Alpha') || title.includes('P-01')) showNodeDetails('P-01');
      else if (title.includes('Pump Beta') || title.includes('P-02')) showNodeDetails('P-02');
      else if (title.includes('Pump Gamma') || title.includes('P-03')) showNodeDetails('P-03');
      else if (title.includes('Pump Delta') || title.includes('P-04')) showNodeDetails('P-04');
    }
  };

  window.addEventListener('telemetry-tick', handleTick);

  // Clean up listener
  container.addEventListener('destroy-page', () => {
    window.removeEventListener('telemetry-tick', handleTick);
  }, { once: true });
}
