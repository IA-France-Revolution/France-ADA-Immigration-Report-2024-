/**
 * ===================================
 * France ADA Immigration Report 2024
 * Advanced JavaScript Application
 * Author: AI France Revolution
 * URL: https://ia-france-revolution.github.io/France-ADA-Immigration-Report-2024-/
 * ===================================
 */

'use strict';

// ===== GLOBAL CONFIGURATION =====
const CONFIG = {
    // URLs and endpoints
    baseURL: 'https://ia-france-revolution.github.io/France-ADA-Immigration-Report-2024-/',
    officialReportURL: 'https://www.assemblee-nationale.fr/dyn/contenu/visualisation/906961/file/Immigration,%20asile%20et%20int%C3%A9gration',
    
    // Analytics
    analyticsEnabled: true,
    hotjarEnabled: true,
    
    // Performance monitoring
    performanceMonitoring: true,
    
    // Animation settings
    animationDuration: 300,
    scrollOffset: 100,
    
    // Intersection Observer thresholds
    observerThreshold: 0.1,
    observerRootMargin: '0px 0px -50px 0px',
    
    // Toast settings
    toastDuration: 4000,
    toastMaxVisible: 3,
    
    // Share content
    shareContent: {
        title: 'France ADA Immigration Rapport 2024 - Échecs et Dysfonctionnements Révélés',
        description: 'Dashboard critique révélant les dysfonctionnements majeurs de la politique d\'immigration française : €2,19B dépensés, objectifs ratés, délais explosés.',
        hashtags: ['TransparenceDémocratique', 'ImmigrationFrance', 'BudgetPublic', 'OFPRA', 'Redevabilité'],
        via: 'AIFR_AI'
    }
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    /**
     * Debounce function to limit function calls
     */
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    /**
     * Throttle function to limit function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top <= windowHeight - threshold &&
            rect.bottom >= threshold &&
            rect.left <= windowWidth - threshold &&
            rect.right >= threshold
        );
    },

    /**
     * Smooth scroll to element
     */
    smoothScrollTo(element, offset = 0) {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Format number with French locale
     */
    formatNumber(number, options = {}) {
        return new Intl.NumberFormat('fr-FR', {
            notation: 'compact',
            maximumFractionDigits: 1,
            ...options
        }).format(number);
    },

    /**
     * Format currency in euros
     */
    formatCurrency(amount, compact = true) {
        const options = {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: compact ? 1 : 2
        };
        
        if (compact) {
            options.notation = 'compact';
        }
        
        return new Intl.NumberFormat('fr-FR', options).format(amount);
    },

    /**
     * Get relative time
     */
    getRelativeTime(date) {
        const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
        const diffTime = date - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (Math.abs(diffDays) < 30) {
            return rtf.format(diffDays, 'day');
        } else if (Math.abs(diffDays) < 365) {
            return rtf.format(Math.round(diffDays / 30), 'month');
        } else {
            return rtf.format(Math.round(diffDays / 365), 'year');
        }
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    },

    /**
     * Generate random ID
     */
    generateId(prefix = 'id') {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Get URL parameters
     */
    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },

    /**
     * Set URL parameter without reload
     */
    setUrlParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.replaceState({}, '', url);
    }
};

// ===== PERFORMANCE MONITORING =====
const Performance = {
    metrics: {
        loadTime: 0,
        domContentLoaded: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0
    },

    init() {
        if (!CONFIG.performanceMonitoring) return;

        // Monitor page load
        this.monitorPageLoad();
        
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor resource loading
        this.monitorResources();
    },

    monitorPageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
            
            console.log('📊 Performance Metrics:', {
                'Page Load Time': `${this.metrics.loadTime}ms`,
                'DOM Content Loaded': `${this.metrics.domContentLoaded}ms`
            });
            
            // Send to analytics
            Analytics.trackEvent('Performance', 'PageLoad', 'LoadTime', this.metrics.loadTime);
        });
    },

    monitorCoreWebVitals() {
        // First Paint
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
            if (entry.name === 'first-paint') {
                this.metrics.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
                this.metrics.firstContentfulPaint = entry.startTime;
            }
        });

        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.largestContentfulPaint = lastEntry.startTime;
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP monitoring not supported');
            }
        }
    },

    monitorResources() {
        if ('PerformanceObserver' in window) {
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.duration > 1000) { // Resources taking more than 1s
                            console.warn(`⚠️ Slow resource: ${entry.name} (${entry.duration}ms)`);
                            Analytics.trackEvent('Performance', 'SlowResource', entry.name, entry.duration);
                        }
                    });
                });
                resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (e) {
                console.warn('Resource monitoring not supported');
            }
        }
    }
};

// ===== ANALYTICS MANAGER =====
const Analytics = {
    pageViews: 0,
    events: [],
    userInteractions: [],

    init() {
        if (!CONFIG.analyticsEnabled) return;

        this.trackPageView();
        this.trackUserBehavior();
        this.trackScrollDepth();
        this.trackTimeOnPage();
    },

    trackPageView() {
        this.pageViews++;
        
        // Track with Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                content_group1: 'Government Analysis',
                content_group2: 'Immigration Policy'
            });
        }

        console.log('📈 Page view tracked');
    },

    trackEvent(category, action, label = '', value = 0) {
        const event = {
            category,
            action,
            label,
            value,
            timestamp: Date.now()
        };

        this.events.push(event);

        // Track with Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }

        console.log('📊 Event tracked:', event);
    },

    trackUserBehavior() {
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, .share-btn, .issue-card, .budget-card');
            if (target) {
                this.trackEvent('User Interaction', 'Click', target.textContent?.trim() || target.className);
            }
        });

        // Track form interactions
        document.addEventListener('submit', (e) => {
            this.trackEvent('User Interaction', 'Form Submit', e.target.id || 'unknown');
        });
    },

    trackScrollDepth() {
        let maxScroll = 0;
        const scrollThresholds = [25, 50, 75, 90, 100];
        const trackedThresholds = new Set();

        const trackScroll = Utils.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                // Track scroll milestones
                scrollThresholds.forEach(threshold => {
                    if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                        trackedThresholds.add(threshold);
                        this.trackEvent('Scroll Depth', 'Milestone', `${threshold}%`, threshold);
                    }
                });
            }
        }, 500);

        window.addEventListener('scroll', trackScroll);
    },

    trackTimeOnPage() {
        const startTime = Date.now();
        
        // Track time milestones
        const timeThresholds = [30, 60, 120, 300]; // seconds
        const trackedTimes = new Set();

        const trackTime = () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            
            timeThresholds.forEach(threshold => {
                if (timeOnPage >= threshold && !trackedTimes.has(threshold)) {
                    trackedTimes.add(threshold);
                    this.trackEvent('Engagement', 'Time on Page', `${threshold}s`, threshold);
                }
            });
        };

        setInterval(trackTime, 10000); // Check every 10 seconds

        // Track when user leaves
        window.addEventListener('beforeunload', () => {
            const totalTime = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('Engagement', 'Session End', 'Total Time', totalTime);
        });
    },

    trackSectionView(sectionId) {
        this.trackEvent('Section View', 'Visible', sectionId);
    }
};

// ===== TOAST NOTIFICATIONS =====
const Toast = {
    container: null,
    activeToasts: [],

    init() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.createContainer();
        }
    },

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        this.container.setAttribute('aria-live', 'polite');
        document.body.appendChild(this.container);
    },

    show(message, type = 'info', duration = CONFIG.toastDuration) {
        // Limit number of visible toasts
        if (this.activeToasts.length >= CONFIG.toastMaxVisible) {
            this.hide(this.activeToasts[0]);
        }

        const toast = this.create(message, type);
        this.container.appendChild(toast);
        this.activeToasts.push(toast);

        // Trigger show animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto hide
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    },

    create(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-content">
                <i class="toast-icon ${icons[type] || icons.info}"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;

        // Add click to dismiss
        toast.addEventListener('click', () => {
            this.hide(toast);
        });

        return toast;
    },

    hide(toast) {
        if (!toast || !toast.parentNode) return;

        toast.classList.remove('show');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            
            const index = this.activeToasts.indexOf(toast);
            if (index > -1) {
                this.activeToasts.splice(index, 1);
            }
        }, 300);
    },

    success(message) {
        return this.show(message, 'success');
    },

    error(message) {
        return this.show(message, 'error');
    },

    warning(message) {
        return this.show(message, 'warning');
    },

    info(message) {
        return this.show(message, 'info');
    }
};

// ===== LOADING MANAGER =====
const LoadingManager = {
    loadingElement: null,
    isLoading: true,
    loadingSteps: [
        'Chargement des données...',
        'Analyse des dysfonctionnements...',
        'Calcul des échecs budgétaires...',
        'Préparation du rapport critique...'
    ],
    currentStep: 0,

    init() {
        this.loadingElement = document.getElementById('loading');
        this.simulateLoading();
    },

    simulateLoading() {
        // Simulate loading steps
        const stepInterval = setInterval(() => {
            if (this.currentStep < this.loadingSteps.length - 1) {
                this.currentStep++;
            } else {
                clearInterval(stepInterval);
                this.hide();
            }
        }, 800);
    },

    hide() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('hidden');
            this.isLoading = false;
            
            // Trigger page loaded event
            document.dispatchEvent(new CustomEvent('pageLoaded'));
            
            Analytics.trackEvent('Loading', 'Complete', 'Page Loaded');
        }
    },

    show() {
        if (this.loadingElement) {
            this.loadingElement.classList.remove('hidden');
            this.isLoading = true;
        }
    }
};

// ===== SCROLL MANAGER =====
const ScrollManager = {
    scrollProgress: null,
    header: null,
    fab: null,
    lastScrollTop: 0,
    scrollThreshold: 100,

    init() {
        this.scrollProgress = document.getElementById('scrollProgress');
        this.header = document.getElementById('header');
        this.fab = document.querySelector('.fab');

        this.bindEvents();
        this.updateScrollProgress();
    },

    bindEvents() {
        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateScrollProgress();
            this.updateHeader();
            this.updateFAB();
        }, 16)); // ~60fps
    },

    updateScrollProgress() {
        if (!this.scrollProgress) return;

        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        this.scrollProgress.style.transform = `scaleX(${Math.min(scrolled / 100, 1)})`;
    },

    updateHeader() {
        if (!this.header) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        this.lastScrollTop = scrollTop;
    },

    updateFAB() {
        if (!this.fab) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > this.scrollThreshold * 2) {
            this.fab.classList.add('visible');
        } else {
            this.fab.classList.remove('visible');
        }
    }
};

// ===== NAVIGATION MANAGER =====
const Navigation = {
    menuToggle: null,
    navMenu: null,
    isMenuOpen: false,

    init() {
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');

        this.bindEvents();
        this.setupSmoothScrolling();
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !e.target.closest('.header-content')) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    },

    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    Utils.smoothScrollTo(targetElement, CONFIG.scrollOffset);
                    Analytics.trackEvent('Navigation', 'Anchor Click', targetId);
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
    },

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.menuToggle) {
            this.menuToggle.setAttribute('aria-expanded', this.isMenuOpen.toString());
        }
        
        if (this.navMenu) {
            this.navMenu.classList.toggle('open', this.isMenuOpen);
        }

        Analytics.trackEvent('Navigation', 'Mobile Menu', this.isMenuOpen ? 'Open' : 'Close');
    },

    closeMobileMenu() {
        this.isMenuOpen = false;
        
        if (this.menuToggle) {
            this.menuToggle.setAttribute('aria-expanded', 'false');
        }
        
        if (this.navMenu) {
            this.navMenu.classList.remove('open');
        }
    }
};

// ===== ANIMATION MANAGER =====
const AnimationManager = {
    observers: [],
    animatedElements: new Set(),

    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
        this.animateCharts();
    },

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this.fallbackAnimation();
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                    
                    // Track section views
                    if (entry.target.tagName === 'SECTION') {
                        Analytics.trackSectionView(entry.target.id);
                    }
                }
            });
        }, {
            threshold: CONFIG.observerThreshold,
            rootMargin: CONFIG.observerRootMargin
        });

        // Observe all animatable elements
        const elementsToAnimate = document.querySelectorAll(
            '.stat-card, .issue-card, .budget-card, .indicator-card, .timeline-item, section'
        );

        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });

        this.observers.push(observer);
    },

    animateElement(element) {
        // Add AOS-like animation classes
        if (element.dataset.aos) {
            element.classList.add('aos-animate');
        } else {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }

        // Trigger specific animations
        if (element.classList.contains('stat-card')) {
            this.animateStatCard(element);
        } else if (element.classList.contains('chart-bar')) {
            this.animateChartBar(element);
        }
    },

    animateStatCard(card) {
        const numberElement = card.querySelector('.stat-number');
        if (numberElement) {
            this.animateNumber(numberElement);
        }
    },

    animateNumber(element) {
        const finalValue = element.textContent.replace(/[^\d.-]/g, '');
        const numericValue = parseFloat(finalValue);
        
        if (isNaN(numericValue)) return;

        const duration = 2000;
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (numericValue - startValue) * easeOutQuart;
            
            // Format based on original text
            if (element.textContent.includes('€')) {
                element.textContent = Utils.formatCurrency(currentValue);
            } else if (element.textContent.includes('%')) {
                element.textContent = Math.round(currentValue) + '%';
            } else if (element.textContent.includes('j')) {
                element.textContent = Math.round(currentValue) + 'j';
            } else {
                element.textContent = Utils.formatNumber(currentValue);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    },

    animateCharts() {
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateChart(entry.target);
                    chartObserver.unobserve(entry.target);
                }
            });
        });

        document.querySelectorAll('.budget-chart, .evolution-chart').forEach(chart => {
            chartObserver.observe(chart);
        });

        this.observers.push(chartObserver);
    },

    animateChart(chart) {
        const bars = chart.querySelectorAll('.chart-bar, .year-bar');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.animation = 'growUp 1.5s ease-out forwards';
            }, index * 100);
        });
    },

    animateChartBar(bar) {
        bar.style.animation = 'growUp 1.5s ease-out forwards';
    },

    fallbackAnimation() {
        // Simple fallback for browsers without IntersectionObserver
        const elements = document.querySelectorAll('.stat-card, .issue-card, .budget-card');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    },

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.animatedElements.clear();
    }
};

// ===== SHARE MANAGER =====
const ShareManager = {
    init() {
        this.bindShareButtons();
        this.setupHashtagClicks();
    },

    bindShareButtons() {
        document.addEventListener('click', (e) => {
            const shareBtn = e.target.closest('.share-btn');
            if (!shareBtn) return;

            e.preventDefault();
            
            const platform = shareBtn.dataset.platform;
            
            switch (platform) {
                case 'twitter':
                    this.shareTwitter();
                    break;
                case 'linkedin':
                    this.shareLinkedIn();
                    break;
                case 'facebook':
                    this.shareFacebook();
                    break;
                case 'copy':
                    this.copyLink(shareBtn);
                    break;
            }
        });
    },

    shareTwitter() {
        const text = `${CONFIG.shareContent.title}\n\n📊 Résultats alarmants :\n• Délais OFPRA : +130% vs objectif\n• Budget : €2,19B dépensés\n• Échec global : 67%\n\n${CONFIG.shareContent.hashtags.map(tag => '#' + tag).join(' ')}`;
        const url = CONFIG.baseURL;
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&via=${CONFIG.shareContent.via}`;
        
        this.openShareWindow(twitterUrl, 'Twitter');
        Analytics.trackEvent('Share', 'Twitter', 'Click');
    },

    shareLinkedIn() {
        const url = CONFIG.baseURL;
        const title = CONFIG.shareContent.title;
        const summary = CONFIG.shareContent.description;
        
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
        
        this.openShareWindow(linkedinUrl, 'LinkedIn');
        Analytics.trackEvent('Share', 'LinkedIn', 'Click');
    },

    shareFacebook() {
        const url = CONFIG.baseURL;
        const quote = `${CONFIG.shareContent.title}\n\n${CONFIG.shareContent.description}`;
        
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;
        
        this.openShareWindow(facebookUrl, 'Facebook');
        Analytics.trackEvent('Share', 'Facebook', 'Click');
    },

    async copyLink(button) {
        const url = CONFIG.baseURL;
        const success = await Utils.copyToClipboard(url);
        
        if (success) {
            // Update button appearance
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i><span>Lien copié !</span><small>Prêt à partager</small>';
            button.style.background = 'var(--gradient-success)';
            
            // Show toast
            Toast.success('Lien copié dans le presse-papiers !');
            
            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
            }, 3000);
            
            Analytics.trackEvent('Share', 'Copy Link', 'Success');
        } else {
            Toast.error('Impossible de copier le lien');
            Analytics.trackEvent('Share', 'Copy Link', 'Error');
        }
    },

    openShareWindow(url, platform) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        window.open(
            url,
            `share-${platform}`,
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );
    },

    setupHashtagClicks() {
        document.querySelectorAll('.hashtag').forEach(hashtag => {
            hashtag.addEventListener('click', () => {
                const tag = hashtag.textContent;
                const twitterUrl = `https://twitter.com/hashtag/${tag.substring(1)}`;
                window.open(twitterUrl, '_blank');
                Analytics.trackEvent('Share', 'Hashtag Click', tag);
            });
        });
    }
};

// ===== INTERACTION MANAGER =====
const InteractionManager = {
    init() {
        this.setupCardInteractions();
        this.setupProgressBars();
        this.setupTooltips();
        this.setupKeyboardNavigation();
    },

    setupCardInteractions() {
        // Enhanced hover effects for cards
        document.querySelectorAll('.issue-card, .budget-card, .indicator-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                Analytics.trackEvent('Interaction', 'Card Hover', card.className);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });

            // Click to expand functionality
            card.addEventListener('click', () => {
                this.expandCard(card);
            });
        });
    },

    expandCard(card) {
        // Add expanded state
        card.classList.toggle('expanded');
        
        // Track interaction
        const cardType = card.classList.contains('issue-card') ? 'Issue' : 
                        card.classList.contains('budget-card') ? 'Budget' : 'Indicator';
        Analytics.trackEvent('Interaction', 'Card Expand', cardType);
    },

    setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    
                    // Animate from 0 to target width
                    bar.style.width = '0%';
                    bar.style.transition = 'width 2s ease-out';
                    
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    
                    progressObserver.unobserve(bar);
                }
            });
        });

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    },

    setupTooltips() {
        // Simple tooltip system
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            let tooltip = null;

            element.addEventListener('mouseenter', (e) => {
                tooltip = this.createTooltip(e.target.dataset.tooltip);
                document.body.appendChild(tooltip);
                this.positionTooltip(tooltip, e.target);
            });

            element.addEventListener('mouseleave', () => {
                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                }
            });
        });
    },

    createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--dark-card);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            border: 1px solid var(--dark-border);
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        
        setTimeout(() => tooltip.style.opacity = '1', 10);
        return tooltip;
    },

    positionTooltip(tooltip, target) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        
        if (top < 10) {
            top = rect.bottom + 10;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    },

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    // Close any open modals or overlays
                    this.handleEscape();
                    break;
                case 'ArrowUp':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.scrollToTop();
                    }
                    break;
                case '/':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.focusSearch();
                    }
                    break;
            }
        });
    },

    handleEscape() {
        // Close mobile menu
        Navigation.closeMobileMenu();
        
        // Remove focus from any focused element
        if (document.activeElement) {
            document.activeElement.blur();
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        Analytics.trackEvent('Interaction', 'Keyboard', 'Scroll to Top');
    },

    focusSearch() {
        // Focus search input if exists
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="recherche" i]');
        if (searchInput) {
            searchInput.focus();
            Analytics.trackEvent('Interaction', 'Keyboard', 'Focus Search');
        }
    }
};

// ===== ERROR HANDLER =====
const ErrorHandler = {
    init() {
        this.setupGlobalErrorHandler();
        this.setupUnhandledRejectionHandler();
        this.setupResourceErrorHandler();
    },

    setupGlobalErrorHandler() {
        window.addEventListener('error', (e) => {
            this.logError('JavaScript Error', e.error, {
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });
    },

    setupUnhandledRejectionHandler() {
        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Unhandled Promise Rejection', e.reason);
        });
    },

    setupResourceErrorHandler() {
        window.addEventListener('error', (e) => {
            if (e.target && e.target !== window) {
                this.logError('Resource Error', null, {
                    resource: e.target.src || e.target.href,
                    element: e.target.tagName
                });
            }
        }, true);
    },

    logError(type, error, details = {}) {
        const errorInfo = {
            type,
            message: error?.message || error?.toString() || 'Unknown error',
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...details
        };

        console.error('🚨 Error logged:', errorInfo);

        // Track with analytics
        Analytics.trackEvent('Error', type, errorInfo.message);

        // Show user-friendly message for critical errors
        if (type === 'JavaScript Error' && !error?.message?.includes('Script error')) {
            Toast.error('Une erreur s\'est produite. Rechargez la page si le problème persiste.');
        }
    }
};

// ===== ACCESSIBILITY MANAGER =====
const AccessibilityManager = {
    init() {
        this.setupFocusManagement();
        this.setupARIAUpdates();
        this.setupReducedMotion();
        this.setupKeyboardTraps();
    },

    setupFocusManagement() {
        // Ensure visible focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    },

    setupARIAUpdates() {
        // Update ARIA labels dynamically
        const updateARIA = () => {
            // Update progress bars
            document.querySelectorAll('.progress-bar').forEach(bar => {
                const value = parseInt(bar.style.width) || 0;
                bar.setAttribute('aria-valuenow', value);
            });

            // Update loading states
            const loadingElements = document.querySelectorAll('[aria-busy="true"]');
            loadingElements.forEach(el => {
                if (!LoadingManager.isLoading) {
                    el.setAttribute('aria-busy', 'false');
                }
            });
        };

        // Update ARIA labels periodically
        setInterval(updateARIA, 1000);
    },

    setupReducedMotion() {
        // Respect user's motion preferences
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
                // Disable animations
                document.querySelectorAll('*').forEach(el => {
                    el.style.animationDuration = '0.01ms';
                    el.style.transitionDuration = '0.01ms';
                });
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        mediaQuery.addListener(handleMotionPreference);
        handleMotionPreference(mediaQuery);
    },

    setupKeyboardTraps() {
        // Trap focus in modals/overlays when open
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal.open, .overlay.open');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }
        });
    },

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
};

// ===== MAIN APPLICATION =====
const App = {
    async init() {
        console.log('🚀 Initializing France ADA Immigration Report Dashboard...');
        
        try {
            // Initialize core systems
            await this.initializeCore();
            
            // Initialize UI components
            this.initializeUI();
            
            // Initialize analytics and monitoring
            this.initializeAnalytics();
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('✅ Dashboard initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize dashboard:', error);
            ErrorHandler.logError('Initialization Error', error);
        }
    },

    async initializeCore() {
        // Initialize loading manager
        LoadingManager.init();
        
        // Initialize error handling
        ErrorHandler.init();
        
        // Initialize accessibility
        AccessibilityManager.init();
        
        // Initialize toast system
        Toast.init();
    },

    initializeUI() {
        // Initialize scroll management
        ScrollManager.init();
        
        // Initialize navigation
        Navigation.init();
        
        // Initialize animations
        AnimationManager.init();
        
        // Initialize interactions
        InteractionManager.init();
        
        // Initialize share functionality
        ShareManager.init();
    },

    initializeAnalytics() {
        // Initialize performance monitoring
        Performance.init();
        
        // Initialize analytics
        Analytics.init();
    },

    setupEventListeners() {
        // Page loaded event
        document.addEventListener('pageLoaded', () => {
            this.onPageLoaded();
        });

        // Window events
        window.addEventListener('resize', Utils.debounce(() => {
            this.onWindowResize();
        }, 250));

        window.addEventListener('beforeunload', () => {
            this.onBeforeUnload();
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                Analytics.trackEvent('Engagement', 'Page Hidden');
            } else {
                Analytics.trackEvent('Engagement', 'Page Visible');
            }
        });
    },

    onPageLoaded() {
        console.log('📄 Page loaded successfully');
        
        // Start animations
        AnimationManager.animateCounters();
        
        // Show welcome message
        setTimeout(() => {
            Toast.info('Dashboard chargé - Découvrez les dysfonctionnements révélés');
        }, 1000);
    },

    onWindowResize() {
        // Handle responsive adjustments
        console.log('📱 Window resized:', window.innerWidth + 'x' + window.innerHeight);
        Analytics.trackEvent('Interaction', 'Window Resize', `${window.innerWidth}x${window.innerHeight}`);
    },

    onBeforeUnload() {
        // Cleanup and final analytics
        Analytics.trackEvent('Session', 'End', 'Page Unload');
        
        // Cleanup observers
        AnimationManager.destroy();
    }
};

// ===== GLOBAL FUNCTIONS (for HTML onclick events) =====

/**
 * Scroll to top function (called from FAB)
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    Analytics.trackEvent('Navigation', 'Scroll to Top', 'FAB Click');
}

/**
 * Share functions (called from share buttons)
 */
function shareTwitter() {
    ShareManager.shareTwitter();
}

function shareLinkedIn() {
    ShareManager.shareLinkedIn();
}

function shareFacebook() {
    ShareManager.shareFacebook();
}

function copyLink() {
    const button = event.target.closest('.share-btn');
    ShareManager.copyLink(button);
}

// ===== INITIALIZATION =====

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Handle page show (back/forward cache)
window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        // Page loaded from cache
        LoadingManager.hide();
        Analytics.trackEvent('Navigation', 'Page Show', 'From Cache');
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        App,
        Utils,
        Analytics,
        Toast,
        ShareManager
    };
}

// Global error boundary
window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.error);
});

console.log('📊 France ADA Immigration Report 2024 - JavaScript Loaded');
console.log('🔗 Dashboard URL:', CONFIG.baseURL);
console.log('📋 Official Report:', CONFIG.officialReportURL);
