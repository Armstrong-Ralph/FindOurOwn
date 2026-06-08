// FindOurOwn - Complete Enhanced Application
class FindOurOwnApp {
    constructor() {
        this.currentPage = 'home';
        this.user = null;
        this.userRole = null;
        this.mobileMenuOpen = false;
        this.adminEmail = 'olaribigbea0389@student.babcock.edu.ng';
        this.adminWhatsApp = '+2347076864421';
        this.init();
    }

    init() {
        this.setupViewport();
        this.setupTouchHandlers();
        this.loadUserFromStorage();
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
        // Touch handlers for mobile responsiveness
        document.addEventListener('touchstart', (e) => {
            const btn = e.target.closest('.btn') || e.target.closest('a');
            if (btn) {
                btn.style.transform = 'scale(0.98)';
                btn.style.opacity = '0.9';
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const btn = e.target.closest('.btn') || e.target.closest('a');
            if (btn) {
                btn.style.transform = 'scale(1)';
                btn.style.opacity = '1';
            }
        }, { passive: true });
    }

    loadUserFromStorage() {
        const storedUser = localStorage.getItem('findourownUser');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
            this.userRole = this.user.role;
        }
    }

    saveUserToStorage() {
        if (this.user) {
            localStorage.setItem('findourownUser', JSON.stringify(this.user));
        }
    }

    navigate(page) {
        this.currentPage = page;
        window.scrollTo(0, 0);
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = '';

        // Add Navigation
        app.appendChild(this.createNav());

        // Add Page Content
        let content;
        switch (this.currentPage) {
            case 'home':
                content = this.renderHome();
                break;
            case 'report-missing':
                content = this.renderReportMissing();
                break;
            case 'report-found':
                content = this.renderReportFound();
                break;
            case 'missing-persons':
                content = this.renderMissingPersons();
                break;
            case 'found-persons':
                content = this.renderFoundPersons();
                break;
            case 'dashboard':
                content = this.renderDashboard();
                break;
            case 'admin':
                content = this.renderAdmin();
                break;
            case 'volunteer':
                content = this.renderVolunteer();
                break;
            case 'messages':
                content = this.renderMessages();
                break;
            case 'login':
                content = this.renderLogin();
                break;
            default:
                content = this.renderHome();
        }

        app.appendChild(content);

        // Add Footer
        app.appendChild(this.createFooter());
    }

    createNav() {
        const nav = document.createElement('nav');
        nav.innerHTML = `
            <div class="container">
                <a href="#" class="logo" onclick="app.navigate('home'); return false;">
                    <div class="logo-icon">❤️</div>
                    <span>FindOurOwn</span>
                </a>
                <ul>
                    <li><a href="#" onclick="app.navigate('missing-persons'); return false;">Missing</a></li>
                    <li><a href="#" onclick="app.navigate('found-persons'); return false;">Found</a></li>
                    <li><a href="#" onclick="app.navigate('report-missing'); return false;">Report</a></li>
                    ${this.user ? `
                        <li><a href="#" onclick="app.navigate('dashboard'); return false;">Dashboard</a></li>
                        <li><a href="#" onclick="app.navigate('messages'); return false;">Messages</a></li>
                        ${this.userRole === 'admin' ? `<li><a href="#" onclick="app.navigate('admin'); return false;">Admin</a></li>` : ''}
                        ${this.userRole === 'volunteer' ? `<li><a href="#" onclick="app.navigate('volunteer'); return false;">Volunteer</a></li>` : ''}
                        <li><a href="#" onclick="app.logout(); return false;">Logout (${this.user.name})</a></li>
                    ` : `
                        <li><a href="#" onclick="app.navigate('login'); return false;" class="btn btn-primary">Login</a></li>
                    `}
                </ul>
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
                        <div class="stat-number" id="active-reports">0</div>
                        <div class="stat-label">Active Reports</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" id="volunteers-count">0</div>
                        <div class="stat-label">Volunteers Helping</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">2</div>
                        <div class="stat-label">States Covered</div>
                    </div>
                </div>
            </div>
        `;

        // Load stats after render
        setTimeout(() => this.loadStats(), 100);

        return section;
    }

    loadStats() {
        const reports = this.getAllReports();
        const volunteers = this.getAllVolunteers();
        const activeReportsEl = document.getElementById('active-reports');
        const volunteersEl = document.getElementById('volunteers-count');

        if (activeReportsEl) activeReportsEl.textContent = reports.length;
        if (volunteersEl) volunteersEl.textContent = volunteers.length;
    }

    renderLogin() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <div class="card" style="max-width: 500px; margin: 3rem auto;">
                    <h2>Login / Sign Up</h2>
                    <form id="login-form" onsubmit="app.handleLogin(event)">
                        <div class="form-group">
                            <label>Full Name *</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Phone Number *</label>
                            <input type="tel" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label>Role *</label>
                            <select name="role" required>
                                <option value="">Select Role</option>
                                <option value="user">Missing Person Reporter</option>
                                <option value="volunteer">Volunteer Helper</option>
                            </select>
                        </div>
                        <div id="volunteer-fields" style="display: none;">
                            <div class="form-group">
                                <label>Residency Address *</label>
                                <textarea name="residencyAddress" placeholder="Your full residential address"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Availability *</label>
                                <select name="availability">
                                    <option value="">Select Availability</option>
                                    <option value="weekdays">Weekdays</option>
                                    <option value="weekends">Weekends</option>
                                    <option value="anytime">Anytime</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Login / Sign Up</button>
                    </form>
                </div>
            </div>
        `;

        // Show/hide volunteer fields based on role selection
        setTimeout(() => {
            const roleSelect = document.querySelector('select[name="role"]');
            const volunteerFields = document.getElementById('volunteer-fields');
            if (roleSelect) {
                roleSelect.addEventListener('change', (e) => {
                    volunteerFields.style.display = e.target.value === 'volunteer' ? 'block' : 'none';
                });
            }
        }, 100);

        return section;
    }

    handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const user = {
            id: Date.now().toString(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            role: formData.get('role'),
            residencyAddress: formData.get('residencyAddress') || null,
            availability: formData.get('availability') || null,
            createdAt: new Date().toISOString()
        };

        this.user = user;
        this.userRole = user.role;
        this.saveUserToStorage();

        alert(`Welcome, ${user.name}! You're logged in as a ${user.role === 'volunteer' ? 'Volunteer' : 'Reporter'}.`);
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
                            <input type="number" name="age" min="1" max="120" required>
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
                            <input type="text" name="lastSeenLocation" placeholder="e.g., Lekki Phase 1, Lagos" required>
                        </div>
                        <div class="form-group">
                            <label>Description *</label>
                            <textarea name="description" placeholder="Physical description, clothing, distinguishing marks, etc." required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Photo</label>
                            <input type="file" name="photo" accept="image/*" id="photo-input">
                            <small>Upload a clear photo of the missing person</small>
                        </div>
                        <div class="form-group">
                            <label>Your Phone Number</label>
                            <input type="tel" name="phoneNumber">
                        </div>
                        <div class="form-group checkbox">
                            <label>
                                <input type="checkbox" name="showPhone"> Show my phone number publicly
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Police Case Number (Optional)</label>
                            <input type="text" name="policeCaseNumber" placeholder="If you have filed a police report">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Submit Report</button>
                    </form>
                </div>
            </div>
        `;
        return section;
    }

    submitReport(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const fileInput = document.getElementById('photo-input');
        let photoBase64 = null;

        if (fileInput && fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoBase64 = e.target.result;
                this.saveReport(formData, photoBase64);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            this.saveReport(formData, null);
        }
    }

    saveReport(formData, photoBase64) {
        const report = {
            id: Date.now().toString(),
            name: formData.get('name'),
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            state: formData.get('state'),
            lastSeenLocation: formData.get('lastSeenLocation'),
            description: formData.get('description'),
            phoneNumber: formData.get('phoneNumber'),
            showPhonePublicly: formData.get('showPhone') ? true : false,
            policeCaseNumber: formData.get('policeCaseNumber') || null,
            photoBase64: photoBase64,
            reporterId: this.user ? this.user.id : null,
            reporterName: this.user ? this.user.name : 'Anonymous',
            type: 'missing',
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        let reports = JSON.parse(localStorage.getItem('findourownReports') || '[]');
        reports.push(report);
        localStorage.setItem('findourownReports', JSON.stringify(reports));

        alert('Report submitted successfully! It will be reviewed by our admin team.');
        this.navigate('missing-persons');
    }

    renderReportFound() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Report Found Person</h2>
                <div class="card" style="max-width: 600px; margin: 2rem auto;">
                    <form id="found-form" onsubmit="app.submitFoundReport(event)">
                        <div class="form-group">
                            <label>Description *</label>
                            <textarea name="description" placeholder="Physical description, clothing, location details, etc." required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Current Location *</label>
                            <input type="text" name="currentLocation" placeholder="Where you found this person" required>
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
                            <label>Photo</label>
                            <input type="file" name="photo" accept="image/*" id="found-photo-input">
                        </div>
                        <div class="form-group">
                            <label>Your Contact Information</label>
                            <input type="tel" name="phoneNumber" placeholder="Your phone number">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Submit Report</button>
                    </form>
                </div>
            </div>
        `;
        return section;
    }

    submitFoundReport(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const fileInput = document.getElementById('found-photo-input');
        let photoBase64 = null;

        if (fileInput && fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoBase64 = e.target.result;
                this.saveFoundReport(formData, photoBase64);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            this.saveFoundReport(formData, null);
        }
    }

    saveFoundReport(formData, photoBase64) {
        const report = {
            id: Date.now().toString(),
            description: formData.get('description'),
            currentLocation: formData.get('currentLocation'),
            state: formData.get('state'),
            photoBase64: photoBase64,
            reporterContact: formData.get('phoneNumber'),
            reporterId: this.user ? this.user.id : null,
            reporterName: this.user ? this.user.name : 'Anonymous',
            type: 'found',
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        let reports = JSON.parse(localStorage.getItem('findourownReports') || '[]');
        reports.push(report);
        localStorage.setItem('findourownReports', JSON.stringify(reports));

        alert('Found person report submitted successfully!');
        this.navigate('found-persons');
    }

    getAllReports() {
        return JSON.parse(localStorage.getItem('findourownReports') || '[]');
    }

    getAllVolunteers() {
        const users = JSON.parse(localStorage.getItem('findourownUsers') || '[]');
        return users.filter(u => u.role === 'volunteer');
    }

    renderMissingPersons() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Missing Persons</h2>
                <div class="filter-bar">
                    <input type="text" id="search-missing" placeholder="Search by name or location..." onkeyup="app.filterMissingPersons()">
                    <select id="state-filter" onchange="app.filterMissingPersons()">
                        <option value="">All States</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Ogun">Ogun</option>
                    </select>
                </div>
                <div class="gallery" id="missing-gallery"></div>
            </div>
        `;

        setTimeout(() => this.loadMissingPersons(), 100);
        return section;
    }

    loadMissingPersons() {
        const reports = this.getAllReports().filter(r => r.type === 'missing' && r.status === 'approved');
        const gallery = document.getElementById('missing-gallery');

        if (!gallery) return;

        gallery.innerHTML = '';

        if (reports.length === 0) {
            gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No missing persons reported yet.</p>';
            return;
        }

        reports.forEach(report => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <div class="gallery-item-image">
                    ${report.photoBase64 ? `<img src="${report.photoBase64}" alt="${report.name}">` : '👤'}
                </div>
                <div class="gallery-item-content">
                    <h3>${report.name}</h3>
                    <div class="gallery-item-meta">
                        <span class="badge">${report.age} years</span>
                        <span class="badge">${report.gender}</span>
                        <span class="badge badge-danger">Missing</span>
                    </div>
                    <p><strong>Last Seen:</strong> ${report.lastSeenLocation}</p>
                    <p><strong>Description:</strong> ${report.description.substring(0, 100)}...</p>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${report.showPhonePublicly && report.phoneNumber ? `
                            <a href="https://wa.me/${report.phoneNumber.replace(/\D/g, '')}" class="btn btn-sm btn-secondary" target="_blank">WhatsApp</a>
                        ` : `
                            <a href="mailto:${this.adminEmail}?subject=Inquiry about ${report.name}" class="btn btn-sm btn-secondary">Contact Admin</a>
                        `}
                        <button class="btn btn-sm btn-primary" onclick="app.viewReportDetails('${report.id}')">View Details</button>
                    </div>
                </div>
            `;
            gallery.appendChild(item);
        });
    }

    filterMissingPersons() {
        const searchTerm = (document.getElementById('search-missing')?.value || '').toLowerCase();
        const stateFilter = document.getElementById('state-filter')?.value || '';
        const reports = this.getAllReports().filter(r => r.type === 'missing' && r.status === 'approved');

        const filtered = reports.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(searchTerm) || r.lastSeenLocation.toLowerCase().includes(searchTerm);
            const matchesState = !stateFilter || r.state === stateFilter;
            return matchesSearch && matchesState;
        });

        const gallery = document.getElementById('missing-gallery');
        if (!gallery) return;

        gallery.innerHTML = '';

        if (filtered.length === 0) {
            gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No results found.</p>';
            return;
        }

        filtered.forEach(report => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <div class="gallery-item-image">
                    ${report.photoBase64 ? `<img src="${report.photoBase64}" alt="${report.name}">` : '👤'}
                </div>
                <div class="gallery-item-content">
                    <h3>${report.name}</h3>
                    <div class="gallery-item-meta">
                        <span class="badge">${report.age} years</span>
                        <span class="badge">${report.gender}</span>
                        <span class="badge badge-danger">Missing</span>
                    </div>
                    <p><strong>Last Seen:</strong> ${report.lastSeenLocation}</p>
                    <p><strong>Description:</strong> ${report.description.substring(0, 100)}...</p>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${report.showPhonePublicly && report.phoneNumber ? `
                            <a href="https://wa.me/${report.phoneNumber.replace(/\D/g, '')}" class="btn btn-sm btn-secondary" target="_blank">WhatsApp</a>
                        ` : `
                            <a href="mailto:${this.adminEmail}?subject=Inquiry about ${report.name}" class="btn btn-sm btn-secondary">Contact Admin</a>
                        `}
                        <button class="btn btn-sm btn-primary" onclick="app.viewReportDetails('${report.id}')">View Details</button>
                    </div>
                </div>
            `;
            gallery.appendChild(item);
        });
    }

    renderFoundPersons() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Found Persons</h2>
                <div class="filter-bar">
                    <input type="text" id="search-found" placeholder="Search by location..." onkeyup="app.filterFoundPersons()">
                    <select id="state-filter-found" onchange="app.filterFoundPersons()">
                        <option value="">All States</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Ogun">Ogun</option>
                    </select>
                </div>
                <div class="gallery" id="found-gallery"></div>
            </div>
        `;

        setTimeout(() => this.loadFoundPersons(), 100);
        return section;
    }

    loadFoundPersons() {
        const reports = this.getAllReports().filter(r => r.type === 'found' && r.status === 'approved');
        const gallery = document.getElementById('found-gallery');

        if (!gallery) return;

        gallery.innerHTML = '';

        if (reports.length === 0) {
            gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No found persons reported yet.</p>';
            return;
        }

        reports.forEach(report => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <div class="gallery-item-image">
                    ${report.photoBase64 ? `<img src="${report.photoBase64}" alt="Found person">` : '👤'}
                </div>
                <div class="gallery-item-content">
                    <h3>Found Person</h3>
                    <div class="gallery-item-meta">
                        <span class="badge badge-success">Found</span>
                    </div>
                    <p><strong>Location:</strong> ${report.currentLocation}</p>
                    <p><strong>Description:</strong> ${report.description.substring(0, 100)}...</p>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <a href="https://wa.me/${report.reporterContact?.replace(/\D/g, '')}" class="btn btn-sm btn-secondary" target="_blank">Contact Reporter</a>
                        <button class="btn btn-sm btn-primary" onclick="app.viewReportDetails('${report.id}')">View Details</button>
                    </div>
                </div>
            `;
            gallery.appendChild(item);
        });
    }

    filterFoundPersons() {
        const searchTerm = (document.getElementById('search-found')?.value || '').toLowerCase();
        const stateFilter = document.getElementById('state-filter-found')?.value || '';
        const reports = this.getAllReports().filter(r => r.type === 'found' && r.status === 'approved');

        const filtered = reports.filter(r => {
            const matchesSearch = r.currentLocation.toLowerCase().includes(searchTerm) || r.description.toLowerCase().includes(searchTerm);
            const matchesState = !stateFilter || r.state === stateFilter;
            return matchesSearch && matchesState;
        });

        const gallery = document.getElementById('found-gallery');
        if (!gallery) return;

        gallery.innerHTML = '';

        if (filtered.length === 0) {
            gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No results found.</p>';
            return;
        }

        filtered.forEach(report => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <div class="gallery-item-image">
                    ${report.photoBase64 ? `<img src="${report.photoBase64}" alt="Found person">` : '👤'}
                </div>
                <div class="gallery-item-content">
                    <h3>Found Person</h3>
                    <div class="gallery-item-meta">
                        <span class="badge badge-success">Found</span>
                    </div>
                    <p><strong>Location:</strong> ${report.currentLocation}</p>
                    <p><strong>Description:</strong> ${report.description.substring(0, 100)}...</p>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <a href="https://wa.me/${report.reporterContact?.replace(/\D/g, '')}" class="btn btn-sm btn-secondary" target="_blank">Contact Reporter</a>
                        <button class="btn btn-sm btn-primary" onclick="app.viewReportDetails('${report.id}')">View Details</button>
                    </div>
                </div>
            `;
            gallery.appendChild(item);
        });
    }

    viewReportDetails(reportId) {
        const reports = this.getAllReports();
        const report = reports.find(r => r.id === reportId);

        if (!report) {
            alert('Report not found');
            return;
        }

        let details = `
            <strong>${report.type === 'missing' ? 'Missing Person' : 'Found Person'}</strong>\n
        `;

        if (report.type === 'missing') {
            details += `
Name: ${report.name}
Age: ${report.age}
Gender: ${report.gender}
Last Seen: ${report.lastSeenLocation}
Description: ${report.description}
            `;
        } else {
            details += `
Location Found: ${report.currentLocation}
Description: ${report.description}
            `;
        }

        details += `\nReported by: ${report.reporterName}
Date: ${new Date(report.createdAt).toLocaleDateString()}
        `;

        alert(details);
    }

    renderDashboard() {
        if (!this.user) {
            return this.renderLoginRequired();
        }

        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>My Dashboard</h2>
                <div class="card">
                    <h3>My Profile</h3>
                    <p><strong>Name:</strong> ${this.user.name}</p>
                    <p><strong>Email:</strong> ${this.user.email}</p>
                    <p><strong>Phone:</strong> ${this.user.phone}</p>
                    <p><strong>Role:</strong> ${this.user.role === 'volunteer' ? 'Volunteer' : 'Reporter'}</p>
                    ${this.user.residencyAddress ? `<p><strong>Residency Address:</strong> ${this.user.residencyAddress}</p>` : ''}
                </div>
                <div class="card">
                    <h3>My Reports</h3>
                    <div id="user-reports"></div>
                </div>
            </div>
        `;

        setTimeout(() => this.loadUserReports(), 100);
        return section;
    }

    loadUserReports() {
        const reports = this.getAllReports().filter(r => r.reporterId === this.user.id);
        const container = document.getElementById('user-reports');

        if (!container) return;

        if (reports.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">You haven\'t submitted any reports yet.</p>';
            return;
        }

        container.innerHTML = '';

        reports.forEach(report => {
            const item = document.createElement('div');
            item.className = 'card';
            item.style.marginBottom = '1rem';
            item.innerHTML = `
                <h4>${report.type === 'missing' ? report.name : 'Found Person'}</h4>
                <p><strong>Status:</strong> <span class="badge ${report.status === 'approved' ? 'badge-success' : report.status === 'rejected' ? 'badge-danger' : 'badge-warning'}">${report.status}</span></p>
                <p><strong>Type:</strong> ${report.type === 'missing' ? 'Missing Person' : 'Found Person'}</p>
                <p><strong>Submitted:</strong> ${new Date(report.createdAt).toLocaleDateString()}</p>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn btn-secondary btn-sm" onclick="app.editReport('${report.id}')">Edit</button>
                    <button class="btn btn-accent btn-sm" onclick="app.deleteReport('${report.id}')">Delete</button>
                </div>
            `;
            container.appendChild(item);
        });
    }

    editReport(reportId) {
        const reports = this.getAllReports();
        const report = reports.find(r => r.id === reportId);

        if (!report) {
            alert('Report not found');
            return;
        }

        if (report.status !== 'pending') {
            alert('You can only edit pending reports');
            return;
        }

        // For simplicity, we'll just show the current details
        alert(`Edit Report:\n\nName: ${report.name}\nDescription: ${report.description}\n\nTo edit, please delete and resubmit.`);
    }

    deleteReport(reportId) {
        if (!confirm('Are you sure you want to delete this report?')) {
            return;
        }

        let reports = this.getAllReports();
        reports = reports.filter(r => r.id !== reportId);
        localStorage.setItem('findourownReports', JSON.stringify(reports));

        alert('Report deleted successfully');
        this.loadUserReports();
    }

    renderAdmin() {
        if (!this.user || this.userRole !== 'admin') {
            return this.renderLoginRequired();
        }

        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Admin Dashboard</h2>
                <div class="card">
                    <h3>Pending Reports</h3>
                    <div id="pending-reports"></div>
                </div>
            </div>
        `;

        setTimeout(() => this.loadPendingReports(), 100);
        return section;
    }

    loadPendingReports() {
        const reports = this.getAllReports().filter(r => r.status === 'pending');
        const container = document.getElementById('pending-reports');

        if (!container) return;

        if (reports.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No pending reports.</p>';
            return;
        }

        container.innerHTML = '';

        reports.forEach(report => {
            const item = document.createElement('div');
            item.className = 'card';
            item.style.marginBottom = '1rem';
            item.innerHTML = `
                <h4>${report.type === 'missing' ? report.name : 'Found Person'}</h4>
                <p><strong>Type:</strong> ${report.type === 'missing' ? 'Missing Person' : 'Found Person'}</p>
                ${report.type === 'missing' ? `
                    <p><strong>Age:</strong> ${report.age}, <strong>Gender:</strong> ${report.gender}</p>
                    <p><strong>Last Seen:</strong> ${report.lastSeenLocation}</p>
                ` : `
                    <p><strong>Location:</strong> ${report.currentLocation}</p>
                `}
                <p><strong>Description:</strong> ${report.description}</p>
                <p><strong>Reported by:</strong> ${report.reporterName}</p>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn btn-primary btn-sm" onclick="app.approveReport('${report.id}')">Approve</button>
                    <button class="btn btn-accent btn-sm" onclick="app.rejectReport('${report.id}')">Reject</button>
                </div>
            `;
            container.appendChild(item);
        });
    }

    approveReport(reportId) {
        let reports = this.getAllReports();
        const report = reports.find(r => r.id === reportId);

        if (report) {
            report.status = 'approved';
            localStorage.setItem('findourownReports', JSON.stringify(reports));
            alert('Report approved!');
            this.loadPendingReports();
        }
    }

    rejectReport(reportId) {
        let reports = this.getAllReports();
        const report = reports.find(r => r.id === reportId);

        if (report) {
            report.status = 'rejected';
            localStorage.setItem('findourownReports', JSON.stringify(reports));
            alert('Report rejected!');
            this.loadPendingReports();
        }
    }

    renderVolunteer() {
        if (!this.user || this.userRole !== 'volunteer') {
            return this.renderLoginRequired();
        }

        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Volunteer Dashboard</h2>
                <div class="card">
                    <h3>My Profile</h3>
                    <p><strong>Name:</strong> ${this.user.name}</p>
                    <p><strong>Email:</strong> ${this.user.email}</p>
                    <p><strong>Phone:</strong> ${this.user.phone}</p>
                    <p><strong>Residency Address:</strong> ${this.user.residencyAddress || 'Not provided'}</p>
                    <p><strong>Availability:</strong> ${this.user.availability || 'Not specified'}</p>
                </div>
                <div class="card">
                    <h3>Active Missing Persons</h3>
                    <div id="volunteer-missing"></div>
                </div>
            </div>
        `;

        setTimeout(() => this.loadVolunteerMissing(), 100);
        return section;
    }

    loadVolunteerMissing() {
        const reports = this.getAllReports().filter(r => r.type === 'missing' && r.status === 'approved');
        const container = document.getElementById('volunteer-missing');

        if (!container) return;

        if (reports.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No active missing persons to help with.</p>';
            return;
        }

        container.innerHTML = '';

        reports.forEach(report => {
            const item = document.createElement('div');
            item.className = 'card';
            item.style.marginBottom = '1rem';
            item.innerHTML = `
                <h4>${report.name}</h4>
                <p><strong>Age:</strong> ${report.age}, <strong>Gender:</strong> ${report.gender}</p>
                <p><strong>Last Seen:</strong> ${report.lastSeenLocation}</p>
                <p><strong>Description:</strong> ${report.description}</p>
                <div style="margin-top: 1rem;">
                    ${report.showPhonePublicly && report.phoneNumber ? `
                        <a href="https://wa.me/${report.phoneNumber.replace(/\D/g, '')}" class="btn btn-secondary btn-sm" target="_blank">Contact Reporter</a>
                    ` : `
                        <a href="mailto:${this.adminEmail}?subject=Volunteer Help for ${report.name}" class="btn btn-secondary btn-sm">Contact Admin</a>
                    `}
                </div>
            `;
            container.appendChild(item);
        });
    }

    renderMessages() {
        if (!this.user) {
            return this.renderLoginRequired();
        }

        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Messages</h2>
                <div class="card">
                    <h3>Send a Message</h3>
                    <form id="message-form" onsubmit="app.sendMessage(event)">
                        <div class="form-group">
                            <label>Recipient *</label>
                            <input type="text" name="recipient" placeholder="Name or email" required>
                        </div>
                        <div class="form-group">
                            <label>Message *</label>
                            <textarea name="message" placeholder="Your message..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Send Message</button>
                    </form>
                </div>
                <div class="card">
                    <h3>Your Messages</h3>
                    <div id="messages-list"></div>
                </div>
            </div>
        `;

        setTimeout(() => this.loadMessages(), 100);
        return section;
    }

    sendMessage(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const message = {
            id: Date.now().toString(),
            senderId: this.user.id,
            senderName: this.user.name,
            recipient: formData.get('recipient'),
            text: formData.get('message'),
            createdAt: new Date().toISOString()
        };

        let messages = JSON.parse(localStorage.getItem('findourownMessages') || '[]');
        messages.push(message);
        localStorage.setItem('findourownMessages', JSON.stringify(messages));

        form.reset();
        alert('Message sent!');
        this.loadMessages();
    }

    loadMessages() {
        const messages = JSON.parse(localStorage.getItem('findourownMessages') || '[]');
        const userMessages = messages.filter(m => m.senderId === this.user.id);
        const container = document.getElementById('messages-list');

        if (!container) return;

        if (userMessages.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No messages sent yet.</p>';
            return;
        }

        container.innerHTML = '';

        userMessages.forEach(msg => {
            const item = document.createElement('div');
            item.className = 'card';
            item.style.marginBottom = '1rem';
            item.innerHTML = `
                <p><strong>To:</strong> ${msg.recipient}</p>
                <p>${msg.text}</p>
                <small style="color: var(--text-muted);">${new Date(msg.createdAt).toLocaleString()}</small>
            `;
            container.appendChild(item);
        });
    }

    renderLoginRequired() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <div class="card" style="max-width: 500px; margin: 3rem auto; text-align: center;">
                    <h2>Login Required</h2>
                    <p>You need to be logged in to access this page.</p>
                    <button class="btn btn-primary" onclick="app.navigate('login')">Go to Login</button>
                </div>
            </div>
        `;
        return section;
    }

    logout() {
        this.user = null;
        this.userRole = null;
        localStorage.removeItem('findourownUser');
        alert('Logged out successfully!');
        this.navigate('home');
    }

    createFooter() {
        const footer = document.createElement('footer');
        footer.innerHTML = `
            <div class="container">
                <div>
                    <h3>FindOurOwn</h3>
                    <p>Reuniting families across Lagos and Ogun States. Every report matters. Every search counts.</p>
                </div>
                <div>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#" onclick="app.navigate('missing-persons'); return false;">Missing Persons</a></li>
                        <li><a href="#" onclick="app.navigate('found-persons'); return false;">Found Persons</a></li>
                        <li><a href="#" onclick="app.navigate('report-missing'); return false;">Report Missing</a></li>
                        <li><a href="#" onclick="app.navigate('report-found'); return false;">Report Found</a></li>
                    </ul>
                </div>
                <div>
                    <h3>Support</h3>
                    <ul>
                        <li><a href="mailto:${this.adminEmail}">Contact Us</a></li>
                        <li><a href="https://wa.me/${this.adminWhatsApp.replace(/\D/g, '')}" target="_blank">WhatsApp Support</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div class="container copyright">
                <p>&copy; 2026 FindOurOwn. All rights reserved. Helping reunite families.</p>
            </div>
        `;
        return footer;
    }
}

// Initialize app
const app = new FindOurOwnApp();
