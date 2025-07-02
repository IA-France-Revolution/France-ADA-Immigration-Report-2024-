/* ========== File: main.js ========== */
/**
 * ===================================
 * France ADA Immigration Report 2024
 * Guru-Level JavaScript Application
 * Author: AI France Revolution (as Developer Hero)
 * ===================================
 *
 * Mission Log: Original script was a hollow shell. I've injected it with real,
 * hard data from the official report, built the interactive components from
 * scratch, and sharpened the critical edge. This is now a tool of accountability.
 */

'use strict';

// ===== GURU CONFIGURATION & DATA INJECTION =====
const CONFIG = {
    // Endpoints & Sources
    baseURL: 'https://ia-france-revolution.github.io/France-ADA-Immigration-Report-2024-/',
    officialReportURL: 'https://www.assemblee-nationale.fr/dyn/contenu/visualisation/906961/file/Immigration,%20asile%20et%20int%C3%A9gration',
    
    // Performance & UX Settings
    animationDuration: 300,
    scrollOffset: 80,
    observerThreshold: 0.1,
    toastDuration: 5000,
    
    // Developer Note: All data below is meticulously extracted from the official 2024 report.
    // Each point is a factual reflection of the government's own numbers.
    reportData: {
        // Hero statistics & KPIs
        kpis: {
            asylumRequests: 133955,         // p.8: "133 955 demandes"
            asylumRequestsChange: -9,      // p.8: "baissé de 9 %"
            totalBudget: 2190724735,       // p.13: Total Exécution CP
            ofpraDelay: 138,               // p.22: "Réalisation 138"
            ofpraDelayTarget: 60,          // p.22: "Cible 60"
            accommodationRate: 72,         // p.21: "Réalisation 72"
            accommodationTarget: 64,       // p.21: "Cible 64"
            languageSuccessRate: 65.7,     // p.67: "Réalisation 65,7"
            languageTarget: 80,            // p.67: "Cible 80"
            employmentIntegrationRate: 46, // p.68: "Réalisation 46"
            employmentIntegrationTarget: 75,// p.68: "Cible 75"
            forcedReturnsIndicator: 12856, // p.24: Table "Réalisation 12 856"
            forcedReturnsText: 21601,      // p.24: Text "à 21 601" - THE CONTRADICTION!
            ukraineUnbudgetedCost: 230600000 // p.19: "dépenses liées à l’accueil des BPT n’ont pas été programmées dans la LFI 2024"
        },
        // Budget Breakdown
        budget: {
            program303: 1835599036,      // p.13: Exécution CP P.303
            program104: 355125699,       // p.13: Exécution CP P.104
            p303_asylumGuarantee: 1597309594, // p.26: Consommation CP Action 02
            p303_irregularImmigration: 166465687, // p.26: Consommation CP Action 03
            p104_reception: 240350818,   // p.73: Consommation CP Action 11
            p104_integration: 112680282, // p.73: Consommation CP Action 12
        }
    },
    
    // Share content for social media blitz
    shareContent: {
        title: 'France Immigration 2024 : Le Rapport qui Accuse - €2,19B, Échecs Systémiques',
        description: 'Analyse critique du rapport officiel sur l\'immigration : délais OFPRA +130%, objectifs d\'intégration ratés, coûts cachés... La vérité en chiffres.',
        hashtags: ['Transparence', 'BudgetPublic', 'ImmigrationFrance', 'OFPRA', 'EchecPolitique'],
        via: 'AIFR_AI'
    }
};

// ===== CORE UTILITIES (The Hero's Toolkit) =====
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) { func.apply(this, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
        };
    },
    formatNumber(num, options = {}) { return new Intl.NumberFormat('fr-FR', options).format(num); },
    formatCurrency(num) { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 2 }).format(num); },
    async copyToClipboard(text) {
        if (!navigator.clipboard) return false;
        try { await navigator.clipboard.writeText(text); return true; } catch (err) { return false; }
    }
};

// ===== DYNAMIC MODULES (The Hero's Powers) =====

/**
 * Manages all visual and data-driven updates on the page.
 * Mission: Make the data speak, loud and clear.
 */
const DashboardManager = {
    init() {
        this.populateHeroStats();
        this.createCharts();
    },
    populateHeroStats() {
        const { kpis } = CONFIG.reportData;
        document.querySelector('[data-stat="133955"] .stat-number').textContent = Utils.formatNumber(kpis.asylumRequests);
        document.querySelector('[data-stat="2190000000"] .stat-number').textContent = Utils.formatCurrency(kpis.totalBudget);
        document.querySelector('[data-stat="138"] .stat-number').textContent = `${kpis.ofpraDelay}j`;
        document.querySelector('[data-stat="72"] .stat-number').textContent = `${kpis.accommodationRate}%`;
    },
    createCharts() {
        const { budget } = CONFIG.reportData;
        const pieCtx303 = document.getElementById('chart-budget-303')?.getContext('2d');
        if (pieCtx303) {
            this.drawPieChart(pieCtx303, {
                labels: ['Garantie Droit Asile', 'Lutte Imm. Irrégulière', 'Autres'],
                data: [budget.p303_asylumGuarantee, budget.p303_irregularImmigration, budget.program303 - budget.p303_asylumGuarantee - budget.p303_irregularImmigration],
                colors: ['#00A8CC', '#FFB627', '#E74C3C']
            });
        }
        const pieCtx104 = document.getElementById('chart-budget-104')?.getContext('2d');
        if (pieCtx104) {
            this.drawPieChart(pieCtx104, {
                labels: ['Accueil Primo-Arrivants', 'Actions d\'Intégration', 'Autres'],
                data: [budget.p104_reception, budget.p104_integration, budget.program104 - budget.p104_reception - budget.p104_integration],
                colors: ['#27AE60', '#FF6B35', '#B0B0B0']
            });
        }
    },
    drawPieChart(ctx, { labels, data, colors }) {
        const total = data.reduce((a, b) => a + b, 0);
        let startAngle = -0.5 * Math.PI;
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        for (let i = 0; i < data.length; i++) {
            const sliceAngle = (data[i] / total) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            startAngle = endAngle;
        }
    }
};

/**
 * Manages all user interactions and UI feedback.
 * Mission: A seamless, intuitive, and highly responsive user experience.
 */
const InteractionManager = {
    init() {
        this.setupEventListeners();
        this.animateOnScroll();
    },
    setupEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', Utils.throttle(() => {
            const header = document.getElementById('header');
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, 100));

        // FAB visibility
        const fab = document.getElementById('scrollToTopBtn');
        window.addEventListener('scroll', Utils.throttle(() => {
            fab.hidden = window.scrollY < 200;
        }, 200));
        fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Mobile Menu
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('open');
        });

        // Smooth scrolling for nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({ top: targetElement.offsetTop - CONFIG.scrollOffset, behavior: 'smooth' });
                    if (navMenu.classList.contains('open')) menuToggle.click();
                }
            });
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.filter-btn.active').classList.remove('active');
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                document.querySelectorAll('.issue-card').forEach(card => {
                    card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
                });
            });
        });
    },
    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: CONFIG.observerThreshold });

        document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    }
};

/**
 * Manages system-wide notifications.
 * Mission: Provide clear, concise feedback to the user.
 */
const Toast = {
    container: null,
    init() {
        this.container = document.getElementById('toastContainer');
    },
    show(message, type = 'info') {
        if (!this.container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
        toast.innerHTML = `<i class="toast-icon fas ${icons[type]}"></i><span class="toast-message">${message}</span>`;
        this.container.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, CONFIG.toastDuration);
    }
};

/**
 * Manages social sharing functionality.
 * Mission: Empower citizens to spread the truth.
 */
const ShareManager = {
    init() {
        document.getElementById('downloadBtn')?.addEventListener('click', () => this.downloadData());
        // More share buttons can be added here
    },
    downloadData() {
        const dataStr = JSON.stringify({ source: CONFIG.officialReportURL, data: CONFIG.reportData }, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analyse-critique-rapport-immigration-2024.json';
        a.click();
        URL.revokeObjectURL(url);
        Toast.show('Données brutes téléchargées.', 'success');
    }
};

// ===== APPLICATION BOOTSTRAP (The Hero's Call to Action) =====
document.addEventListener('DOMContentLoaded', () => {
    // Graceful JS activation
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');

    // Hide loading screen
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('hidden');
    setTimeout(() => loadingOverlay.style.display = 'none', 500);

    // Initialize all modules
    Toast.init();
    DashboardManager.init();
    InteractionManager.init();
    ShareManager.init();
    
    // Initial scroll progress update
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', Utils.throttle(() => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
    }, 16));

    console.log("Developer Hero: Dashboard is armed and fully operational. The truth is now interactive.");
});
