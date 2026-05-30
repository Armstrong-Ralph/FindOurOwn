// FindOurOwn - Vanilla JavaScript App with Mocked API
class FindOurOwnApp {
    constructor() {
        this.currentPage = 'home';
        this.user = { id: 1, name: 'Demo User', role: 'user' }; // Auto-login for demo
        this.apiBase = '/api/trpc';
        this.mobileMenuOpen = false;
        
        // Dummy Data
        this.dummyMissing = [
            { id: 1, name: 'Chidi Okafor', age: 12, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Ikeja Along', description: 'Last seen wearing a blue school uniform. Height approx 4ft 5in.', phoneNumber: '08012345678', showPhonePublicly: true },
            { id: 2, name: 'Amina Bello', age: 24, gender: 'Female', state: 'Ogun', lastSeenLocation: 'Mowe Bus Stop', description: 'Fair complexion, wearing a green hijab and black dress.', phoneNumber: '08123456789', showPhonePublicly: false },
            { id: 3, name: 'Oluwaseun Adeyemi', age: 8, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Lekki Phase 1', description: 'Short hair, birthmark on left arm. Wearing a red t-shirt.', phoneNumber: '07034567890', showPhonePublicly: true },
            { id: 4, name: 'Blessing Emmanuel', age: 19, gender: 'Female', state: 'Ogun', lastSeenLocation: 'Sango Ota', description: 'Slim build, dark skin. Last seen heading to the market.', phoneNumber: '09045678901', showPhonePublicly: true },
            { id: 5, name: 'Tunde Bakare', age: 45, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Oshodi Market', description: 'Wearing a grey native attire. Speaks Yoruba fluently.', phoneNumber: '08056789012', showPhonePublicly: false }
        ];

        this.dummyFound = [
            { id: 101, description: 'Young boy found wandering near Ojota. Wearing a yellow shirt. Seems confused.', currentLocation: 'Ojota Police Station', state: 'Lagos' },
            { id: 102, description: 'Elderly woman found in Abeokuta. Cannot remember her home address. Wearing a floral wrapper.', currentLocation: 'St. Peters Hospital', state: 'Ogun' },
            { id: 103, description: 'Toddler found at a park in Surulere. Wearing blue shorts and no shoes.', currentLocation: 'Community Center, Surulere', state: 'Lagos' },
            { id: 104, description: 'Teenage girl found at a bus terminal. Carrying a small black backpack.', currentLocation: 'Red Cross Office, Ifo', state: 'Ogun' }
        ];

        this.init();
    }

    async init() {
        this.setupViewport();
        this.setupRouting();
        this.setupTouchHandlers();
        // Skip real auth for demo
        this.render();
    }
    
    setupViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes';
    }
    
    setupTouchHandlers() {
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.btn') || e.target.closest('a')) {
                const el = e.target.closest('.btn, a');
                if (el) el.style.opacity = '0.8';
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.closest('.btn') || e.target.closest('a')) {
                const el = e.target.closest('.btn, a');
                if (el) el.style.opacity = '1';
            }
        }, { passive: true });
    }

    setupRouting() {
        window.addEventListener('popstate', () => {
            this.mobileMenuOpen = false;
            this.render();
        });
    }
    
    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        this.render();
    }

    navigate(page) {
        this.currentPage = page;
        // In a real GitHub Pages environment, deep linking needs special handling.
        // For this demo, we'll just update state and render.
        window.history.pushState({ page }, '', '#/' + page);
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = '';
        
        app.appendChild(this.createNav());
        
        let content;
        switch(this.currentPage) {
            case 'home': content = this.renderHome(); break;
            case 'report-missing': content = this.renderReportMissing(); break;
            case 'report-found': content = this.renderReportFound(); break;
            case 'missing-persons': content = this.renderMissingPersons(); break;
            case 'found-persons': content = this.renderFoundPersons(); break;
            case 'dashboard': content = this.renderDashboard(); break;
            case 'messages': content = this.renderMessages(); break;
            default: content = this.renderHome();
        }
        
        app.appendChild(content);
        app.appendChild(this.createFooter());
        window.scrollTo(0, 0);
    }

    createNav() {
        const nav = document.createElement('nav');
        nav.innerHTML = `
            <div class="container">
                <a href="#" class="logo" onclick="app.navigate('home'); return false;">
                    <div class="logo-icon">❤️</div>
                    <span>FindOurOwn</span>
                </a>
                <ul class="${this.mobileMenuOpen ? 'active' : ''}">
                    <li><a href="#" onclick="app.navigate('missing-persons'); return false;">Missing</a></li>
                    <li><a href="#" onclick="app.navigate('found-persons'); return false;">Found</a></li>
                    <li><a href="#" onclick="app.navigate('report-missing'); return false;">Report</a></li>
                    ${this.user ? `
                        <li><a href="#" onclick="app.navigate('dashboard'); return false;">Dashboard</a></li>
                        <li><a href="#" onclick="app.logout(); return false;">Logout</a></li>
                    ` : `
                        <li><a href="#" onclick="app.navigate('home'); return false;" class="btn btn-primary">Login</a></li>
                    `}
                </ul>
                <div class="mobile-toggle" onclick="app.toggleMobileMenu()">☰</div>
            </div>
        `;
        return nav;
    }

    renderHome() {
        const section = document.createElement('section');
        section.className = 'hero';
        section.innerHTML = `
            <div class="container">
                <h1>FindOurOwn</h1>
                <p>A trusted platform dedicated to reuniting missing persons with their families across Lagos and Ogun States. Every report matters. Every search counts.</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" onclick="app.navigate('report-missing')">Report Missing Person</button>
                    <button class="btn btn-secondary" onclick="app.navigate('found-persons')">Browse Found Persons</button>
                </div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-number">${this.dummyMissing.length}</div>
                        <div class="stat-label">Active Reports</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">124</div>
                        <div class="stat-label">Volunteers Helping</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">2</div>
                        <div class="stat-label">States Covered</div>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    renderReportMissing() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Report Missing Person</h2>
                <div class="card" style="max-width: 600px; margin: 2rem auto;">
                    <form id="report-form" onsubmit="app.submitReport(event)">
                        <div class="form-group">
                            <label>Full Name *</label>
                            <input type="text" name="name" required placeholder="Enter full name">
                        </div>
                        <div class="form-group">
                            <label>Age *</label>
                            <input type="number" name="age" required>
                        </div>
                        <div class="form-group">
                            <label>Gender *</label>
                            <select name="gender" required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>State *</label>
                            <select name="state" required>
                                <option value="">Select State</option>
                                <option value="Lagos">Lagos</option>
                                <option value="Ogun">Ogun</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Last Seen Location *</label>
                            <input type="text" name="lastSeenLocation" required placeholder="e.g. Oshodi Bus Stop">
                        </div>
                        <div class="form-group">
                            <label>Description *</label>
                            <textarea name="description" required placeholder="Physical description, clothing, etc."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phoneNumber">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Report (Demo)</button>
                    </form>
                </div>
            </div>
        `;
        return section;
    }

    submitReport(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newPerson = {
            id: Date.now(),
            name: formData.get('name'),
            age: formData.get('age'),
            gender: formData.get('gender'),
            state: formData.get('state'),
            lastSeenLocation: formData.get('lastSeenLocation'),
            description: formData.get('description'),
            phoneNumber: formData.get('phoneNumber'),
            showPhonePublicly: true
        };
        this.dummyMissing.unshift(newPerson);
        alert('Demo: Report added successfully!');
        this.navigate('missing-persons');
    }

    renderMissingPersons() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Missing Persons</h2>
                <div class="card" style="max-width: 400px; margin: 2rem auto;">
                    <div class="form-group">
                        <label>Filter by State</label>
                        <select id="state-filter" onchange="app.filterGallery(this.value)">
                            <option value="">All States</option>
                            <option value="Lagos">Lagos</option>
                            <option value="Ogun">Ogun</option>
                        </select>
                    </div>
                </div>
                <div id="gallery" class="gallery"></div>
            </div>
        `;
        setTimeout(() => this.filterGallery(''), 0);
        return section;
    }

    filterGallery(state) {
        const gallery = document.getElementById('gallery');
        if (!gallery) return;
        gallery.innerHTML = '';
        
        const filtered = state ? this.dummyMissing.filter(p => p.state === state) : this.dummyMissing;
        
        filtered.forEach(person => {
            const card = document.createElement('div');
            card.className = 'gallery-item';
            card.innerHTML = `
                <div style="background-color: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 3rem;">👤</div>
                <div class="gallery-content">
                    <h3 class="gallery-title">${person.name}</h3>
                    <div class="gallery-meta">
                        Age: ${person.age} | ${person.gender} | ${person.state}
                    </div>
                    <p class="gallery-description">${person.description}</p>
                    <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;"><strong>Last seen:</strong> ${person.lastSeenLocation}</p>
                    ${person.showPhonePublicly ? `<p style="font-weight: 600; color: #e74c3c; margin-top: 0.5rem;">📞 ${person.phoneNumber}</p>` : ''}
                    <button class="btn btn-accent" style="width: 100%; margin-top: 1rem;" onclick="alert('Contacting reporter for ${person.name}...')">Contact Reporter</button>
                </div>
            `;
            gallery.appendChild(card);
        });
    }

    renderFoundPersons() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Found Persons</h2>
                <div class="card" style="max-width: 400px; margin: 2rem auto;">
                    <div class="form-group">
                        <label>Filter by State</label>
                        <select onchange="app.filterFoundGallery(this.value)">
                            <option value="">All States</option>
                            <option value="Lagos">Lagos</option>
                            <option value="Ogun">Ogun</option>
                        </select>
                    </div>
                </div>
                <div id="found-gallery" class="gallery"></div>
            </div>
        `;
        setTimeout(() => this.filterFoundGallery(''), 0);
        return section;
    }

    filterFoundGallery(state) {
        const gallery = document.getElementById('found-gallery');
        if (!gallery) return;
        gallery.innerHTML = '';
        
        const filtered = state ? this.dummyFound.filter(p => p.state === state) : this.dummyFound;
        
        filtered.forEach(person => {
            const card = document.createElement('div');
            card.className = 'gallery-item';
            card.innerHTML = `
                <div style="background-color: #e8f4fd; height: 200px; display: flex; align-items: center; justify-content: center; color: #3498db; font-size: 3rem;">🔍</div>
                <div class="gallery-content">
                    <h3 class="gallery-title">Unidentified Person</h3>
                    <div class="gallery-meta">${person.state}</div>
                    <p class="gallery-description">${person.description}</p>
                    <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;"><strong>Current Location:</strong> ${person.currentLocation}</p>
                    <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="alert('Thank you. We will notify the authorities.')">This might be my relative</button>
                </div>
            `;
            gallery.appendChild(card);
        });
    }

    renderDashboard() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>My Dashboard</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
                    <div class="card">
                        <h3>Welcome, ${this.user.name}</h3>
                        <p>You have submitted ${this.dummyMissing.length} reports.</p>
                        <button class="btn btn-primary" style="margin-top: 1rem;" onclick="app.navigate('report-missing')">Create New Report</button>
                    </div>
                    <div class="card">
                        <h3>Quick Stats</h3>
                        <p>Active Reports: ${this.dummyMissing.length}</p>
                        <p>Pending Review: 0</p>
                        <p>Matches Found: 2</p>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    renderMessages() {
        const section = document.createElement('section');
        section.innerHTML = `<div class="container"><h2>Messages</h2><p>No new messages.</p></div>`;
        return section;
    }

    logout() {
        this.user = null;
        this.navigate('home');
    }

    createFooter() {
        const footer = document.createElement('footer');
        footer.innerHTML = `
            <div class="container">
                <div>
                    <h3>FindOurOwn</h3>
                    <p>Reuniting families across Lagos and Ogun States.</p>
                </div>
                <div>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#" onclick="app.navigate('missing-persons'); return false;">Missing Persons</a></li>
                        <li><a href="#" onclick="app.navigate('found-persons'); return false;">Found Persons</a></li>
                        <li><a href="#" onclick="app.navigate('report-missing'); return false;">Report Missing</a></li>
                    </ul>
                </div>
                <div>
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#" onclick="alert('Contact: support@findourown.org'); return false;">Contact Us</a></li>
                        <li><a href="#" onclick="return false;">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <div class="container" style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 2rem; padding-top: 2rem; text-align: center;">
                <p>&copy; 2026 FindOurOwn. All rights reserved.</p>
            </div>
        `;
        return footer;
    }
}

const app = new FindOurOwnApp();
