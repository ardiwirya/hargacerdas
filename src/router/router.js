/**
 * Minimal hash-based router — sufficient for a 3-view utility SPA,
 * avoids the weight/complexity of a full routing library.
 */
const routes = new Map();
let notFoundHandler = () => {};

export function registerRoute(pattern, handler) {
  routes.set(pattern, handler);
}

export function registerNotFound(handler) {
  notFoundHandler = handler;
}

function matchRoute(hash) {
  for (const [pattern, handler] of routes) {
    const paramNames = [];
    const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const match = hash.match(new RegExp(`^${regexStr}$`));
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => (params[name] = match[i + 1]));
      return { handler, params };
    }
  }
  return null;
}

function resolve() {
  const hash = (location.hash || '#/').replace(/^#/, '') || '/';
  const matched = matchRoute(hash);
  if (matched) {
    matched.handler(matched.params);
  } else {
    notFoundHandler();
  }
  updateActiveNav(hash);
}

function updateActiveNav(hash) {
  document.querySelectorAll('[data-nav-link]').forEach((el) => {
    const target = el.getAttribute('href')?.replace(/^#/, '');
    const isActive = target === hash || (target === '/' && hash === '/');
    if (isActive) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
}

export function initRouter() {
  window.addEventListener('hashchange', resolve);
  window.addEventListener('DOMContentLoaded', resolve);
  if (document.readyState !== 'loading') resolve();
}
