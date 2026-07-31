/* ============================================================
   FluentPath Spanish — i18n Multi-Language Engine
   Supports: English (en), French (fr), German (de), Italian (it)
   ============================================================ */

const I18n = (() => {
  const SUPPORTED = ['en', 'fr', 'de', 'it'];
  const DEFAULT = 'en';
  const STORAGE_KEY = 'fluentpath_lang';

  let currentLang = DEFAULT;
  let translations = {};
  let loaded = new Set();

  const FLAGS = { en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹' };
  const NAMES = { en: 'English', fr: 'Français', de: 'Deutsch', it: 'Italiano' };

  async function load(lang) {
    if (loaded.has(lang)) return;
    try {
      const resp = await fetch(`locales/${lang}.json`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      translations[lang] = data;
      loaded.add(lang);
    } catch (e) {
      console.warn(`Failed to load locale: ${lang}`, e);
      if (lang !== DEFAULT) await load(DEFAULT);
    }
  }

  function t(key) {
    const keys = key.split('.');
    let val = translations[currentLang] || translations[DEFAULT] || {};
    for (const k of keys) {
      if (val == null) return key;
      val = val[k];
    }
    return val != null ? String(val) : key;
  }

  function apply() {
    document.documentElement.lang = currentLang;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = t(key);
      if (text !== key) el.textContent = text;
    });

    // Attributes (placeholder, title, aria-label, etc.)
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr');
      const [attr, key] = spec.split(':');
      if (attr && key) {
        const val = t(key);
        if (val !== key) el.setAttribute(attr, val);
      }
    });

    // HTML content (for elements that need markup)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const html = t(key);
      if (html !== key) el.innerHTML = html;
    });

    // Dispatch event for dynamic content
    window.dispatchEvent(new CustomEvent('i18n-update', { detail: { lang: currentLang } }));
  }

  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    await load(lang);
    currentLang = lang;
    apply();
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    updateSwitcher();
  }

  function updateSwitcher() {
    document.querySelectorAll('[data-lang-switch]').forEach(btn => {
      const l = btn.getAttribute('data-lang-switch');
      btn.classList.toggle('active-lang', l === currentLang);
    });

    const label = document.getElementById('lang-current-label');
    if (label) label.textContent = FLAGS[currentLang] + ' ' + NAMES[currentLang].split(' ')[0];
  }

  function initSwitcher() {
    // Create switcher buttons
    const container = document.getElementById('lang-switcher-buttons');
    if (!container) return;

    container.innerHTML = SUPPORTED.map(l => `
      <button data-lang-switch="${l}"
        class="lang-btn px-3 py-2 text-sm rounded-lg transition font-medium
               ${l === currentLang ? 'active-lang' : ''}"
        onclick="I18n.setLang('${l}')">
        ${FLAGS[l]} ${NAMES[l]}
      </button>
    `).join('');
  }

  async function init() {
    // Restore saved language
    let saved = DEFAULT;
    try { saved = localStorage.getItem(STORAGE_KEY) || DEFAULT; } catch (e) {}
    if (!SUPPORTED.includes(saved)) saved = DEFAULT;

    // Preload default
    await load(DEFAULT);
    if (saved !== DEFAULT) await load(saved);

    currentLang = saved;
    apply();
    initSwitcher();
    updateSwitcher();
  }

  return { init, setLang, t, getLang: () => currentLang, FLAGS, NAMES, SUPPORTED };
})();

document.addEventListener('DOMContentLoaded', () => I18n.init());
