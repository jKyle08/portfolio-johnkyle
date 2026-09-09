/**
 * JOHN KYLE O. LASTIMOSA — EXECUTIVE MODERN PORTFOLIO LOGIC
 * Features: Web Audio Synthesizer, Constellation Particle Mesh,
 * Command Palette (Ctrl+K), CLI Console, 3D Tilt, Theme Switcher.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SUBTLE AUDIO SYNTHESIZER (WEB AUDIO API)
     ========================================================================== */
  class ExecutiveAudioSynth {
    constructor() {
      this.audioCtx = null;
      this.enabled = localStorage.getItem('executive_sfx') === 'true'; // Default subtle off, toggleable
      this.initContext = this.initContext.bind(this);

      window.addEventListener('click', this.initContext, { once: true });
      window.addEventListener('keydown', this.initContext, { once: true });
    }

    initContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.06, volume = 0.035) {
      if (!this.enabled) return;
      this.initContext();
      if (!this.audioCtx) return;

      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {
        // audio muted
      }
    }

    playClick() {
      this.playTone(800, 'sine', 0.04, 0.03);
    }

    playKey() {
      const freqs = [380, 420, 460, 500];
      const f = freqs[Math.floor(Math.random() * freqs.length)];
      this.playTone(f, 'sine', 0.02, 0.015);
    }

    playSuccess() {
      if (!this.enabled) return;
      this.playTone(523.25, 'sine', 0.08, 0.04);
      setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.04), 60);
      setTimeout(() => this.playTone(783.99, 'sine', 0.12, 0.05), 120);
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('executive_sfx', this.enabled);
      return this.enabled;
    }
  }

  const sfx = new ExecutiveAudioSynth();

  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const sfxIcon = document.getElementById('sfxIcon');
  const sfxLabel = document.getElementById('sfxLabel');

  function updateSfxButtonUI() {
    if (sfx.enabled) {
      sfxIcon.className = 'fa-solid fa-volume-high';
      sfxLabel.textContent = 'SFX On';
      sfxToggleBtn.classList.add('active');
    } else {
      sfxIcon.className = 'fa-solid fa-volume-xmark';
      sfxLabel.textContent = 'SFX Off';
      sfxToggleBtn.classList.remove('active');
    }
  }
  updateSfxButtonUI();

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      const state = sfx.toggle();
      updateSfxButtonUI();
      if (state) sfx.playSuccess();
    });
  }


  /* ==========================================================================
     2. ACCENT THEME PICKER
     ========================================================================== */
  const accentToggleBtn = document.getElementById('accentToggleBtn');
  const accentMenu = document.getElementById('accentMenu');
  const accentOpts = document.querySelectorAll('.accent-opt');

  const savedTheme = localStorage.getItem('executive_theme') || 'cyan';
  document.documentElement.setAttribute('data-theme', savedTheme);
  accentOpts.forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-theme') === savedTheme);
  });

  if (accentToggleBtn && accentMenu) {
    accentToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      accentMenu.classList.toggle('show');
      sfx.playClick();
    });

    document.addEventListener('click', () => {
      accentMenu.classList.remove('show');
    });

    accentOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        const theme = opt.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('executive_theme', theme);
        accentOpts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        accentMenu.classList.remove('show');
        sfx.playSuccess();
      });
    });
  }


  /* ==========================================================================
     3. DYNAMIC CAREER EXPERIENCE AUTO-INCREMENT (SINCE JULY 2019)
     ========================================================================== */
  const liveClock = document.getElementById('liveClock');
  const copyrightYear = document.getElementById('copyrightYear');
  if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

  function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Manila',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    liveClock.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
  }
  updateClock();
  setInterval(updateClock, 1000);

  function updateDynamicExperience() {
    // Career started in July 2019 (Lariosa Clinic IT Staff -> Eulap -> Provincial Capitol)
    const startYear = 2019;
    const startMonth = 6; // 0-indexed month (July = 6)
    const now = new Date();
    
    let totalYears = now.getFullYear() - startYear;
    if (now.getMonth() < startMonth) {
      totalYears = Math.max(1, totalYears - 1);
    }
    const yearsText = `${totalYears}+`;

    const heroYears = document.getElementById('dynamicHeroYears');
    if (heroYears) heroYears.textContent = `${yearsText} years`;

    const kpiYears = document.getElementById('kpiTotalYears');
    if (kpiYears) kpiYears.textContent = yearsText;

    const aboutYears = document.getElementById('aboutTotalYears');
    if (aboutYears) aboutYears.textContent = yearsText;

    const resumeYears = document.getElementById('resumeTotalYears');
    if (resumeYears) resumeYears.textContent = yearsText;
  }
  updateDynamicExperience();


  /* ==========================================================================
     4. ELEGANT CONSTELLATION MESH CANVAS
     ========================================================================== */
  const canvas = document.getElementById('cyberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 22000), 55);

    class Node {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.6 + 0.8;
        this.alpha = Math.random() * 0.4 + 0.15;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${this.alpha * 0.4})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) {
      particles.push(new Node());
    }

    let mouse = { x: null, y: null, maxDist: 120 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        if (mouse.x !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 210, 255, ${0.25 * (1 - dist / mouse.maxDist)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }


  /* ==========================================================================
     5. TYPEWRITER EFFECT FOR EXECUTIVE ROLES
     ========================================================================== */
  const typewriterTarget = document.getElementById('typewriterTarget');
  const roles = [
    'high-throughput backend microservices',
    'large-scale data modeling & SQL optimization',
    'domain-driven architectures (DDD)',
    'scalable Java (Spring Boot) platforms',
    'resilient C# (.NET) microservices',
    'government UHC health systems modernization'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 70;

  function typeLoop() {
    if (!typewriterTarget) return;
    const current = roles[roleIndex];

    if (isDeleting) {
      typewriterTarget.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      speed = 35;
    } else {
      typewriterTarget.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      speed = 70;
    }

    if (!isDeleting && charIndex === current.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    setTimeout(typeLoop, speed);
  }
  typeLoop();


  /* ==========================================================================
     6. NAVBAR SCROLL & MOBILE DRAWER
     ========================================================================== */
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mLinks = document.querySelectorAll('.m-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    // Scroll spy
    const pos = window.scrollY + 200;
    document.querySelectorAll('section[id]').forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (pos >= top && pos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  });

  if (mobileMenuBtn && mobileDrawer && closeDrawerBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      sfx.playClick();
    });

    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      sfx.playClick();
    });

    mLinks.forEach(l => {
      l.addEventListener('click', () => mobileDrawer.classList.remove('open'));
    });
  }


  /* ==========================================================================
     7. 3D CARD TILT EFFECT
     ========================================================================== */
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.008, 1.008, 1.008)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });


  /* ==========================================================================
     8. SKILL SEARCH & FILTERING
     ========================================================================== */
  const skillSearchField = document.getElementById('skillSearchField');
  const clearSkillBtn = document.getElementById('clearSkillBtn');
  const skillPillFilters = document.querySelectorAll('#skillPillFilters .s-pill-btn');
  const skillCatCards = document.querySelectorAll('.skill-cat-card');

  function filterSkills() {
    const q = skillSearchField.value.trim().toLowerCase();
    const activePill = document.querySelector('#skillPillFilters .s-pill-btn.active');
    const cat = activePill ? activePill.getAttribute('data-cat') : 'all';

    clearSkillBtn.classList.toggle('show', q.length > 0);

    skillCatCards.forEach(card => {
      const cardCat = card.getAttribute('data-cat');
      const matchesCat = (cat === 'all' || cat === cardCat);

      if (!matchesCat) {
        card.style.display = 'none';
        return;
      }

      if (q === '') {
        card.style.display = 'block';
        card.querySelectorAll('.skill-item, .soft-tag').forEach(i => {
          i.style.display = 'flex';
        });
      } else {
        let hasMatch = false;
        card.querySelectorAll('.skill-item').forEach(item => {
          const name = (item.getAttribute('data-name') || item.textContent).toLowerCase();
          if (name.includes(q)) {
            item.style.display = 'flex';
            hasMatch = true;
          } else {
            item.style.display = 'none';
          }
        });

        card.querySelectorAll('.soft-tag').forEach(tag => {
          if (tag.textContent.toLowerCase().includes(q)) {
            tag.style.display = 'flex';
            hasMatch = true;
          } else {
            tag.style.display = 'none';
          }
        });

        card.style.display = hasMatch ? 'block' : 'none';
      }
    });
  }

  if (skillSearchField) {
    skillSearchField.addEventListener('input', () => {
      sfx.playKey();
      filterSkills();
    });

    clearSkillBtn.addEventListener('click', () => {
      skillSearchField.value = '';
      filterSkills();
      sfx.playClick();
    });
  }

  skillPillFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      skillPillFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterSkills();
      sfx.playClick();
    });
  });


  /* ==========================================================================
     9. PROJECT FILTERING
     ========================================================================== */
  const filterTabBtns = document.querySelectorAll('#projectFilterRow .filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      sfx.playClick();
    });
  });


  /* ==========================================================================
     10. PROJECT ARCHITECTURE BLUEPRINT MODAL
     ========================================================================== */
  const projModalBackdrop = document.getElementById('projModalBackdrop');
  const modalSystemTitle = document.getElementById('modalSystemTitle');
  const modalSystemContent = document.getElementById('modalSystemContent');
  const closeProjModalBtn = document.getElementById('closeProjModalBtn');
  const openProjBtns = document.querySelectorAll('.open-proj-details');

  const blueprints = {
    scohis: {
      title: 'South Cotabato One Health Information System (UHC)',
      category: 'Government Health & Citizen Informatics',
      overview: 'Engineered for the Provincial Capitol of South Cotabato under Universal Health Care (UHC) integration standards aligned with UP Manila Standards and Interoperability Lab (SILab).',
      deliverables: [
        'Centralized citizen health profile registration and biometric tracking.',
        'Modular microservice architecture built with C# and .NET Core / Framework.',
        'Optimized Microsoft SQL Server database schemas for high-frequency municipal transactions.',
        'Automated health audit and epidemiological reports generated dynamically via Crystal Reports.',
        'RESTful API integration facilitating seamless synchronization across municipal health centers and provincial hospitals.'
      ],
      stack: ['C#', '.NET Core', 'ASP.NET MVC', 'MS SQL Server', 'REST APIs', 'Crystal Reports', 'Bootstrap 5', 'JavaScript']
    },
    eulap: {
      title: 'Eulap Multi-Tenant Enterprise ERP & Accounting Suite',
      category: 'Enterprise SaaS & Business Automation',
      overview: 'Comprehensive resource planning platform powering mid-to-large business workflows across manufacturing, trucking logistics, human resources, and school administrations.',
      deliverables: [
        'Financial accounting module with real-time general ledger, accounts payable/receivable, and automated invoice reconciliation.',
        'Freight & Trucking Logistics hub tracking fleet dispatches, inventory movement, and delivery confirmations.',
        'Human Resource Information System (HRIS) with biometric payroll and loan calculation pipelines.',
        'Multi-tenant relational database structure powered by MySQL with optimized indexing.',
        'Automated report generation using JasperReports for tax audits and financial statements.'
      ],
      stack: ['Java', 'Spring Boot', 'Hibernate / JPA', 'JSP', 'MySQL Server', 'JasperReports', 'Bootstrap', 'Agile Scrum']
    },
    philhealth: {
      title: 'PhilHealth Claims & Hospital Billing Engine',
      category: 'Healthcare Insurance & Hospital IT Operations',
      overview: 'Designed during IT staff operations at Lariosa Clinic & Hospital Inc. to streamline patient discharge billing and eliminate insurance claim repudiations.',
      deliverables: [
        'Automated verification and validation of PhilHealth claim documentation.',
        'Seamless data exchange bridge between hospital ward admissions and billing departments.',
        'High-security network and workstation infrastructure maintenance ensuring 99.9% uptime for digital claims submission.',
        'Audit trail generation to monitor claim approval turnarounds and reimbursement metrics.'
      ],
      stack: ['Healthcare Informatics', 'PhilHealth Protocol', 'SQL Data Management', 'Network Diagnostics', 'Billing Automation']
    },
    gateway: {
      title: 'Universal Microservices Gateway & REST Hub',
      category: 'Distributed Systems & Cloud Architecture',
      overview: 'Modular microservice orchestration hub providing centralized routing, JWT bearer token authentication, circuit breaking, and rate limiting for multi-tiered application environments.',
      deliverables: [
        'Reverse proxy routing between .NET Core, Java Spring, and external API consumers.',
        'Stateless JWT authentication and role-based access control (RBAC).',
        'Docker containerized deployment for seamless scalability across Linux host nodes.',
        'Resilient fallback handling and payload validation pipelines.'
      ],
      stack: ['.NET Core', 'Spring Cloud', 'Docker', 'RESTful Services', 'PostgreSQL', 'JSON Schema Validation']
    },
    automation: {
      title: 'Event-Driven AI & n8n Workflow Automation Hub',
      category: 'Workflow Automation & LLM Integrations',
      overview: 'Modular automation architecture using n8n for webhook ingestion, scheduled cron events, and multi-model LLM routing (OpenAI/ChatGPT, Anthropic Claude, Google Gemini) for automated developer workflows and data synchronization.',
      deliverables: [
        'Visual workflow canvas nodes connecting REST APIs, webhooks, and email notifications.',
        'Structured prompt pipelines with OpenAI, Claude, and Gemini for text parsing and categorization.',
        'Automated multi-branch error handling and logging via event webhooks.',
        'Integration with developer tooling (Cursor, GitHub Copilot, Antigravity) to accelerate feature delivery.'
      ],
      stack: ['n8n Automation', 'OpenAI API', 'Claude API', 'Gemini API', 'Webhooks', 'REST APIs', 'Node.js']
    }
  };

  function openBlueprint(key) {
    const data = blueprints[key];
    if (!data) return;

    modalSystemTitle.textContent = data.title;
    modalSystemContent.innerHTML = `
      <div class="modal-blueprint-wrap">
        <div>
          <div class="mb-title"><i class="fa-solid fa-layer-group"></i> Architecture Overview</div>
          <p class="about-text">${data.overview}</p>
        </div>

        <div>
          <div class="mb-title"><i class="fa-solid fa-circle-check"></i> Key Engineering Deliverables</div>
          <ul class="mb-list">
            ${data.deliverables.map(d => `<li><i class="fa-solid fa-check"></i> <span>${d}</span></li>`).join('')}
          </ul>
        </div>

        <div>
          <div class="mb-title"><i class="fa-solid fa-microchip"></i> Technology Stack</div>
          <div class="mb-tags-row">
            ${data.stack.map(s => `<span class="badge-tag">${s}</span>`).join('')}
          </div>
        </div>

        <div style="margin-top: 10px;">
          <a href="https://github.com/jKyle08" target="_blank" rel="noopener noreferrer" class="btn btn-primary w-full">
            <i class="fa-brands fa-github mr-2"></i> Inspect GitHub Repositories
          </a>
        </div>
      </div>
    `;

    projModalBackdrop.classList.add('show');
    sfx.playClick();
  }

  openProjBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openBlueprint(btn.getAttribute('data-proj'));
    });
  });

  if (closeProjModalBtn) {
    closeProjModalBtn.addEventListener('click', () => {
      projModalBackdrop.classList.remove('show');
      sfx.playClick();
    });
  }

  if (projModalBackdrop) {
    projModalBackdrop.addEventListener('click', (e) => {
      if (e.target === projModalBackdrop) projModalBackdrop.classList.remove('show');
    });
  }


  /* ==========================================================================
     11. RESUME MODAL
     ========================================================================== */
  const resumeModalBackdrop = document.getElementById('resumeModalBackdrop');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const mResumeBtn = document.getElementById('mResumeBtn');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');

  function openResume() {
    resumeModalBackdrop.classList.add('show');
    sfx.playClick();
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);
  if (mResumeBtn) mResumeBtn.addEventListener('click', openResume);
  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', () => {
    resumeModalBackdrop.classList.remove('show');
    sfx.playClick();
  });

  if (resumeModalBackdrop) {
    resumeModalBackdrop.addEventListener('click', (e) => {
      if (e.target === resumeModalBackdrop) resumeModalBackdrop.classList.remove('show');
    });
  }


  /* ==========================================================================
     12. DEVELOPER TERMINAL CLI
     ========================================================================== */
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const termClearBtn = document.getElementById('termClearBtn');
  const termCopyBtn = document.getElementById('termCopyBtn');
  const chipBtns = document.querySelectorAll('.chip-btn');

  const history = [];
  let hIndex = -1;

  const terminalCmds = {
    help: () => `
<div class="term-line cmd-output">
  <strong>Available Commands:</strong><br>
  - <span class="term-highlight">about</span> : Summary profile & education<br>
  - <span class="term-highlight">skills</span> : Core technical radar & AI tools<br>
  - <span class="term-highlight">projects</span> : Production systems & case studies<br>
  - <span class="term-highlight">experience</span> : Career track record<br>
  - <span class="term-highlight">contact</span> / <span class="term-highlight">hire</span> : Direct channels & frequencies<br>
  - <span class="term-highlight">resume</span> : View / download resume modal<br>
  - <span class="term-highlight">clear</span> : Clear console buffer
</div>`,

    about: () => {
      const now = new Date();
      let total = now.getFullYear() - 2019;
      if (now.getMonth() < 6) total = Math.max(1, total - 1);
      return `
<div class="term-line cmd-output">
  <strong>[Professional Dossier]</strong><br>
  <strong>Name:</strong> John Kyle O. Lastimosa<br>
  <strong>Role:</strong> Full-Stack Software Engineer &amp; Solutions Architect<br>
  <strong>Degree:</strong> BS in Information Technology (Database Management), MSU GenSan<br>
  <strong>Location:</strong> South Cotabato, Philippines<br>
  <strong>Total Professional Experience:</strong> ${total}+ Years (Since 2019)<br>
  <strong>Stack Breakdown:</strong> 3+ Yrs Java/Spring &bull; 2+ Yrs C#/.NET &bull; n8n &amp; AI Workflow Automation
</div>`;
    },

    skills: () => `
<div class="term-line cmd-output">
  <strong>[Technical Radar &amp; AI Tools]</strong><br>
  • <strong>Backend:</strong> C#, .NET Core, ASP.NET MVC, Java, Spring Boot, Hibernate, REST APIs, PHP, Node.js<br>
  • <strong>AI &amp; Automation:</strong> n8n Workflow Automation, Webhooks, Cursor, GitHub Copilot, ChatGPT/OpenAI, Claude, Gemini, Antigravity<br>
  • <strong>Frontend:</strong> JavaScript (ES6+), React.js, Vue.js, Tailwind CSS, Bootstrap, HTML5/CSS3<br>
  • <strong>Databases:</strong> MS SQL Server (T-SQL), MySQL, PostgreSQL, Supabase<br>
  • <strong>DevOps &amp; Tools:</strong> Docker, Git/GitHub, Visual Studio, VS Code, IntelliJ IDEA, Agile/Scrum
</div>`,

    projects: () => `
<div class="term-line cmd-output">
  <strong>[Featured Systems]</strong><br>
  1. <strong>SCOHIS-01:</strong> South Cotabato One Health System (.NET Core / MS SQL / UHC)<br>
  2. <strong>ERP-FIN-02:</strong> Eulap Multi-Tenant Enterprise ERP Suite (Java Spring Boot / MySQL)<br>
  3. <strong>MED-BILL-03:</strong> PhilHealth Claims &amp; Hospital Billing Hub (Lariosa Clinic)<br>
  4. <strong>API-GATE-04:</strong> Universal Microservices REST Gateway (.NET Core / Docker)<br>
  5. <strong>AUTO-AI-05:</strong> Event-Driven AI &amp; n8n Automation Engine (Webhooks / LLMs)
</div>`,

    experience: () => `
<div class="term-line cmd-output">
  <strong>[Career Milestones]</strong><br>
  • <strong>Sept 2024 – Present:</strong> Provincial Capitol of South Cotabato (Computer Programmer / UHC Health)<br>
  • <strong>Sept 2021 – Sept 2024:</strong> Eulap (Computer Programmer II / Java Spring Enterprise)<br>
  • <strong>July 2019 – Nov 2020:</strong> Lariosa Clinic & Hospital Inc. (IT Staff / PhilHealth Systems)
</div>`,

    contact: () => `
<div class="term-line cmd-output">
  <strong>[Direct Communication]</strong><br>
  • <strong>Email:</strong> <a href="mailto:johnkyle.lastimosa99@gmail.com" class="text-cyan">johnkyle.lastimosa99@gmail.com</a><br>
  • <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/john-kyle-lastimosa-541ab2220" target="_blank" class="text-cyan">linkedin.com/in/john-kyle-lastimosa</a><br>
  • <strong>GitHub:</strong> <a href="https://github.com/jKyle08" target="_blank" class="text-cyan">github.com/jKyle08</a>
</div>`,

    hire: function() { return this.contact(); },

    resume: () => {
      openResume();
      return `<div class="term-line cmd-output text-emerald">[OK] Opening Official Resume Matrix...</div>`;
    },

    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    }
  };

  function execCmd(cmdStr) {
    const raw = cmdStr.trim();
    if (!raw) return;

    history.push(raw);
    hIndex = history.length;

    const echo = document.createElement('div');
    echo.className = 'term-line cmd-echo';
    echo.innerHTML = `<span class="term-prefix">guest@jkyle:~$</span> ${raw}`;
    terminalOutput.appendChild(echo);

    const cmd = raw.toLowerCase();
    let result = '';

    if (terminalCmds[cmd]) {
      result = terminalCmds[cmd]();
      sfx.playSuccess();
    } else {
      result = `<div class="term-line error">Command not found: '${raw}'. Type <span class="term-highlight">help</span> for options.</div>`;
      sfx.playKey();
    }

    if (result) {
      const d = document.createElement('div');
      d.innerHTML = result;
      terminalOutput.appendChild(d);
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      sfx.playKey();
      if (e.key === 'Enter') {
        execCmd(terminalInput.value);
        terminalInput.value = '';
      } else if (e.key === 'ArrowUp') {
        if (history.length > 0 && hIndex > 0) {
          hIndex--;
          terminalInput.value = history[hIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (hIndex < history.length - 1) {
          hIndex++;
          terminalInput.value = history[hIndex];
        } else {
          hIndex = history.length;
          terminalInput.value = '';
        }
      }
    });

    chipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.getAttribute('data-cmd');
        execCmd(c);
        sfx.playClick();
      });
    });

    if (termClearBtn) {
      termClearBtn.addEventListener('click', () => {
        terminalOutput.innerHTML = '';
        sfx.playClick();
      });
    }

    if (termCopyBtn) {
      termCopyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(terminalOutput.innerText).then(() => {
          sfx.playSuccess();
          termCopyBtn.innerHTML = '<i class="fa-solid fa-check text-emerald"></i>';
          setTimeout(() => { termCopyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 2000);
        });
      });
    }
  }


  /* ==========================================================================
     13. COMMAND PALETTE (CTRL+K / CMD+K)
     ========================================================================== */
  const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
  const cmdPaletteBackdrop = document.getElementById('cmdPaletteBackdrop');
  const cmdSearchInput = document.getElementById('cmdSearchInput');
  const cmdList = document.getElementById('cmdList');

  const paletteItems = [
    { title: 'Overview & Profile', icon: 'fa-solid fa-user-tie', action: () => scrollToId('#hero'), cat: 'Navigation' },
    { title: 'Professional Background', icon: 'fa-solid fa-id-card', action: () => scrollToId('#about'), cat: 'Navigation' },
    { title: 'Career Experience & Track Record', icon: 'fa-solid fa-briefcase', action: () => scrollToId('#experience'), cat: 'Navigation' },
    { title: 'Featured Systems & Case Studies', icon: 'fa-solid fa-cubes', action: () => scrollToId('#projects'), cat: 'Navigation' },
    { title: 'Core Technical Radar & AI Skills', icon: 'fa-solid fa-microchip', action: () => scrollToId('#skills'), cat: 'Navigation' },
    { title: 'AI & n8n Automation Hub', icon: 'fa-solid fa-wand-magic-sparkles', action: () => { scrollToId('#projects'); openBlueprint('automation'); }, cat: 'System' },
    { title: 'Developer CLI Console', icon: 'fa-solid fa-terminal', action: () => scrollToId('#terminal'), cat: 'Navigation' },
    { title: 'Initiate Contact & Communication', icon: 'fa-solid fa-paper-plane', action: () => scrollToId('#contact'), cat: 'Navigation' },
    { title: 'Download Official Resume (PDF)', icon: 'fa-solid fa-file-pdf', action: () => openResume(), cat: 'Action' },
    { title: 'Theme: Electric Cyan', icon: 'fa-solid fa-circle', action: () => setTheme('cyan'), cat: 'Theme' },
    { title: 'Theme: Indigo Blue', icon: 'fa-solid fa-circle', action: () => setTheme('indigo'), cat: 'Theme' },
    { title: 'Theme: Neo Emerald', icon: 'fa-solid fa-circle', action: () => setTheme('emerald'), cat: 'Theme' },
    { title: 'Theme: Cyber Violet', icon: 'fa-solid fa-circle', action: () => setTheme('violet'), cat: 'Theme' }
  ];

  let pIndex = 0;
  let filteredPItems = [...paletteItems];

  function scrollToId(id) {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    closeCmd();
  }

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('executive_theme', t);
    accentOpts.forEach(o => o.classList.toggle('active', o.getAttribute('data-theme') === t));
    closeCmd();
    sfx.playSuccess();
  }

  function renderPalette() {
    cmdList.innerHTML = '';
    if (filteredPItems.length === 0) {
      cmdList.innerHTML = `<div style="padding: 14px; color: var(--text-secondary); font-size: 0.85rem; text-align: center;">No matching commands found.</div>`;
      return;
    }

    filteredPItems.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = `cmd-row ${idx === pIndex ? 'selected' : ''}`;
      row.innerHTML = `
        <div class="cmd-row-left">
          <i class="${item.icon}"></i>
          <span>${item.title}</span>
        </div>
        <span class="cmd-cat-tag">${item.cat}</span>
      `;
      row.addEventListener('click', () => {
        item.action();
        sfx.playClick();
      });
      cmdList.appendChild(row);
    });
  }

  function openCmd() {
    cmdPaletteBackdrop.classList.add('show');
    cmdSearchInput.value = '';
    filteredPItems = [...paletteItems];
    pIndex = 0;
    renderPalette();
    setTimeout(() => cmdSearchInput.focus(), 50);
    sfx.playClick();
  }

  function closeCmd() {
    cmdPaletteBackdrop.classList.remove('show');
  }

  if (cmdPaletteBtn) cmdPaletteBtn.addEventListener('click', openCmd);

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdPaletteBackdrop.classList.contains('show')) {
        closeCmd();
      } else {
        openCmd();
      }
    } else if (e.key === 'Escape') {
      closeCmd();
      projModalBackdrop.classList.remove('show');
      resumeModalBackdrop.classList.remove('show');
    }
  });

  if (cmdPaletteBackdrop) {
    cmdPaletteBackdrop.addEventListener('click', (e) => {
      if (e.target === cmdPaletteBackdrop) closeCmd();
    });
  }

  if (cmdSearchInput) {
    cmdSearchInput.addEventListener('input', () => {
      sfx.playKey();
      const q = cmdSearchInput.value.toLowerCase().trim();
      filteredPItems = paletteItems.filter(item =>
        item.title.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q)
      );
      pIndex = 0;
      renderPalette();
    });

    cmdSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        pIndex = (pIndex + 1) % filteredPItems.length;
        renderPalette();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        pIndex = (pIndex - 1 + filteredPItems.length) % filteredPItems.length;
        renderPalette();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredPItems[pIndex]) {
          filteredPItems[pIndex].action();
          sfx.playClick();
        }
      }
    });
  }


  /* ==========================================================================
     14. CONTACT FORM
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('cName').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      const subject = document.getElementById('cSubject').value.trim();
      const message = document.getElementById('cMessage').value.trim();

      if (!name || !email || !subject || !message) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Transmitting Message...`;
      formFeedback.className = 'form-feedback-msg';
      formFeedback.innerHTML = '';

      const formData = new FormData(contactForm);
      const urlEncoded = new URLSearchParams(formData).toString();

      let success = false;

      try {
        // 1. Primary: Netlify Forms native POST
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: urlEncoded
        });

        if (res.ok) {
          success = true;
        } else {
          throw new Error('Netlify form endpoint unavailable');
        }
      } catch (err) {
        try {
          // 2. Fallback: Direct FormSubmit email dispatch
          const fbRes = await fetch('https://formsubmit.co/ajax/johnkyle.lastimosa99@gmail.com', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              email: email,
              _subject: `[Portfolio Inquiry] ${subject}`,
              message: message
            })
          });
          const fbData = await fbRes.json();
          if (fbData.success || fbRes.ok) {
            success = true;
          }
        } catch (fbErr) {
          console.warn('Form dispatch fallback notice:', fbErr);
        }
      }

      submitBtn.disabled = false;
      if (success) {
        submitBtn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> Transmission Received`;
        formFeedback.className = 'form-feedback-msg success';
        formFeedback.innerHTML = `✅ <strong>Message Delivered!</strong> Thank you, <strong>${name}</strong>. Your communication has been dispatched to <code>johnkyle.lastimosa99@gmail.com</code>. I will reply to <code>${email}</code> shortly.`;
        sfx.playSuccess();
        contactForm.reset();
      } else {
        submitBtn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> Message Sent`;
        formFeedback.className = 'form-feedback-msg success';
        formFeedback.innerHTML = `✅ <strong>Message Prepared!</strong> Opening default mail client to finalize delivery to <code>johnkyle.lastimosa99@gmail.com</code>...`;
        sfx.playSuccess();
        const mailto = `mailto:johnkyle.lastimosa99@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
        window.location.href = mailto;
        contactForm.reset();
      }

      setTimeout(() => {
        submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane mr-2"></i> Send Message`;
      }, 5000);
    });
  }

  // Channel Copy Buttons
  document.querySelectorAll('.copy-ch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        sfx.playSuccess();
        btn.innerHTML = '<i class="fa-solid fa-check text-emerald"></i>';
        setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 2000);
      });
    });
  });

});
