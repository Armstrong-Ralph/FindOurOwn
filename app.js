// FindOurOwn - Comprehensive Platform Update
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
            { id: 1, name: 'Tunde Bakare', age: 24, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Ikeja', description: 'Wearing a blue shirt and black trousers.', phoneNumber: '2348012345678', showPhone: true, date: '2026-06-01' },
            { id: 2, name: 'Chidi Okafor', age: 31, gender: 'Male', state: 'Ogun', lastSeenLocation: 'Abeokuta', description: 'Last seen at the local market.', phoneNumber: '2348098765432', showPhone: false, date: '2026-06-02' }
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

        // Session Restoration
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            const hash = window.location.hash.replace('#/', '');
            this.currentPage = hash || 'dashboard';
        }
        
        this.init();
    }

    init() {
        this.setupTouchHandlers();
        this.render();
    }

    setupTouchHandlers() {
        document.addEventListener('touchstart', (e) => {
            const btn = e.target.closest('.btn');
            if (btn) btn.style.transform = 'scale(0.96)';
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const btn = e.target.closest('.btn');
            if (btn) btn.style.transform = 'scale(1)';
        }, { passive: true });
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
        
        if (this.currentPage === 'login' && this.loginType && this.loginType !== 'admin') this.initGoogleSignIn();
        if (this.currentPage === 'signup') this.initGoogleSignIn('google-signup-button');
    }

    createNav() {
        const nav = document.createElement('nav');
        nav.innerHTML = `
            <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0;">
                <a href="javascript:void(0)" class="logo" onclick="app.navigate('home')" style="font-weight: bold; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: #e63946;">❤️</span> FindOurOwn
                </a>
                <div class="nav-links" style="display: flex; gap: 1rem; align-items: center;">
                    <a href="javascript:void(0)" onclick="app.navigate('home')">Home</a>
                    <a href="javascript:void(0)" onclick="app.navigate('missing-persons')">Missing</a>
                    <a href="javascript:void(0)" onclick="app.navigate('found-persons')">Found</a>
                    ${this.user ? `
                        <a href="javascript:void(0)" onclick="app.navigate('dashboard')">Dashboard</a>
                        ${this.user.role === 'admin' ? `<a href="javascript:void(0)" onclick="app.navigate('admin')">Admin</a>` : ''}
                        <button class="btn btn-sm btn-accent" onclick="app.logout()">Logout</button>
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
            <div class="container" style="text-align: center; padding: 4rem 0;">
                <h1>Reuniting Families, Restoring Hope</h1>
                <p style="margin: 1.5rem 0; font-size: 1.2rem; color: #666;">A trusted platform for Lagos and Ogun States.</p>
                <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="app.navigate('report-missing')">Report Missing</button>
                    <button class="btn btn-secondary" onclick="app.navigate('report-found')">Report Found</button>
                    <button class="btn btn-accent" onclick="app.navigate('volunteer')">Join as Volunteer</button>
                </div>
                <div class="stats" style="display: flex; justify-content: center; gap: 3rem; margin-top: 4rem;">
                    <div><div style="font-size: 2rem; font-weight: bold;">${this.dummyMissing.length + this.dummyFound.length}</div><div>Reports</div></div>
                    <div><div style="font-size: 2rem; font-weight: bold;">${this.volunteers.length}</div><div>Volunteers</div></div>
                    <div><div style="font-size: 2rem; font-weight: bold;">2</div><div>States</div></div>
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
                    <p style="margin-top: 2rem;">Don't have an account? <a href="javascript:void(0)" onclick="app.navigate('signup')">Sign Up</a></p>
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
                    ${this.loginType !== 'admin' ? `
                        <div style="margin: 2rem 0; text-align: center;">OR</div>
                        <div id="google-signin-button" style="display: flex; justify-content: center;"></div>
                        <p style="margin-top: 2rem; text-align: center;">Don't have an account? <a href="javascript:void(0)" onclick="app.navigate('signup')">Sign Up</a></p>
                    ` : ''}
                </div>`;
        }
        return container;
    }

    renderSignup() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <div class="card" style="max-width: 500px; margin: 4rem auto;">
                <h2 style="text-align: center;">Create an Account</h2>
                <form onsubmit="app.handleSignup(event)" style="margin-top: 2rem;">
                    <div class="form-group"><label>Full Name</label><input type="text" name="name" required></div>
                    <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
                    <div class="form-group"><label>Password</label><input type="password" name="password" required></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Sign Up</button>
                </form>
                <div style="margin: 2rem 0; text-align: center;">OR</div>
                <div id="google-signup-button" style="display: flex; justify-content: center;"></div>
                <p style="margin-top: 2rem; text-align: center;">Already have an account? <a href="javascript:void(0)" onclick="app.navigate('login')">Login</a></p>
            </div>`;
        return container;
    }

    handleSignup(e) {
        e.preventDefault();
        const f = e.target;
        const email = f.email.value;
        if (this.accounts.find(a => a.email === email)) return alert('Account already exists');
        const newAcc = { name: f.name.value, email, password: f.password.value, role: 'user' };
        this.accounts.push(newAcc);
        this.user = newAcc;
        this.saveData();
        alert('Account Created Successfully!');
        this.navigate('dashboard');
    }

    setLoginType(t) { this.loginType = t; this.render(); }

    handleLogin(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        if (this.loginType === 'admin') {
            const admin = this.admins.find(a => a.email === email && a.password === password);
            if (admin) { this.user = { ...admin, role: 'admin' }; this.saveData(); this.navigate('dashboard'); }
            else alert('Invalid Admin Credentials');
        } else {
            const acc = this.accounts.find(a => a.email === email && a.password === password);
            if (acc) {
                this.user = { ...acc, role: this.loginType || 'user' };
                this.saveData(); this.navigate('dashboard');
            } else alert('Invalid Credentials');
        }
    }

    initGoogleSignIn(targetId = 'google-signin-button') {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({ client_id: this.googleClientId, callback: (r) => {
                const p = JSON.parse(atob(r.credential.split('.')[1]));
                this.user = { email: p.email, name: p.name, role: this.loginType || 'user', picture: p.picture };
                if (!this.accounts.find(a => a.email === p.email)) {
                    this.accounts.push({ email: p.email, name: p.name, role: 'user' });
                }
                this.saveData(); this.navigate('dashboard');
            }});
            const target = document.getElementById(targetId);
            if (target) google.accounts.id.renderButton(target, { theme: 'outline', size: 'large' });
        } else setTimeout(() => this.initGoogleSignIn(targetId), 100);
    }

    logout() { this.user = null; this.loginType = null; this.saveData(); this.navigate('home'); }

    renderDashboard() {
        const container = document.createElement('div');
        container.className = 'container';
        const role = this.user.role;
        const myReports = this.dummyMissing.filter(m => m.reporterEmail === this.user.email);
        const myCases = this.assignedCases[this.user.email] || [];

        container.innerHTML = `
            <div style="margin: 2rem 0; display: flex; justify-content: space-between; align-items: center;">
                <h2>Welcome, ${this.user.name}</h2>
                <button class="btn btn-sm btn-secondary" onclick="app.navigate('profile')">Edit Profile</button>
            </div>
            <span class="badge" style="background: #eee; padding: 4px 12px; border-radius: 20px;">Role: ${role.toUpperCase()}</span>
            
            <div class="card" style="margin-top: 2rem;">
                <h3>Quick Actions</h3>
                <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
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

            ${myReports.length > 0 ? `
                <div style="margin-top: 2rem;">
                    <h3>Your Reports</h3>
                    <div class="gallery" style="margin-top: 1rem;">
                        ${myReports.map(r => `
                            <div class="gallery-item">
                                <div class="gallery-content">
                                    <h4>${r.name}</h4>
                                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                                        <button class="btn btn-sm btn-secondary" onclick="app.editReport(${r.id})">Edit</button>
                                        <button class="btn btn-sm btn-accent" onclick="app.deleteReport(${r.id})">Delete</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${role === 'volunteer' && myCases.length > 0 ? `
                <div style="margin-top: 2rem;">
                    <h3>Your Active Cases</h3>
                    <div class="gallery" style="margin-top: 1rem;">
                        ${myCases.map(id => {
                            const p = this.dummyMissing.find(m => m.id === id);
                            return p ? `
                                <div class="gallery-item">
                                    <div class="gallery-content">
                                        <h4>${p.name}</h4>
                                        <button class="btn btn-sm btn-primary" onclick="app.contactReporter('${p.phoneNumber}', ${p.showPhone})">Update Family</button>
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
                                <strong>${v.name}</strong> (${v.email})<br>Address: ${v.address}<br>Reason: ${v.reason}
                                <div style="margin-top: 0.5rem;">
                                    <button class="btn btn-sm btn-primary" onclick="app.approveVolunteer('${v.email}')">Approve</button>
                                    <button class="btn btn-sm btn-accent" onclick="app.rejectVolunteer('${v.email}')">Reject</button>
                                </div>
                            </div>
                        `).join('') || '<p>No pending applications.</p>'}
                    </div>
                </div>
                <div class="card">
                    <h3>Admin Management</h3>
                    <form onsubmit="app.addAdmin(event)" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <input type="email" name="email" placeholder="Email" required style="flex: 1;">
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

    approveReport(i) {
        const r = this.pendingReports.splice(i, 1)[0];
        if (r.type === 'missing') this.dummyMissing.unshift(r);
        else this.dummyFound.unshift(r);
        this.saveData(); this.render();
    }

    rejectReport(i) {
        this.pendingReports.splice(i, 1);
        this.saveData(); this.render();
    }

    approveVolunteer(email) {
        const v = this.volunteers.find(v => v.email === email);
        if (v) v.status = 'approved';
        this.saveData(); this.render();
    }

    rejectVolunteer(email) {
        this.volunteers = this.volunteers.filter(v => v.email !== email);
        this.saveData(); this.render();
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

    renderMissingPersons() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 2rem 0;">
                <h2>Missing Persons</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <select onchange="app.filterGallery('missing', this.value)" style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ddd;">
                        <option value="all">All States</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Ogun">Ogun</option>
                    </select>
                </div>
            </div>
            <div class="gallery" id="missing-gallery">
                ${this.renderGalleryItems(this.dummyMissing, 'missing')}
            </div>
        `;
        return container;
    }

    renderFoundPersons() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 2rem 0;">
                <h2>Found Persons</h2>
                <select onchange="app.filterGallery('found', this.value)" style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ddd;">
                    <option value="all">All States</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Ogun">Ogun</option>
                </select>
            </div>
            <div class="gallery" id="found-gallery">
                ${this.renderGalleryItems(this.dummyFound, 'found')}
            </div>
        `;
        return container;
    }

    renderGalleryItems(data, type) {
        return data.map(p => `
            <div class="gallery-item card">
                ${p.photo ? `<img src="${p.photo}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;">` : `<div style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 3rem;">👤</div>`}
                <div class="gallery-content" style="padding: 1rem;">
                    <h3>${p.name || (p.identified ? 'Identified' : 'Unidentified')}</h3>
                    <p>${p.description}</p>
                    <p style="font-size: 0.8rem; color: #888; margin-top: 0.5rem;">📍 ${p.lastSeenLocation || p.state} | 📅 ${p.date}</p>
                    <div style="margin-top: 1rem; display: grid; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="app.contactReporter('${p.phoneNumber || p.reporterPhone}', ${p.showPhone || false})">Contact</button>
                        ${type === 'missing' ? `
                            <button class="btn btn-secondary" onclick="app.volunteerForCase(${p.id})">Volunteer</button>
                            <button class="btn btn-accent" onclick="app.navigate('report-found')">I Found Them</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterGallery(type, state) {
        const data = type === 'missing' ? this.dummyMissing : this.dummyFound;
        const filtered = state === 'all' ? data : data.filter(p => p.state === state);
        document.getElementById(`${type}-gallery`).innerHTML = this.renderGalleryItems(filtered, type);
    }

    contactReporter(phone, showPhone) {
        const whatsappBtn = `<button class="btn btn-primary" onclick="window.open('https://wa.me/${phone}', '_blank')">WhatsApp Reporter</button>`;
        const adminWhatsAppBtn = `<button class="btn btn-primary" onclick="window.open('https://wa.me/${this.adminWhatsApp}', '_blank')">WhatsApp Admin</button>`;
        const adminEmailBtn = `<button class="btn btn-secondary" onclick="window.location.href='mailto:${this.adminEmail}'">Email Admin</button>`;

        const modal = document.createElement('div');
        modal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;";
        modal.innerHTML = `
            <div class="card" style="max-width: 400px; width: 90%; text-align: center;">
                <h3>Contact Information</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
                    ${(showPhone && phone) ? whatsappBtn : ''}
                    ${adminWhatsAppBtn}
                    ${adminEmailBtn}
                    <button class="btn btn-sm btn-accent" onclick="this.closest('div.card').parentElement.remove()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    renderReportMissing() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <div class="card" style="max-width: 600px; margin: 2rem auto;">
                <h2>Report Missing Person</h2>
                <form onsubmit="app.submitReport(event, 'missing')" style="margin-top: 2rem;">
                    <div class="form-group"><label>Full Name *</label><input type="text" name="name" required></div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group"><label>Age *</label><input type="number" name="age" required></div>
                        <div class="form-group"><label>Gender *</label><select name="gender" required><option value="Male">Male</option><option value="Female">Female</option></select></div>
                    </div>
                    <div class="form-group"><label>State *</label><select name="state" required><option value="Lagos">Lagos</option><option value="Ogun">Ogun</option></select></div>
                    <div class="form-group"><label>Last Seen Location *</label><input type="text" name="location" required></div>
                    <div class="form-group"><label>Description *</label><textarea name="desc" required></textarea></div>
                    <div class="form-group"><label>Photo</label><input type="file" onchange="app.handleImage(event)" accept="image/*"></div>
                    <div class="form-group"><label>WhatsApp Number</label><input type="tel" name="phone"></div>
                    <div class="form-group"><label><input type="checkbox" name="showPhone" checked> Show my phone number publicly</label></div>
                    <div class="form-group"><label>Police Case Number (Optional)</label><input type="text" name="police_case"></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">${this.user?.role === 'admin' ? 'Publish Now' : 'Submit Report'}</button>
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
                    <div class="form-group"><label>State *</label><select name="state" required><option value="Lagos">Lagos</option><option value="Ogun">Ogun</option></select></div>
                    <div class="form-group"><label>Photo</label><input type="file" onchange="app.handleImage(event)" accept="image/*"></div>
                    <div class="form-group"><label>Your WhatsApp Number</label><input type="tel" name="phone"></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Report</button>
                </form>
            </div>`;
        return container;
    }

    handleImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => { this.lastUploadedImage = reader.result; };
        if (file) reader.readAsDataURL(file);
    }

    submitReport(e, type) {
        e.preventDefault();
        const f = e.target;
        const r = {
            id: Date.now(),
            type,
            name: f.name?.value || 'Unidentified',
            age: f.age?.value || null,
            gender: f.gender?.value || null,
            state: f.state.value,
            lastSeenLocation: f.location?.value || f.state.value,
            description: f.desc.value,
            phoneNumber: f.phone?.value || null,
            reporterPhone: f.phone?.value || null,
            showPhone: f.showPhone?.checked || false,
            police_case: f.police_case?.value || null,
            photo: this.lastUploadedImage || null,
            reporterEmail: this.user?.email || null,
            date: new Date().toISOString().split('T')[0]
        };
        if (this.user?.role === 'admin') {
            if (type === 'missing') this.dummyMissing.unshift(r);
            else this.dummyFound.unshift(r);
        } else this.pendingReports.push(r);
        this.saveData(); this.navigate(type === 'missing' ? 'missing-persons' : 'found-persons');
    }

    deleteReport(id) {
        if (confirm('Delete this report?')) {
            this.dummyMissing = this.dummyMissing.filter(m => m.id !== id);
            this.dummyFound = this.dummyFound.filter(f => f.id !== id);
            this.saveData(); this.render();
        }
    }

    renderVolunteer() {
        const container = document.createElement('div');
        container.className = 'container';
        const isVolunteer = this.volunteers.find(v => v.email === this.user?.email);
        
        if (isVolunteer) {
            container.innerHTML = `
                <div class="card" style="max-width: 500px; margin: 4rem auto; text-align: center;">
                    <div style="font-size: 3rem;">${isVolunteer.status === 'approved' ? '✅' : '⏳'}</div>
                    <h3>Status: ${isVolunteer.status.toUpperCase()}</h3>
                    <p style="margin-top: 1rem;">${isVolunteer.status === 'approved' ? 'You are an approved volunteer!' : 'Your application is pending review.'}</p>
                    <button class="btn btn-primary" onclick="app.navigate('dashboard')" style="margin-top: 1rem; width: 100%;">Go to Dashboard</button>
                </div>`;
        } else {
            container.innerHTML = `
                <div class="card" style="max-width: 500px; margin: 2rem auto;">
                    <h2>Volunteer Application</h2>
                    <form onsubmit="app.submitVolunteer(event)" style="margin-top: 2rem;">
                        <div class="form-group"><label>Full Name</label><input type="text" name="name" value="${this.user?.name || ''}" required></div>
                        <div class="form-group"><label>Email</label><input type="email" name="email" value="${this.user?.email || ''}" required></div>
                        <div class="form-group"><label>Residency Address *</label><input type="text" name="address" required placeholder="Full home address"></div>
                        <div class="form-group"><label>WhatsApp Number</label><input type="tel" name="phone" required></div>
                        <div class="form-group"><label>Why do you want to help?</label><textarea name="reason" required></textarea></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Application</button>
                    </form>
                </div>`;
        }
        return container;
    }

    submitVolunteer(e) {
        e.preventDefault();
        const f = e.target;
        this.volunteers.push({ name: f.name.value, email: f.email.value, address: f.address.value, phone: f.phone.value, reason: f.reason.value, status: 'pending' });
        this.saveData(); alert('Application Submitted!'); this.navigate('dashboard');
    }

    volunteerForCase(id) {
        if (!this.user) return this.navigate('login');
        if (this.user.role !== 'volunteer') {
            if (confirm('Only volunteers can pick cases. Become a volunteer?')) this.navigate('volunteer');
            return;
        }
        const v = this.volunteers.find(v => v.email === this.user.email);
        if (!v || v.status !== 'approved') return alert('Your volunteer application is still pending approval.');
        
        if (!this.assignedCases[this.user.email]) this.assignedCases[this.user.email] = [];
        if (!this.assignedCases[this.user.email].includes(id)) {
            this.assignedCases[this.user.email].push(id);
            this.saveData(); alert('Case assigned!'); this.render();
        }
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
        const acc = this.accounts.find(a => a.email === this.user.email);
        if (acc) acc.name = this.user.name;
        this.saveData(); alert('Profile Updated!'); this.render();
    }

    createFooter() {
        const f = document.createElement('footer');
        f.style = "background: #1d3557; color: white; padding: 4rem 0 2rem; margin-top: 4rem;";
        f.innerHTML = `
            <div class="container">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
                    <div>
                        <h3>FindOurOwn</h3>
                        <p style="opacity: 0.8; margin-top: 1rem;">Dedicated to reuniting families in Lagos and Ogun States.</p>
                    </div>
                    <div>
                        <h4>Quick Links</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                            <a href="javascript:void(0)" onclick="app.navigate('missing-persons')" style="color: white; opacity: 0.8;">Missing Persons</a>
                            <a href="javascript:void(0)" onclick="app.navigate('found-persons')" style="color: white; opacity: 0.8;">Found Persons</a>
                            <a href="javascript:void(0)" onclick="app.navigate('volunteer')" style="color: white; opacity: 0.8;">Volunteer</a>
                        </div>
                    </div>
                    <div>
                        <h4>Support</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                            <a href="mailto:${this.adminEmail}" style="color: white; opacity: 0.8;">Contact Us</a>
                            <a href="javascript:void(0)" style="color: white; opacity: 0.8;">Privacy Policy</a>
                            <a href="javascript:void(0)" style="color: white; opacity: 0.8;">Terms of Service</a>
                        </div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 3rem; opacity: 0.5; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                    © 2026 FindOurOwn. All rights reserved.
                </div>
            </div>
        `;
        return f;
    }
}

const app = new FindOurOwnApp();
