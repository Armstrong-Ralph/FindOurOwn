// FindOurOwn - Dedicated Role-Based Login Experience
class FindOurOwnApp {
    constructor() {
        this.currentPage = 'home';
        this.loginType = null; // 'user', 'volunteer', 'admin'
        this.user = null;
        this.mobileMenuOpen = false;
        this.logoutMessage = false;
        this.googleClientId = '139219211717-ung2bd9htrvq7afu8drjlffv78usi74s.apps.googleusercontent.com';
        
        this.accounts = [
            { email: 'admin@findourown.org', password: 'password123', name: 'Admin User', role: 'admin' },
            { email: 'user@findourown.org', password: 'password123', name: 'Standard User', role: 'user' },
            { email: 'volunteer@findourown.org', password: 'password123', name: 'Active Volunteer', role: 'volunteer' }
        ];

        this.initData();
        this.init();
    }

    initData() {
        const savedMissing = localStorage.getItem('findourown_missing');
        const savedFound = localStorage.getItem('findourown_found');
        const savedPending = localStorage.getItem('findourown_pending');
        const savedVolunteers = localStorage.getItem('findourown_volunteers');
        const savedAssignedCases = localStorage.getItem('findourown_assigned_cases');

        this.dummyMissing = savedMissing ? JSON.parse(savedMissing) : [
            { id: 1, name: 'Chidi Okafor', age: 12, gender: 'Male', state: 'Lagos', lastSeenLocation: 'Ikeja Along', description: 'Last seen wearing a blue school uniform.', phoneNumber: '2348012345678' },
            { id: 2, name: 'Amina Bello', age: 24, gender: 'Female', state: 'Ogun', lastSeenLocation: 'Mowe Bus Stop', description: 'Fair complexion, wearing a green hijab.', phoneNumber: '2348123456789' }
        ];

        this.dummyFound = savedFound ? JSON.parse(savedFound) : [
            { id: 101, description: 'Young boy found near Ojota.', currentLocation: 'Ojota Police Station', state: 'Lagos', identified: false, reporterPhone: '2348011112222' }
        ];

        this.pendingReports = savedPending ? JSON.parse(savedPending) : [];
        this.volunteers = savedVolunteers ? JSON.parse(savedVolunteers) : [
            { name: 'Active Volunteer', email: 'volunteer@findourown.org', phone: '2348000000000', state: 'Lagos', status: 'approved' }
        ];
        this.assignedCases = savedAssignedCases ? JSON.parse(savedAssignedCases) : {};
    }

    saveData() {
        localStorage.setItem('findourown_missing', JSON.stringify(this.dummyMissing));
        localStorage.setItem('findourown_found', JSON.stringify(this.dummyFound));
        localStorage.setItem('findourown_pending', JSON.stringify(this.pendingReports));
        localStorage.setItem('findourown_volunteers', JSON.stringify(this.volunteers));
        localStorage.setItem('findourown_assigned_cases', JSON.stringify(this.assignedCases));
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
        if (page !== 'login') this.loginType = null;
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

        if (this.currentPage === 'login' && this.loginType && this.loginType !== 'admin') {
            this.initGoogleSignIn();
        }

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
        const approvedVolunteers = this.volunteers.filter(v => v.status === 'approved').length;
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
                    <div class="stat"><div class="stat-number">${124 + approvedVolunteers}</div><div class="stat-label">Volunteers</div></div>
                    <div class="stat"><div class="stat-number">2</div><div class="stat-label">States</div></div>
                </div>
            </div>
        `;
        return section;
    }

    renderVolunteer() {
        const section = document.createElement('section');
        const isVolunteer = this.volunteers.find(v => v.email === this.user?.email);
        
        if (isVolunteer) {
            section.innerHTML = `
                <div class="container">
                    <h2>Volunteer Status</h2>
                    <div class="card" style="max-width: 500px; margin: 2rem auto; text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">${isVolunteer.status === 'approved' ? '✅' : '⏳'}</div>
                        <h3>Status: ${isVolunteer.status.charAt(0).toUpperCase() + isVolunteer.status.slice(1)}</h3>
                        <p style="margin-top: 1rem;">${isVolunteer.status === 'approved' ? 'You are an approved volunteer! You can now pick cases to help with.' : 'Your application is being reviewed by an admin.'}</p>
                        <button class="btn btn-primary" onclick="app.navigate('dashboard')" style="margin-top: 1.5rem;">Go to Dashboard</button>
                    </div>
                </div>
            `;
        } else {
            section.innerHTML = `
                <div class="container">
                    <h2>Become a Volunteer</h2>
                    <div class="card" style="max-width: 500px; margin: 2rem auto;">
                        <form onsubmit="app.submitVolunteer(event)">
                            <div class="form-group"><label>Full Name *</label><input type="text" name="name" value="${this.user?.name || ''}" required></div>
                            <div class="form-group"><label>Email *</label><input type="email" name="email" value="${this.user?.email || ''}" required></div>
                            <div class="form-group"><label>WhatsApp Number *</label><input type="tel" name="phone" required></div>
                            <div class="form-group"><label>State *</label><select name="state" required><option value="Lagos">Lagos</option><option value="Ogun">Ogun</option></select></div>
                            <div class="form-group"><label>Why do you want to help? *</label><textarea name="reason" required></textarea></div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Application</button>
                        </form>
                    </div>
                </div>
            `;
        }
        return section;
    }

    submitVolunteer(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        if (this.volunteers.find(v => v.email === email)) {
            alert('You have already applied!');
            return;
        }
        this.volunteers.push({
            id: Date.now(),
            name: formData.get('name'),
            email: email,
            phone: formData.get('phone'),
            state: formData.get('state'),
            reason: formData.get('reason'),
            status: 'pending'
        });
        this.saveData();
        alert('Application submitted! An admin will review it shortly.');
        this.render();
    }

    renderLogin() {
        const section = document.createElement('section');
        const container = document.createElement('div');
        container.className = 'container';
        
        if (!this.loginType) {
            container.innerHTML = `
                <div class="card" style="max-width: 500px; margin: 2rem auto;">
                    <h2 style="text-align: center; margin-bottom: 2rem;">Select Login Type</h2>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <button class="btn btn-primary" onclick="app.setLoginType('user')" style="width: 100%; padding: 1.5rem;">👤 Login as User</button>
                        <button class="btn btn-secondary" onclick="app.setLoginType('volunteer')" style="width: 100%; padding: 1.5rem;">🤝 Login as Volunteer</button>
                        <button class="btn btn-accent" onclick="app.setLoginType('admin')" style="width: 100%; padding: 1.5rem;">🛡️ Login as Admin</button>
                    </div>
                </div>
            `;
        } else {
            const title = this.loginType.charAt(0).toUpperCase() + this.loginType.slice(1);
            container.innerHTML = `
                <div class="card" style="max-width: 500px; margin: 2rem auto;">
                    <button class="btn btn-sm" onclick="app.setLoginType(null)" style="margin-bottom: 1rem;">← Back</button>
                    <h2 style="text-align: center; margin-bottom: 2rem;">${title} Login</h2>
                    
                    <form onsubmit="app.handleLogin(event)">
                        <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
                        <div class="form-group"><label>Password</label><input type="password" name="password" required></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                    </form>

                    ${this.loginType !== 'admin' ? `
                        <div style="margin: 2rem 0; text-align: center; color: #666; position: relative;">
                            <hr style="border: 0; border-top: 1px solid #eee;">
                            <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #fff; padding: 0 10px;">OR</span>
                        </div>
                        <div id="google-signin-button" style="display: flex; justify-content: center;"></div>
                    ` : ''}
                </div>
            `;
        }
        
        section.appendChild(container);
        return section;
    }

    setLoginType(type) {
        this.loginType = type;
        this.render();
    }

    initGoogleSignIn() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: this.googleClientId,
                callback: this.handleGoogleResponse.bind(this)
            });
            google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: "outline", size: "large", width: "100%" }
            );
        } else {
            setTimeout(() => this.initGoogleSignIn(), 100);
        }
    }

    handleGoogleResponse(response) {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        this.user = {
            email: payload.email,
            name: payload.name,
            role: this.loginType || 'user',
            picture: payload.picture
        };
        this.navigate('dashboard');
    }

    handleLogin(event) {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const account = this.accounts.find(a => a.email === email && a.password === password);
        
        if (account && account.role === this.loginType) {
            this.user = account;
            this.navigate('dashboard');
        } else if (account) {
            alert(`This account is registered as a ${account.role}. Please login through the ${account.role} portal.`);
        } else {
            alert('Invalid credentials.');
        }
    }

    logout() {
        this.user = null;
        this.loginType = null;
        this.logoutMessage = true;
        this.navigate('home');
    }

    renderMissingPersons() {
        const section = document.createElement('section');
        section.innerHTML = `<div class="container"><h2>Missing Persons</h2><div id="gallery" class="gallery"></div></div>`;
        setTimeout(() => {
            const gallery = document.getElementById('gallery');
            this.dummyMissing.forEach(person => {
                const isAssigned = this.user && this.assignedCases[this.user.email]?.includes(person.id);
                const card = document.createElement('div');
                card.className = 'gallery-item';
                card.innerHTML = `
                    <div style="background-color: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">👤</div>
                    <div class="gallery-content">
                        <h3 class="gallery-title">${person.name}</h3>
                        <div class="gallery-meta">Age: ${person.age} | ${person.state}</div>
                        <p class="gallery-description">${person.description}</p>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                            <button class="btn btn-accent" style="width: 100%;" onclick="app.openWhatsApp('${person.phoneNumber}', 'Hello, I have info regarding ${person.name}')">Contact via WhatsApp</button>
                            <button class="btn ${isAssigned ? 'btn-secondary' : 'btn-primary'}" style="width: 100%;" onclick="app.volunteerForCase(${person.id}, 'missing')">
                                ${isAssigned ? '✅ You are helping' : 'Volunteer for this case'}
                            </button>
                        </div>
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
                const isAssigned = this.user && this.assignedCases[this.user.email]?.includes(person.id);
                const card = document.createElement('div');
                card.className = 'gallery-item' + (person.identified ? ' identified' : '');
                card.innerHTML = `
                    <div style="background-color: ${person.identified ? '#d4edda' : '#e8f4fd'}; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">${person.identified ? '✅' : '🔍'}</div>
                    <div class="gallery-content">
                        <h3 class="gallery-title">${person.identified ? 'Identified: ' + person.identifiedName : 'Unidentified Person'}</h3>
                        <p class="gallery-description">${person.description}</p>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                            <button class="btn btn-primary" style="width: 100%;" onclick="app.openWhatsApp('${person.reporterPhone}', 'Hello, I think I know the person found at ${person.currentLocation}')">Contact Finder</button>
                            <button class="btn ${isAssigned ? 'btn-secondary' : 'btn-primary'}" style="width: 100%;" onclick="app.volunteerForCase(${person.id}, 'found')">
                                ${isAssigned ? '✅ You are helping' : 'Volunteer for this case'}
                            </button>
                        </div>
                    </div>
                `;
                gallery.appendChild(card);
            });
        }, 0);
        return section;
    }

    volunteerForCase(id, type) {
        if (!this.user) {
            alert('Please login to volunteer for cases.');
            this.navigate('login');
            return;
        }
        const volunteer = this.volunteers.find(v => v.email === this.user.email);
        if (!volunteer || volunteer.status !== 'approved') {
            alert('You must be an approved volunteer to pick cases. Please apply first!');
            this.navigate('volunteer');
            return;
        }

        if (!this.assignedCases[this.user.email]) this.assignedCases[this.user.email] = [];
        if (this.assignedCases[this.user.email].includes(id)) {
            alert('You are already helping with this case!');
            return;
        }

        this.assignedCases[this.user.email].push(id);
        this.saveData();
        alert('Thank you! This case has been added to your dashboard.');
        this.render();
    }

    openWhatsApp(phone, message) {
        window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    }

    renderAdmin() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Admin Dashboard</h2>
                <div style="margin-top: 2rem;">
                    <h3>Pending Reports (${this.pendingReports.length})</h3>
                    <div id="pending-reports-list"></div>
                    
                    <h3 style="margin-top: 3rem;">Volunteer Applications (${this.volunteers.filter(v => v.status === 'pending').length})</h3>
                    <div id="pending-volunteers-list"></div>
                </div>
            </div>
        `;
        setTimeout(() => {
            const reportList = document.getElementById('pending-reports-list');
            this.pendingReports.forEach((report, index) => {
                const card = document.createElement('div');
                card.className = 'card'; card.style.marginBottom = '1rem';
                card.innerHTML = `<h3>${report.name} (${report.type})</h3><p>${report.description}</p><div style="margin-top: 1rem; display: flex; gap: 1rem;"><button class="btn btn-primary" onclick="app.approveReport(${index})">Approve</button><button class="btn btn-accent" onclick="app.rejectReport(${index})">Reject</button></div>`;
                reportList.appendChild(card);
            });

            const volList = document.getElementById('pending-volunteers-list');
            this.volunteers.filter(v => v.status === 'pending').forEach((vol) => {
                const card = document.createElement('div');
                card.className = 'card'; card.style.marginBottom = '1rem';
                card.innerHTML = `<h3>${vol.name} (${vol.state})</h3><p><strong>Reason:</strong> ${vol.reason}</p><div style="margin-top: 1rem; display: flex; gap: 1rem;"><button class="btn btn-primary" onclick="app.approveVolunteer('${vol.email}')">Approve Volunteer</button><button class="btn btn-accent" onclick="app.rejectVolunteer('${vol.email}')">Reject</button></div>`;
                volList.appendChild(card);
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

    approveVolunteer(email) {
        const vol = this.volunteers.find(v => v.email === email);
        if (vol) vol.status = 'approved';
        this.saveData(); this.render();
    }

    renderDashboard() {
        const section = document.createElement('section');
        const volunteer = this.volunteers.find(v => v.email === this.user.email);
        const myCases = this.assignedCases[this.user.email] || [];
        
        section.innerHTML = `
            <div class="container">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h2>Welcome, ${this.user.name}</h2>
                    <div style="color: #666; font-size: 0.9rem;">Logged in as: <span class="badge" style="background: #e8f4fd; color: #004a99; padding: 2px 8px; border-radius: 4px;">${this.user.role.toUpperCase()}</span></div>
                </div>

                ${this.user.role === 'volunteer' ? `
                    <div class="card" style="margin-bottom: 2rem;">
                        <h3>Volunteer Statistics</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold;">${myCases.length}</div>
                                <div style="font-size: 0.8rem; color: #666;">Active Cases</div>
                            </div>
                            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold;">0</div>
                                <div style="font-size: 0.8rem; color: #666;">Cases Resolved</div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <div class="card" style="max-width: 500px; margin: 0 auto;">
                    <h3 style="margin-bottom: 1.5rem;">Quick Actions</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <button class="btn btn-primary" onclick="app.navigate('report-missing')" style="width: 100%;">Report Missing</button>
                        <button class="btn btn-secondary" onclick="app.navigate('report-found')" style="width: 100%;">Report Found</button>
                        ${this.user.role === 'volunteer' ? '' : `<button class="btn btn-accent" onclick="app.navigate('volunteer')" style="width: 100%;">Volunteer Status</button>`}
                    </div>
                </div>

                ${this.user.role === 'volunteer' ? `
                    <div style="margin-top: 3rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                            <h3>Your Active Cases</h3>
                            <button class="btn btn-accent btn-sm" onclick="app.navigate('missing-persons')">+ Find New Case</button>
                        </div>
                        <div id="active-cases-gallery" class="gallery">
                            ${myCases.length === 0 ? '<p style="text-align: center; color: #666; grid-column: 1/-1; padding: 2rem;">You haven\'t picked any cases yet. Go to the gallery to help!</p>' : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        if (this.user.role === 'volunteer' && myCases.length > 0) {
            setTimeout(() => {
                const gallery = document.getElementById('active-cases-gallery');
                myCases.forEach(caseId => {
                    const person = this.dummyMissing.find(m => m.id === caseId) || this.dummyFound.find(f => f.id === caseId);
                    if (person) {
                        const card = document.createElement('div');
                        card.className = 'gallery-item';
                        card.innerHTML = `
                            <div style="background-color: #f0f0f0; height: 150px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">👤</div>
                            <div class="gallery-content">
                                <h4 class="gallery-title">${person.name || 'Unidentified'}</h4>
                                <p style="font-size: 0.8rem; color: #666; margin-bottom: 0.5rem;">${person.state} | ${person.lastSeenLocation || person.currentLocation}</p>
                                <button class="btn btn-accent btn-sm" style="width: 100%;" onclick="app.openWhatsApp('${person.phoneNumber || person.reporterPhone}', 'Update on case: ${person.name || 'Unidentified'}')">Send Update</button>
                            </div>
                        `;
                        gallery.appendChild(card);
                    }
                });
            }, 0);
        }
        return section;
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

    createFooter() {
        const footer = document.createElement('footer');
        footer.innerHTML = `<div class="container" style="text-align: center;"><p>&copy; 2026 FindOurOwn. All rights reserved.</p></div>`;
        return footer;
    }
}

const app = new FindOurOwnApp();
