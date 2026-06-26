let currentSlide = 0;
const totalSlides = 10;

export function renderPresentation(container) {
  container.innerHTML = `
    <div class="section-head mb-24">
      <div>
        <h1>Confluence 2.0 Presentation</h1>
        <p class="muted">Team WhoAreWeNow · Slide deck pitch for the Solar Powered Dewatering System</p>
      </div>
      <div style="margin-left:auto; display:flex; gap:10px;">
        <button class="btn btn-ghost" onclick="toggleAutoPlay()"><span id="play-icon">▶</span> Auto Play</button>
        <button class="btn btn-primary" onclick="window.router.navigate('dashboard')">📊 Back to Live Telemetry</button>
      </div>
    </div>

    <div class="slide-container">
      <!-- SLIDE VIEWPORT -->
      <div class="slide-viewport" id="slide-viewport">
        
        <!-- SLIDE 1: TITLE -->
        <div class="slide-content-wrapper active" data-slide="0">
          <div class="slide-section-title">PROJECT PITCH · CONFLUENCE 2.0</div>
          <div class="slide-title-large" style="font-size: 3.2rem; margin-top: 10px;">Design & Implementation of Solar-Powered Dewatering in Mining Operations</div>
          <div class="slide-subtitle-large">"Beyond the Edge of Possibility" — A smart, zero-emission, automated dewatering solution for modern sustainable extraction.</div>
          
          <div class="slide-team-grid">
            <div class="slide-team-card">
              <h4>👥 Team Name</h4>
              <p>WhoAreWeNow</p>
            </div>
            <div class="slide-team-card">
              <h4>🎓 Team Members</h4>
              <p>Vasundhara P S · Hajar Nameera S</p>
            </div>
          </div>
        </div>

        <!-- SLIDE 2: TEAM INTRO -->
        <div class="slide-content-wrapper" data-slide="1">
          <div class="slide-section-title">TEAM INTRODUCTION</div>
          <div class="slide-title-large">Who Are We Now?</div>
          <p class="slide-body-text mb-16">
            We are final-year Information Technology students from <strong>National Engineering College, Kovilpatti</strong>. Driven by a passion for sustainability and smart engineering, we combine computational knowledge with physical infrastructure.
          </p>
          <div class="grid-3 mt-24" style="gap: 16px;">
            <div style="background:var(--deep); padding:16px; border-radius:10px; border:1px solid var(--border);">
              <h4 style="color:var(--blue); font-size:0.95rem; margin-bottom:8px;">💡 Innovation Driven</h4>
              <p style="font-size:0.8rem; color:var(--muted); line-height:1.4;">Committed to sustainable hardware/software automation addressing real-world engineering issues.</p>
            </div>
            <div style="background:var(--deep); padding:16px; border-radius:10px; border:1px solid var(--border);">
              <h4 style="color:var(--green); font-size:0.95rem; margin-bottom:8px;">⚙️ Technical Synergy</h4>
              <p style="font-size:0.8rem; color:var(--muted); line-height:1.4;">Uniting IoT telemetry, embedded automation loops, dynamic web charts, and industrial protocols.</p>
            </div>
            <div style="background:var(--deep); padding:16px; border-radius:10px; border:1px solid var(--border);">
              <h4 style="color:var(--solar); font-size:0.95rem; margin-bottom:8px;">🌿 Circular Vision</h4>
              <p style="font-size:0.8rem; color:var(--muted); line-height:1.4;">Striving to build low-emission, cost-effective models compliant with modern global mining standards.</p>
            </div>
          </div>
        </div>

        <!-- SLIDE 3: PROBLEM STATEMENT -->
        <div class="slide-content-wrapper" data-slide="2">
          <div class="slide-section-title">THE CHALLENGE</div>
          <div class="slide-title-large">The Dewatering Dilemma in Mining</div>
          <p class="slide-body-text mb-16" style="max-width: 800px;">
            Mining operations require <strong>continuous 24/7 dewatering</strong> to prevent flooding in pits and underground passages, ensuring operator safety and operational progress.
          </p>
          <div style="background: rgba(244, 63, 94, 0.04); border: 1px solid rgba(244, 63, 94, 0.2); padding: 18px; border-radius:10px; margin-top:10px; font-size:0.95rem;">
            <strong style="color:var(--red); display:block; margin-bottom:8px;">⚠️ Vulnerabilities of Existing Systems:</strong>
            <ul style="margin-left: 20px; color:#cbd5e1; display:flex; flex-direction:column; gap:6px;">
              <li>High dependency on expensive grid electricity and heavy diesel-powered generators.</li>
              <li>Extreme vulnerability of remote sites to fuel supply chain disruptions and power outages.</li>
              <li>Massive carbon footprints violating environmental regulations and company ESG goals.</li>
            </ul>
          </div>
        </div>

        <!-- SLIDE 4: EXISTING SOLUTIONS & GAPS -->
        <div class="slide-content-wrapper" data-slide="3">
          <div class="slide-section-title">COMPARATIVE GAP ANALYSIS</div>
          <div class="slide-title-large" style="font-size: 2.2rem; margin-bottom:12px;">Existing Solutions vs. Gaps</div>
          <div style="overflow-x: auto; max-height:280px;">
            <table class="data-table" style="font-size:0.8rem;">
              <thead>
                <tr>
                  <th style="width: 45%;">Existing Solution</th>
                  <th style="width: 55%; color: var(--red);">Critical Gaps</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Diesel-Powered Pumps</strong><br/><span style="color:var(--muted);">Commonly deployed in remote off-grid mines.</span></td>
                  <td>Exorbitant fuel costs, volatile supply lines, high maintenance cycles, and high local greenhouse gas emissions.</td>
                </tr>
                <tr>
                  <td><strong>Grid-Tied AC Centrifugals</strong><br/><span style="color:var(--muted);">Grid-powered lines for standard deep pumps.</span></td>
                  <td>Subject to grid instability/outages, expensive demand fees, and absent in remote regions.</td>
                </tr>
                <tr>
                  <td><strong>Diesel-Electric Hybrid Alternators</strong><br/><span style="color:var(--muted);">Switching between grid power and gensets.</span></td>
                  <td>High capital expenditure, double infrastructure footprint, and still fossil fuel reliant.</td>
                </tr>
                <tr>
                  <td><strong>Sump Settling & Drainage Channels</strong><br/><span style="color:var(--muted);">Gravity collection reservoirs.</span></td>
                  <td>Requires vast land footprints, frequent dredging/cleaning, and fails to resolve pumping power needs.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- SLIDE 5: PROPOSED SOLUTION -->
        <div class="slide-content-wrapper" data-slide="4">
          <div class="slide-section-title">THE PROPOSED SOLUTION</div>
          <div class="slide-title-large" style="font-size: 2.3rem;">Smart Solar-Biomass Hybrid Dewatering</div>
          <p class="slide-body-text mb-16">
            An off-grid, automated dewatering solution merging solar PV, biomass combustion, and battery storage.
          </p>
          <div class="grid-3" style="gap: 16px; margin-top: 10px;">
            <div style="background:rgba(245, 166, 35, 0.05); border:1px solid rgba(245, 166, 35, 0.2); padding:16px; border-radius:10px;">
              <strong style="color:var(--solar);">☀️ Solar PV (Daytime)</strong>
              <p style="font-size:0.78rem; color:var(--muted); margin-top:8px;">Supplies immediate high kW output during solar hours to run pumps and charge backup cells.</p>
            </div>
            <div style="background:rgba(16, 185, 129, 0.05); border:1px solid rgba(16, 185, 129, 0.2); padding:16px; border-radius:10px;">
              <strong style="color:var(--green);">🌿 Biomass Unit (Nighttime)</strong>
              <p style="font-size:0.78rem; color:var(--muted); margin-top:8px;">Utilizes local agricultural waste biomass to generate continuous energy when solar is unavailable.</p>
            </div>
            <div style="background:rgba(0, 184, 255, 0.05); border:1px solid rgba(0, 184, 255, 0.2); padding:16px; border-radius:10px;">
              <strong style="color:var(--blue);">🔋 Smart Storage & Control</strong>
              <p style="font-size:0.78rem; color:var(--muted); margin-top:8px;">A battery buffer managed by SCADA triggers load shedding and biomass ignition automatically.</p>
            </div>
          </div>
        </div>

        <!-- SLIDE 6: USP -->
        <div class="slide-content-wrapper" data-slide="5">
          <div class="slide-section-title">UNIQUE SELLING PROPOSITION (USP)</div>
          <div class="slide-title-large">Why Our Dewatering System Wins?</div>
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--blue); text-align: center; background: var(--deep); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            "A zero-waste, hybrid renewable energy system delivering uninterrupted, cost-effective, and sustainable dewatering."
          </div>
          <div class="grid-2" style="gap:16px; font-size:0.86rem;">
            <div style="display:flex; gap:10px;">
              <span style="color:var(--green); font-size:1.2rem;">✔</span>
              <div>
                <strong>Zero-Waste Loop:</strong> Consumes agricultural residue, assisting farming regions in waste disposal and supporting circular economy.
              </div>
            </div>
            <div style="display:flex; gap:10px;">
              <span style="color:var(--green); font-size:1.2rem;">✔</span>
              <div>
                <strong>Total Grid Autonomy:</strong> Fully off-grid configuration ideal for remote concessions lacking power access.
              </div>
            </div>
            <div style="display:flex; gap:10px;">
              <span style="color:var(--green); font-size:1.2rem;">✔</span>
              <div>
                <strong>Low Maintenance Design:</strong> Modern variable-speed pumps linked with soft starters reduce wear.
              </div>
            </div>
            <div style="display:flex; gap:10px;">
              <span style="color:var(--green); font-size:1.2rem;">✔</span>
              <div>
                <strong>ESG Compliance:</strong> Delivers tangible emissions offsets directly helping mines secure green financing.
              </div>
            </div>
          </div>
        </div>

        <!-- SLIDE 7: ARCHITECTURE LINK -->
        <div class="slide-content-wrapper" data-slide="6">
          <div class="slide-section-title">SYSTEM BLUEPRINT</div>
          <div class="slide-title-large">Hydraulic & Electrical Topology</div>
          <p class="slide-body-text mb-24">
            The integration is designed with a Central SCADA Automation Hub overseeing solar arrays, gasification generators, and high-voltage battery storage arrays, routing power to pump sets placed across level depths.
          </p>
          <div style="text-align:center; padding: 24px; background:var(--deep); border-radius:12px; border:1px solid var(--border);">
            <p class="mb-16" style="font-size: 0.95rem; color:var(--muted);">We have built a fully interactive live system flow diagram mapping this topology.</p>
            <button class="btn btn-primary" style="margin: 0 auto;" onclick="window.router.navigate('architecture')">
              🔗 Open Interactive Architecture Diagram
            </button>
          </div>
        </div>

        <!-- SLIDE 8: TECH STACK -->
        <div class="slide-content-wrapper" data-slide="7">
          <div class="slide-section-title">TECHNOLOGY FRAMEWORK</div>
          <div class="slide-title-large">The Integration Stack</div>
          <div class="grid-4" style="gap:16px; text-align:center;">
            <div style="background:var(--deep); padding:20px 10px; border-radius:10px; border:1px solid var(--border);">
              <div style="font-size: 2rem; margin-bottom:10px;">🔌</div>
              <h4 style="color:#ffffff; font-size:0.9rem; margin-bottom:4px;">Power Hardware</h4>
              <p style="font-size:0.75rem; color:var(--muted);">Solar PV, Biomass combustion Core, LFP Cell Packs, and Bidirectional Hybrid Inverters.</p>
            </div>
            <div style="background:var(--deep); padding:20px 10px; border-radius:10px; border:1px solid var(--border);">
              <div style="font-size: 2rem; margin-bottom:10px;">📟</div>
              <h4 style="color:#ffffff; font-size:0.9rem; margin-bottom:4px;">Sensors & IoT</h4>
              <p style="font-size:0.75rem; color:var(--muted);">RTD Temperature probes, Ultrasonic Level meters, Turbine flowmeters, Modbus TCP gateways.</p>
            </div>
            <div style="background:var(--deep); padding:20px 10px; border-radius:10px; border:1px solid var(--border);">
              <div style="font-size: 2rem; margin-bottom:10px;">🤖</div>
              <h4 style="color:#ffffff; font-size:0.9rem; margin-bottom:4px;">Automation Loop</h4>
              <p style="font-size:0.75rem; color:var(--muted);">Edge control logic, automated biomass startup triggers, and battery state protections.</p>
            </div>
            <div style="background:var(--deep); padding:20px 10px; border-radius:10px; border:1px solid var(--border);">
              <div style="font-size: 2rem; margin-bottom:10px;">🖥</div>
              <h4 style="color:#ffffff; font-size:0.9rem; margin-bottom:4px;">Operator HMI</h4>
              <p style="font-size:0.75rem; color:var(--muted);">Real-time SVG diagrams, line charts telemetry, alert center, and simulation tools.</p>
            </div>
          </div>
        </div>

        <!-- SLIDE 9: IMPACT & BENEFITS -->
        <div class="slide-content-wrapper" data-slide="8">
          <div class="slide-section-title">IMPACT & BENEFITS</div>
          <div class="slide-title-large" style="font-size: 2.2rem; margin-bottom:12px;">Environmental Impact & Benefits</div>
          <div class="grid-2">
            <div style="background: rgba(16, 185, 129, 0.03); border:1px solid rgba(16, 185, 129, 0.15); padding:16px; border-radius:10px;">
              <h4 style="color:var(--green); font-size:0.95rem; margin-bottom:10px; display:flex; align-items:center; gap:8px;">🌍 ESG & Carbon Impact</h4>
              <ul style="font-size:0.8rem; color:#cbd5e1; margin-left:16px; display:flex; flex-direction:column; gap:6px;">
                <li>Reduces CO₂ output directly, promoting sustainable green mining practices.</li>
                <li>Eliminates diesel particulate contamination risks in remote regions.</li>
                <li>Promotes agricultural waste circularity by utilizing crop residues.</li>
                <li>Provides grid safety margins, lowering regional power line stresses.</li>
              </ul>
            </div>
            <div style="background: rgba(0, 184, 255, 0.03); border:1px solid rgba(0, 184, 255, 0.15); padding:16px; border-radius:10px;">
              <h4 style="color:var(--blue); font-size:0.95rem; margin-bottom:10px; display:flex; align-items:center; gap:8px;">🪙 Economic Benefits</h4>
              <ul style="font-size:0.8rem; color:#cbd5e1; margin-left:16px; display:flex; flex-direction:column; gap:6px;">
                <li>Ensures 24/7 continuous operations, preventing water logging of workings.</li>
                <li>Drastically cuts fuel OPEX and generator maintenance downtimes.</li>
                <li>Leverages cheap, local feedstock contracts rather than expensive diesel.</li>
                <li>Modular scalability enables expansion along concessions as mines grow.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- SLIDE 10: FUTURE SCOPE -->
        <div class="slide-content-wrapper" data-slide="9">
          <div class="slide-section-title">THE HORIZON</div>
          <div class="slide-title-large">Future Scope & Vision</div>
          <div class="grid-3" style="gap:16px; margin-bottom: 24px;">
            <div style="background:var(--deep); padding:16px; border-radius:8px; border:1px solid var(--border);">
              <strong style="color:var(--solar); font-size:0.88rem;">🤖 AI Maintenance</strong>
              <p style="font-size:0.75rem; color:var(--muted); margin-top:6px;">Predictive machine learning models scanning impeller vibrations and predicting failures before downtime.</p>
            </div>
            <div style="background:var(--deep); padding:16px; border-radius:8px; border:1px solid var(--border);">
              <strong style="color:var(--green); font-size:0.88rem;">🌐 IoT Monitoring</strong>
              <p style="font-size:0.75rem; color:var(--muted); margin-top:6px;">Extended cellular/satellite SCADA telemetry for remote operator monitoring from central company headquarters.</p>
            </div>
            <div style="background:var(--deep); padding:16px; border-radius:8px; border:1px solid var(--border);">
              <strong style="color:var(--blue); font-size:0.88rem;">⚡ Carbon Credits</strong>
              <p style="font-size:0.75rem; color:var(--muted); margin-top:6px;">Platform integration logging certified green offsets, allowing companies to sell carbon credits on global registries.</p>
            </div>
          </div>
          <div style="text-align:center; font-size: 1.6rem; font-weight:800; background: linear-gradient(135deg, var(--solar), var(--blue)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-top:10px;">
            THANK YOU!
          </div>
        </div>

      </div>

      <!-- SLIDE NAVIGATION BAR -->
      <div class="slide-nav-bar">
        <div style="display:flex; gap:8px;">
          <button class="btn btn-ghost" onclick="prevSlide()" style="padding: 8px 16px;">◀ Previous</button>
          <button class="btn btn-ghost" onclick="nextSlide()" style="padding: 8px 16px;">Next ▶</button>
        </div>
        <div class="slide-indicator" id="slide-indicator">Slide 1 of 10</div>
        <div style="display:flex; gap:6px;" id="slide-dots"></div>
      </div>
    </div>
  `;

  // Initialize slides state
  currentSlide = 0;
  updateSlidesView();

  // Create dot controls
  const dotsContainer = document.getElementById('slide-dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = Array.from({ length: totalSlides }, (_, i) => `
      <div class="slide-dot" style="width: 8px; height: 8px; border-radius:50%; background: ${i === 0 ? 'var(--blue)' : 'rgba(255,255,255,0.2)'}; cursor:pointer;" onclick="goToSlide(${i})"></div>
    `).join('');
  }

  // Bind navigation actions to global scope
  window.goToSlide = function(index) {
    currentSlide = index;
    updateSlidesView();
  };

  window.nextSlide = function() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlidesView();
  };

  window.prevSlide = function() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlidesView();
  };

  let autoPlayInterval = null;
  window.toggleAutoPlay = function() {
    const playBtn = document.querySelector('button[onclick="toggleAutoPlay()"]');
    const playIcon = document.getElementById('play-icon');

    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      if (playBtn) {
        playBtn.classList.remove('btn-primary');
        playBtn.classList.add('btn-ghost');
      }
      if (playIcon) playIcon.textContent = '▶';
    } else {
      autoPlayInterval = setInterval(() => {
        nextSlide();
      }, 5000);
      if (playBtn) {
        playBtn.classList.add('btn-primary');
        playBtn.classList.remove('btn-ghost');
      }
      if (playIcon) playIcon.textContent = '⏸';
    }
  };

  // Safe clean up autoplay on page navigation
  container.addEventListener('destroy-page', () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  }, { once: true });
}

function updateSlidesView() {
  const slides = document.querySelectorAll('.slide-content-wrapper');
  const indicator = document.getElementById('slide-indicator');
  const dots = document.querySelectorAll('#slide-dots .slide-dot');

  if (!slides || slides.length === 0) return;

  slides.forEach((slide, idx) => {
    if (idx === currentSlide) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  if (indicator) {
    indicator.textContent = `Slide ${currentSlide + 1} of ${totalSlides}`;
  }

  if (dots && dots.length > 0) {
    dots.forEach((dot, idx) => {
      dot.style.background = idx === currentSlide ? 'var(--blue)' : 'rgba(255,255,255,0.2)';
    });
  }
}
