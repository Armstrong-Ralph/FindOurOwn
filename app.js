// FindOurOwn - Vanilla JavaScript App with Mocked API, Login, and Identified Persons
class FindOurOwnApp {
    constructor() {
        this.currentPage = 'home';
        this.user = null; // Start logged out
        this.apiBase = '/api/trpc';
        this.mobileMenuOpen = false;
        this.logoutMessage = false;
        
        // Mock Accounts
        this.accounts = [
            { email: 'admin@findourown.org', password: 'password123', name: 'Admin User', role: 'admin' },
            { email: 'user@findourown.org', password: 'password123', name: 'John Doe', role: 'user' }
        ];

        // Dummy Data
        this.dummyMissing = [
            { id: 1, name: 'Chidi Okafor', age: 12, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Ikeja Along', description: 'Last seen wearing a blue school uniform. Height approx 4ft 5in.', phoneNumber: '08012345678', showPhonePublicly: true },
            { id: 2, name: 'Amina Bello', age: 24, gender: 'Female', state: 'Ogun', lastSeenLocation: 'Mowe Bus Stop', description: 'Fair complexion, wearing a green hijab and black dress.', phoneNumber: '08123456789', showPhonePublicly: false },
            { id: 3, name: 'Oluwaseun Adeyemi', age: 8, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Lekki Phase 1', description: 'Short hair, birthmark on left arm. Wearing a red t-shirt.', phoneNumber: '07034567890', showPhonePublicly: true },
            { id: 4, name: 'Blessing Emmanuel', age: 19, gender: 'Female', state: 'Ogun', lastSeenLocation: 'Sango Ota', description: 'Slim build, dark skin. Last seen heading to the market.', phoneNumber: '09045678901', showPhonePublicly: true },
            { id: 5, name: 'Tunde Bakare', age: 45, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Oshodi Market', description: 'Wearing a grey native attire. Speaks Yoruba fluently.', phoneNumber: '08056789012', showPhonePublicly: false }
        ];

        this.dummyFound = [
            { id: 101, description: 'Young boy found wandering near Ojota. Wearing a yellow shirt. Seems confused.', currentLocation: 'Ojota Police Station', state: 'Lagos', identified: false },
            { id: 102, description: 'Elderly woman found in Abeokuta. Cannot remember her home address. Wearing a floral wrapper.', currentLocation: 'St. Peters Hospital', state: 'Ogun', identified: false },
            { id: 103, description: 'Toddler found at a park in Surulere. Wearing blue shorts and no shoes.', currentLocation: 'Community Center, Surulere', state: 'Lagos', identified: true, identifiedName: 'Emeka Junior' },
            { id: 104, description: 'Teenage girl found at a bus terminal. Carrying a small black backpack.', currentLocation: 'Red Cross Office, Ifo', state: 'Ogun', identified: true, identifiedName: 'Sade Williams' }
        ];

        this.init();
    }

    async init() {
        this.setupViewport();
        this.setupRouting();
        this.setupTouchHandlers();
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
            const el = e.target.closest('.btn, a');
            if (el) el.style.opacity = '0.8';
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const el = e.target.closest('.btn, a');
            if (el) el.style.opacity = '1';
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
        this.mobileMenuOpen = false;
        this.logoutMessage = false;
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
            case 'login': content = this.renderLogin(); break;
            case 'report-missing': content = this.renderReportMissing(); break;
            case 'report-found': content = this.renderReportFound(); break;
            case 'missing-persons': content = this.renderMissingPersons(); break;
            case 'found-persons': content = this.renderFoundPersons(); break;
            case 'dashboard': content = this.renderDashboard(); break;
            default: content = this.renderHome();
        }
        
        app.appendChild(content);
        app.appendChild(this.createFooter());
        window.scrollTo(0, 0);
    }

    createNav() {
        const nav = document.createElement('nav');
        const links = [
            { name: 'Home', page: 'home' },
            { name: 'Missing', page: 'missing-persons' },
            { name: 'Found', page: 'found-persons' },
            { name: 'Report', page: 'report-missing' }
        ];

        if (this.user) {
            links.push({ name: 'Dashboard', page: 'dashboard' });
        }

        nav.innerHTML = `
            <div class="container">
                <a href="#" class="logo" onclick="app.navigate('home'); return false;">
                    <div class="logo-icon">❤️</div>
                    <span>FindOurOwn</span>
                </a>
                <ul class="nav-links ${this.mobileMenuOpen ? 'active' : ''}">
                    ${links.map(link => `<li><a href="#" onclick="app.navigate('${link.page}'); return false;">${link.name}</a></li>`).join('')}
                    ${this.user ? 
                        `<li><a href="#" onclick="app.logout(); return false;">Logout</a></li>` : 
                        `<li><a href="#" onclick="app.navigate('login'); return false;" class="btn btn-primary">Login</a></li>`
                    }
                </ul>
                <div class="mobile-toggle" onclick="app.toggleMobileMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        return nav;
    }

    renderHome() {
        const section = document.createElement('section');
        section.className = 'hero';
        section.innerHTML = `
            <div class="container">
                ${this.logoutMessage ? `<div class="alert success">You have been logged out successfully.</div>` : ''}
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

    renderLogin() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <div class="card" style="max-width: 400px; margin: 2rem auto;">
                    <h2 style="text-align: center; margin-bottom: 1.5rem;">Login</h2>
                    <form onsubmit="app.handleLogin(event)">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required placeholder="user@findourown.org">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" name="password" required placeholder="password123">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                    </form>
                    <p style="margin-top: 1rem; font-size: 0.8rem; color: #666; text-align: center;">
                        Demo: user@findourown.org / password123
                    </p>
                </div>
            </div>
        `;
        return section;
    }

    handleLogin(event) {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        
        const account = this.accounts.find(a => a.email === email && a.password === password);
        
        if (account) {
            this.user = account;
            this.navigate('dashboard');
        } else {
            alert('Invalid email or password. Please try again.');
        }
    }

    logout() {
        this.user = null;
        this.logoutMessage = true;
        this.navigate('home');
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
                            <input type="text" name="name" required>
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
                            <input type="text" name="lastSeenLocation" required>
                        </div>
                        <div class="form-group">
                            <label>Description *</label>
                            <textarea name="description" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Report</button>
                    </form>
                </div>
            </div>
        `;
        return section;
    }

    submitReport(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        this.dummyMissing.unshift({
            id: Date.now(),
            name: formData.get('name'),
            age: formData.get('age'),
            gender: formData.get('gender'),
            state: formData.get('state'),
            lastSeenLocation: formData.get('lastSeenLocation'),
            description: formData.get('description'),
            showPhonePublicly: false
        });
        alert('Report submitted successfully!');
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
                        <select onchange="app.filterGallery(this.value)">
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
                    <div class="gallery-meta">Age: ${person.age} | ${person.gender} | ${person.state}</div>
                    <p class="gallery-description">${person.description}</p>
                    <p style="font-size: 0.85rem; color: #666;"><strong>Last seen:</strong> ${person.lastSeenLocation}</p>
                    <button class="btn btn-accent" style="width: 100%; margin-top: 1rem;">Contact Reporter</button>
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
            card.className = 'gallery-item' + (person.identified ? ' identified' : '');
            card.innerHTML = `
                <div style="background-color: ${person.identified ? '#d4edda' : '#e8f4fd'}; height: 200px; display: flex; align-items: center; justify-content: center; color: ${person.identified ? '#28a745' : '#3498db'}; font-size: 3rem;">
                    ${person.identified ? '✅' : '🔍'}
                </div>
                <div class="gallery-content">
                    <h3 class="gallery-title">${person.identified ? 'Identified: ' + person.identifiedName : 'Unidentified Person'}</h3>
                    <div class="gallery-meta">${person.state} ${person.identified ? ' | <span style="color: #28a745; font-weight: bold;">REUNITED</span>' : ''}</div>
                    <p class="gallery-description">${person.description}</p>
                    <p style="font-size: 0.85rem; color: #666;"><strong>Location:</strong> ${person.currentLocation}</p>
                    ${!person.identified ? `<button class="btn btn-primary" style="width: 100%; margin-top: 1rem;">This might be my relative</button>` : ''}
                </div>
            `;
            gallery.appendChild(card);
        });
    }

    renderDashboard() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Welcome, ${this.user.name}</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
                    <div class="card">
                        <h3>Your Reports</h3>
                        <p>You have submitted ${this.dummyMissing.length} reports.</p>
                        <button class="btn btn-primary" style="margin-top: 1rem;" onclick="app.navigate('report-missing')">Create New Report</button>
                    </div>
                    <div class="card">
                        <h3>Recent Activity</h3>
                        <ul style="list-style: none; margin-top: 1rem;">
                            <li style="margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;">Report for Chidi Okafor is active.</li>
                            <li>You have 0 new messages.</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        return section;
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
                        <li><a href="#" onclick="app.navigate('home'); return false;">Home</a></li>
                        <li><a href="#" onclick="app.navigate('missing-persons'); return false;">Missing Persons</a></li>
                        <li><a href="#" onclick="app.navigate('found-persons'); return false;">Found Persons</a></li>
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
