// FindOurOwn - Vanilla JavaScript App
class FindOurOwnApp {
    constructor() {
        this.currentPage = 'home';
        this.user = null;
        this.apiBase = '/api/trpc';
        this.mobileMenuOpen = false;
        this.init();
    }

    async init() {
        this.setupViewport();
        this.setupRouting();
        this.setupTouchHandlers();
        await this.checkAuth();
        this.render();
    }
    
    setupViewport() {
        // Ensure proper viewport for mobile
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes';
    }
    
    setupTouchHandlers() {
        // Prevent double-tap zoom on buttons
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.btn') || e.target.closest('a')) {
                e.target.closest('.btn, a').style.opacity = '0.8';
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.closest('.btn') || e.target.closest('a')) {
                e.target.closest('.btn, a').style.opacity = '1';
            }
        }, { passive: true });
    }

    setupRouting() {
        window.addEventListener('popstate', () => this.render());
        // Close mobile menu on navigation
        window.addEventListener('popstate', () => {
            this.mobileMenuOpen = false;
        });
    }
    
    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        this.render();
    }

    async checkAuth() {
        try {
            const response = await fetch(`${this.apiBase}/auth.me?input={}`);
            const data = await response.json();
            if (data.result && data.result.data) {
                this.user = data.result.data;
            }
        } catch (error) {
            console.log('Not authenticated');
        }
    }

    navigate(page) {
        this.currentPage = page;
        window.history.pushState({ page }, '', `/${page}`);
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = '';
        
        // Add Navigation
        app.appendChild(this.createNav());
        
        // Add Page Content
        let content;
        switch(this.currentPage) {
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
            case 'messages':
                content = this.renderMessages();
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
                        ${this.user.role === 'admin' ? `<li><a href="#" onclick="app.navigate('admin'); return false;">Admin</a></li>` : ''}
                        <li><a href="#" onclick="app.logout(); return false;">Logout</a></li>
                    ` : `
                        <li><a href="/api/oauth/login?returnPath=/" class="btn btn-primary">Login</a></li>
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
        
        // Load stats
        this.loadStats();
        
        return section;
    }

    async loadStats() {
        try {
            const response = await fetch(`${this.apiBase}/missingPerson.listApproved?input={}`);
            const data = await response.json();
            if (data.result && data.result.data) {
                document.getElementById('active-reports').textContent = data.result.data.length;
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
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
                        <div class="form-group">
                            <label>Photo</label>
                            <input type="file" name="photo" accept="image/*">
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phoneNumber">
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="showPhone"> Show my phone number publicly
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Police Case Number (Optional)</label>
                            <input type="text" name="policeCaseNumber">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Report</button>
                    </form>
                </div>
            </div>
        `;
        return section;
    }

    async submitReport(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`${this.apiBase}/missingPerson.create`, {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.get('name'),
                    age: parseInt(formData.get('age')),
                    gender: formData.get('gender'),
                    state: formData.get('state'),
                    lastSeenLocation: formData.get('lastSeenLocation'),
                    description: formData.get('description'),
                    phoneNumber: formData.get('phoneNumber'),
                    showPhonePublicly: formData.get('showPhone') ? true : false,
                    policeCaseNumber: formData.get('policeCaseNumber'),
                    photoUrl: null
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('Report submitted successfully!');
                this.navigate('missing-persons');
            } else {
                alert('Error submitting report');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting report');
        }
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
                            <textarea name="description" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Current Location *</label>
                            <input type="text" name="currentLocation" required>
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
                            <input type="file" name="photo" accept="image/*">
                        </div>
                        <div class="form-group">
                            <label>Your Contact Information</label>
                            <input type="tel" name="phoneNumber" placeholder="Your phone number">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Report</button>
                    </form>
                </div>
            </div>
        `;
        return section;
    }

    async submitFoundReport(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`${this.apiBase}/foundPerson.create`, {
                method: 'POST',
                body: JSON.stringify({
                    description: formData.get('description'),
                    currentLocation: formData.get('currentLocation'),
                    state: formData.get('state'),
                    photoUrl: null,
                    reporterContact: formData.get('phoneNumber')
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('Found person report submitted successfully!');
                this.navigate('found-persons');
            } else {
                alert('Error submitting report');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting report');
        }
    }

    async renderMissingPersons() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Missing Persons</h2>
                <div class="card" style="max-width: 400px; margin: 2rem auto;">
                    <div class="form-group">
                        <label>Filter by State</label>
                        <select id="state-filter" onchange="app.filterGallery()">
                            <option value="">All States</option>
                            <option value="Lagos">Lagos</option>
                            <option value="Ogun">Ogun</option>
                        </select>
                    </div>
                </div>
                <div id="gallery" class="gallery"></div>
            </div>
        `;
        
        // Load data
        await this.loadMissingPersons();
        
        return section;
    }

    async loadMissingPersons() {
        try {
            const response = await fetch(`${this.apiBase}/missingPerson.listApproved?input={}`);
            const data = await response.json();
            
            if (data.result && data.result.data) {
                const gallery = document.getElementById('gallery');
                gallery.innerHTML = '';
                
                data.result.data.forEach(person => {
                    const card = document.createElement('div');
                    card.className = 'gallery-item';
                    card.innerHTML = `
                        <div style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center; color: #999;">
                            No Photo
                        </div>
                        <div class="gallery-content">
                            <h3 class="gallery-title">${person.name}</h3>
                            <div class="gallery-meta">
                                Age: ${person.age} | ${person.gender} | ${person.state}
                            </div>
                            <p class="gallery-description">${person.description}</p>
                            <p style="font-size: 0.85rem; color: #666;">Last seen: ${person.lastSeenLocation}</p>
                            ${person.showPhonePublicly ? `<p style="font-weight: 600; color: var(--accent);">📞 ${person.phoneNumber}</p>` : ''}
                            <button class="btn btn-accent" style="width: 100%; margin-top: 1rem;">Contact Reporter</button>
                        </div>
                    `;
                    gallery.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Error loading missing persons:', error);
        }
    }

    async renderFoundPersons() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Found Persons</h2>
                <div class="card" style="max-width: 400px; margin: 2rem auto;">
                    <div class="form-group">
                        <label>Filter by State</label>
                        <select id="state-filter" onchange="app.filterFoundGallery()">
                            <option value="">All States</option>
                            <option value="Lagos">Lagos</option>
                            <option value="Ogun">Ogun</option>
                        </select>
                    </div>
                </div>
                <div id="found-gallery" class="gallery"></div>
            </div>
        `;
        
        // Load data
        await this.loadFoundPersons();
        
        return section;
    }

    async loadFoundPersons() {
        try {
            const response = await fetch(`${this.apiBase}/foundPerson.listApproved?input={}`);
            const data = await response.json();
            
            if (data.result && data.result.data) {
                const gallery = document.getElementById('found-gallery');
                gallery.innerHTML = '';
                
                data.result.data.forEach(person => {
                    const card = document.createElement('div');
                    card.className = 'gallery-item';
                    card.innerHTML = `
                        <div style="background-color: #ddd; height: 200px; display: flex; align-items: center; justify-content: center; color: #999;">
                            No Photo
                        </div>
                        <div class="gallery-content">
                            <h3 class="gallery-title">Unidentified Person</h3>
                            <p class="gallery-description">${person.description}</p>
                            <p style="font-size: 0.85rem; color: #666;">Location: ${person.currentLocation}</p>
                            <button class="btn btn-accent" style="width: 100%; margin-top: 1rem;">Report Match</button>
                        </div>
                    `;
                    gallery.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Error loading found persons:', error);
        }
    }

    renderDashboard() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>My Dashboard</h2>
                <div class="card" style="max-width: 600px; margin: 2rem auto;">
                    <h3>Your Reports</h3>
                    <div id="user-reports" style="margin-top: 1rem;"></div>
                </div>
            </div>
        `;
        
        this.loadUserReports();
        
        return section;
    }

    async loadUserReports() {
        try {
            const response = await fetch(`${this.apiBase}/missingPerson.getUserReports?input={}`);
            const data = await response.json();
            
            if (data.result && data.result.data) {
                const container = document.getElementById('user-reports');
                container.innerHTML = '';
                
                data.result.data.forEach(report => {
                    const item = document.createElement('div');
                    item.className = 'card';
                    item.style.marginBottom = '1rem';
                    item.innerHTML = `
                        <h4>${report.name}</h4>
                        <p>Status: ${report.status}</p>
                        <button class="btn btn-secondary" style="margin-right: 0.5rem;">Edit</button>
                        <button class="btn btn-accent">Delete</button>
                    `;
                    container.appendChild(item);
                });
            }
        } catch (error) {
            console.error('Error loading user reports:', error);
        }
    }

    renderAdmin() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Admin Dashboard</h2>
                <div class="card">
                    <h3>Pending Reports</h3>
                    <div id="pending-reports" style="margin-top: 1rem;"></div>
                </div>
            </div>
        `;
        
        this.loadPendingReports();
        
        return section;
    }

    async loadPendingReports() {
        try {
            const response = await fetch(`${this.apiBase}/admin.getPendingReports?input={}`);
            const data = await response.json();
            
            if (data.result && data.result.data) {
                const container = document.getElementById('pending-reports');
                container.innerHTML = '';
                
                data.result.data.forEach(report => {
                    const item = document.createElement('div');
                    item.className = 'card';
                    item.style.marginBottom = '1rem';
                    item.innerHTML = `
                        <h4>${report.name}</h4>
                        <p>${report.description}</p>
                        <button class="btn btn-primary" onclick="app.approveReport(${report.id})">Approve</button>
                        <button class="btn btn-accent" onclick="app.rejectReport(${report.id})">Reject</button>
                    `;
                    container.appendChild(item);
                });
            }
        } catch (error) {
            console.error('Error loading pending reports:', error);
        }
    }

    async approveReport(id) {
        try {
            const response = await fetch(`${this.apiBase}/admin.approveReport`, {
                method: 'POST',
                body: JSON.stringify({ reportId: id }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                alert('Report approved!');
                this.loadPendingReports();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async rejectReport(id) {
        try {
            const response = await fetch(`${this.apiBase}/admin.rejectReport`, {
                method: 'POST',
                body: JSON.stringify({ reportId: id }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                alert('Report rejected!');
                this.loadPendingReports();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    renderMessages() {
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="container">
                <h2>Messages</h2>
                <div class="card">
                    <h3>Your Conversations</h3>
                    <div id="conversations" style="margin-top: 1rem;"></div>
                </div>
            </div>
        `;
        
        this.loadConversations();
        
        return section;
    }

    async loadConversations() {
        try {
            const response = await fetch(`${this.apiBase}/message.getConversations?input={}`);
            const data = await response.json();
            
            if (data.result && data.result.data) {
                const container = document.getElementById('conversations');
                container.innerHTML = '';
                
                data.result.data.forEach(conv => {
                    const item = document.createElement('div');
                    item.className = 'card';
                    item.style.marginBottom = '1rem';
                    item.innerHTML = `
                        <h4>Conversation ${conv.id}</h4>
                        <p>${conv.lastMessage}</p>
                        <button class="btn btn-primary">View</button>
                    `;
                    container.appendChild(item);
                });
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    }

    filterGallery() {
        // Implement filtering logic
    }

    filterFoundGallery() {
        // Implement filtering logic
    }

    async logout() {
        try {
            await fetch(`${this.apiBase}/auth.logout`, { method: 'POST' });
            this.user = null;
            this.navigate('home');
        } catch (error) {
            console.error('Error logging out:', error);
        }
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
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
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

// Initialize app
const app = new FindOurOwnApp();
