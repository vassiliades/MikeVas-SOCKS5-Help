const search = document.getElementById('search');
const language = document.getElementById('language');
let activeCategory = null;
const categories = [
  ['start', 'Getting started', 'Εκκίνηση'], ['applications', 'Applications', 'Εφαρμογές'],
  ['proxy', 'Proxy & Bypass', 'Proxy & Bypass'], ['ssh', 'SSH Tunnels', 'SSH Tunnels'],
  ['server', 'Linux server', 'Linux server'], ['browser', 'Browser add-on', 'Πρόσθετο browser'], ['automatic', 'Automatic operations', 'Αυτόματες λειτουργίες'],
  ['security', 'Security & Settings', 'Ασφάλεια & Ρυθμίσεις'], ['troubleshooting', 'Troubleshooting', 'Προβλήματα']
];
language.checked = false;
const currentLanguage = () => language.checked ? 'el' : 'en';
document.getElementById('closeGuide').onclick = () => window.close();
function renderGuide() {
  const english = !language.checked;
  document.documentElement.lang = currentLanguage();
  document.getElementById('intro').textContent = english ? 'App & browser extension user guide' : 'Οδηγός χρήσης app και πρόσθετου';
  document.getElementById('enLabel').classList.toggle('active', english);
  document.getElementById('grLabel').classList.toggle('active', !english);
  search.placeholder = english ? 'Search topics, e.g. Auto Run, bypass…' : 'Αναζήτηση, π.χ. Auto Run, bypass…';
  document.getElementById('closeGuide').textContent = english ? 'Close' : 'Κλείσιμο';
  document.getElementById('categories').replaceChildren();
  for (const [id, en, el] of categories) {
    const button = document.createElement('button'); button.textContent = english ? en : el;
    button.dataset.category = id;
    if (id === activeCategory) button.setAttribute('aria-current', 'location');
    button.onclick = () => {
      activeCategory = id;
      search.value = ''; renderGuide();
      document.querySelector(`section[data-language="${currentLanguage()}"] article[data-category="${id}"]`)?.scrollIntoView({ block: 'start' });
    };
    document.getElementById('categories').append(button);
  }
  let count = 0;
  for (const section of document.querySelectorAll('[data-language]')) {
    section.hidden = section.dataset.language !== currentLanguage();
    let highlighted = false;
    for (const topic of section.querySelectorAll('article')) {
      const current = !highlighted && topic.dataset.category === activeCategory;
      topic.classList.toggle('current-topic', current);
      if (current) highlighted = true;
      topic.hidden = !topic.dataset.search.toLocaleLowerCase().includes(search.value.trim().toLocaleLowerCase());
      if (!section.hidden && !topic.hidden) count++;
    }
  }
  document.getElementById('results').textContent = english ? (count ? `${count} topics · Use the categories above to jump to a section.` : 'No topics found. Try another word.')
    : (count ? `${count} ενότητες · Επίλεξε κατηγορία για μετάβαση στην ενότητα.` : 'Δεν βρέθηκαν ενότητες. Δοκίμασε άλλη λέξη.');
}
search.addEventListener('input', renderGuide);
language.addEventListener('change', renderGuide);
const topPanel = document.getElementById('guideTop');
new ResizeObserver(() => document.documentElement.style.setProperty('--guide-top-height', topPanel.getBoundingClientRect().height + 'px')).observe(topPanel);
renderGuide();
