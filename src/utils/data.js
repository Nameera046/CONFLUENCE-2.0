// ── Simulated Sensor Data Store & Control Loop ─────────────────────────────
// Mimics real IoT sensor telemetry feeds and automated system logic.

export const state = {
  // Mode selection
  autoMode: true,
  diagnosticsRunning: false,
  diagnosticLogs: [],

  // Energy Sources
  solar: {
    power: 18.4,       // kW
    voltage: 396,      // V
    current: 46.4,     // A
    efficiency: 87,    // %
    panels: 24,
    active: 22,
    irradiance: 842,   // W/m²
    status: 'optimal'  // optimal, shaded, offline
  },
  biomass: {
    power: 0.0,        // kW (Starts off during high solar)
    fuelLevel: 68,     // %
    temperature: 45,   // °C (cold when off)
    running: false,
    status: 'standby'  // standby, heating, running, empty
  },
  battery: {
    soc: 74,           // State of Charge %
    voltage: 480,      // V
    current: -12.4,    // A (negative = charging, positive = discharging)
    health: 92,        // %
    estimatedHours: 5.8,
    capacity: 100,     // kWh total capacity
    chargeRate: 15,    // Max charge rate kW
    dischargeRate: 20  // Max discharge rate kW
  },

  // Pump Systems
  // P-01 & P-02 are high priority, P-03 is medium, P-04 is underground deep sump
  pumps: [
    { id: 'P-01', name: 'Pump Alpha', zone: 'Level -40m',  status: 'running', flow: 42.5, power: 5.8, pressure: 3.2, temp: 62, hours: 1284, priority: 'High' },
    { id: 'P-02', name: 'Pump Beta',  zone: 'Level -80m',  status: 'running', flow: 38.1, power: 5.1, pressure: 5.6, temp: 71, hours: 976,  priority: 'High' },
    { id: 'P-03', name: 'Pump Gamma', zone: 'Level -40m',  status: 'standby', flow: 0,    power: 0,   pressure: 0,   temp: 28, hours: 2341, priority: 'Medium' },
    { id: 'P-04', name: 'Pump Delta', zone: 'Level -120m', status: 'running', flow: 51.2, power: 7.2, pressure: 8.1, temp: 68, hours: 432,  priority: 'Critical' }
  ],

  // Water Levels
  water: {
    pit: { level: 34, inflow: 85, max: 100, label: 'Main Pit' },
    sump1: { level: 56, inflow: 45, max: 100, label: 'Sump Alpha (-40m)' },
    sump2: { level: 22, inflow: 30, max: 100, label: 'Sump Beta (-80m)' },
    discharge: { rate: 131.8, unit: 'L/min' }
  },

  // Environmental Sensors
  environment: {
    rainfall: 0.0,      // mm/h
    solarShading: 0,    // % (due to clouds/dust)
    ambientTemp: 34,    // °C
    humidity: 67,       // %
    windSpeed: 12       // km/h
  },

  // Alerts
  alerts: [
    { id: 1, type: 'warning', title: 'Panel P-07 output degraded', time: '09:14', msg: 'Output 23% below nominal. Possible soiling or fault.', read: false },
    { id: 2, type: 'info',    title: 'Biomass fuel resupply due', time: '08:30', msg: 'Current stock will last ~18 hours at present consumption rate.', read: false },
    { id: 3, type: 'success', title: 'Battery fully charged at 06:45', time: '06:45', msg: 'Solar generation exceeded load. Battery reached 100% SOC.', read: true },
    { id: 4, type: 'error',   title: 'Pump P-03 maintenance overdue', time: 'Yesterday', msg: '2341 hours since last service. Schedule inspection.', read: false }
  ]
};

// Simulated historical values for charts
export function generateEnergyHistory(points = 24) {
  const labels = [];
  const solar = [];
  const biomass = [];
  const load = [];

  for (let i = 0; i < points; i++) {
    const hour = (new Date().getHours() - (points - 1 - i) + 24) % 24;
    labels.push(`${String(hour).padStart(2, '0')}:00`);

    // Solar curve peaks at 12:00
    let solVal = 0;
    if (hour >= 6 && hour <= 18) {
      solVal = Math.sin((hour - 6) / 12 * Math.PI) * 22;
      solVal = Math.max(0, solVal + (Math.random() - 0.5) * 2);
    }
    solar.push(+solVal.toFixed(1));

    // Biomass steps in at night/early morning to cover load
    let bioVal = 0;
    if (hour < 6 || hour > 18) {
      bioVal = 6.0 + (Math.random() - 0.5) * 0.8;
    } else if (hour < 8 || hour > 16) {
      bioVal = 3.0 + (Math.random() - 0.5) * 0.5;
    }
    biomass.push(+bioVal.toFixed(1));

    // Load fluctuates with active pumps (around 10-18 kW)
    const loadVal = 12 + Math.sin(hour / 24 * Math.PI * 2) * 3 + (Math.random() - 0.5) * 1.5;
    load.push(+loadVal.toFixed(1));
  }

  return { labels, solar, biomass, load };
}

export function generateWaterHistory(points = 12) {
  const labels = [];
  const pitLevel = [];
  const inflow = [];
  const outflow = [];

  for (let i = 0; i < points; i++) {
    const hour = (new Date().getHours() - (points - 1 - i) * 2 + 24) % 24;
    labels.push(`${String(hour).padStart(2, '0')}:00`);
    
    // Pit level goes down during solar hours, up when pumps are resting
    const basePit = 35 + Math.sin((hour - 12) / 12 * Math.PI) * 8;
    pitLevel.push(Math.max(10, Math.min(100, +(basePit + (Math.random() - 0.5) * 2).toFixed(1))));
    
    inflow.push(+(75 + Math.sin(hour/6) * 10 + (Math.random() - 0.5)*5).toFixed(0));
    outflow.push(+(120 + Math.sin((hour-6)/6) * 15 + (Math.random() - 0.5)*5).toFixed(0));
  }

  return { labels, pitLevel, inflow, outflow };
}

// Global alert adder
export function addAlert(type, title, msg) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const id = state.alerts.length > 0 ? Math.max(...state.alerts.map(a => a.id)) + 1 : 1;
  state.alerts.unshift({ id, type, title, time, msg, read: false });
  // Limit to 20 alerts
  if (state.alerts.length > 20) state.alerts.pop();
}

// Run Diagnostics simulation
export function runDiagnostics() {
  state.diagnosticsRunning = true;
  state.diagnosticLogs = [];
  
  const steps = [
    { delay: 500, log: "Initializing Diagnostics Subsystem..." },
    { delay: 1200, log: "Checking solar panel string resistance and voltages..." },
    { delay: 2000, log: "Solar String A-1 (optimal): 396V. String B-2 (optimal): 394V." },
    { delay: 2800, log: "Testing biomass gasifier pilot ignition temperature..." },
    { delay: 3500, log: "Biomass Gasifier: Igniter checked, pressure stable at 1.05 bar." },
    { delay: 4200, log: "Querying Battery Management System (BMS)..." },
    { delay: 5000, log: "Battery Pack: Health 92%. Cell temperature 31.4°C. Balanced." },
    { delay: 5800, log: "Checking Pump Fleet telemetry..." },
    { delay: 6500, log: "P-01: Stable. P-02: Stable. P-04: High head load but normal temp." },
    { delay: 7200, log: "WARNING: Pump P-03 maintenance is overdue (2341 run hours)." },
    { delay: 8000, log: "Diagnostics Complete: All systems operational. 1 Warning." }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      if (state.diagnosticsRunning) {
        state.diagnosticLogs.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          text: step.log
        });
        // Dispatch UI update event
        window.dispatchEvent(new CustomEvent('diagnostics-update'));
        
        if (step.log.includes("Complete")) {
          state.diagnosticsRunning = false;
        }
      }
    }, step.delay);
  });
}

// Local simulation tick loop - executes once per second
export function tick() {
  // 1. Environmental Telemetry Dynamics
  // Natural variation in ambient temperature and humidity
  state.environment.ambientTemp = +(state.environment.ambientTemp + (Math.random() - 0.5) * 0.2).toFixed(1);
  state.environment.humidity = Math.max(10, Math.min(100, +(state.environment.humidity + (Math.random() - 0.5) * 0.5).toFixed(0)));
  
  // 2. Solar Generation Dynamics
  // Base solar potential depends on "time" (here simulated by real minutes/seconds)
  const date = new Date();
  const hour = date.getHours() + date.getMinutes() / 60;
  
  // Base solar potential based on diurnal curve
  let baseSolarPower = 0;
  let baseIrradiance = 0;
  
  if (hour >= 6 && hour <= 18) {
    const angle = (hour - 6) / 12 * Math.PI;
    baseSolarPower = Math.sin(angle) * 20; // Max 20kW
    baseIrradiance = Math.sin(angle) * 900; // Max 900 W/m²
  }

  // Apply environment solar shading (clouds, dust)
  const shadingFactor = (100 - state.environment.solarShading) / 100;
  state.solar.power = +(baseSolarPower * shadingFactor * (0.95 + Math.random() * 0.1)).toFixed(1);
  state.solar.irradiance = +(baseIrradiance * shadingFactor * (0.98 + Math.random() * 0.04)).toFixed(0);
  
  if (state.solar.power > 0) {
    state.solar.voltage = +(380 + (state.solar.power * 1.5) + (Math.random() - 0.5) * 2).toFixed(0);
    state.solar.current = +(state.solar.power * 1000 / state.solar.voltage).toFixed(1);
    state.solar.status = state.environment.solarShading > 40 ? 'shaded' : 'optimal';
  } else {
    state.solar.power = 0;
    state.solar.voltage = 0;
    state.solar.current = 0;
    state.solar.status = 'offline';
  }
  
  // 3. Biomass Telemetry Dynamics
  if (state.biomass.running) {
    // Biomass burns fuel
    const burnRate = 0.02; // % per tick
    state.biomass.fuelLevel = Math.max(0, +(state.biomass.fuelLevel - burnRate).toFixed(3));
    
    if (state.biomass.fuelLevel <= 0) {
      state.biomass.running = false;
      state.biomass.power = 0;
      state.biomass.status = 'empty';
      state.biomass.temperature = +(state.biomass.temperature * 0.95).toFixed(1);
      addAlert('error', 'Biomass fuel exhausted', 'Biomass unit has automatically shutdown due to fuel depletion.');
    } else {
      // Warm up / Running temp
      if (state.biomass.temperature < 320) {
        state.biomass.temperature = Math.min(340, +(state.biomass.temperature + 5 + Math.random() * 2).toFixed(1));
        state.biomass.power = +((state.biomass.temperature / 340) * 6.5).toFixed(1);
        state.biomass.status = 'heating';
      } else {
        state.biomass.temperature = +(340 + (Math.random() - 0.5) * 4).toFixed(1);
        state.biomass.power = +(6.5 + (Math.random() - 0.5) * 0.2).toFixed(1);
        state.biomass.status = 'running';
      }
    }
  } else {
    // Cooling down
    state.biomass.power = 0;
    state.biomass.status = state.biomass.fuelLevel <= 0 ? 'empty' : 'standby';
    if (state.biomass.temperature > state.environment.ambientTemp) {
      state.biomass.temperature = +(state.biomass.temperature - (state.biomass.temperature - state.environment.ambientTemp) * 0.02).toFixed(1);
    }
  }

  // 4. Pump Fleet Dynamics & Water Pumping
  let totalOutflowRate = 0;
  let totalPumpLoad = 0;

  state.pumps.forEach(p => {
    if (p.status === 'running') {
      // Flow rate fluctuates based on pump efficiency
      const targetFlow = p.id === 'P-01' ? 42.5 : p.id === 'P-02' ? 38.1 : p.id === 'P-03' ? 45.0 : 51.2;
      const targetPower = p.id === 'P-01' ? 5.8 : p.id === 'P-02' ? 5.1 : p.id === 'P-03' ? 6.2 : 7.2;
      const targetPressure = p.id === 'P-01' ? 3.2 : p.id === 'P-02' ? 5.6 : p.id === 'P-03' ? 4.1 : 8.1;

      p.flow = +(targetFlow + (Math.random() - 0.5) * 1.5).toFixed(1);
      p.power = +(targetPower + (Math.random() - 0.5) * 0.1).toFixed(1);
      p.pressure = +(targetPressure + (Math.random() - 0.5) * 0.2).toFixed(1);
      
      // Temperature heats up based on power draw
      const targetTemp = 60 + p.power * 2;
      if (p.temp < targetTemp) {
        p.temp = +(p.temp + 0.5 + Math.random() * 0.2).toFixed(1);
      } else {
        p.temp = +(targetTemp + (Math.random() - 0.5) * 1).toFixed(1);
      }

      // Heat alarms
      if (p.temp > 75 && Math.random() > 0.98) {
        addAlert('warning', `${p.name} high temperature alert`, `Motor winding temperature reached ${p.temp.toFixed(0)}°C.`);
      }

      // Add to hours
      p.hours = +(p.hours + 0.0003).toFixed(4); // approx. run time increment

      totalOutflowRate += p.flow;
      totalPumpLoad += p.power;
    } else {
      // Standby / stopped
      p.flow = 0;
      p.power = 0;
      p.pressure = 0;
      if (p.temp > state.environment.ambientTemp) {
        p.temp = +(p.temp - (p.temp - state.environment.ambientTemp) * 0.05).toFixed(1);
      }
    }
  });

  state.water.discharge.rate = totalOutflowRate;

  // 5. Water Level Simulation (Inflow vs Outflow)
  // Rain increases inflows significantly
  const rainEffect = state.environment.rainfall * 15; // liters/min added per mm/h of rain
  
  // Base inflows
  state.water.pit.inflow = 80 + rainEffect + (Math.random() - 0.5) * 4;
  state.water.sump1.inflow = 40 + rainEffect * 0.5 + (Math.random() - 0.5) * 2;
  state.water.sump2.inflow = 30 + rainEffect * 0.3 + (Math.random() - 0.5) * 1.5;

  // Level changes (net = inflow - outflow)
  // Outflows are mapped to pumps:
  // P-01 & P-03 drain Sump Alpha (Sump 1)
  // P-02 drains Sump Beta (Sump 2)
  // P-04 drains Deep Level (which feeds into Pit)
  // Pit levels are changed by Deep drainage, Sump overflows, and natural inflows
  
  const sump1Outflow = (state.pumps.find(p => p.id === 'P-01').status === 'running' ? state.pumps.find(p => p.id === 'P-01').flow : 0) +
                       (state.pumps.find(p => p.id === 'P-03').status === 'running' ? state.pumps.find(p => p.id === 'P-03').flow : 0);
  const sump2Outflow = state.pumps.find(p => p.id === 'P-02').status === 'running' ? state.pumps.find(p => p.id === 'P-02').flow : 0;
  const deepOutflow = state.pumps.find(p => p.id === 'P-04').status === 'running' ? state.pumps.find(p => p.id === 'P-04').flow : 0;

  // Sump 1 (Alpha) level updates
  const sump1Net = state.water.sump1.inflow - sump1Outflow;
  state.water.sump1.level = Math.max(0, Math.min(100, +(state.water.sump1.level + sump1Net * 0.005).toFixed(2)));

  // Sump 2 (Beta) level updates
  const sump2Net = state.water.sump2.inflow - sump2Outflow;
  state.water.sump2.level = Math.max(0, Math.min(100, +(state.water.sump2.level + sump2Net * 0.005).toFixed(2)));

  // Pit level updates: affected by natural inflow, deep water pumping (which pumps OUT of deep workings to surface pit or treatment), and potential overflows
  const deepNet = 50 + rainEffect * 0.8 - deepOutflow;
  // If Sump 1 or 2 overflow (>95%), they overflow into the main pit
  let overflowToPit = 0;
  if (state.water.sump1.level > 95) overflowToPit += 30;
  if (state.water.sump2.level > 95) overflowToPit += 30;

  const pitNet = state.water.pit.inflow + overflowToPit - (deepOutflow * 0.3); // deep outflow feeds treatment, 30% goes to pit settling
  state.water.pit.level = Math.max(0, Math.min(100, +(state.water.pit.level + pitNet * 0.002).toFixed(2)));

  // Water alarms
  if (state.water.pit.level > 80 && Math.random() > 0.98) {
    addAlert('error', 'Main Pit level high', `Pit water volume reached ${state.water.pit.level.toFixed(0)}%. Flood danger.`);
  }
  if (state.water.sump1.level > 85 && Math.random() > 0.98) {
    addAlert('warning', 'Sump Alpha near capacity', `Sump Alpha reached ${state.water.sump1.level.toFixed(0)}%. Initiate emergency pumping.`);
  }

  // 6. Energy Power Balance & Battery Simulation
  const totalPowerGeneration = state.solar.power + state.biomass.power;
  const netPower = totalPowerGeneration - totalPumpLoad;

  if (netPower > 0) {
    // Charging battery
    if (state.battery.soc < 100) {
      const chargeAmt = (netPower / 3600) * 100; // Power (kW) to Energy (kWh) in 1 sec
      state.battery.soc = Math.min(100, +(state.battery.soc + chargeAmt / state.battery.capacity * 100).toFixed(3));
      state.battery.current = -+((netPower * 1000) / state.battery.voltage).toFixed(1);
      state.battery.estimatedHours = +((state.battery.capacity * (1 - state.battery.soc / 100)) / (netPower || 1)).toFixed(1);
      
      if (state.battery.soc >= 100) {
        addAlert('success', 'Battery fully charged', 'Battery bank SOC reached 100% capacity.');
      }
    } else {
      state.battery.current = 0;
      state.battery.estimatedHours = 99.9;
    }
  } else {
    // Discharging battery (or battery empty)
    const dischargeAmt = (-netPower / 3600) * 100;
    
    if (state.battery.soc > 0) {
      state.battery.soc = Math.max(0, +(state.battery.soc - dischargeAmt / state.battery.capacity * 100).toFixed(3));
      state.battery.current = +((-netPower * 1000) / state.battery.voltage).toFixed(1);
      state.battery.estimatedHours = +((state.battery.capacity * (state.battery.soc / 100)) / (-netPower || 1)).toFixed(1);
    } else {
      state.battery.soc = 0;
      state.battery.current = 0;
      state.battery.estimatedHours = 0;
      
      // If battery is dead and generation is 0, we can't run pumps
      if (totalPowerGeneration <= 0 && totalPumpLoad > 0) {
        // Emergency halt pumps
        state.pumps.forEach(p => {
          if (p.status === 'running') {
            p.status = 'standby';
            p.flow = 0;
            p.power = 0;
            p.pressure = 0;
          }
        });
        addAlert('error', 'GRID FAILURE: System Blackout', 'Total depletion of battery and solar/biomass generation has halted all pumps.');
      }
    }
  }

  // 7. Smart Automation Control Loop (Auto Mode)
  if (state.autoMode) {
    // Rule A: If solar is shading/nighttime and battery goes below 60%, start biomass generator
    if (state.battery.soc < 60 && !state.biomass.running && state.biomass.fuelLevel > 0) {
      state.biomass.running = true;
      addAlert('info', 'Biomass generator engaged', 'Automated trigger: solar power low, battery SOC < 60%. Initiating gasification.');
    }
    
    // Rule B: If solar power is high (>12kW) and battery is >85%, shut down biomass generator to save fuel
    if (state.solar.power > 12 && state.battery.soc > 85 && state.biomass.running) {
      state.biomass.running = false;
      addAlert('info', 'Biomass generator standby', 'Automated trigger: solar power optimal, battery >85%. Disengaging biomass.');
    }

    // Rule C: Critical load shedding if battery SOC is extremely low (<15%)
    if (state.battery.soc < 15 && totalPumpLoad > totalPowerGeneration) {
      // Shutdown medium priority first (P-03)
      const p3 = state.pumps.find(p => p.id === 'P-03');
      if (p3.status === 'running') {
        p3.status = 'standby';
        addAlert('warning', 'Load Shedding: P-03 deactivated', 'Battery level critical. Stopping Pump Gamma.');
      } else {
        // Shutdown high priority pumps if battery is <8%
        if (state.battery.soc < 8) {
          const p2 = state.pumps.find(p => p.id === 'P-02');
          if (p2.status === 'running') {
            p2.status = 'standby';
            addAlert('error', 'Load Shedding: P-02 deactivated', 'Emergency battery protection. Stopping Pump Beta.');
          }
        }
      }
    }

    // Rule D: Flood mitigation override. If pit level exceeds 70% or sump level > 75%,
    // start standby pumps if we have power (or battery > 20%)
    if (state.water.sump1.level > 75) {
      const p3 = state.pumps.find(p => p.id === 'P-03');
      if (p3.status === 'standby' && (state.battery.soc > 20 || totalPowerGeneration > 10)) {
        p3.status = 'running';
        addAlert('warning', 'Flood Override: P-03 activated', 'Sump Alpha exceeds 75%. Starting Pump Gamma in Auto Mode.');
      }
    }
  }

  // Trigger UI callback event to force rendering updates
  window.dispatchEvent(new CustomEvent('telemetry-tick'));
}

// Global action handlers accessible to the front-end
window.setPumpStatus = function(id, status) {
  const pump = state.pumps.find(p => p.id === id);
  if (pump) {
    pump.status = status;
    if (status === 'running') {
      pump.flow = pump.id === 'P-01' ? 42.5 : pump.id === 'P-02' ? 38.1 : pump.id === 'P-03' ? 45.0 : 51.2;
      pump.power = pump.id === 'P-01' ? 5.8 : pump.id === 'P-02' ? 5.1 : pump.id === 'P-03' ? 6.2 : 7.2;
    } else {
      pump.flow = 0;
      pump.power = 0;
      pump.pressure = 0;
    }
    // Log user action if autoMode is enabled, notify that manual override is active
    if (state.autoMode) {
      state.autoMode = false;
      addAlert('info', 'Auto Mode: OFF (Manual Override)', `Manual operation of ${pump.name} triggered. Disengaging automation.`);
      // Update toggle buttons in UI
      const btn = document.getElementById('auto-mode-btn');
      if (btn) btn.innerHTML = '🤖 Auto Mode: OFF';
    }
    window.dispatchEvent(new CustomEvent('telemetry-tick'));
  }
};

window.toggleAutoMode = function(btn) {
  state.autoMode = !state.autoMode;
  btn.innerHTML = state.autoMode ? '🤖 Auto Mode: ON' : '🤖 Auto Mode: OFF';
  if (state.autoMode) {
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-ghost');
    addAlert('info', 'Auto Mode: ON', 'Autonomous telemetry controller re-engaged.');
  } else {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-ghost');
    addAlert('info', 'Auto Mode: OFF', 'Autonomous telemetry controller disengaged. Manual controls active.');
  }
  window.dispatchEvent(new CustomEvent('telemetry-tick'));
};

window.runSystemDiagnostics = function() {
  runDiagnostics();
  addAlert('info', 'System diagnostics started', 'Initiated full structural component telemetry sweep.');
  window.dispatchEvent(new CustomEvent('telemetry-tick'));
};
