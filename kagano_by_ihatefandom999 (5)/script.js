const bootSequence = [
  "Initiating boot sequence...",
  "BIOS Version 2.5.1",
  "Checking RAM... 256MB OK",
  "Checking Hard Drive... 20GB OK",
  "Loading Operating System...",
  "LisOS v1.3 Loading..."
];

async function typeText(text, element, speed = 50) {
  for (let char of text) {
    element.textContent += char;
    await new Promise(resolve => setTimeout(resolve, speed));
  }
  element.textContent += '\n';
}

async function startBootSequence() {
  const bootTextElement = document.querySelector('.boot-text');
  
  for (let line of bootSequence) {
    await typeText(line, bootTextElement);
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  document.getElementById('boot-sequence').style.display = 'none';
  document.getElementById('account-select').style.display = 'block';
  initializeLoginSystem();
}

function initializeLoginSystem() {
  const accountSelect = document.getElementById('account-select');
  const accounts = document.querySelectorAll('.account');
  const loginPrompt = document.querySelector('.login-prompt');
  const promptUser = document.querySelector('.prompt-user');
  const loginPassword = document.querySelector('.login-password');
  const loginSubmit = document.querySelector('.login-submit');
  const loginBack = document.querySelector('.login-back');
  const loginError = document.querySelector('.login-error');
  const desktop = document.getElementById('desktop');
  
  const passwords = {
    guest: '',
    researcher: 'pass123'
  };
  
  let currentUser = null;
  
  accounts.forEach(account => {
    account.addEventListener('click', () => {
      currentUser = account.dataset.username;
      const accountList = document.querySelector('.account-list');
      accountList.style.display = 'none';
      loginPrompt.style.display = 'block';
      promptUser.textContent = `Welcome, ${currentUser}`;
      loginPassword.value = '';
      loginError.style.display = 'none';
      
      if (currentUser === 'guest') {
        // Auto-login for guest
        setTimeout(() => {
          accountSelect.style.display = 'none';
          desktop.style.display = 'block';
          desktop.classList.remove('researcher-background', 'researcher-theme');
          // Show/hide appropriate files
          document.querySelectorAll('.guest-only').forEach(file => file.style.display = 'block');
          document.querySelectorAll('.researcher-only').forEach(file => file.style.display = 'none');
        }, 500);
      }
    });
  });
  
  loginSubmit.addEventListener('click', () => {
    if (loginPassword.value === passwords[currentUser]) {
      loginError.style.display = 'none';
      accountSelect.style.display = 'none';
      desktop.style.display = 'block';
      
      if (currentUser === 'researcher') {
        desktop.classList.add('researcher-background', 'researcher-theme');
        // Show/hide appropriate files
        document.querySelectorAll('.guest-only').forEach(file => file.style.display = 'none');
        document.querySelectorAll('.researcher-only').forEach(file => file.style.display = 'block');
      } else {
        desktop.classList.remove('researcher-background', 'researcher-theme');
        // Show/hide appropriate files
        document.querySelectorAll('.guest-only').forEach(file => file.style.display = 'block');
        document.querySelectorAll('.researcher-only').forEach(file => file.style.display = 'none');
      }
      
    } else {
      loginError.style.display = 'block';
      loginPassword.value = '';
    }
  });
  
  loginBack.addEventListener('click', () => {
    const accountList = document.querySelector('.account-list');
    accountList.style.display = 'flex';
    loginPrompt.style.display = 'none';
    loginError.style.display = 'none';
    currentUser = null;
  });
  
  loginPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loginSubmit.click();
    }
  });
}

function initializeFileSystem() {
  const files = document.querySelectorAll('.file');
  const fileViewer = document.getElementById('file-viewer');
  const closeBtn = document.querySelector('.close-btn');
  const fileContent = document.getElementById('file-content');
  const currentFileName = document.getElementById('current-file');
  const passwordPrompt = document.getElementById('password-prompt');
  const errorMessage = document.getElementById('error-message');

  const kaganoDocuments = {
    'Company Overview': `KAGANO CORPORATION
========================
[SECURE DOCUMENT - COMPANY STATEMENT]

ESTABLISHED: 2nd Year, First Land
CLEARANCE: WALNUT-CLASS
========================
CORE OPERATIONS:
- Artificial Intelligence Research
- Cell Sustainance Division
- Biological Enhancement Systems
- Neural Interface Development

========================
ACTIVE PROJECTS:
[DATA EXPUNGED]
[DATA EXPUNGED]
[DATA EXPUNGED]

========================
⚠️ WARNING: This document contains 
classified information protected
under International Security Act 
Section 31-B. Unauthorized access
will result in immediate legal action.
========================
[END DOCUMENT]`,

    'Project SENTINEL': `PROJECT SENTINEL
========================
STATUS: ACTIVE
CLEARANCE: CHERRY-CLASS
========================

OBJECTIVE:
Integration of biological and digital
consciousness structures through
adjusted neural mapping.

PROGRESS:
■■■■■■■□□□ 70%

NOTES:
- Subject 23 showed promising results
- Temporal lobe integration successful
- Memory retention at 89%
- [DATA EXPUNGED]

WARNING: Project suspended pending
ethics committee review.
========================`,

    'Incident Report #47': `INCIDENT REPORT #47
========================
DATE: [REDACTED]
LOCATION: Sector 7, Sub-level B
========================

DESCRIPTION:
During routine maintenance of the
Seninel system, unexpected
events occurred resulting
in complete [REDACTED] failure.

CASUALTIES: [REDACTED]
CONTAINMENT STATUS: ACHIEVED
========================

Note: All personnel must maintain
Level 3 clearance when accessing
this area. Area is to be sealed off.`,

    'Research Log': `RESEARCH LOG
========================
Entry #1992
Date: [REDACTED]
========================

The combination of [REDACTED] with
the neural interface has shown
unexpected side effects. Subject
displays increased [DATA EXPUNGED]
and unusual temporal perception.

Further testing required.
Monitor brain wave patterns for
anomalies.

Dr. [REMOVED]
Head of Research`,

    'Personnel Records': `PERSONNEL RECORDS
========================
[CLASSIFIED - INTERNAL USE ONLY]
UPDATED: 510 Third Land
NOTE: "This database has been outdated for ages."
========================
SUBJECT: Jonathon Steele
STATUS: ACTIVE
NOTES: Well-skilled at swordsmanship. Has potential. Affiliated with Slamjhatoon.
PRIORITY: 4/10
========================
SUBJECT: Very Goodman
STATUS: ACTIVE
NOTES: Refused by the Goodman Family gang. Could be useful converted. Current whereabouts
unknown.
PRIORITY: 7/10
========================
SUBJECT: Slamjhatoon
STATUS: ACTIVE
NOTES: Richest current individual. Over 1000 years old. Alien. Serves little threat but extremely valuable.
PRIORITY: 8/10
========================
[ADDITIONAL RECORDS RESTRICTED]`
  };

  files.forEach(file => {
    file.addEventListener('click', () => {
      const fileName = file.textContent.trim();
      
      if (fileName.includes('Kagano Corp')) {
        passwordPrompt.classList.add('kagano-prompt');
        passwordPrompt.style.display = 'block';
        const submitBtn = document.getElementById('submit-password');
        const passwordInput = document.getElementById('password-input');
        
        submitBtn.onclick = () => {
          if (passwordInput.value === 'combine998') {
            passwordPrompt.style.display = 'none';
            currentFileName.textContent = fileName;
            
            // Create document selector
            const documentSelector = document.createElement('div');
            documentSelector.className = 'document-selector';
            
            Object.keys(kaganoDocuments).forEach((docName, index) => {
              const tab = document.createElement('div');
              tab.className = 'document-tab' + (index === 0 ? ' active' : '');
              tab.textContent = docName;
              tab.onclick = () => {
                document.querySelectorAll('.document-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                fileContent.textContent = kaganoDocuments[docName];
              };
              documentSelector.appendChild(tab);
            });
            
            const viewerContent = fileViewer.querySelector('.viewer-content');
            viewerContent.insertBefore(documentSelector, fileContent);
            
            // Show first document by default
            fileContent.textContent = kaganoDocuments[Object.keys(kaganoDocuments)[0]];
            
            fileViewer.style.display = 'block';
            fileViewer.classList.add('kagano-viewer');
            errorMessage.style.display = 'none';
            passwordInput.value = '';
          } else {
            errorMessage.style.display = 'block';
            passwordInput.value = '';
          }
        };

        document.getElementById('cancel-password').onclick = () => {
          passwordPrompt.style.display = 'none';
          errorMessage.style.display = 'none';
          passwordInput.value = '';
        };
      } else {
        currentFileName.textContent = fileName;
        fileContent.textContent = file.dataset.content;
        fileViewer.classList.remove('kagano-viewer');
        // Remove document selector if it exists
        const existingSelector = fileViewer.querySelector('.document-selector');
        if (existingSelector) {
          existingSelector.remove();
        }
        fileViewer.style.display = 'block';
      }
    });
  });

  closeBtn.addEventListener('click', () => {
    fileViewer.style.display = 'none';
    const existingSelector = fileViewer.querySelector('.document-selector');
    if (existingSelector) {
      existingSelector.remove();
    }
  });
}

function initializeOrbMonitor() {
  const orbMonitor = document.querySelector('.orb-monitor');
  const monitorWindow = document.getElementById('orb-monitor-window');
  const closeBtn = monitorWindow.querySelector('.close-btn');
  const logContent = document.getElementById('orb-log');
  
  let monitorActive = false;
  let currentColor = "#00ffff";
  let resonanceLevel = 0;
  let energyLevel = 0;
  let stabilityLevel = 100;
  
  orbMonitor.addEventListener('click', () => {
    monitorWindow.style.display = 'block';
    monitorActive = true;
    startMonitoring();
  });
  
  closeBtn.addEventListener('click', () => {
    monitorWindow.style.display = 'none';
    monitorActive = false;
  });
  
  function startMonitoring() {
    updateReadings();
    logEvent("Monitoring system initialized");
    logEvent("Establishing connection to orb...");
    
    setTimeout(() => {
      logEvent("Connection established");
      logEvent("Beginning data collection...");
    }, 2000);
  }
  
  function updateReadings() {
    if (!monitorActive) return;
    
    // Update resonance
    resonanceLevel = Math.sin(Date.now() / 1000) * 50 + 50;
    document.getElementById('resonance-value').textContent = 
      resonanceLevel.toFixed(2) + " Hz";
    
    // Update energy
    energyLevel += (Math.random() - 0.5) * 2;
    energyLevel = Math.max(0, Math.min(100, energyLevel));
    document.getElementById('energy-value').textContent = 
      energyLevel.toFixed(2) + " MW";
    
    // Update stability
    stabilityLevel += (Math.random() - 0.5) * 5;
    stabilityLevel = Math.max(0, Math.min(100, stabilityLevel));
    document.getElementById('stability-value').textContent = 
      stabilityLevel.toFixed(1) + "%";
    
    // Random events
    if (Math.random() < 0.05) {
      const events = [
        "Anomalous energy spike detected",
        "Minor resonance fluctuation",
        "Chromatic shift observed",
        "Stability variance within acceptable parameters",
        "Energy output normalized",
        "Quantum frequency alignment successful"
      ];
      logEvent(events[Math.floor(Math.random() * events.length)]);
    }
    
    // Update orb visualization
    const orbVis = document.querySelector('.orb-visualization');
    const hue = (Math.sin(Date.now() / 8000) + 1) * 180;
    currentColor = `hsl(${hue}, 100%, 50%)`;
    orbVis.style.background = `radial-gradient(circle at center, ${currentColor} 0%, transparent 70%)`;
    
    if (stabilityLevel < 50) {
      orbVis.style.animation = 'orb-glow 2s infinite, orb-unstable 0.5s infinite';
    } else {
      orbVis.style.animation = 'orb-glow 5s infinite';
    }
    
    // Continue monitoring
    requestAnimationFrame(updateReadings);
  }
  
  function logEvent(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${timestamp}] ${message}`;
    logContent.insertBefore(logEntry, logContent.firstChild);
    
    // Keep only last 100 messages
    while (logContent.children.length > 100) {
      logContent.removeChild(logContent.lastChild);
    }
  }
}

function initializeAmbientSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create oscillators for the hum
  const baseOsc = audioContext.createOscillator();
  const subOsc = audioContext.createOscillator();
  const modulatorOsc = audioContext.createOscillator();
  
  // Create gain nodes for volume control
  const masterGain = audioContext.createGain();
  const baseGain = audioContext.createGain();
  const subGain = audioContext.createGain();
  const modulatorGain = audioContext.createGain();
  
  // Set frequencies
  baseOsc.frequency.value = 60; // Base frequency
  subOsc.frequency.value = 120; // Harmonic
  modulatorOsc.frequency.value = 0.5; // Slow modulation
  
  // Set volumes
  masterGain.gain.value = 0.15; // Master volume
  baseGain.gain.value = 0.6;
  subGain.gain.value = 0.2;
  modulatorGain.gain.value = 0.1;
  
  // Create low-pass filter
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 200;
  filter.Q.value = 1;
  
  // Connect oscillators to their gain nodes
  baseOsc.connect(baseGain);
  subOsc.connect(subGain);
  modulatorOsc.connect(modulatorGain);
  
  // Connect everything to the master gain
  baseGain.connect(filter);
  subGain.connect(filter);
  modulatorGain.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(audioContext.destination);
  
  // Start the oscillators
  baseOsc.start();
  subOsc.start();
  modulatorOsc.start();
  
  // Add slight random variations to create more "natural" sound
  setInterval(() => {
    if (audioContext.state === 'running') {
      baseOsc.frequency.setValueAtTime(60 + Math.random() * 2 - 1, audioContext.currentTime);
      subOsc.frequency.setValueAtTime(120 + Math.random() * 4 - 2, audioContext.currentTime);
      filter.frequency.setValueAtTime(200 + Math.random() * 20 - 10, audioContext.currentTime);
    }
  }, 1000);
  
  // Return the audio context and master gain for external control
  return { audioContext, masterGain };
}

function initializeEmailClient() {
  const emailApp = document.querySelector('.email-client');
  const emailWindow = document.getElementById('email-window');
  const closeBtn = emailWindow.querySelector('.close-btn');
  
  emailApp.addEventListener('click', () => {
    emailWindow.style.display = 'block';
  });
  
  closeBtn.addEventListener('click', () => {
    emailWindow.style.display = 'none';
  });

  const folders = document.querySelectorAll('.email-folder');
  folders.forEach(folder => {
    folder.addEventListener('click', () => {
      folders.forEach(f => f.classList.remove('active'));
      folder.classList.add('active');
    });
  });
}

function initializeLogout() {
  const logoutBtn = document.querySelector('.logout-btn');
  const desktop = document.getElementById('desktop');
  const accountSelect = document.getElementById('account-select');
  
  logoutBtn.addEventListener('click', () => {
    // Reset account display settings
    desktop.classList.remove('researcher-background', 'researcher-theme');
    document.querySelectorAll('.guest-only').forEach(file => file.style.display = 'none');
    document.querySelectorAll('.researcher-only').forEach(file => file.style.display = 'none');
    
    // Hide desktop and show account select
    desktop.style.display = 'none';
    accountSelect.style.display = 'block';
    
    // Reset any open windows
    document.querySelectorAll('.monitor-window').forEach(window => {
      window.style.display = 'none';
    });
    
    // Reset login prompt
    const accountList = document.querySelector('.account-list');
    const loginPrompt = document.querySelector('.login-prompt');
    accountList.style.display = 'flex';
    loginPrompt.style.display = 'none';
    
    // Reset any password inputs
    document.querySelectorAll('input[type="password"]').forEach(input => {
      input.value = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const { audioContext, masterGain } = initializeAmbientSound();
  
  document.body.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }, { once: true });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === '-' || e.key === '_') {
      masterGain.gain.value = Math.max(0, masterGain.gain.value - 0.05);
    } else if (e.key === '=' || e.key === '+') {
      masterGain.gain.value = Math.min(1, masterGain.gain.value + 0.05);
    } else if (e.key === 'm') {
      masterGain.gain.value = masterGain.gain.value === 0 ? 0.15 : 0;
    }
  });
  
  document.querySelectorAll('.researcher-only').forEach(file => file.style.display = 'none');
  
  startBootSequence();
  initializeFileSystem();
  initializeOrbMonitor();
  initializeEmailClient();
  initializeLogout();
});

// Add password input handling on Enter key
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && document.getElementById('password-prompt').style.display === 'block') {
    document.getElementById('submit-password').click();
  }
});