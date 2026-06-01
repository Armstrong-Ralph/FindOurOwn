// FindOurOwn - Vanilla JavaScript App with Admin Dashboard, WhatsApp, and Session Storage
class FindOurOwnApp {
    constructor() {
        this.currentPage = 'home';
        this.user = null;
        this.mobileMenuOpen = false;
        this.logoutMessage = false;
        
        // Mock Accounts
        this.accounts = [
            { email: 'admin@findourown.org', password: 'password123', name: 'Admin User', role: 'admin' },
            { email: 'user@findourown.org', password: 'password123', name: 'John Doe', role: 'user' }
        ];

        // Initialize Data from LocalStorage or Defaults
        this.initData();
        this.init();
    }

    initData() {
        const savedMissing = localStorage.getItem('findourown_missing');
        const savedFound = localStorage.getItem('findourown_found');
        const savedPending = localStorage.getItem('findourown_pending');

        this.dummyMissing = savedMissing ? JSON.parse(savedMissing) : [
            { id: 1, name: 'Chidi Okafor', age: 12, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Ikeja Along', description: 'Last seen wearing a blue school uniform. Height approx 4ft 5in.', phoneNumber: '2348012345678', showPhonePublicly: true },
            { id: 2, name: 'Amina Bello', age: 24, gender: 'Female', state: 'Ogun', lastSeenLocation: 'Mowe Bus Stop', description: 'Fair complexion, wearing a green hijab and black dress.', phoneNumber: '2348123456789', showPhonePublicly: false },
            { id: 3, name: 'Oluwaseun Adeyemi', age: 8, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Lekki Phase 1', description: 'Short hair, birthmark on left arm. Wearing a red t-shirt.', phoneNumber: '2347034567890', showPhonePublicly: true }
        ];

        this.dummyFound = savedFound ? JSON.parse(savedFound) : [
            { id: 101, description: 'Young boy found wandering near Ojota. Wearing a yellow shirt.', currentLocation: 'Ojota Police Station', state: 'Lagos', identified: false, reporterPhone: '2348011112222' },
            { id: 102, description: 'Elderly woman found in Abeokuta. Wearing a floral wrapper.', currentLocation: 'St. Peters Hospital', state: 'Ogun', identified: false, reporterPhone: '2348033334444' },
            { id: 103, description: 'Toddler found at a park in Surulere.', currentLocation: 'Community Center, Surulere', state: 'Lagos', identified: true, identifiedName: 'Emeka Junior', reporterPhone: '2348055556666' }
        ];

        this.pendingReports = savedPending ? JSON.parse(savedPending) : [];
    }

    saveData() {
        localStorage.setItem('findourown_missing', JSON.stringify(this.dummyMissing));
        localStorage.setItem('findourown_found', JSON.stringify(this.dummyFound));
        localStorage.setItem('findourown_pending', JSON.stringify(this.pendingReports));
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
            case 'admin': content = this.renderAdmin(); break;
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
            if (this.user.role === 'admin') {
                links.push({ name: 'Admin', page: 'admin' });
            }
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
                <p>A trusted platform dedicated to reuniting missing persons with their families across Lagos and Ogun States.</p>
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
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                    </form>
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
            alert('Invalid credentials.');
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
                    <form onsubmit="app.submitReport(event)">
                        <div class="form-group"><label>Full Name *</label><input type="text" name="name" required></div>
                        <div class="form-group"><label>Age *</label><input type="number" name="age" required></div>
                        <div class="form-group"><label>Gender *</label><select name="gender" required><option value="Male">Male</option><option value="Female">Female</option></select></div>
                        <div class="form-group"><label>State *</label><select name="state" required><option value="Lagos">Lagos</option><option value="Ogun">Ogun</option></select></div>
                        <div class="form-group"><label>Last Seen Location *</label><input type="text" name="lastSeenLocation" required></div>
                        <div class="form-group"><label>Description *</label><textarea name="description" required></textarea></div>
                        <div class="form-group"><label>Your WhatsApp Number (with country code, e.g. 23480...) *</label><input type="tel" name="phoneNumber" required></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit for Approval</button>
                    </form>
                </div>
            </div>
        `;
        return section;
    }

    submitReport(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const report = {
            id: Date.now(),
            type: 'missing',
            name: formData.get('name'),
            age: formData.get('age'),
            gender: formData.get('gender'),
            state: formData.get('state'),
            lastSeenLocation: formData.get('lastSeenLocation'),
            description: formData.get('description'),
            phoneNumber: formData.get('phoneNumber'),
            showPhonePublicly: true,
            status: 'pending'
        };
        this.pendingReports.push(report);
        this.saveData();
        alert('Report submitted! It will appear once an admin approves it.');
        this.navigate('home');
    }

    renderMissingPersons() {
        const section = document.createElement('section');
        section.innerHTML = `<div class="container"><h2>Missing Persons</h2><div id="gallery" class="gallery"></div></div>`;
        setTimeout(() => {
            const gallery = document.getElementById('gallery');
            this.dummyMissing.forEach(person => {
                const card = document.createElement('div');
                card.className = 'gallery-item';
                card.innerHTML = `
                    <div style="background-color: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">👤</div>
                    <div class="gallery-content">
                        <h3 class="gallery-title">${person.name}</h3>
                        <div class="gallery-meta">Age: ${person.age} | ${person.state}</div>
                        <p class="gallery-description">${person.description}</p>
                        <button class="btn btn-accent" style="width: 100%;" onclick="app.openWhatsApp('${person.phoneNumber}', 'Hello, I have information regarding ${person.name}')">Contact via WhatsApp</button>
                    </div>
                `;
                gallery.appendChild(card);
            });
        }, 0);
        return section;
    }

    renderFoundPersons() {
        const section = document.createElement('section');
        section.innerHTML = `<div class="container"><h2>Found Persons</h2><div id="found-gallery" class="gallery"></div></div>`;
        setTimeout(() => {
            const gallery = document.getElementById('found-gallery');
            this.dummyFound.forEach(person => {
                const card = document.createElement('div');
                card.className = 'gallery-item' + (person.identified ? ' identified' : '');
                card.innerHTML = `
                    <div style="background-color: ${person.identified ? '#d4edda' : '#e8f4fd'}; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">${person.identified ? '✅' : '🔍'}</div>
                    <div class="gallery-content">
                        <h3 class="gallery-title">${person.identified ? 'Identified: ' + person.identifiedName : 'Unidentified Person'}</h3>
                        <p class="gallery-description">${person.description}</p>
                        <button class="btn btn-primary" style="width: 100%;" onclick="app.openWhatsApp('${person.reporterPhone}', 'Hello, I think I know the unidentified person found at ${person.currentLocation}')">Contact Finder</button>
                    </div>
                `;
                gallery.appendChild(card);
            });
        }, 0);
        return section;
    }

    openWhatsApp(phone, message) {
        const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    renderAdmin() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Admin Dashboard - Pending Approvals</h2>
                <div id="pending-list" style="margin-top: 2rem;">
                    ${this.pendingReports.length === 0 ? '<p>No pending reports.</p>' : ''}
                </div>
            </div>
        `;
        setTimeout(() => {
            const list = document.getElementById('pending-list');
            this.pendingReports.forEach((report, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.marginBottom = '1rem';
                card.innerHTML = `
                    <h3>${report.name} (${report.type})</h3>
                    <p>${report.description}</p>
                    <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                        <button class="btn btn-primary" onclick="app.approveReport(${index})">Approve</button>
                        <button class="btn btn-accent" onclick="app.rejectReport(${index})">Reject</button>
                    </div>
                `;
                list.appendChild(card);
            });
        }, 0);
        return section;
    }

    approveReport(index) {
        const report = this.pendingReports.splice(index, 1)[0];
        if (report.type === 'missing') {
            this.dummyMissing.unshift(report);
        } else {
            this.dummyFound.unshift(report);
        }
        this.saveData();
        alert('Report approved and added to gallery!');
        this.render();
    }

    rejectReport(index) {
        this.pendingReports.splice(index, 1);
        this.saveData();
        alert('Report rejected.');
        this.render();
    }

    renderDashboard() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Welcome, ${this.user.name}</h2>
                <div class="card" style="margin-top: 2rem;">
                    <h3>Quick Actions</h3>
                    <button class="btn btn-primary" onclick="app.navigate('report-missing')" style="margin-top: 1rem;">New Missing Report</button>
                </div>
            </div>
        `;
        return section;
    }

    createFooter() {
        const footer = document.createElement('footer');
        footer.innerHTML = `<div class="container" style="text-align: center;"><p>&copy; 2026 FindOurOwn. All rights reserved.</p></div>`;
        return footer;
    }
}

const app = new FindOurOwnApp();
