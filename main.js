/* ================================================
   CHARISMA T. GAMBOA — MAIN JAVASCRIPT
   Shared across all pages
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- DARK MODE ---- */
  const themeBtn  = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    if (themeIcon) updateIcon(true);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const dark = document.body.classList.toggle('dark');
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      updateIcon(dark);
    });
  }

  function updateIcon(isDark) {
    if (!themeIcon) return;
    themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  /* ---- NAVBAR SCROLL ---- */
  const topnav = document.getElementById('topnav');
  if (topnav) {
    window.addEventListener('scroll', () => {
      topnav.style.boxShadow = window.scrollY > 40
        ? '0 4px 24px rgba(231,84,128,.4)' : '';
    });
  }

  /* ---- HAMBURGER ---- */
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => ro.observe(el));
  }

  /* ---- LOAD PROJECTS FROM JSON ---- */
  const container = document.getElementById('projectsContainer');
  if (container) {
    fetch('data/projects.json')
      .then(r => { if (!r.ok) throw new Error('Fetch failed'); return r.json(); })
      .then(data => {
        container.innerHTML = '';
        data.projects.forEach(proj => {
          const statusClass = proj.status === 'Completed' ? 'status-done' : 'status-wip';
          const tags = proj.tech.map(t => `<span class="pj-tag">${t}</span>`).join('');
          const card = document.createElement('div');
          card.classList.add('project-json-card', proj.color, 'reveal');
          card.innerHTML = `
            <div class="pj-icon"><i class="fa-solid ${proj.icon}"></i></div>
            <span class="pj-status ${statusClass}">${proj.status}</span>
            <p class="pj-title">${proj.title}</p>
            <p class="pj-desc">${proj.description}</p>
            <div class="pj-tags">${tags}</div>
            <p style="font-size:.75rem;color:var(--muted);margin-top:.6rem;">${proj.year} · ${proj.category}</p>
          `;
          container.appendChild(card);
          // observe newly added card
          const ro2 = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro2.unobserve(e.target); } });
          }, { threshold: 0.1 });
          ro2.observe(card);
        });
      })
      .catch(() => {
        container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:2rem;">Could not load projects. Make sure you\'re running from a server.</p>';
      });
  }

  /* ========================================================
     MODAL: AUTH (LOGIN / REGISTER / OTP)
     ======================================================== */
  let currentOtp = '';

  window.openModal = function(tab) {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('authForms').style.display = '';
    document.getElementById('otpSection').style.display  = 'none';
    switchTab(tab);
    clearAllErrors();
  };

  window.closeModal = function() {
    document.getElementById('modalOverlay').classList.remove('active');
  };

  window.closeIfOutside = function(e) {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  };

  window.switchTab = function(tab) {
    document.getElementById('formLogin').classList.toggle('active', tab === 'login');
    document.getElementById('formRegister').classList.toggle('active', tab === 'register');
    document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
    clearAllErrors();
  };

  /* ---- REGISTER ---- */
  window.saveUser = function() {
    const email    = document.getElementById('regEmail').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    let ok = true;

    clearErr('err-re'); clearErr('err-ru'); clearErr('err-rp');

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { showErr('err-re', 'Email is required.'); ok = false; }
    else if (!emailRx.test(email)) { showErr('err-re', 'Enter a valid email.'); ok = false; }

    if (!username) { showErr('err-ru', 'Username is required.'); ok = false; }
    else if (username.length < 3) { showErr('err-ru', 'At least 3 characters.'); ok = false; }

    if (!password) { showErr('err-rp', 'Password is required.'); ok = false; }
    else if (password.length < 6) { showErr('err-rp', 'At least 6 characters.'); ok = false; }

    if (!ok) return;

    localStorage.setItem('regEmail', email);
    localStorage.setItem('regUsername', username);
    localStorage.setItem('regPassword', password);
    alert('Registration successful! You can now login. 🌸');
    switchTab('login');
  };

  /* ---- LOGIN ---- */
  window.checkLogin = function() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    let ok = true;

    clearErr('err-lu'); clearErr('err-lp'); clearErr('err-lmain');
    document.getElementById('loginUsername').classList.remove('error');
    document.getElementById('loginPassword').classList.remove('error');

    if (!username) { showErr('err-lu', 'Username is required.'); document.getElementById('loginUsername').classList.add('error'); ok = false; }
    if (!password) { showErr('err-lp', 'Password is required.'); document.getElementById('loginPassword').classList.add('error'); ok = false; }
    if (!ok) return;

    const savedUser = localStorage.getItem('regUsername');
    const savedPass = localStorage.getItem('regPassword');
    const isValid   = (username === savedUser && password === savedPass) ||
                      (username === 'admin' && password === 'admin123');

    if (isValid) {
      showOtp('Your OTP code is: ');
    } else {
      showErr('err-lmain', 'Invalid username or password. Please try again.');
      document.getElementById('loginUsername').classList.add('error');
      document.getElementById('loginPassword').classList.add('error');
    }
  };

  window.googleLogin = function() { showOtp('Google sign-in OTP: '); };

  function showOtp(prefix) {
    currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById('authForms').style.display  = 'none';
    document.getElementById('otpSection').style.display = 'block';
    document.getElementById('otpMessage').innerText = prefix + currentOtp;
    document.getElementById('otpInput').value = '';
    clearErr('err-otp');
  }

  window.verifyOtp = function() {
    const entered = document.getElementById('otpInput').value.trim();
    clearErr('err-otp');
    if (!entered) { showErr('err-otp', 'Please enter the OTP.'); return; }
    if (entered === currentOtp) {
      sessionStorage.setItem('loggedIn', 'true');
      alert('Login successful! Welcome, Cha! 💕');
      window.location.href = 'home.html';
    } else {
      showErr('err-otp', 'Invalid OTP. Please try again.');
    }
  };

  /* ---- PASSWORD TOGGLE ---- */
  window.togglePw = function() {
    const input = document.getElementById('loginPassword');
    const icon  = document.getElementById('eyeIcon');
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (icon) icon.className = 'fa-solid fa-eye-slash';
    } else {
      input.type = 'password';
      if (icon) icon.className = 'fa-solid fa-eye';
    }
  };

  /* ---- HELPERS ---- */
  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearErr(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  }
  function clearAllErrors() {
    ['err-lu','err-lp','err-lmain','err-re','err-ru','err-rp','err-otp'].forEach(clearErr);
    document.querySelectorAll('.modal-form input').forEach(i => i.classList.remove('error'));
  }

  /* ---- ENTER KEY for modal inputs ---- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal && closeModal();
  });

});
