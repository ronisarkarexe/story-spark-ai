const { jsPDF } = require('jspdf');
const path = require('path');

const doc = new jsPDF({
  orientation: 'landscape',
  unit: 'pt',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth(); // 841.89
const pageHeight = doc.internal.pageSize.getHeight(); // 595.28

// Colors
const COLOR_BG = [5, 6, 11]; // #05060B
const COLOR_PRIMARY = [139, 61, 255]; // #8B3DFF
const COLOR_SECONDARY = [0, 196, 204]; // #00C4CC
const COLOR_WHITE = [255, 255, 255];
const COLOR_MUTED = [155, 164, 181]; // #9BA4B5
const COLOR_CARD_BG = [13, 16, 29]; // #0D101D

function drawSlideBase(slideNum, slideTitle) {
  // 1. Background
  doc.setFillColor(...COLOR_BG);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // 2. Neon line at the top
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 4, 'F');
  
  // 3. Header Logo & Tech tag
  doc.setTextColor(...COLOR_WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('LUNA OS', 40, 40);
  
  doc.setTextColor(...COLOR_SECONDARY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('SYSTEMS CLASSIFIED // HACKATHON STAGE 1', pageWidth - 250, 40);
  
  // 4. Slide Number & Title
  doc.setTextColor(...COLOR_PRIMARY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(slideNum.toUpperCase(), 40, 80);
  
  doc.setTextColor(...COLOR_WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(slideTitle, 40, 110);

  // 5. Footer
  doc.setDrawColor(255, 255, 255, 0.05);
  doc.line(40, pageHeight - 50, pageWidth - 40, pageHeight - 50);

  doc.setTextColor(...COLOR_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Built by Team WEBTitans', 40, pageHeight - 35);
  doc.text('Page ' + (doc.internal.getNumberOfPages()), pageWidth - 80, pageHeight - 35);
}

function drawGridCards(cards) {
  const startX = 40;
  const startY = 240;
  const gap = 20;
  const cardWidth = (pageWidth - 80 - (gap * (cards.length - 1))) / cards.length;
  const cardHeight = 220;

  cards.forEach((card, index) => {
    const x = startX + index * (cardWidth + gap);
    
    // Card background
    doc.setFillColor(...COLOR_CARD_BG);
    doc.setDrawColor(...COLOR_PRIMARY);
    doc.rect(x, startY, cardWidth, cardHeight, 'FD');
    
    // Top accent line
    doc.setFillColor(...(card.accent === 'cyan' ? COLOR_SECONDARY : COLOR_PRIMARY));
    doc.rect(x + 15, startY, 40, 2, 'F');
    
    // Card Title
    doc.setTextColor(...COLOR_WHITE);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(card.title, x + 20, startY + 30);
    
    // Card description
    doc.setTextColor(...COLOR_MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(card.desc, x + 20, startY + 55, { maxWidth: cardWidth - 40, lineHeightFactor: 1.4 });
  });
}

// ==========================================
// SLIDE 1: TITLE PAGE
// ==========================================
doc.setFillColor(...COLOR_BG);
doc.rect(0, 0, pageWidth, pageHeight, 'F');
doc.setFillColor(...COLOR_PRIMARY);
doc.rect(0, 0, pageWidth, 4, 'F');

doc.setTextColor(...COLOR_SECONDARY);
doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.text('SYSTEMS CLASSIFIED // HACKATHON STAGE 1', pageWidth - 250, 40);

doc.setTextColor(...COLOR_WHITE);
doc.setFont('helvetica', 'bold');
doc.setFontSize(55);
doc.text('LUNA OS', pageWidth / 2, pageHeight / 2 - 40, { align: 'center' });

doc.setTextColor(...COLOR_SECONDARY);
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.text('THE AI-NATIVE CLINICAL COMPANION', pageWidth / 2, pageHeight / 2, { align: 'center' });

doc.setTextColor(...COLOR_MUTED);
doc.setFont('helvetica', 'italic');
doc.setFontSize(14);
doc.text('"Your body, finally understood."', pageWidth / 2, pageHeight / 2 + 35, { align: 'center' });

doc.setDrawColor(255, 255, 255, 0.05);
doc.line(150, pageHeight - 90, pageWidth - 150, pageHeight - 90);

doc.setTextColor(...COLOR_MUTED);
doc.setFont('helvetica', 'normal');
doc.setFontSize(10);
doc.text('Built by Abdisa Jemal Hasen & Sonu Sharma (Team WEBTitans)', pageWidth / 2, pageHeight - 70, { align: 'center' });

// ==========================================
// SLIDE 2: INTRODUCTION & PROJECT WORKFLOW (2-COLUMN CARDS)
// ==========================================
doc.addPage();
drawSlideBase('Slide 02 // Core Foundation', 'Introduction & Project Workflow');

doc.setTextColor(...COLOR_WHITE);
doc.setFont('helvetica', 'normal');
doc.setFontSize(12.5);
const introText = 'Luna OS is a high-performance AI companion engineered for women\'s health. Built specifically to handle complex biometric data and clinical symptoms, it ensures real-time, personalized care for the menopause transition.';
doc.text(introText, 40, 160, { maxWidth: pageWidth - 80, lineHeightFactor: 1.4 });

// Two column cards layout for Slide 2
drawGridCards([
  { title: 'Biometric Ingestion', desc: 'The platform captures live telemetry metrics like HRV (Heart Rate Variability), skin temperature, and sleep architecture via wearable integration.' },
  { title: 'Background AI Operations', desc: 'To guarantee an uninterrupted experience, heavy pattern-recognition (analyzing a 30-day longitudinal history of 34 symptoms) is offloaded to our background LLM engine.' }
]);

// ==========================================
// SLIDE 3: PROBLEM STATEMENT
// ==========================================
doc.addPage();
drawSlideBase('Slide 03 // Market Gaps', 'Problem Statement');

drawGridCards([
  { title: 'Complexity', desc: 'A standard 12-minute doctor visit is completely insufficient to track and diagnose up to 34 distinct, interacting symptoms spanning over decades.', accent: 'cyan' },
  { title: 'Vulnerability', desc: '80% of OB-GYNs lack formal menopause training. Over 1.1 Billion women are affected globally, resulting in $150B lost annually in workplace productivity due to unmanaged symptoms.', accent: 'cyan' },
  { title: 'Dependency', desc: 'Existing FemTech platforms are merely menstrual trackers. They act as static lookup tables instead of natively analyzing complex perimenopausal transitions over time.', accent: 'cyan' }
]);

// ==========================================
// SLIDE 4: SOLUTION APPROACH
// ==========================================
doc.addPage();
drawSlideBase('Slide 04 // Architecture Design', 'Solution Approach');

drawGridCards([
  { title: 'Data Privacy (Local-First)', desc: 'Isolates PII (Personally Identifiable Information) from the AI layer to maintain strict HIPAA-aligned safety protocols and prevent data collisions.' },
  { title: 'Real-Time Safety Thread', desc: 'Shifts emergency keyword classification to a prioritized loop. Instantly bypasses the AI and surfaces crisis lifelines if severe medical symptoms are detected.' },
  { title: 'Context AI Engine', desc: 'Injects the user\'s 30-day continuous symptom history directly into the LLM. Analyzes daily metrics against NAMS 2022 clinical guidelines to forecast trigger events natively.' }
]);

// ==========================================
// SLIDE 5: SYSTEM RESILIENCE
// ==========================================
doc.addPage();
drawSlideBase('Slide 05 // Technical Guardrails', 'System Resilience');

drawGridCards([
  { title: 'Pattern Recognition (Concurrency)', desc: 'Handles overlapping health inputs smoothly. Uses advanced RAG to cross-reference multiple clinical databases (vasomotor, sleep, psychiatry) instantly.', accent: 'cyan' },
  { title: 'Clinical Stability', desc: 'Keeps AI outputs strictly evidence-based. Prevents AI hallucinations and medical over-reliance by refusing to recommend specific prescription dosages.', accent: 'cyan' },
  { title: 'Emergency Persistence', desc: 'Enforces secure escalation paths. Any input matching crisis keywords triggers a hard-coded safety override.', accent: 'cyan' }
]);

// ==========================================
// SLIDE 6: WORKSPACE (CLINICAL) INTELLIGENCE
// ==========================================
doc.addPage();
drawSlideBase('Slide 06 // Live Metrics', 'Clinical Intelligence');

doc.setTextColor(...COLOR_WHITE);
doc.setFont('helvetica', 'normal');
doc.setFontSize(12.5);
doc.text('Luna OS integrates a native background predictive AI model to monitor, analyze, and forecast clinical transitions continuously.', 40, 160, { maxWidth: 440, lineHeightFactor: 1.4 });

const bullets = [
  'Luna OS integrates a native background predictive AI model.',
  'It monitors sleep architecture, daily mood logs, and biometrics continuously.',
  'The system automatically builds a real-time 24-Hour Hot Flash Risk Forecast.',
  'Generates a proactive "Doctor Prep" clinical dossier without manual input, saving vital time during physician visits.'
];

doc.setFontSize(10.5);
bullets.forEach((bullet, index) => {
  const y = 230 + index * 40;
  doc.setFillColor(...COLOR_SECONDARY);
  doc.circle(50, y - 3, 4, 'F');
  
  doc.setTextColor(...COLOR_WHITE);
  doc.text(bullet, 65, y, { maxWidth: 400, lineHeightFactor: 1.3 });
});

// HUD card
const hudX = 520;
const hudY = 160;
const hudWidth = 280;
const hudHeight = 270;

doc.setFillColor(...COLOR_CARD_BG);
doc.setDrawColor(...COLOR_PRIMARY);
doc.rect(hudX, hudY, hudWidth, hudHeight, 'FD');

doc.setDrawColor(...COLOR_SECONDARY);
doc.setLineWidth(3);
doc.circle(hudX + hudWidth / 2, hudY + 100, 60, 'D');

doc.setTextColor(...COLOR_SECONDARY);
doc.setFont('helvetica', 'bold');
doc.setFontSize(28);
doc.text('87%', hudX + hudWidth / 2, hudY + 105, { align: 'center' });

doc.setTextColor(...COLOR_MUTED);
doc.setFont('helvetica', 'normal');
doc.setFontSize(7.5);
doc.text('FORECAST ACCURACY', hudX + hudWidth / 2, hudY + 122, { align: 'center' });

doc.setTextColor(...COLOR_SECONDARY);
doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.text('MODEL: LUNA-TRANSITION-V1', hudX + hudWidth / 2, hudY + 200, { align: 'center' });

// ==========================================
// SLIDE 7: ARCHITECTS, STACK & ROADMAP
// ==========================================
doc.addPage();
drawSlideBase('Slide 07 // Delivery Model', 'Architects, Core Stack & Roadmap');

const colWidth = (pageWidth - 80 - 40) / 3;
const startX = 40;
const startY = 160;
const colHeight = 310;

// Column 1: The Architects
doc.setFillColor(...COLOR_CARD_BG);
doc.rect(startX, startY, colWidth, colHeight, 'F');
doc.setTextColor(...COLOR_SECONDARY);
doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.text('THE ARCHITECTS', startX + 15, startY + 25);
doc.line(startX + 15, startY + 35, startX + colWidth - 15, startY + 35);

doc.setTextColor(...COLOR_WHITE);
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.text('Sonu Sharma', startX + 15, startY + 60);
doc.setTextColor(...COLOR_MUTED);
doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.text('Lead Full-Stack & Systems Engineer', startX + 15, startY + 72);

doc.setTextColor(...COLOR_WHITE);
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.text('Abdisa Jemal Hasen', startX + 15, startY + 115);
doc.setTextColor(...COLOR_MUTED);
doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.text('Lead AI & Prompt Engineer', startX + 15, startY + 127);

// Column 2: Core Stack
const col2X = startX + colWidth + 20;
doc.setFillColor(...COLOR_CARD_BG);
doc.rect(col2X, startY, colWidth, colHeight, 'F');
doc.setTextColor(...COLOR_SECONDARY);
doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.text('CORE STACK', col2X + 15, startY + 25);
doc.line(col2X + 15, startY + 35, col2X + colWidth - 15, startY + 35);

const stackItems = [
  { title: 'Systems Frontend', val: 'React Native framework with high-contrast Tech-Noir custom Tailwind CSS design.' },
  { title: 'Intelligence Plane', val: 'Anthropic Claude API for intent triage and RAG-grounded response generation.' },
  { title: 'Backend Concurrency', val: 'Node.js API with PostgreSQL, running via Replit Agent for rapid live deployment.' }
];

stackItems.forEach((item, index) => {
  const y = startY + 60 + index * 75;
  doc.setTextColor(...COLOR_WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(item.title, col2X + 15, y);
  
  doc.setTextColor(...COLOR_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(item.val, col2X + 15, y + 12, { maxWidth: colWidth - 30, lineHeightFactor: 1.3 });
});

// Column 3: Project Roadmap
const col3X = startX + (colWidth + 20) * 2;
doc.setFillColor(...COLOR_CARD_BG);
doc.rect(col3X, startY, colWidth, colHeight, 'F');
doc.setTextColor(...COLOR_SECONDARY);
doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.text('PROJECT ROADMAP', col3X + 15, startY + 25);
doc.line(col3X + 15, startY + 35, col3X + colWidth - 15, startY + 35);

const steps = [
  { p: 'P1', name: 'Hackathon Baseline', desc: 'Deploying conversational AI & emergency triage safeguard.' },
  { p: 'P2', name: 'Closed Beta', desc: 'Onboarding 50 real users to validate trigger-detection.' },
  { p: 'P3', name: 'Zenith Scalability', desc: 'Stripe payment & B2B employer telehealth pilots.' }
];

steps.forEach((step, index) => {
  const y = startY + 60 + index * 75;
  
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(col3X + 15, y - 8, 20, 12, 'F');
  
  doc.setTextColor(...COLOR_WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(step.p, col3X + 25, y, { align: 'center' });
  
  doc.setFontSize(9.5);
  doc.text(step.name, col3X + 42, y);
  
  doc.setTextColor(...COLOR_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(step.desc, col3X + 15, y + 14, { maxWidth: colWidth - 30, lineHeightFactor: 1.3 });
});

// Save PDF
const pdfPath = path.join(__dirname, '../../luna-os-presentation-updated.pdf');
doc.save(pdfPath);
console.log('PDF successfully generated at: ' + pdfPath);
