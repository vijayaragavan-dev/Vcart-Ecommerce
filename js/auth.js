// VCart Authentication Module - Flask Backend

const API_BASE = Config.API_BASE;

const Auth = {
  _sessionChecked: false,

  async init() {
    this._user = Utils.getFromStorage("vcart_current_user", null);
    await this.checkSession();
    this._sessionChecked = true;
    this.updateUI();
    this.bindEvents();
  },

  async checkSession() {
    try {
      const res = await fetch(API_BASE + "/api/auth/session", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.authenticated && data.user) {
        this._user = data.user;
        Utils.setToStorage("vcart_current_user", data.user);
      } else {
        this._user = null;
        localStorage.removeItem("vcart_current_user");
      }
    } catch {
      this._user = Utils.getFromStorage("vcart_current_user", null);
    }
    return this._user;
  },

  getCurrentUser() {
    return this._user || Utils.getFromStorage("vcart_current_user", null);
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  async login(username, password) {
    try {
      const res = await fetch(API_BASE + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        this._user = data.user;
        Utils.setToStorage("vcart_current_user", data.user);
        this.updateUI();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: "Unable to connect to server. Please try again." };
    }
  },

  async signup(username, password, email) {
    try {
      const res = await fetch(API_BASE + "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
          confirm_password: password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        this._user = data.user;
        Utils.setToStorage("vcart_current_user", data.user);
        this.updateUI();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: "Unable to connect to server. Please try again." };
    }
  },

  async logout() {
    try {
      await fetch(API_BASE + "/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
    }
    this._user = null;
    localStorage.removeItem("vcart_current_user");
    this.updateUI();
    Utils.showToast("Logged out successfully");
    setTimeout(() => window.location.reload(), 500);
  },

  updateUI() {
    const user = this.getCurrentUser();
    const loginBtn = document.querySelector(".login-btn");
    const userProfileBtn = document.querySelector(".user-profile-btn");
    const userNameEl = document.querySelector(".user-name");
    const userAvatarEl = document.querySelector(".user-avatar");

    if (user) {
      if (loginBtn) loginBtn.classList.remove("visible");
      if (userProfileBtn) userProfileBtn.classList.add("visible");
      if (userNameEl) userNameEl.textContent = user.username;
      if (userAvatarEl) userAvatarEl.textContent = user.username.charAt(0).toUpperCase();
    } else {
      if (loginBtn) loginBtn.classList.add("visible");
      if (userProfileBtn) userProfileBtn.classList.remove("visible");
    }

    const sidebarAuth = document.getElementById("sidebar-auth");
    if (sidebarAuth) {
      if (user) {
        sidebarAuth.innerHTML =
          '<a href="/pages/profile.html">My Profile</a>' +
          '<a href="#" id="sidebar-logout">Logout</a>';
        const logoutLink = document.getElementById("sidebar-logout");
        if (logoutLink)
          logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            this.logout();
          });
      } else {
        sidebarAuth.innerHTML =
          '<a href="/pages/login.html">Login</a>' +
          '<a href="/pages/signup.html">Sign Up</a>';
      }
    }
  },

  bindEvents() {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (!username || !password) {
          Utils.showToast("Please fill in all fields", "error");
          return;
        }

        const result = await this.login(username, password);
        if (result.success) {
          Utils.showToast("Welcome back, " + username + "!");
          setTimeout(() => {
            const redirect =
              new URLSearchParams(window.location.search).get("redirect") ||
              "/index.html";
            window.location.href = redirect;
          }, 500);
        } else {
          Utils.showToast(result.message, "error");
        }
      });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("signup-username").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value.trim();
        const confirm = document.getElementById("signup-confirm").value.trim();

        if (!username || !password || !confirm) {
          Utils.showToast("Please fill in all fields", "error");
          return;
        }

        if (password.length < 8) {
          Utils.showToast("Password must be at least 8 characters", "error");
          return;
        }

        if (password !== confirm) {
          Utils.showToast("Passwords do not match", "error");
          return;
        }

        const result = await this.signup(username, password, email);
        if (result.success) {
          Utils.showToast("Account created successfully!");
          setTimeout(() => {
            window.location.href = "/index.html";
          }, 500);
        } else {
          Utils.showToast(result.message, "error");
        }
      });
    }
  },
};
