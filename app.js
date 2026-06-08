// FindOurOwn - Professional Platform Update
class FindOurOwnApp {
    constructor() {
        this.currentPage = 'home';
        this.user = null;
        this.loginType = null;
        this.googleClientId = '139219211717-ung2bd9htrvq7afu8drjlffv78usi74s.apps.googleusercontent.com';
        this.adminEmail = 'olaribigbea0389@student.babcock.edu.ng';
        this.adminWhatsApp = '2347076864421';
        
        // Data Storage
        const savedMissing = localStorage.getItem('findourown_missing');
        const savedFound = localStorage.getItem('findourown_found');
        const savedPending = localStorage.getItem('findourown_pending');
        const savedVolunteers = localStorage.getItem('findourown_volunteers');
        const savedAccounts = localStorage.getItem('findourown_accounts');
        const savedAdmins = localStorage.getItem('findourown_admins');
        const savedAssignedCases = localStorage.getItem('findourown_assigned_cases');
        const savedUser = localStorage.getItem('findourown_user');

        this.dummyMissing = savedMissing ? JSON.parse(savedMissing) : [
            { id: 1, name: 'Chris Dozier', age: 28, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Lekki', description: 'Last seen wearing a white t-shirt and blue jeans near Lekki Phase 1.', phoneNumber: '2348012345678', showPhone: true, date: '2024-12-02' },
            { id: 2, name: 'Amaya Bello', age: 24, gender: 'Female', state: 'Lagos', lastSeenLocation: 'Victoria Island', description: 'Wearing a floral dress. Last seen at a cafe in VI.', phoneNumber: '2348098765432', showPhone: true, date: '2024-12-02' }
        ];
        this.dummyFound = savedFound ? JSON.parse(savedFound) : [
            { id: 101, identified: true, description: 'Found at Ojodu Berger. Reunited with family.', state: 'Lagos', reporterPhone: '2347011223344', date: '2026-06-01' }
        ];
        this.pendingReports = savedPending ? JSON.parse(savedPending) : [];
        this.volunteers = savedVolunteers ? JSON.parse(savedVolunteers) : [
            { name: 'Active Volunteer', email: 'volunteer@findourown.org', phone: '2348000000000', state: 'Lagos', address: '123 Ikeja Way', status: 'approved' }
        ];
        this.accounts = savedAccounts ? JSON.parse(savedAccounts) : [
            { name: 'Demo User', email: 'user@findourown.org', password: 'password123', role: 'user' },
            { name: 'Demo Volunteer', email: 'volunteer@findourown.org', password: 'password123', role: 'volunteer' }
        ];
        this.admins = savedAdmins ? JSON.parse(savedAdmins) : [
            { email: 'admin@findourown.org', password: 'password123', name: 'Main Admin' }
        ];
        this.assignedCases = savedAssignedCases ? JSON.parse(savedAssignedCases) : {};

        if (savedUser) {
            this.user = JSON.parse(savedUser);
            const hash = window.location.hash.replace('#/', '');
            this.currentPage = hash || 'dashboard';
        }
        
        this.init();
    }

    init() {
        this.render();
    }

    saveData() {
        localStorage.setItem('findourown_missing', JSON.stringify(this.dummyMissing));
        localStorage.setItem('findourown_found', JSON.stringify(this.dummyFound));
        localStorage.setItem('findourown_pending', JSON.stringify(this.pendingReports));
        localStorage.setItem('findourown_volunteers', JSON.stringify(this.volunteers));
        localStorage.setItem('findourown_accounts', JSON.stringify(this.accounts));
        localStorage.setItem('findourown_admins', JSON.stringify(this.admins));
        localStorage.setItem('findourown_assigned_cases', JSON.stringify(this.assignedCases));
        if (this.user) localStorage.setItem('findourown_user', JSON.stringify(this.user));
        else localStorage.removeItem('findourown_user');
    }

    navigate(page) {
        this.currentPage = page;
        window.location.hash = `/${page}`;
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
            case 'signup': content = this.renderSignup(); break;
            case 'report-missing': content = this.renderReportMissing(); break;
            case 'report-found': content = this.renderReportFound(); break;
            case 'missing-persons': content = this.renderMissingPersons(); break;
            case 'found-persons': content = this.renderFoundPersons(); break;
            case 'dashboard': content = this.renderDashboard(); break;
            case 'admin': content = this.renderAdmin(); break;
            case 'volunteer': content = this.renderVolunteer(); break;
            case 'profile': content = this.renderProfile(); break;
            default: content = this.renderHome();
        }
        
        if (!content) content = this.renderHome();
        app.appendChild(content);
        app.appendChild(this.createFooter());
    }

    createNav() {
        const nav = document.createElement('nav');
        nav.innerHTML = `
            <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0;">
                <a href="javascript:void(0)" class="logo" onclick="app.navigate('home')" style="font-weight: 800; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #1d3557;">
                    <span style="color: #e63946;">❤️</span> FindOurOwn
                </a>
                <div class="nav-links" style="display: flex; gap: 1.5rem; align-items: center;">
                    <a href="javascript:void(0)" onclick="app.navigate('home')">Home</a>
                    <a href="javascript:void(0)" onclick="app.navigate('missing-persons')">Missing</a>
                    <a href="javascript:void(0)" onclick="app.navigate('found-persons')">Found</a>
                    ${this.user ? `
                        <a href="javascript:void(0)" onclick="app.navigate('dashboard')">Dashboard</a>
                        <button class="btn btn-sm btn-primary" onclick="app.logout()">Logout</button>
                    ` : `
                        <button class="btn btn-sm btn-primary" onclick="app.navigate('login')">Login</button>
                    `}
                </div>
            </div>
        `;
        return nav;
    }

    renderHome() {
        const section = document.createElement('section');
        section.className = 'hero';
        section.innerHTML = `
            <div class="container" style="text-align: center;">
                <h1>Reuniting Families,<br>Restoring Hope</h1>
                <p style="margin: 1.5rem auto; font-size: 1.25rem; color: #666; max-width: 600px;">A trusted platform dedicated to finding missing loved ones in Lagos and Ogun States.</p>
                <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="app.navigate('report-missing')">Report Missing</button>
                    <button class="btn btn-secondary" onclick="app.navigate('missing-persons')">Browse Missing</button>
                </div>
                <div class="stats">
                    <div class="stats-item">
                        <div class="stats-number">${this.dummyMissing.length}</div>
                        <div class="stats-label">Active Reports</div>
                    </div>
                    <div class="stats-item">
                        <div class="stats-number">${this.volunteers.length}</div>
                        <div class="stats-label">Volunteers Helping</div>
                    </div>
                    <div class="stats-item">
                        <div class="stats-number">${this.dummyMissing.length + this.dummyFound.length}</div>
                        <div class="stats-label">Total Cases</div>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    renderMissingPersons() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 3rem 0 2rem;">
                <h2>Missing Persons</h2>
                <button class="btn btn-sm btn-primary" onclick="app.navigate('report-missing')">+ Report New</button>
            </div>
            <div class="gallery">
                ${this.dummyMissing.map(p => `
                    <div class="gallery-item card">
                        <div style="height: 220px; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 4rem;">👤</div>
                        <div class="gallery-content">
                            <span class="badge" style="background: #ffe3e3; color: #e63946; margin-bottom: 0.5rem;">Missing</span>
                            <h3>${p.name}</h3>
                            <p style="color: #666; font-size: 0.9rem; margin: 0.5rem 0;">Last seen in ${p.lastSeenLocation}, ${p.state}</p>
                            <p style="margin: 1rem 0; font-size: 0.95rem;">${p.description}</p>
                            <div style="display: grid; gap: 0.5rem; margin-top: 1.5rem;">
                                <button class="btn btn-primary" onclick="app.contactReporter('${p.phoneNumber}', true)">Contact Reporter</button>
                                <button class="btn btn-secondary" onclick="app.volunteerForCase(${p.id})">Volunteer to Case</button>
                                <button class="btn btn-accent" onclick="app.navigate('report-found')">Found This Person</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        return container;
    }

    renderLogin() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <div class="card" style="max-width: 450px; margin: 5rem auto;">
                <h2 style="text-align: center;">Welcome Back</h2>
                <form onsubmit="app.handleLogin(event)" style="margin-top: 2rem;">
                    <div class="form-group"><label>Email Address</label><input type="email" name="email" required placeholder="name@example.com"></div>
                    <div class="form-group"><label>Password</label><input type="password" name="password" required placeholder="••••••••"></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Login to Account</button>
                </form>
                <p style="text-align: center; margin-top: 2rem; color: #666;">Don't have an account? <a href="javascript:void(0)" onclick="app.navigate('signup')" style="color: #e63946; font-weight: 600;">Sign Up</a></p>
            </div>`;
        return container;
    }

    handleLogin(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const acc = this.accounts.find(a => a.email === email && a.password === password);
        if (acc) {
            this.user = acc;
            this.saveData();
            this.navigate('dashboard');
        } else {
            alert('Invalid credentials. Try user@findourown.org / password123');
        }
    }

    logout() { this.user = null; this.saveData(); this.navigate('home'); }

    contactReporter(phone, show) {
        alert('Connecting you to the reporter via WhatsApp: ' + phone);
    }

    volunteerForCase(id) {
        alert('Thank you for volunteering! An admin will contact you shortly.');
    }

    createFooter() {
        const f = document.createElement('footer');
        f.style = "background: #1d3557; color: white; padding: 4rem 0 2rem; margin-top: 6rem;";
        f.innerHTML = `<div class="container" style="text-align: center;">
            <h3 style="color: white; margin-bottom: 1rem;">FindOurOwn</h3>
            <p style="opacity: 0.7;">© 2026 FindOurOwn Lagos/Ogun. All rights reserved.</p>
        </div>`;
        return f;
    }
}

const app = new FindOurOwnApp();
