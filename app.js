// FindOurOwn - Comprehensive Update
class FindOurOwnApp {
    constructor() {
        this.currentPage = 'home';
        this.loginType = null;
        this.user = null;
        this.mobileMenuOpen = false;
        this.logoutMessage = false;
        this.googleClientId = '139219211717-ung2bd9htrvq7afu8drjlffv78usi74s.apps.googleusercontent.com';
        this.adminEmail = 'olaribigbea0389@student.babcock.edu.ng';

        this.initData();
        this.init();
    }

    initData() {
        // Core Storage
        const savedMissing = localStorage.getItem('findourown_missing');
        const savedFound = localStorage.getItem('findourown_found');
        const savedPending = localStorage.getItem('findourown_pending');
        const savedVolunteers = localStorage.getItem('findourown_volunteers');
        const savedAssignedCases = localStorage.getItem('findourown_assigned_cases');
        const savedAdmins = localStorage.getItem('findourown_admins');
        const savedUser = localStorage.getItem('findourown_user');

        // Accounts & Roles
        this.admins = savedAdmins ? JSON.parse(savedAdmins) : [
            { email: 'admin@findourown.org', password: 'password123', name: 'Primary Admin' }
        ];

        this.accounts = [
            { email: 'user@findourown.org', password: 'password123', name: 'Standard User', role: 'user' },
            { email: 'volunteer@findourown.org', password: 'password123', name: 'Active Volunteer', role: 'volunteer' }
        ];

        // People Data
        this.dummyMissing = savedMissing ? JSON.parse(savedMissing) : [
            { id: 1, name: 'Chidi Okafor', age: 12, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Ikeja Along', description: 'Last seen wearing a blue school uniform.', phoneNumber: '2348012345678', date: '2026-06-01' },
            { id: 2, name: 'Amina Bello', age: 24, gender: 'Female', state: 'Ogun', lastSeenLocation: 'Mowe Bus Stop', description: 'Fair complexion, wearing a green hijab.', phoneNumber: '2348123456789', date: '2026-06-02' }
        ];

        this.dummyFound = savedFound ? JSON.parse(savedFound) : [
            { id: 101, description: 'Young boy found near Ojota.', currentLocation: 'Ojota Police Station', state: 'Lagos', identified: false, reporterPhone: '2348011112222', date: '2026-06-01' }
        ];

        this.pendingReports = savedPending ? JSON.parse(savedPending) : [];
        this.volunteers = savedVolunteers ? JSON.parse(savedVolunteers) : [
            { name: 'Active Volunteer', email: 'volunteer@findourown.org', phone: '2348000000000', state: 'Lagos', status: 'approved' }
        ];
        this.assignedCases = savedAssignedCases ? JSON.parse(savedAssignedCases) : {};

        // Session Restoration
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            const hash = window.location.hash.replace('#/', '');
            this.currentPage = hash || 'dashboard';
        }
    }

    saveData() {
        if (this.user) localStorage.setItem('findourown_user', JSON.stringify(this.user));
        else localStorage.removeItem('findourown_user');

        localStorage.setItem('findourown_admins', JSON.stringify(this.admins));
        localStorage.setItem('findourown_missing', JSON.stringify(this.dummyMissing));
        localStorage.setItem('findourown_found', JSON.stringify(this.dummyFound));
        localStorage.setItem('findourown_pending', JSON.stringify(this.pendingReports));
        localStorage.setItem('findourown_volunteers', JSON.stringify(this.volunteers));
        localStorage.setItem('findourown_assigned_cases', JSON.stringify(this.assignedCases));
    }

    init() {
        this.setupViewport();
        this.setupRouting();
        this.render();
    }

    setupViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
    }

    setupRouting() {
        window.addEventListener('popstate', () => this.render());
    }

    navigate(page) {
        this.currentPage = page;
        this.mobileMenuOpen = false;
        if (page !== 'login') this.loginType = null;
        window.history.pushState({ page }, '', '#/' + page);
        this.saveData();
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
            case 'profile': content = this.renderProfile(); break;
            default: content = this.renderHome();
        }
        
        if (!content) content = this.renderHome();
        
        app.appendChild(content);
        app.appendChild(this.createFooter());
        if (this.currentPage === 'login' && this.loginType && this.loginType !== 'admin') this.initGoogleSignIn();
        window.scrollTo(0, 0);
    }

    createNav() {
        const nav = document.createElement('nav');
        const links = [{ name: 'Home', page: 'home' }, { name: 'Missing', page: 'missing-persons' }, { name: 'Found', page: 'found-persons' }, { name: 'Report', page: 'report-missing' }];
        if (this.user) {
            links.push({ name: 'Dashboard', page: 'dashboard' });
            if (this.user.role === 'admin') links.push({ name: 'Admin', page: 'admin' });
            links.push({ name: 'Profile', page: 'profile' });
        }
        nav.innerHTML = `
            <div class="container">
                <a href="#" class="logo" onclick="app.navigate('home'); return false;">❤️ FindOurOwn</a>
                <ul class="nav-links ${this.mobileMenuOpen ? 'active' : ''}">
                    ${links.map(l => `<li><a href="#" onclick="app.navigate('${l.page}'); return false;">${l.name}</a></li>`).join('')}
                    ${this.user ? `<li><a href="#" onclick="app.logout(); return false;">Logout</a></li>` : `<li><a href="#" onclick="app.navigate('login'); return false;" class="btn btn-primary">Login</a></li>`}
                </ul>
                <div class="mobile-toggle" onclick="app.toggleMobileMenu()"><span></span><span></span><span></span></div>
            </div>
        `;
        return nav;
    }

    toggleMobileMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; this.render(); }

    renderHome() {
        const section = document.createElement('section');
        section.className = 'hero';
        section.innerHTML = `
            <div class="container">
                <h1>FindOurOwn</h1>
                <p>Reuniting families across Lagos and Ogun. Presentation Ready for Monday.</p>
                <div class="hero-buttons" style="display: flex; flex-direction: column; gap: 1rem; max-width: 300px; margin: 2rem auto;">
                    <button class="btn btn-primary" onclick="app.navigate('report-missing')">Report Missing</button>
                    <button class="btn btn-secondary" onclick="app.navigate('report-found')">Report Found</button>
                    <button class="btn btn-accent" onclick="app.navigate('volunteer')">Join as Volunteer</button>
                </div>
            </div>
        `;
        return section;
    }

    renderLogin() {
        const container = document.createElement('div');
        container.className = 'container';
        if (!this.loginType) {
            container.innerHTML = `
                <div class="card" style="max-width: 500px; margin: 4rem auto; text-align: center;">
                    <h2>Login to FindOurOwn</h2>
                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
                        <button class="btn btn-primary" onclick="app.setLoginType('user')">Login as User</button>
                        <button class="btn btn-secondary" onclick="app.setLoginType('volunteer')">Login as Volunteer</button>
                        <button class="btn btn-accent" onclick="app.setLoginType('admin')">Login as Admin</button>
                    </div>
                </div>`;
        } else {
            container.innerHTML = `
                <div class="card" style="max-width: 500px; margin: 4rem auto;">
                    <button class="btn btn-sm" onclick="app.setLoginType(null)">← Back</button>
                    <h2 style="text-align: center; margin: 1rem 0;">${this.loginType.toUpperCase()} Login</h2>
                    <form onsubmit="app.handleLogin(event)">
                        <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
                        <div class="form-group"><label>Password</label><input type="password" name="password" required></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                    </form>
                    ${this.loginType !== 'admin' ? `<div style="margin: 2rem 0; text-align: center;">OR</div><div id="google-signin-button" style="display: flex; justify-content: center;"></div>` : ''}
                </div>`;
        }
        return container;
    }

    setLoginType(t) { this.loginType = t; this.render(); }

    handleLogin(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        if (this.loginType === 'admin') {
            const admin = this.admins.find(a => a.email === email && a.password === password);
            if (admin) { 
                this.user = { ...admin, role: 'admin' }; 
                this.saveData(); // Save session immediately
                this.navigate('dashboard'); 
            }
            else alert('Invalid Admin Credentials');
        } else {
            const acc = this.accounts.find(a => a.email === email && a.password === password);
            if (acc && acc.role === this.loginType) { 
                this.user = acc; 
                this.saveData(); // Save session immediately
                this.navigate('dashboard'); 
            }
            else alert('Invalid Credentials for this role');
        }
    }

    initGoogleSignIn() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({ client_id: this.googleClientId, callback: (r) => {
                const p = JSON.parse(atob(r.credential.split('.')[1]));
                this.user = { email: p.email, name: p.name, role: this.loginType || 'user', picture: p.picture };
                this.saveData(); this.navigate('dashboard');
            }});
            google.accounts.id.renderButton(document.getElementById("google-signin-button"), { theme: "outline", size: "large", width: "100%" });
        } else setTimeout(() => this.initGoogleSignIn(), 100);
    }

    logout() { this.user = null; this.loginType = null; this.saveData(); this.navigate('home'); }

    renderDashboard() {
        const container = document.createElement('div');
        container.className = 'container';
        const role = this.user.role;
        const myCases = this.assignedCases[this.user.email] || [];
        
        container.innerHTML = `
            <div style="margin: 2rem 0;">
                <h2>Welcome, ${this.user.name}</h2>
                <span class="badge" style="background: #eee; padding: 4px 12px; border-radius: 20px;">Role: ${role.toUpperCase()}</span>
            </div>
            
            ${role === 'volunteer' ? `
                <div class="card" style="margin-bottom: 2rem;">
                    <h3>Volunteer Statistics</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 1.5rem; font-weight: bold;">${myCases.length}</div>
                            <div style="font-size: 0.8rem; color: #666;">Active Cases</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 1.5rem; font-weight: bold;">0</div>
                            <div style="font-size: 0.8rem; color: #666;">Resolved</div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="card">
                <h3>Quick Actions</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
                    ${role === 'admin' ? `
                        <button class="btn btn-primary" onclick="app.navigate('admin')">Admin Panel</button>
                    ` : role === 'volunteer' ? `
                        <button class="btn btn-primary" onclick="app.navigate('missing-persons')">Find New Cases</button>
                        <button class="btn btn-secondary" onclick="app.navigate('report-found')">Report Found Person</button>
                    ` : `
                        <button class="btn btn-primary" onclick="app.navigate('report-missing')">Report Missing</button>
                        <button class="btn btn-secondary" onclick="app.navigate('report-found')">Report Found</button>
                    `}
                </div>
            </div>

            ${role === 'volunteer' && myCases.length > 0 ? `
                <div style="margin-top: 2rem;">
                    <h3>Your Active Cases</h3>
                    <div class="gallery" style="margin-top: 1rem;">
                        ${myCases.map(id => {
                            const p = this.dummyMissing.find(m => m.id === id) || this.dummyFound.find(f => f.id === id);
                            return p ? `
                                <div class="gallery-item">
                                    <div class="gallery-content">
                                        <h4>${p.name || 'Unidentified'}</h4>
                                        <button class="btn btn-sm btn-accent" onclick="app.contactReporter('${p.phoneNumber || p.reporterPhone}')">Send Update</button>
                                    </div>
                                </div>
                            ` : '';
                        }).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        return container;
    }

    renderVolunteer() {
        const container = document.createElement('div');
        container.className = 'container';
        const isVolunteer = this.volunteers.find(v => v.email === this.user?.email);
        
        if (isVolunteer) {
            container.innerHTML = `
                <div class="card" style="max-width: 500px; margin: 4rem auto; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${isVolunteer.status === 'approved' ? '✅' : '⏳'}</div>
                    <h3>Status: ${isVolunteer.status.toUpperCase()}</h3>
                    <p style="margin-top: 1rem;">${isVolunteer.status === 'approved' ? 'You are an approved volunteer! Go to your dashboard to pick cases.' : 'Your application is being reviewed by an admin.'}</p>
                    <button class="btn btn-primary" onclick="app.navigate('dashboard')" style="margin-top: 1.5rem; width: 100%;">Go to Dashboard</button>
                </div>`;
        } else {
            container.innerHTML = `
                <div class="card" style="max-width: 500px; margin: 2rem auto;">
                    <h2>Become a Volunteer</h2>
                    <form onsubmit="app.submitVolunteer(event)" style="margin-top: 2rem;">
                        <div class="form-group"><label>Full Name *</label><input type="text" name="name" value="${this.user?.name || ''}" required></div>
                        <div class="form-group"><label>Email *</label><input type="email" name="email" value="${this.user?.email || ''}" required></div>
                        <div class="form-group"><label>WhatsApp Number *</label><input type="tel" name="phone" required></div>
                        <div class="form-group"><label>State *</label><select name="state" required><option value="Lagos">Lagos</option><option value="Ogun">Ogun</option></select></div>
                        <div class="form-group"><label>Why do you want to help? *</label><textarea name="reason" required></textarea></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Application</button>
                    </form>
                </div>`;
        }
        return container;
    }

    submitVolunteer(e) {
        e.preventDefault();
        const f = new FormData(e.target);
        const email = f.get('email');
        if (this.volunteers.find(v => v.email === email)) return alert('Already applied');
        this.volunteers.push({ name: f.get('name'), email, phone: f.get('phone'), state: f.get('state'), reason: f.get('reason'), status: 'pending' });
        this.saveData(); alert('Application Submitted!'); this.render();
    }

    renderAdmin() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <h2>Admin Control Panel</h2>
            <div style="display: grid; gap: 2rem; margin-top: 2rem;">
                <div class="card">
                    <h3>Pending Reports (${this.pendingReports.length})</h3>
                    <div style="margin-top: 1rem;">
                        ${this.pendingReports.map((r, i) => `
                            <div style="border-bottom: 1px solid #eee; padding: 1rem 0;">
                                <strong>${r.name}</strong> - ${r.type}<br>${r.description}
                                <div style="margin-top: 0.5rem;">
                                    <button class="btn btn-sm btn-primary" onclick="app.approveReport(${i})">Approve</button>
                                    <button class="btn btn-sm btn-accent" onclick="app.rejectReport(${i})">Reject</button>
                                </div>
                            </div>
                        `).join('') || '<p>No pending reports.</p>'}
                    </div>
                </div>
                <div class="card">
                    <h3>Volunteer Applications (${this.volunteers.filter(v => v.status === 'pending').length})</h3>
                    <div style="margin-top: 1rem;">
                        ${this.volunteers.filter(v => v.status === 'pending').map(v => `
                            <div style="border-bottom: 1px solid #eee; padding: 1rem 0;">
                                <strong>${v.name}</strong> (${v.email})<br>${v.reason}
                                <div style="margin-top: 0.5rem;">
                                    <button class="btn btn-sm btn-primary" onclick="app.approveVolunteer('${v.email}')">Approve</button>
                                </div>
                            </div>
                        `).join('') || '<p>No pending applications.</p>'}
                    </div>
                </div>
                <div class="card">
                    <h3>Admin Management</h3>
                    <form onsubmit="app.addAdmin(event)" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                        <input type="email" name="email" placeholder="Admin Email" required style="flex: 1;">
                        <input type="password" name="password" placeholder="Password" required style="flex: 1;">
                        <button type="submit" class="btn btn-primary">Add Admin</button>
                    </form>
                    <div style="margin-top: 1rem;">
                        ${this.admins.map(a => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                                <span>${a.email}</span>
                                ${a.email !== 'admin@findourown.org' ? `<button class="btn btn-sm btn-accent" onclick="app.removeAdmin('${a.email}')">Remove</button>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        return container;
    }

    addAdmin(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        if (this.admins.find(a => a.email === email)) return alert('Admin already exists');
        this.admins.push({ email, password, name: 'Added Admin' });
        this.saveData(); this.render();
    }

    removeAdmin(email) {
        this.admins = this.admins.filter(a => a.email !== email);
        this.saveData(); this.render();
    }

    approveReport(i) {
        const r = this.pendingReports.splice(i, 1)[0];
        if (r.type === 'missing') this.dummyMissing.unshift(r);
        else this.dummyFound.unshift(r);
        this.saveData(); this.render();
    }

    approveVolunteer(email) {
        const v = this.volunteers.find(v => v.email === email);
        if (v) v.status = 'approved';
        this.saveData(); this.render();
    }

    renderProfile() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <div class="card" style="max-width: 500px; margin: 4rem auto;">
                <h2>Edit Profile</h2>
                <form onsubmit="app.updateProfile(event)" style="margin-top: 2rem;">
                    <div class="form-group"><label>Full Name</label><input type="text" name="name" value="${this.user.name}"></div>
                    <div class="form-group"><label>Email</label><input type="email" value="${this.user.email}" disabled></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Update Profile</button>
                </form>
            </div>
        `;
        return container;
    }

    updateProfile(e) {
        e.preventDefault();
        this.user.name = e.target.name.value;
        
        // Also update the account in the persistent accounts list if it exists
        const acc = this.accounts.find(a => a.email === this.user.email);
        if (acc) acc.name = this.user.name;
        
        const admin = this.admins.find(a => a.email === this.user.email);
        if (admin) admin.name = this.user.name;

        this.saveData(); 
        alert('Profile Updated!'); 
        this.render();
    }

    renderMissingPersons() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `<h2>Missing Persons</h2><div class="gallery">${this.dummyMissing.map(p => `
            <div class="gallery-item">
                <div style="height: 150px; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 3rem;">👤</div>
                <div class="gallery-content">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <div style="margin-top: 1rem; display: grid; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="app.contactReporter('${p.phoneNumber}')">Contact Reporter</button>
                        <button class="btn btn-secondary" onclick="app.volunteerForCase(${p.id})">Volunteer for Case</button>
                        <button class="btn btn-accent" onclick="app.iFoundThisPerson(${p.id})">I Found This Person</button>
                    </div>
                </div>
            </div>
        `).join('')}</div>`;
        return container;
    }

    renderFoundPersons() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `<h2>Found Persons</h2><div class="gallery">${this.dummyFound.map(p => `
            <div class="gallery-item">
                <div style="height: 150px; background: #e8f4fd; display: flex; align-items: center; justify-content: center; font-size: 3rem;">🔍</div>
                <div class="gallery-content">
                    <h3>${p.identified ? 'Identified' : 'Unidentified'}</h3>
                    <p>${p.description}</p>
                    <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="app.contactReporter('${p.reporterPhone}')">Contact Finder</button>
                </div>
            </div>
        `).join('')}</div>`;
        return container;
    }

    contactReporter(phone) {
        if (!phone || phone === 'null') {
            window.location.href = `mailto:${this.adminEmail}?subject=Inquiry regarding a case`;
        } else {
            window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
        }
    }

    volunteerForCase(id) {
        if (!this.user) return this.navigate('login');
        if (this.user.role !== 'volunteer') {
            if (confirm('Only volunteers can pick cases. Would you like to become a volunteer?')) {
                this.navigate('volunteer');
            }
            return;
        }
        const v = this.volunteers.find(v => v.email === this.user.email);
        if (!v || v.status !== 'approved') return this.navigate('volunteer');
        
        if (!this.assignedCases[this.user.email]) this.assignedCases[this.user.email] = [];
        if (!this.assignedCases[this.user.email].includes(id)) this.assignedCases[this.user.email].push(id);
        this.saveData(); alert('Case assigned to you!'); this.render();
    }

    iFoundThisPerson(id) {
        alert('Thank you! Please fill out the "Report Found" form to provide details.');
        this.navigate('report-found');
    }

    renderReportMissing() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <div class="card" style="max-width: 600px; margin: 2rem auto;">
                <h2>Report Missing Person</h2>
                <form onsubmit="app.submitReport(event, 'missing')" style="margin-top: 2rem;">
                    <div class="form-group"><label>Name *</label><input type="text" name="name" required></div>
                    <div class="form-group"><label>Police Case Number (Optional)</label><input type="text" name="police_case"></div>
                    <div class="form-group"><label>WhatsApp Number (Optional)</label><input type="tel" name="phone"></div>
                    <div class="form-group"><label>Description *</label><textarea name="desc" required></textarea></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">${this.user?.role === 'admin' ? 'Publish Now' : 'Submit for Approval'}</button>
                </form>
            </div>`;
        return container;
    }

    renderReportFound() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <div class="card" style="max-width: 600px; margin: 2rem auto;">
                <h2>Report Found Person</h2>
                <form onsubmit="app.submitReport(event, 'found')" style="margin-top: 2rem;">
                    <div class="form-group"><label>Description *</label><textarea name="desc" required></textarea></div>
                    <div class="form-group"><label>WhatsApp Number (Optional)</label><input type="tel" name="phone"></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">${this.user?.role === 'admin' ? 'Publish Now' : 'Submit for Approval'}</button>
                </form>
            </div>`;
        return container;
    }

    submitReport(e, type) {
        e.preventDefault();
        const f = e.target;
        const r = {
            id: Date.now(),
            type,
            name: f.name?.value || 'Unidentified',
            description: f.desc.value,
            phoneNumber: f.phone?.value || null,
            reporterPhone: f.phone?.value || null,
            police_case: f.police_case?.value || null,
            date: new Date().toISOString().split('T')[0]
        };
        if (this.user?.role === 'admin') {
            if (type === 'missing') this.dummyMissing.unshift(r);
            else this.dummyFound.unshift(r);
        } else this.pendingReports.push(r);
        this.saveData(); this.navigate(type === 'missing' ? 'missing-persons' : 'found-persons');
    }

    createFooter() {
        const f = document.createElement('footer');
        f.innerHTML = `<div class="container" style="text-align: center; padding: 2rem 0; border-top: 1px solid #eee;">© 2026 FindOurOwn. Presentation Date: June 8, 2026 (Monday)</div>`;
        return f;
    }
}

const app = new FindOurOwnApp();
