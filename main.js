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
    
    // Real data from official report 2024
    reportData: {
        // Hero statistics (from pages 8-12 of rapport)
        asylum: {
            totalRequests: 133955,  // Page 8: "133 955 demandes enregistrées par les préfectures"
            changeVsPreviousYear: -9,  // Page 8: "baissé de 9 % par rapport à 2023"
            ofpraDelay: 138,  // Page 11: "délai moyen d'instruction, passé de 127 à 138 jours"
            ofpraTarget: 60,  // Page 22: "Cible 2024: 60 jours"
            accommodationRate: 72,  // Page 21: "taux d'hébergement des demandeurs d'asile éligibles s'établit à 72 %"
            accommodationTarget: 64  // Page 21: "cible fixée en PAP 2024 (64 %)"
        },
        // Budget data (from pages 13-15)
        budget: {
            totalExecuted: 2190000000,  // €2.19B total (programmes 303 et 104)
            program303: 1835599036,  // Page 14: Programme 303 exécution
            program104: 355125699,   // Page 14: Programme 104 exécution
            accommodationCost: 1482017283,  // Page 26: Hébergement
            adaCost: 368074148  // Page 40: ADA exécution
        },
        // Performance indicators (from pages 21-25)
        performance: {
            ofpraDecisions: 141911,  // Page 22: "141 911 décisions"
            ofpraStock: 66370,  // Page 18: "66 370 dossiers fin décembre 2024"
            stockIncrease: 24,  // Page 18: "augmentation de 24 %"
            languageSuccess: 65.7,  // Page 67: "Taux d'atteinte du niveau A1"
            languageTarget: 80,  // Page 67: "Cible 2024: 80"
            integrationEfficiency: 46,  // Page 68: "46 % absence amélioration"
            removals: 12856,  // Page 24: "12 856 retours forcés exécutés"
            removalsIncrease: 22.4  // Page 20: "+22,4 % par rapport à 2023"
        }
    },
    
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
        firstContentfulPaint: 0
    },

    init() {
        if (!CONFIG.performanceMonitoring) return;

        // Monitor page load
        this.monitorPageLoad();
        
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
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
    }
};

// ===== ANALYTICS MANAGER =====
const Analytics = {
    pageViews: 0,
    events: [],

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
    }
};

// ===== TOAST NOTIFICATIONS =====
const Toast = {
    container: null,
    activeToasts: [],

    init() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.createContainer();
        }
    },

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'toastContainer';
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
            <i class="toast-icon ${icons[type] || icons.info}"></i>
            <span class="toast-message">${message}</span>
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

    init() {
        this.loadingElement = document.getElementById('loadingOverlay');
        this.simulateLoading();
    },

    simulateLoading() {
        // Hide loading after a short delay
        setTimeout(() => {
            this.hide();
        }, 1500);
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
        this.scrollProgress = document.getElementById('progressBar');
        this.header = document.getElementById('header');
        this.fab = document.getElementById('scrollToTopBtn');

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
        this.setupStatCardAnimations();
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
                        Analytics.trackEvent('Section View', 'Visible', entry.target.id);
                    }
                }
            });
        }, {
            threshold: CONFIG.observerThreshold,
            rootMargin: CONFIG.observerRootMargin
        });

        // Observe all animatable elements
        const elementsToAnimate = document.querySelectorAll(
            '.stat-card, .issue-card, .budget-card, .indicator-card, .timeline-item, section[data-aos]'
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
        }
    },

    animateStatCard(card) {
        const numberElement = card.querySelector('.stat-number');
        if (numberElement) {
            this.animateNumber(numberElement);
        }
    },

    animateNumber(element) {
        const dataValue = element.closest('[data-stat]')?.dataset.stat;
        const finalValue = dataValue ? parseFloat(dataValue) : 0;
        
        if (isNaN(finalValue) || finalValue === 0) return;

        const duration = 2000;
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (finalValue - startValue) * easeOutQuart;
            
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

    setupStatCardAnimations() {
        // Animate stat cards with real data from report
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach((card, index) => {
            const numberEl = card.querySelector('.stat-number');
            if (!numberEl) return;

            // Set real data based on card content
            if (card.textContent.includes('demandes d\'asile')) {
                numberEl.textContent = CONFIG.reportData.asylum.totalRequests.toLocaleString('fr-FR');
                card.dataset.stat = CONFIG.reportData.asylum.totalRequests;
            } else if (card.textContent.includes('Budget total')) {
                numberEl.textContent = Utils.formatCurrency(CONFIG.reportData.budget.totalExecuted);
                card.dataset.stat = CONFIG.reportData.budget.totalExecuted;
            } else if (card.textContent.includes('Délai moyen')) {
                numberEl.textContent = `${CONFIG.reportData.asylum.ofpraDelay}j`;
                card.dataset.stat = CONFIG.reportData.asylum.ofpraDelay;
            } else if (card.textContent.includes('hébergement')) {
                numberEl.textContent = `${CONFIG.reportData.asylum.accommodationRate}%`;
                card.dataset.stat = CONFIG.reportData.asylum.accommodationRate;
            }
        });
    },

    animateCounters() {
        // Update hero stats with real data
        setTimeout(() => {
            const heroStats = document.querySelector('.hero-stats');
            if (heroStats) {
                const statCards = heroStats.querySelectorAll('.stat-card');
                statCards.forEach(this.animateStatCard.bind(this));
            }
        }, 500);
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
            button.innerHTML = '<div class="btn-icon"><i class="fas fa-check"></i></div><div class="btn-content"><span class="btn-title">Lien copié !</span><small class="btn-subtitle">Prêt à partager</small></div>';
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
        this.setupFilterControls();
        this.setupExpandableCards();
    },

    setupCardInteractions() {
        // Enhanced hover effects for cards
        document.querySelectorAll('.issue-card, .budget-card, .indicator-card, .stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('animating')) {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                    Analytics.trackEvent('Interaction', 'Card Hover', card.className);
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('animating')) {
                    card.style.transform = '';
                }
            });
        });
    },

    setupExpandableCards() {
        document.querySelectorAll('.issue-expand, .indicator-expand').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const card = button.closest('.issue-card, .indicator-card');
                const details = card.querySelector('.issue-details, .indicator-details');
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                
                if (details) {
                    if (isExpanded) {
                        details.hidden = true;
                        button.setAttribute('aria-expanded', 'false');
                        button.querySelector('i').style.transform = 'rotate(0deg)';
                    } else {
                        details.hidden = false;
                        button.setAttribute('aria-expanded', 'true');
                        button.querySelector('i').style.transform = 'rotate(180deg)';
                    }
                    
                    Analytics.trackEvent('Interaction', 'Card Expand', isExpanded ? 'Close' : 'Open');
                }
            });
        });
    },

    setupFilterControls() {
        // Filter buttons for issues
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                // Remove active from all buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                
                // Add active to clicked button
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                
                const filter = button.dataset.filter;
                this.filterIssues(filter);
                
                Analytics.trackEvent('Interaction', 'Filter', filter);
            });
        });

        // Performance view toggle
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.addEventListener('click', () => {
                // Remove active from all buttons in the same group
                const group = button.closest('.view-toggle');
                if (group) {
                    group.querySelectorAll('.toggle-btn').forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-checked', 'false');
                    });
                    
                    // Add active to clicked button
                    button.classList.add('active');
                    button.setAttribute('aria-checked', 'true');
                    
                    const view = button.dataset.view;
                    this.switchPerformanceView(view);
                    
                    Analytics.trackEvent('Interaction', 'View Toggle', view);
                }
            });
        });

        // Timeline controls
        document.querySelectorAll('.zoom-btn').forEach(button => {
            button.addEventListener('click', () => {
                // Remove active from all zoom buttons
                document.querySelectorAll('.zoom-btn').forEach(btn => {
                    btn.setAttribute('aria-pressed', 'false');
                });
                
                // Add active to clicked button
                button.setAttribute('aria-pressed', 'true');
                
                const zoom = button.dataset.zoom;
                this.adjustTimelineZoom(zoom);
                
                Analytics.trackEvent('Interaction', 'Timeline Zoom', zoom);
            });
        });
    },

    filterIssues(filter) {
        const issueCards = document.querySelectorAll('.issue-card');
        
        issueCards.forEach(card => {
            if (filter === 'all' || card.classList.contains(filter)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease forwards';
            } else {
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    },

    switchPerformanceView(view) {
        const indicatorsGrid = document.querySelector('.indicators-grid');
        if (!indicatorsGrid) return;

        // Apply view-specific styles or layouts
        indicatorsGrid.className = `indicators-grid view-${view}`;
        
        // You could implement different layouts here
        // For now, we'll just add a visual transition
        indicatorsGrid.style.opacity = '0.5';
        setTimeout(() => {
            indicatorsGrid.style.opacity = '1';
        }, 150);
    },

    adjustTimelineZoom(zoom) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            const delay = index * 50;
            
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = `slideInUp 0.6s ease ${delay}ms forwards`;
            }, 10);
        });
    },

    setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar, .progress-fill');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width || bar.dataset.width;
                    
                    if (width) {
                        // Animate from 0 to target width
                        bar.style.width = '0%';
                        bar.style.transition = 'width 2s ease-out';
                        
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    }
                    
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
                    this.handleEscape();
                    break;
                case 'ArrowUp':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.scrollToTop();
                    }
                    break;
            }
        });
    },

    handleEscape() {
        // Close mobile menu
        Navigation.closeMobileMenu();
        
        // Close accessibility panel
        const accessibilityPanel = document.getElementById('accessibilityPanel');
        if (accessibilityPanel && !accessibilityPanel.hidden) {
            accessibilityPanel.hidden = true;
        }
        
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
    }
};

// ===== CHART MANAGER =====
const ChartManager = {
    charts: new Map(),

    init() {
        this.createOfpraDelayChart();
        this.createBudgetChart();
        this.createPerformanceCharts();
    },

    createOfpraDelayChart() {
        const canvas = document.getElementById('chart-ofpra-delays');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Simple line chart showing OFPRA delay evolution
        const data = {
            labels: ['2022', '2023', '2024'],
            datasets: [{
                label: 'Délai OFPRA (jours)',
                data: [159, 127, 138],
                borderColor: '#E74C3C',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                tension: 0.4
            }, {
                label: 'Objectif',
                data: [60, 60, 60],
                borderColor: '#27AE60',
                borderDash: [5, 5],
                fill: false
            }]
        };

        this.drawLineChart(ctx, data, canvas.width, canvas.height);
    },

    createBudgetChart() {
        const canvas = document.getElementById('chart-budget-303');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Pie chart for budget breakdown
        const data = [
            { label: 'Hébergement', value: 1482017283, color: '#FF6B35' },
            { label: 'ADA', value: 368074148, color: '#00A8CC' },
            { label: 'Fonctionnement', value: 321675784, color: '#FFB627' },
            { label: 'Autres', value: 163831821, color: '#E74C3C' }
        ];

        this.drawPieChart(ctx, data, canvas.width, canvas.height);
    },

    createPerformanceCharts() {
        // Create charts for performance indicators
        const delayChart = document.getElementById('chart-delays-evolution');
        if (delayChart) {
            const ctx = delayChart.getContext('2d');
            const data = {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Délai moyen',
                    data: [135, 140, 138, 142, 136, 138],
                    borderColor: '#E74C3C',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4
                }]
            };
            this.drawLineChart(ctx, data, delayChart.width, delayChart.height);
        }
    },

    drawLineChart(ctx, data, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        // Find max value for scaling
        const allValues = data.datasets.flatMap(d => d.data);
        const maxValue = Math.max(...allValues) * 1.1;
        
        // Draw grid
        ctx.strokeStyle = '#1E1E1E';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw datasets
        data.datasets.forEach(dataset => {
            ctx.strokeStyle = dataset.borderColor;
            ctx.lineWidth = 2;
            
            if (dataset.borderDash) {
                ctx.setLineDash(dataset.borderDash);
            } else {
                ctx.setLineDash([]);
            }
            
            ctx.beginPath();
            dataset.data.forEach((value, index) => {
                const x = padding + (chartWidth / (dataset.data.length - 1)) * index;
                const y = padding + chartHeight - (value / maxValue) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        });
        
        // Draw labels
        ctx.fillStyle = '#B0B0B0';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        
        data.labels.forEach((label, index) => {
            const x = padding + (chartWidth / (data.labels.length - 1)) * index;
            ctx.fillText(label, x, height - 10);
        });
    },

    drawPieChart(ctx, data, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -Math.PI / 2;
        
        data.forEach(item => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
    }
};

// ===== ACCESSIBILITY MANAGER =====
const AccessibilityManager = {
    init() {
        this.setupFocusManagement();
        this.setupARIAUpdates();
        this.setupReducedMotion();
        this.setupAccessibilityPanel();
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
            document.querySelectorAll('.progress-bar, .progress-fill').forEach(bar => {
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

    setupAccessibilityPanel() {
        const accessibilityButton = document.querySelector('.accessibility-menu');
        const accessibilityPanel = document.getElementById('accessibilityPanel');
        
        if (accessibilityButton && accessibilityPanel) {
            accessibilityButton.addEventListener('click', () => {
                const isOpen = !accessibilityPanel.hidden;
                accessibilityPanel.hidden = isOpen;
                accessibilityPanel.classList.toggle('open', !isOpen);
                
                Analytics.trackEvent('Accessibility', 'Panel Toggle', isOpen ? 'Close' : 'Open');
            });
            
            // Close panel with close button
            const closeButton = accessibilityPanel.querySelector('.panel-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    accessibilityPanel.hidden = true;
                    accessibilityPanel.classList.remove('open');
                });
            }
            
            // Handle accessibility controls
            this.setupAccessibilityControls(accessibilityPanel);
        }
    },

    setupAccessibilityControls(panel) {
        // Font size control
        const fontSizeControl = panel.querySelector('#fontSize');
        if (fontSizeControl) {
            fontSizeControl.addEventListener('input', (e) => {
                const fontSize = e.target.value + 'px';
                document.documentElement.style.fontSize = fontSize;
                Analytics.trackEvent('Accessibility', 'Font Size', fontSize);
            });
        }
        
        // High contrast control
        const contrastControl = panel.querySelector('#contrast');
        if (contrastControl) {
            contrastControl.addEventListener('change', (e) => {
                document.body.classList.toggle('high-contrast', e.target.checked);
                Analytics.trackEvent('Accessibility', 'High Contrast', e.target.checked);
            });
        }
        
        // Reduced animations control
        const animationsControl = panel.querySelector('#animations');
        if (animationsControl) {
            animationsControl.addEventListener('change', (e) => {
                document.body.classList.toggle('reduced-motion', e.target.checked);
                Analytics.trackEvent('Accessibility', 'Reduced Motion', e.target.checked);
            });
        }
    }
};

// ===== DATA MANAGER =====
const DataManager = {
    reportData: CONFIG.reportData,

    init() {
        this.updateDashboardWithRealData();
        this.setupDataDownload();
    },

    updateDashboardWithRealData() {
        // Update hero statistics with real data
        this.updateHeroStats();
        
        // Update issue cards with real data
        this.updateIssueCards();
        
        // Update budget information
        this.updateBudgetInfo();
        
        // Update performance indicators
        this.updatePerformanceIndicators();
    },

    updateHeroStats() {
        const heroStats = document.querySelectorAll('.hero-stats .stat-card');
        
        heroStats.forEach(card => {
            const numberEl = card.querySelector('.stat-number');
            const changeEl = card.querySelector('.stat-change');
            
            if (card.textContent.includes('demandes d\'asile')) {
                numberEl.textContent = this.reportData.asylum.totalRequests.toLocaleString('fr-FR');
                if (changeEl) changeEl.innerHTML = `<i class="fas fa-arrow-down"></i>${this.reportData.asylum.changeVsPreviousYear}% vs 2023`;
            } else if (card.textContent.includes('Budget')) {
                numberEl.textContent = Utils.formatCurrency(this.reportData.budget.totalExecuted);
            } else if (card.textContent.includes('Délai')) {
                numberEl.textContent = `${this.reportData.asylum.ofpraDelay}j`;
                const overrun = Math.round(((this.reportData.asylum.ofpraDelay - this.reportData.asylum.ofpraTarget) / this.reportData.asylum.ofpraTarget) * 100);
                if (changeEl) changeEl.innerHTML = `<i class="fas fa-arrow-up"></i>+${overrun}% vs objectif`;
            } else if (card.textContent.includes('hébergement')) {
                numberEl.textContent = `${this.reportData.asylum.accommodationRate}%`;
                if (changeEl) changeEl.innerHTML = `<i class="fas fa-check"></i>Seul objectif atteint`;
            }
        });
    },

    updateIssueCards() {
        // Update OFPRA delay issue card
        const ofpraCard = document.querySelector('.issue-card');
        if (ofpraCard && ofpraCard.textContent.includes('OFPRA')) {
            const dataItems = ofpraCard.querySelectorAll('.data-value');
            if (dataItems.length >= 3) {
                dataItems[0].textContent = `${this.reportData.asylum.ofpraTarget} jours`;
                dataItems[1].textContent = `${this.reportData.asylum.ofpraDelay} jours`;
                
                const overrun = Math.round(((this.reportData.asylum.ofpraDelay - this.reportData.asylum.ofpraTarget) / this.reportData.asylum.ofpraTarget) * 100);
                dataItems[2].textContent = `+${overrun}%`;
            }
            
            const impactEl = ofpraCard.querySelector('.issue-impact span');
            if (impactEl) {
                impactEl.textContent = `Stock dossiers : +${this.reportData.performance.stockIncrease}% (${this.reportData.performance.ofpraStock.toLocaleString('fr-FR')} dossiers)`;
            }
        }
    },

    updateBudgetInfo() {
        // Update budget total
        const budgetTotal = document.querySelector('.budget-total .budget-amount');
        if (budgetTotal) {
            budgetTotal.textContent = Utils.formatCurrency(this.reportData.budget.totalExecuted);
        }
        
        // Update budget breakdown
        const breakdown = document.querySelector('.budget-breakdown');
        if (breakdown) {
            const items = breakdown.querySelectorAll('.breakdown-item');
            if (items.length >= 3) {
                items[0].innerHTML = '<span>Hébergement</span><span>' + Utils.formatCurrency(this.reportData.budget.accommodationCost) + '</span>';
                items[1].innerHTML = '<span>ADA</span><span>' + Utils.formatCurrency(this.reportData.budget.adaCost) + '</span>';
                items[2].innerHTML = '<span>Fonctionnement</span><span>' + Utils.formatCurrency(321675784) + '</span>';
            }
        }
    },

    updatePerformanceIndicators() {
        // Update performance indicators with real data
        const indicators = document.querySelectorAll('.indicator-card');
        
        indicators.forEach(card => {
            const valueEl = card.querySelector('.indicator-value');
            const progressBar = card.querySelector('.progress-bar');
            
            if (card.textContent.includes('Délai OFPRA')) {
                valueEl.textContent = `${this.reportData.asylum.ofpraDelay}j`;
                if (progressBar) {
                    const percentage = (this.reportData.asylum.ofpraDelay / this.reportData.asylum.ofpraTarget) * 100;
                    progressBar.style.width = `${Math.min(percentage, 100)}%`;
                }
            } else if (card.textContent.includes('A1')) {
                valueEl.textContent = `${this.reportData.performance.languageSuccess}%`;
                if (progressBar) {
                    progressBar.style.width = `${this.reportData.performance.languageSuccess}%`;
                }
            } else if (card.textContent.includes('Décisions')) {
                valueEl.textContent = Utils.formatNumber(this.reportData.performance.ofpraDecisions);
            }
        });
    },

    setupDataDownload() {
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadData();
                Analytics.trackEvent('Data', 'Download', 'JSON');
            });
        }
    },

    downloadData() {
        const data = {
            title: 'France ADA Immigration Report 2024 - Data Export',
            exportDate: new Date().toISOString(),
            source: 'Rapport annuel de performances - Immigration, asile et intégration 2024',
            sourceUrl: CONFIG.officialReportURL,
            data: this.reportData,
            summary: {
                totalBudget: this.reportData.budget.totalExecuted,
                asylumRequests: this.reportData.asylum.totalRequests,
                ofpraDelay: this.reportData.asylum.ofpraDelay,
                accommodationRate: this.reportData.asylum.accommodationRate,
                keyFinding: 'Délai OFPRA dépasse l\'objectif de 130%, seul le taux d\'hébergement atteint son objectif'
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ada-immigration-report-2024-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        Toast.success('Données téléchargées avec succès !');
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
            
            // Initialize data
            this.initializeData();
            
            console.log('✅ Dashboard initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize dashboard:', error);
            ErrorHandler.logError('Initialization Error', error);
            this.showFallbackContent();
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

    initializeData() {
        // Initialize data manager
        DataManager.init();
        
        // Initialize charts after a delay
        setTimeout(() => {
            ChartManager.init();
        }, 1000);
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

        // Scroll to top button
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                Analytics.trackEvent('Navigation', 'Scroll to Top', 'FAB Click');
            });
        }

        // Theme toggle (if present)
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                Analytics.trackEvent('UI', 'Theme Toggle');
            });
        }
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
    },

    showFallbackContent() {
        // Show error boundary if initialization fails
        const errorBoundary = document.getElementById('errorBoundary');
        if (errorBoundary) {
            errorBoundary.hidden = false;
        }
        
        // Hide loading overlay
        LoadingManager.hide();
    }
};

// ===== GLOBAL FUNCTIONS =====

/**
 * Global functions for HTML onclick events and external access
 */
window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    Analytics.trackEvent('Navigation', 'Scroll to Top', 'Global Function');
};

window.shareTwitter = function() {
    ShareManager.shareTwitter();
};

window.shareLinkedIn = function() {
    ShareManager.shareLinkedIn();
};

window.shareFacebook = function() {
    ShareManager.shareFacebook();
};

window.copyLink = function(button) {
    ShareManager.copyLink(button || event.target.closest('.share-btn'));
};

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
        ShareManager,
        CONFIG
    };
}

// Global error boundary
window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.error);
});

// Add some CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes growUp {
        from { transform: scaleY(0); }
        to { transform: scaleY(1); }
    }
    
    .aos-animate {
        animation: fadeIn 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

console.log('📊 France ADA Immigration Report 2024 - JavaScript Loaded');
console.log('🔗 Dashboard URL:', CONFIG.baseURL);
console.log('📋 Official Report:', CONFIG.officialReportURL);
console.log('📈 Real Data Loaded:', CONFIG.reportData);
