import { tick } from './utils/data.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderPumpControl } from './pages/pumpControl.js';
import { renderArchitecture } from './pages/architecture.js';
import { renderPresentation } from './pages/presentation.js';
import { renderAnalytics } from './pages/analytics.js';

class Router {
  constructor(routes, containerId) {
    this.routes = routes;
    this.container = document.getElementById(containerId);
    this.currentPath = null;
    
    // Listen to popstate for back button
    window.addEventListener('popstate', () => {
      this.resolveRoute(window.location.hash.substring(1) || 'dashboard');
    });
  }

  navigate(path) {
    window.location.hash = path;
  }

  resolveRoute(path) {
    if (this.currentPath === path) return;
    
    const route = this.routes[path] || this.routes['dashboard'];
    
    // Dispatch destroy event to old page components to clean up timers/listeners
    if (this.container) {
      this.container.dispatchEvent(new CustomEvent('destroy-page'));
      this.container.innerHTML = '';
      
      // Render new page
      route(this.container);
      this.currentPath = path;
    }

    // Update sidebar navigation active states
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const href = item.getAttribute('data-route');
      if (href === path) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

// Initialize application on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const routes = {
    'dashboard': renderDashboard,
    'pump-control': renderPumpControl,
    'architecture': renderArchitecture,
    'presentation': renderPresentation,
    'analytics': renderAnalytics
  };

  const router = new Router(routes, 'content-viewport');
  window.router = router;

  // Set initial route based on hash, default to dashboard
  const initialRoute = window.location.hash.substring(1) || 'dashboard';
  router.resolveRoute(initialRoute);

  // Set up sidebar navigation clicks
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const path = item.getAttribute('data-route');
      router.navigate(path);
    });
  });

  // Start telemetry simulation tick interval (every 1 second)
  setInterval(() => {
    tick();
  }, 1000);
});
