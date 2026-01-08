// Fallback deterministic stage navigation renderer (always shows 6 categories)
const STAGES = [
  { id: 'stage1', label: 'בציר', iconClass: 'fa-leaf' },
  { id: 'stage2', label: 'ריסוק והכנה לתסיסה', iconClass: 'fa-wine-glass' },
  { id: 'stage3', label: 'תסיסה אלכוהולית', iconClass: 'fa-flask' },
  { id: 'stage4', label: 'תסיסה מלולקטית', iconClass: 'fa-sync-alt' },
  { id: 'stage5', label: 'יישון', iconClass: 'fa-hourglass-half' },
  { id: 'stage6', label: 'הכנה לבקבוק', iconClass: 'fa-vial' }
];

function createButton(stage) {
  const btn = document.createElement('button');
  btn.className = 'stage-nav-button';
  btn.type = 'button';
  btn.dataset.stageId = stage.id;
  btn.innerHTML = `<i class="fas ${stage.iconClass}" aria-hidden="true"></i> ${stage.label}`;
  btn.addEventListener('click', () => {
    if (typeof window.switchStage === 'function') {
      window.switchStage(stage.id);
    } else {
      console.log('[StageNavFix] Clicked:', stage.id, '(switchStage not available)');
    }
  });
  return btn;
}

function renderStageNavDeterministic() {
  const container = document.getElementById('stageNavContainer');
  if (!container) return;

  container.innerHTML = '';
  const rowLeft = document.createElement('div');
  const logoRow = document.createElement('div');
  logoRow.className = 'wine-icon-container';
  const rowRight = document.createElement('div');

  STAGES.slice(0,3).forEach(s => rowLeft.appendChild(createButton(s)));
  logoRow.innerHTML = `<img src="image_00b206.png" alt="יין" width="48" height="48" />`;
  STAGES.slice(3,6).forEach(s => rowRight.appendChild(createButton(s)));

  container.appendChild(rowLeft);
  container.appendChild(logoRow);
  container.appendChild(rowRight);

  [rowLeft, logoRow, rowRight].forEach(el => {
    el.style.display = 'flex';
    el.style.visibility = 'visible';
  });
}

function setupObserver() {
  const container = document.getElementById('stageNavContainer');
  if (!container) return;

  const ensureSix = () => {
    const buttons = container.querySelectorAll('.stage-nav-button');
    if (buttons.length !== 6) {
      console.warn('[StageNavFix] Buttons lost/incorrect count, re-rendering...');
      renderStageNavDeterministic();
    }
  };

  ensureSix();

  const obs = new MutationObserver(ensureSix);
  obs.observe(container, { childList: true, subtree: true });

  document.addEventListener('visibilitychange', ensureSix);
  window.addEventListener('resize', ensureSix);
}

function initStageNavFix() {
  renderStageNavDeterministic();
  setupObserver();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStageNavFix);
} else {
  initStageNavFix();
}
