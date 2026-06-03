// FindOurOwn - Vanilla JavaScript App with Volunteer Feature
class FindOurOwnApp {
    constructor() {
        this.currentPage = 'home';
        this.user = null;
        this.mobileMenuOpen = false;
        this.logoutMessage = false;
        
        this.accounts = [
            { email: 'admin@findourown.org', password: 'password123', name: 'Admin User', role: 'admin' },
            { email: 'user@findourown.org', password: 'password123', name: 'John Doe', role: 'user' }
        ];

        this.initData();
        this.init();
    }

    initData() {
        const savedMissing = localStorage.getItem('findourown_missing');
        const savedFound = localStorage.getItem('findourown_found');
        const savedPending = localStorage.getItem('findourown_pending');
        const savedVolunteers = localStorage.getItem('findourown_volunteers');

        this.dummyMissing = savedMissing ? JSON.parse(savedMissing) : [
            { id: 1, name: 'Chidi Okafor', age: 12, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Ikeja Along', description: 'Last seen wearing a blue school uniform.', phoneNumber: '2348012345678' },
            { id: 2, name: 'Amina Bello', age: 24, gender: 'Female', state: 'Ogun', lastSeenLocation: 'Mowe Bus Stop', description: 'Fair complexion, wearing a green hijab.', phoneNumber: '2348123456789' }
        ];

        this.dummyFound = savedFound ? JSON.parse(savedFound) : [
            { id: 101, description: 'Young boy found near Ojota.', currentLocation: 'Ojota Police Station', state: 'Lagos', identified: false, reporterPhone: '2348011112222' }
        ];

        this.pendingReports = savedPending ? JSON.parse(savedPending) : [];
        this.volunteers = savedVolunteers ? JSON.parse(savedVolunteers) : [];
    }

    saveData() {
        localStorage.setItem('findourown_missing', JSON.stringify(this.dummyMissing));
        localStorage.setItem('findourown_found', JSON.stringify(this.dummyFound));
        localStorage.setItem('findourown_pending', JSON.stringify(this.pendingReports));
        localStorage.setItem('findourown_volunteers', JSON.stringify(this.volunteers));
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
            case 'volunteer': content = this.renderVolunteer(); break;
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
                    <span></span><span></span><span></span>
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
                <p>Reuniting missing persons with their families across Lagos and Ogun States.</p>
                <div class="hero-buttons" style="flex-direction: column; max-width: 300px; margin: 0 auto;">
                    <button class="btn btn-primary" onclick="app.navigate('report-missing')" style="width: 100%;">Report Missing Person</button>
                    <button class="btn btn-secondary" onclick="app.navigate('report-found')" style="width: 100%; margin-top: 1rem;">Report Found Person</button>
                    <button class="btn btn-accent" onclick="app.navigate('volunteer')" style="width: 100%; margin-top: 1rem;">Join as Volunteer</button>
                </div>
                <div class="stats">
                    <div class="stat"><div class="stat-number">${this.dummyMissing.length}</div><div class="stat-label">Active Reports</div></div>
                    <div class="stat"><div class="stat-number">${124 + this.volunteers.length}</div><div class="stat-label">Volunteers</div></div>
                    <div class="stat"><div class="stat-number">2</div><div class="stat-label">States</div></div>
                </div>
            </div>
        `;
        return section;
    }

    renderVolunteer() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Become a Volunteer</h2>
                <div class="card" style="max-width: 500px; margin: 2rem auto;">
                    <form onsubmit="app.submitVolunteer(event)">
                        <div class="form-group"><label>Full Name *</label><input type="text" name="name" required></div>
                        <div class="form-group"><label>Email *</label><input type="email" name="email" required></div>
                        <div class="form-group"><label>WhatsApp Number *</label><input type="tel" name="phone" required></div>
                        <div class="form-group"><label>State *</label><select name="state" required><option value="Lagos">Lagos</option><option value="Ogun">Ogun</option></select></div>
                        <div class="form-group"><label>Why do you want to help? *</label><textarea name="reason" required></textarea></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Sign Up to Help</button>
                    </form>
                </div>
            </div>
        `;
        return section;
    }

    submitVolunteer(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        this.volunteers.push({
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            state: formData.get('state'),
            reason: formData.get('reason')
        });
        this.saveData();
        alert('Thank you for volunteering! We will contact you soon.');
        this.navigate('home');
    }

    renderLogin() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <div class="card" style="max-width: 400px; margin: 2rem auto;">
                    <h2 style="text-align: center; margin-bottom: 1.5rem;">Login</h2>
                    <form onsubmit="app.handleLogin(event)">
                        <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
                        <div class="form-group"><label>Password</label><input type="password" name="password" required></div>
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
                    <form onsubmit="app.submitReport(event, 'missing')">
                        <div class="form-group"><label>Full Name *</label><input type="text" name="name" required></div>
                        <div class="form-group"><label>Age *</label><input type="number" name="age" required></div>
                        <div class="form-group"><label>Gender *</label><select name="gender" required><option value="Male">Male</option><option value="Female">Female</option></select></div>
                        <div class="form-group"><label>State *</label><select name="state" required><option value="Lagos">Lagos</option><option value="Ogun">Ogun</option></select></div>
                        <div class="form-group"><label>Last Seen Location *</label><input type="text" name="lastSeenLocation" required></div>
                        <div class="form-group"><label>Description *</label><textarea name="description" required></textarea></div>
                        <div class="form-group"><label>Your WhatsApp Number *</label><input type="tel" name="phoneNumber" required></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">${this.user?.role === 'admin' ? 'Publish Immediately' : 'Submit for Approval'}</button>
                    </form>
                </div>
            </div>
        `;
        return section;
    }

    renderReportFound() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Report Found Person</h2>
                <div class="card" style="max-width: 600px; margin: 2rem auto;">
                    <form onsubmit="app.submitReport(event, 'found')">
                        <div class="form-group"><label>Description *</label><textarea name="description" required></textarea></div>
                        <div class="form-group"><label>Current Location *</label><input type="text" name="currentLocation" required></div>
                        <div class="form-group"><label>State *</label><select name="state" required><option value="Lagos">Lagos</option><option value="Ogun">Ogun</option></select></div>
                        <div class="form-group"><label>Your WhatsApp Number *</label><input type="tel" name="phoneNumber" required></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">${this.user?.role === 'admin' ? 'Publish Immediately' : 'Submit for Approval'}</button>
                    </form>
                </div>
            </div>
        `;
        return section;
    }

    submitReport(event, type) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const report = {
            id: Date.now(),
            type: type,
            name: formData.get('name') || 'Unidentified Person',
            age: formData.get('age') || 'Unknown',
            gender: formData.get('gender') || 'Unknown',
            state: formData.get('state'),
            lastSeenLocation: formData.get('lastSeenLocation'),
            currentLocation: formData.get('currentLocation'),
            description: formData.get('description'),
            phoneNumber: formData.get('phoneNumber'),
            reporterPhone: formData.get('phoneNumber'),
            identified: false
        };

        if (this.user?.role === 'admin') {
            if (type === 'missing') this.dummyMissing.unshift(report);
            else this.dummyFound.unshift(report);
            alert('Report published immediately!');
        } else {
            this.pendingReports.push(report);
            alert('Report submitted! It will appear once an admin approves it.');
        }
        
        this.saveData();
        this.navigate(type === 'missing' ? 'missing-persons' : 'found-persons');
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
                        <button class="btn btn-accent" style="width: 100%;" onclick="app.openWhatsApp('${person.phoneNumber}', 'Hello, I have info regarding ${person.name}')">Contact via WhatsApp</button>
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
                        <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="app.openWhatsApp('${person.reporterPhone}', 'Hello, I think I know the person found at ${person.currentLocation}')">Contact Finder</button>
                    </div>
                `;
                gallery.appendChild(card);
            });
        }, 0);
        return section;
    }

    openWhatsApp(phone, message) {
        window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    }

    renderAdmin() {
        const section = document.createElement('section');
        section.innerHTML = `<div class="container"><h2>Admin Dashboard</h2><div id="pending-list" style="margin-top: 2rem;">${this.pendingReports.length === 0 ? '<p>No pending reports.</p>' : ''}</div></div>`;
        setTimeout(() => {
            const list = document.getElementById('pending-list');
            this.pendingReports.forEach((report, index) => {
                const card = document.createElement('div');
                card.className = 'card'; card.style.marginBottom = '1rem';
                card.innerHTML = `<h3>${report.name} (${report.type})</h3><p>${report.description}</p><div style="margin-top: 1rem; display: flex; gap: 1rem;"><button class="btn btn-primary" onclick="app.approveReport(${index})">Approve</button><button class="btn btn-accent" onclick="app.rejectReport(${index})">Reject</button></div>`;
                list.appendChild(card);
            });
        }, 0);
        return section;
    }

    approveReport(index) {
        const report = this.pendingReports.splice(index, 1)[0];
        if (report.type === 'missing') this.dummyMissing.unshift(report);
        else this.dummyFound.unshift(report);
        this.saveData(); this.render();
    }

    renderDashboard() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Welcome, ${this.user.name}</h2>
                <div class="card" style="margin-top: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">
                    <h3 style="margin-bottom: 1.5rem;">Quick Actions</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <button class="btn btn-primary" onclick="app.navigate('report-missing')" style="width: 100%;">Report Missing</button>
                        <button class="btn btn-secondary" onclick="app.navigate('report-found')" style="width: 100%;">Report Found</button>
                        <button class="btn btn-accent" onclick="app.navigate('volunteer')" style="width: 100%;">Volunteer Dashboard</button>
                    </div>
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
