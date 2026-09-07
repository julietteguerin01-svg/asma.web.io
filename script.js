// Marque l'onglet de navigation correspondant à la page actuelle
document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.tabs a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current) {
      link.setAttribute('aria-current', 'page');
    }
  });

  initToggleDemo();
  initEditMode();
});

// Démo interactive : illustre le "renversement du défaut" décrit par
// Mayer-Schönberger. En mode "oubli par défaut", seule la ligne marquée
// .kept résiste ; en mode "mémoire par défaut", tout reste net et lisible.
function initToggleDemo() {
  const demo = document.querySelector('[data-demo]');
  if (!demo) return;

  const btnOubli = demo.querySelector('[data-mode="oubli"]');
  const btnMemoire = demo.querySelector('[data-mode="memoire"]');

  function setMode(mode) {
    demo.classList.toggle('mode-oubli', mode === 'oubli');
    demo.classList.toggle('mode-memoire', mode === 'memoire');
    btnOubli.classList.toggle('active', mode === 'oubli');
    btnMemoire.classList.toggle('active', mode === 'memoire');
    btnOubli.setAttribute('aria-pressed', mode === 'oubli');
    btnMemoire.setAttribute('aria-pressed', mode === 'memoire');
  }

  btnOubli.addEventListener('click', () => setMode('oubli'));
  btnMemoire.addEventListener('click', () => setMode('memoire'));

  setMode('memoire'); // état par défaut aujourd'hui : le numérique se souvient de tout
}

// Mode édition : permet de cliquer sur une phrase et de la réécrire
// directement dans la page. Comme le site est statique (pas de serveur),
// les changements ne sont pas sauvegardés automatiquement : le bouton
// "Télécharger cette page" exporte le HTML de la page telle qu'elle est
// à l'écran, avec les modifications faites.
function initEditMode() {
  const dossier = document.querySelector('.dossier');
  if (!dossier) return;

  const toolbar = document.createElement('div');
  toolbar.className = 'edit-toolbar';
  toolbar.innerHTML = `
    <button type="button" id="toggleEdit">Modifier le texte</button>
    <button type="button" id="downloadPage" hidden>Télécharger cette page</button>
    <span class="hint">Clique sur une phrase pour la modifier, puis télécharge la page.</span>
  `;
  document.body.appendChild(toolbar);

  const editableEls = dossier.querySelectorAll('h1, h2, h3, p, span.stamp');
  const toggleBtn = toolbar.querySelector('#toggleEdit');
  const downloadBtn = toolbar.querySelector('#downloadPage');
  let editing = false;

  toggleBtn.addEventListener('click', () => {
    editing = !editing;
    editableEls.forEach((el) => el.setAttribute('contenteditable', editing));
    document.body.classList.toggle('is-editing', editing);
    toggleBtn.textContent = editing ? 'Terminer' : 'Modifier le texte';
    downloadBtn.hidden = !editing;
  });

  downloadBtn.addEventListener('click', () => {
    const clone = document.documentElement.cloneNode(true);
    const toolbarClone = clone.querySelector('.edit-toolbar');
    if (toolbarClone) toolbarClone.remove();
    clone.querySelectorAll('[contenteditable]').forEach((el) => el.removeAttribute('contenteditable'));
    clone.querySelector('body').classList.remove('is-editing');

    const html = '<!DOCTYPE html>\n' + clone.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = window.location.pathname.split('/').pop() || 'page.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}
