// Fallback deterministic stage navigation renderer (always shows 6 categories)
// Uses global stagesConfig from main script to avoid duplication

function getStageDefinitions() {
  // If stagesConfig is available globally, use it
  if (window.stagesConfig) {
    const stages = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6'];
    return stages
      .filter(id => window.stagesConfig[id])
      .map(id => {
        const config = window.stagesConfig[id];
        return {
          id,
          longName: config.longName || config.name
        };
      });
  }
  
  // Fallback definitions if stagesConfig not available
  return [
    { id: 'stage1', longName: 'בציר' },
    { id: 'stage2', longName: 'ריסוק והכנה לתסיסה' },
    { id: 'stage3', longName: 'תסיסה אלכוהולית' },
    { id: 'stage4', longName: 'תסיסה מלולקטית' },
    { id: 'stage5', longName: 'יישון' },
    { id: 'stage6', longName: 'הכנה לבקבוק' }
  ];
}

function createButton(stage) {
  const btn = document.createElement('button');
  btn.className = 'stage-nav-button';
  btn.type = 'button';
  btn.textContent = stage.longName; // Match existing implementation
  btn.onclick = () => {
    if (typeof window.switchStage === 'function') {
      window.switchStage(stage.id);
    } else {
      console.log('[StageNavFix] Clicked:', stage.id, '(switchStage not available)');
    }
  };
  return btn;
}

let renderPending = false;

function renderStageNavDeterministic() {
  const container = document.getElementById('stageNavContainer');
  if (!container) return;

  // Prevent duplicate renders
  if (renderPending) return;
  renderPending = true;
  
  requestAnimationFrame(() => {
    const stages = getStageDefinitions();
    
    container.innerHTML = '';
    const rowLeft = document.createElement('div');
    const logoRow = document.createElement('div');
    logoRow.className = 'wine-icon-container';
    const rowRight = document.createElement('div');

    stages.slice(0, 3).forEach(s => rowLeft.appendChild(createButton(s)));
    
    // Match existing implementation
    const wineIconLink = document.createElement('a');
    wineIconLink.href = '#';
    wineIconLink.onclick = (e) => { e.preventDefault(); };
    const wineIconImg = document.createElement('img');
    wineIconImg.src = 'image_00b206.png';
    wineIconImg.alt = 'Wine Icon';
    wineIconLink.appendChild(wineIconImg);
    logoRow.appendChild(wineIconLink);
    
    stages.slice(3, 6).forEach(s => rowRight.appendChild(createButton(s)));

    container.appendChild(rowLeft);
    container.appendChild(logoRow);
    container.appendChild(rowRight);

    [rowLeft, logoRow, rowRight].forEach(el => {
      el.style.display = 'flex';
      el.style.visibility = 'visible';
    });
    
    renderPending = false;
  });
}

let observerActive = false;
let observer = null;
let visibilityHandler = null;
let resizeHandler = null;

function setupObserver() {
  const container = document.getElementById('stageNavContainer');
  if (!container || observerActive) return;

  const ensureSix = () => {
    // Skip if already rendering to prevent cascading checks
    if (renderPending) return;
    
    const buttons = container.querySelectorAll('.stage-nav-button');
    if (buttons.length !== 6) {
      console.warn('[StageNavFix] Buttons lost/incorrect count, re-rendering...');
      renderStageNavDeterministic();
    }
  };

  ensureSix();

  observer = new MutationObserver(ensureSix);
  observer.observe(container, { childList: true, subtree: true });
  observerActive = true;

  // Store handlers for cleanup
  visibilityHandler = ensureSix;
  resizeHandler = ensureSix;
  
  document.addEventListener('visibilitychange', visibilityHandler);
  window.addEventListener('resize', resizeHandler);
}

function cleanup() {
  if (observer) {
    observer.disconnect();
    observer = null;
    observerActive = false;
  }
  
  // Remove event listeners
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler);
    visibilityHandler = null;
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
}

function initStageNavFix() {
  renderStageNavDeterministic();
  setupObserver();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStageNavFix);
} else {
  initStageNavFix();
}
