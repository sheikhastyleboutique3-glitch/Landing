/**
 * Gaimer W Kahi - Admin Panel JavaScript
 * JWT Auth, CRUD Operations, Dashboard Management
 */

// ==========================================
// STATE & CONFIG
// ==========================================
const API_BASE = '';
let authToken = localStorage.getItem('gwk_admin_token');
let currentUser = JSON.parse(localStorage.getItem('gwk_admin_user') || 'null');

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  if (authToken && currentUser) {
    showAdminPanel();
  } else {
    showLoginPage();
  }
  setupEventListeners();
});


function setupEventListeners() {
  // Login form
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  
  // Sidebar navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToSection(item.dataset.section);
    });
  });
  
  // Mobile menu toggle
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  
  document.getElementById('sidebarClose').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
  });
  
  // Menu form
  document.getElementById('menuForm').addEventListener('submit', handleMenuSave);
  
  // Gallery form
  document.getElementById('galleryForm').addEventListener('submit', handleGallerySave);
  
  // Settings form
  document.getElementById('settingsForm').addEventListener('submit', handleSettingsSave);
}

// ==========================================
// AUTHENTICATION
// ==========================================
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');
  
  errorEl.classList.remove('show');
  btn.disabled = true;
  btn.innerHTML = '<span>Signing in...</span> <i class="fas fa-spinner fa-spin"></i>';
  
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('gwk_admin_token', authToken);
    localStorage.setItem('gwk_admin_user', JSON.stringify(currentUser));
    
    showAdminPanel();
    showToast('Welcome back, ' + currentUser.name + '!', 'success');
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.add('show');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Sign In</span> <i class="fas fa-arrow-right"></i>';
  }
}

function handleLogout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('gwk_admin_token');
  localStorage.removeItem('gwk_admin_user');
  showLoginPage();
  showToast('Logged out successfully', 'info');
}

function showLoginPage() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'flex';
  loadDashboard();
}


// ==========================================
// NAVIGATION
// ==========================================
function navigateToSection(section) {
  // Update nav
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');
  
  // Update sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${section}`).classList.add('active');
  
  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    menu: 'Menu Management',
    orders: 'Orders',
    reservations: 'Reservations',
    gallery: 'Gallery',
    testimonials: 'Testimonials',
    messages: 'Messages',
    settings: 'Settings'
  };
  document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
  
  // Load section data
  switch(section) {
    case 'dashboard': loadDashboard(); break;
    case 'menu': loadMenu(); break;
    case 'orders': loadOrders(); break;
    case 'reservations': loadReservations(); break;
    case 'gallery': loadGallery(); break;
    case 'testimonials': loadTestimonials(); break;
    case 'messages': loadMessages(); break;
    case 'settings': loadSettings(); break;
  }
  
  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
}

// ==========================================
// API HELPER
// ==========================================
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  
  if (res.status === 401) {
    handleLogout();
    throw new Error('Session expired. Please login again.');
  }
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}


// ==========================================
// DASHBOARD
// ==========================================
async function loadDashboard() {
  try {
    showLoading();
    const [menu, orders, messages, reservations] = await Promise.all([
      apiCall('/api/menu'),
      apiCall('/api/orders').catch(() => []),
      apiCall('/api/contact').catch(() => []),
      apiCall('/api/reservations').catch(() => [])
    ]);
    
    document.getElementById('statMenuItems').textContent = menu.length;
    document.getElementById('statOrders').textContent = orders.length;
    document.getElementById('statMessages').textContent = messages.filter(m => !m.read).length;
    document.getElementById('statReservations').textContent = reservations.filter(r => r.status === 'pending').length;
    
    // Recent orders
    const recentEl = document.getElementById('recentOrders');
    if (orders.length === 0) {
      recentEl.innerHTML = '<p class="empty-state">No recent orders</p>';
    } else {
      recentEl.innerHTML = orders.slice(0, 5).map(o => `
        <div class="recent-order">
          <div>
            <strong>${o.orderNumber || 'N/A'}</strong>
            <span style="color:var(--text-muted); margin-left:10px;">${o.customerName || 'Guest'}</span>
          </div>
          <span class="badge badge-${o.status}">${o.status}</span>
        </div>
      `).join('');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}

// ==========================================
// MENU MANAGEMENT
// ==========================================
async function loadMenu() {
  try {
    showLoading();
    const category = document.getElementById('menuCategoryFilter').value;
    let url = '/api/menu';
    if (category) url += `?category=${category}`;
    const items = await apiCall(url);
    
    const tbody = document.getElementById('menuTableBody');
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No menu items found</td></tr>';
    } else {
      tbody.innerHTML = items.map(item => `
        <tr>
          <td><img src="${item.image || '/images/menu/kahi-gaimer.svg'}" class="item-image" alt="${item.name}"></td>
          <td><strong>${item.name}</strong><br><small style="color:var(--text-muted)">${item.nameAr || ''}</small></td>
          <td><span class="badge badge-confirmed">${item.category}</span></td>
          <td>${item.price} QAR</td>
          <td>${item.featured ? '<i class="fas fa-star" style="color:var(--gold)"></i>' : '<i class="far fa-star" style="color:var(--text-muted)"></i>'}</td>
          <td>${item.available ? '<span style="color:var(--success)">●</span> Yes' : '<span style="color:var(--danger)">●</span> No'}</td>
          <td>
            <button class="btn-sm btn-info" onclick="editMenuItem('${item.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn-sm btn-danger" onclick="deleteMenuItem('${item.id}', '${item.name}')"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}


function openMenuModal(item = null) {
  const modal = document.getElementById('menuModal');
  const title = document.getElementById('menuModalTitle');
  
  if (item) {
    title.textContent = 'Edit Menu Item';
    document.getElementById('menuItemId').value = item.id;
    document.getElementById('menuName').value = item.name || '';
    document.getElementById('menuNameAr').value = item.nameAr || '';
    document.getElementById('menuDescription').value = item.description || '';
    document.getElementById('menuDescriptionAr').value = item.descriptionAr || '';
    document.getElementById('menuPrice').value = item.price || '';
    document.getElementById('menuCategory').value = item.category || 'breakfast';
    document.getElementById('menuImage').value = item.image || '';
    document.getElementById('menuFeatured').checked = item.featured || false;
    document.getElementById('menuAvailable').checked = item.available !== false;
  } else {
    title.textContent = 'Add Menu Item';
    document.getElementById('menuForm').reset();
    document.getElementById('menuItemId').value = '';
    document.getElementById('menuAvailable').checked = true;
  }
  
  modal.classList.add('show');
}

function closeMenuModal() {
  document.getElementById('menuModal').classList.remove('show');
}

async function editMenuItem(id) {
  try {
    const item = await apiCall(`/api/menu/${id}`);
    openMenuModal(item);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteMenuItem(id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  try {
    showLoading();
    await apiCall(`/api/menu/${id}`, 'DELETE');
    showToast('Menu item deleted', 'success');
    loadMenu();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}

async function handleMenuSave(e) {
  e.preventDefault();
  const id = document.getElementById('menuItemId').value;
  const data = {
    name: document.getElementById('menuName').value,
    nameAr: document.getElementById('menuNameAr').value,
    description: document.getElementById('menuDescription').value,
    descriptionAr: document.getElementById('menuDescriptionAr').value,
    price: parseFloat(document.getElementById('menuPrice').value),
    category: document.getElementById('menuCategory').value,
    image: document.getElementById('menuImage').value,
    featured: document.getElementById('menuFeatured').checked,
    available: document.getElementById('menuAvailable').checked
  };
  
  try {
    showLoading();
    if (id) {
      await apiCall(`/api/menu/${id}`, 'PUT', data);
      showToast('Menu item updated', 'success');
    } else {
      await apiCall('/api/menu', 'POST', data);
      showToast('Menu item created', 'success');
    }
    closeMenuModal();
    loadMenu();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}


// ==========================================
// ORDERS MANAGEMENT
// ==========================================
async function loadOrders() {
  try {
    showLoading();
    const status = document.getElementById('orderStatusFilter').value;
    let url = '/api/orders';
    if (status) url += `?status=${status}`;
    const orders = await apiCall(url);
    
    const tbody = document.getElementById('ordersTableBody');
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No orders found</td></tr>';
    } else {
      tbody.innerHTML = orders.map(o => `
        <tr>
          <td><strong>${o.orderNumber || 'N/A'}</strong></td>
          <td>${o.customerName || 'Guest'}<br><small style="color:var(--text-muted)">${o.phone || ''}</small></td>
          <td>${(o.items || []).map(i => i.name || i).join(', ') || 'N/A'}</td>
          <td><strong>${o.total || 0} QAR</strong></td>
          <td><span class="badge badge-${o.status}">${o.status}</span></td>
          <td>${formatDate(o.createdAt)}</td>
          <td>
            <select class="status-select" onchange="updateOrderStatus('${o.id}', this.value)">
              <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
              <option value="confirmed" ${o.status==='confirmed'?'selected':''}>Confirmed</option>
              <option value="delivered" ${o.status==='delivered'?'selected':''}>Delivered</option>
              <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelled</option>
            </select>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}

async function updateOrderStatus(id, status) {
  try {
    await apiCall(`/api/orders/${id}`, 'PUT', { status });
    showToast(`Order status updated to ${status}`, 'success');
    loadOrders();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==========================================
// RESERVATIONS
// ==========================================
async function loadReservations() {
  try {
    showLoading();
    const reservations = await apiCall('/api/reservations');
    
    const tbody = document.getElementById('reservationsTableBody');
    if (reservations.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No reservations found</td></tr>';
    } else {
      tbody.innerHTML = reservations.map(r => `
        <tr>
          <td><strong>${r.name || 'N/A'}</strong></td>
          <td>${r.date || 'N/A'}</td>
          <td>${r.time || 'N/A'}</td>
          <td>${r.guests || 'N/A'}</td>
          <td>${r.phone || 'N/A'}</td>
          <td><span class="badge badge-${r.status}">${r.status}</span></td>
          <td>
            ${r.status === 'pending' ? `
              <button class="btn-sm btn-success" onclick="updateReservation('${r.id}', 'approved')"><i class="fas fa-check"></i></button>
              <button class="btn-sm btn-danger" onclick="updateReservation('${r.id}', 'rejected')"><i class="fas fa-times"></i></button>
            ` : `
              <button class="btn-sm btn-danger" onclick="deleteReservation('${r.id}')"><i class="fas fa-trash"></i></button>
            `}
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}

async function updateReservation(id, status) {
  try {
    await apiCall(`/api/reservations/${id}`, 'PUT', { status });
    showToast(`Reservation ${status}`, 'success');
    loadReservations();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteReservation(id) {
  if (!confirm('Delete this reservation?')) return;
  try {
    await apiCall(`/api/reservations/${id}`, 'DELETE');
    showToast('Reservation deleted', 'success');
    loadReservations();
  } catch (err) {
    showToast(err.message, 'error');
  }
}


// ==========================================
// GALLERY MANAGEMENT
// ==========================================
async function loadGallery() {
  try {
    showLoading();
    const items = await apiCall('/api/gallery');
    
    const grid = document.getElementById('galleryGrid');
    if (items.length === 0) {
      grid.innerHTML = '<p class="empty-state">No gallery items. Add images or videos to showcase your restaurant.</p>';
    } else {
      grid.innerHTML = items.map(item => {
        const isVideo = item.mediaType === 'video' || (item.url && (item.url.endsWith('.mp4') || item.url.endsWith('.webm')));
        return `
          <div class="gallery-item">
            <div class="responsive-media ${isVideo ? 'video-container' : ''}">
              ${isVideo ? `
                <video muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()">
                  <source src="${item.url || item.image}" type="video/mp4">
                </video>
              ` : `
                <img src="${item.url || item.image}" alt="${item.title || 'Gallery'}" loading="lazy">
              `}
            </div>
            ${isVideo ? '<span class="video-badge"><i class="fas fa-video"></i> Video</span>' : ''}
            <div class="gallery-overlay">
              <span>${item.title || 'Untitled'}</span>
              <button onclick="deleteGalleryItem('${item.id}')"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}

function openGalleryModal() {
  document.getElementById('galleryForm').reset();
  document.getElementById('galleryModal').classList.add('show');
}

function closeGalleryModal() {
  document.getElementById('galleryModal').classList.remove('show');
}

async function handleGallerySave(e) {
  e.preventDefault();
  const data = {
    title: document.getElementById('galleryTitle').value,
    mediaType: document.getElementById('galleryMediaType').value,
    url: document.getElementById('galleryUrl').value,
    category: document.getElementById('galleryCategory').value
  };
  
  try {
    showLoading();
    await apiCall('/api/gallery', 'POST', data);
    showToast('Gallery item added', 'success');
    closeGalleryModal();
    loadGallery();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}

async function deleteGalleryItem(id) {
  if (!confirm('Delete this gallery item?')) return;
  try {
    showLoading();
    await apiCall(`/api/gallery/${id}`, 'DELETE');
    showToast('Gallery item deleted', 'success');
    loadGallery();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}


// ==========================================
// TESTIMONIALS
// ==========================================
async function loadTestimonials() {
  try {
    showLoading();
    const items = await apiCall('/api/testimonials?all=true');
    
    const container = document.getElementById('testimonialsList');
    if (items.length === 0) {
      container.innerHTML = '<p class="empty-state">No testimonials yet</p>';
    } else {
      container.innerHTML = items.map(t => `
        <div class="testimonial-card">
          <div class="tc-header">
            <span class="tc-author">${t.name || 'Anonymous'}</span>
            <span class="tc-rating">${'★'.repeat(t.rating || 5)}${'☆'.repeat(5 - (t.rating || 5))}</span>
          </div>
          <p class="tc-text">"${t.text || t.comment || ''}"</p>
          <div class="tc-header">
            <span class="badge badge-${t.approved ? 'approved' : 'pending'}">${t.approved ? 'Approved' : 'Pending'}</span>
            <span style="font-size:12px;color:var(--text-muted)">${t.date || ''}</span>
          </div>
          <div class="tc-actions">
            ${!t.approved ? `<button class="btn-sm btn-success" onclick="approveTestimonial('${t.id}')"><i class="fas fa-check"></i> Approve</button>` : ''}
            ${t.approved ? `<button class="btn-sm btn-warning" onclick="rejectTestimonial('${t.id}')"><i class="fas fa-ban"></i> Reject</button>` : ''}
            <button class="btn-sm btn-danger" onclick="deleteTestimonial('${t.id}')"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}

async function approveTestimonial(id) {
  try {
    await apiCall(`/api/testimonials/${id}`, 'PUT', { approved: true });
    showToast('Testimonial approved', 'success');
    loadTestimonials();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function rejectTestimonial(id) {
  try {
    await apiCall(`/api/testimonials/${id}`, 'PUT', { approved: false });
    showToast('Testimonial rejected', 'success');
    loadTestimonials();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteTestimonial(id) {
  if (!confirm('Delete this testimonial?')) return;
  try {
    await apiCall(`/api/testimonials/${id}`, 'DELETE');
    showToast('Testimonial deleted', 'success');
    loadTestimonials();
  } catch (err) {
    showToast(err.message, 'error');
  }
}


// ==========================================
// MESSAGES
// ==========================================
async function loadMessages() {
  try {
    showLoading();
    const messages = await apiCall('/api/contact');
    
    const container = document.getElementById('messagesList');
    if (messages.length === 0) {
      container.innerHTML = '<p class="empty-state">No messages received</p>';
    } else {
      container.innerHTML = messages.map(m => `
        <div class="message-card ${!m.read ? 'unread' : ''}">
          <div class="mc-header">
            <span class="mc-sender">${!m.read ? '<i class="fas fa-circle" style="font-size:8px;color:var(--gold);margin-right:6px;"></i>' : ''}${m.name || 'Unknown'}</span>
            <span class="mc-date">${formatDate(m.createdAt)}</span>
          </div>
          <div class="mc-email">${m.email || 'No email'}</div>
          ${m.subject ? `<strong style="font-size:13px;">${m.subject}</strong>` : ''}
          <p class="mc-body">${m.message || m.body || ''}</p>
          <div class="mc-actions">
            ${!m.read ? `<button class="btn-sm btn-info" onclick="markMessageRead('${m.id}')"><i class="fas fa-check"></i> Mark Read</button>` : ''}
            <button class="btn-sm btn-danger" onclick="deleteMessage('${m.id}')"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}

async function markMessageRead(id) {
  try {
    await apiCall(`/api/contact/${id}`, 'PUT', { read: true });
    showToast('Message marked as read', 'success');
    loadMessages();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteMessage(id) {
  if (!confirm('Delete this message?')) return;
  try {
    await apiCall(`/api/contact/${id}`, 'DELETE');
    showToast('Message deleted', 'success');
    loadMessages();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==========================================
// SETTINGS
// ==========================================
async function loadSettings() {
  try {
    showLoading();
    const settings = await apiCall('/api/settings');
    
    // Populate form fields
    const fields = [
      'siteName', 'siteNameAr', 'tagline', 'taglineAr',
      'phone', 'whatsapp', 'email', 'address', 'addressAr',
      'instagram', 'deliveryLink', 'openingHours', 'openingHoursAr',
      'deliveryTime', 'minimumOrder', 'currency', 'heroTitle', 'heroSubtitle'
    ];
    
    fields.forEach(field => {
      const el = document.getElementById('set' + field.charAt(0).toUpperCase() + field.slice(1));
      if (el && settings[field] !== undefined) {
        el.value = settings[field];
      }
    });
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}

async function handleSettingsSave(e) {
  e.preventDefault();
  const form = e.target;
  const data = {};
  
  const fields = [
    'siteName', 'siteNameAr', 'tagline', 'taglineAr',
    'phone', 'whatsapp', 'email', 'address', 'addressAr',
    'instagram', 'deliveryLink', 'openingHours', 'openingHoursAr',
    'deliveryTime', 'minimumOrder', 'currency', 'heroTitle', 'heroSubtitle'
  ];
  
  fields.forEach(field => {
    const el = document.getElementById('set' + field.charAt(0).toUpperCase() + field.slice(1));
    if (el) {
      data[field] = field === 'minimumOrder' ? parseFloat(el.value) : el.value;
    }
  });
  
  try {
    showLoading();
    await apiCall('/api/settings', 'PUT', data);
    showToast('Settings saved successfully', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideLoading();
  }
}


// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
