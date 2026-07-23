(function () {
  function resolveApiBase() {
    if (window.TRUVA_API_BASE) return window.TRUVA_API_BASE;
    const { protocol, hostname, port } = window.location;
    if (port === "8888") return protocol + "//" + hostname + ":8000";
    return window.location.origin;
  }

  const API_BASE = resolveApiBase();

  const overlay = document.getElementById("auth-overlay");
  const profileOverlay = document.getElementById("profile-overlay");
  const navAuthTrigger = document.getElementById("nav-auth-trigger");
  if (!overlay) return;

  const closeBtn = document.getElementById("auth-modal-close");
  const tabs = overlay.querySelectorAll(".auth-tab");
  const panels = overlay.querySelectorAll(".auth-panel");
  const signInForm = document.getElementById("auth-signin-form");
  const signUpForm = document.getElementById("auth-signup-form");
  const signInMessage = document.getElementById("auth-signin-message");
  const signUpMessage = document.getElementById("auth-signup-message");
  const linkedinSignInBtn = document.getElementById("auth-linkedin-signin");
  const linkedinSignUpBtn = document.getElementById("auth-linkedin-signup");
  const profileForm = document.getElementById("profile-complete-form");
  const profileMessage = document.getElementById("profile-complete-message");

  function getStoredSession() {
    const token = localStorage.getItem("truva_auth_token");
    const rawUser = localStorage.getItem("truva_auth_user");
    if (!token || !rawUser) return null;
    try {
      return { token, user: JSON.parse(rawUser) };
    } catch {
      return null;
    }
  }

  function profileComplete(user) {
    return Boolean(user && user.organization && user.role);
  }

  function userInitials(name) {
    return (name || "?")
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function storeSession(token, user) {
    localStorage.setItem("truva_auth_token", token);
    localStorage.setItem("truva_auth_user", JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("truva:auth-changed", { detail: user }));
    updateNavAuth(user);
  }

  function clearSession() {
    localStorage.removeItem("truva_auth_token");
    localStorage.removeItem("truva_auth_user");
    window.dispatchEvent(new CustomEvent("truva:auth-changed", { detail: null }));
    updateNavAuth(null);
  }

  function updateNavAuth(user) {
    if (!navAuthTrigger) return;

    if (!user) {
      navAuthTrigger.className = "nav-auth-btn";
      navAuthTrigger.innerHTML = "Sign In";
      navAuthTrigger.dataset.openAuth = "signin";
      delete navAuthTrigger.dataset.signedIn;
      return;
    }

    navAuthTrigger.className = "nav-user-btn";
    navAuthTrigger.dataset.signedIn = "1";
    delete navAuthTrigger.dataset.openAuth;

    const photo = user.profile_photo_url;
    const avatarMarkup = photo
      ? '<img class="nav-user-avatar" src="' + photo + '" alt="" referrerpolicy="no-referrer">'
      : '<span class="nav-user-initials" aria-hidden="true">' + userInitials(user.full_name) + "</span>";

    navAuthTrigger.innerHTML =
      avatarMarkup + '<span class="nav-user-name">' + (user.full_name || user.email) + "</span>";
  }

  function setActiveTab(tabName) {
    tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.tab === tabName);
    });
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === tabName);
    });
  }

  function openModal(tab) {
    setActiveTab(tab || "signin");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("is-open");
    if (!profileOverlay || !profileOverlay.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
    clearMessages();
  }

  function renderProfileUserPreview(user) {
    const preview = document.getElementById("profile-user-preview");
    if (!preview) return;

    if (!user) {
      preview.hidden = true;
      preview.innerHTML = "";
      return;
    }

    const photo = user.profile_photo_url;
    const avatarMarkup = photo
      ? '<img class="profile-preview-avatar" src="' + photo + '" alt="" referrerpolicy="no-referrer">'
      : '<span class="profile-preview-initials" aria-hidden="true">' + userInitials(user.full_name) + "</span>";

    preview.hidden = false;
    preview.innerHTML =
      avatarMarkup +
      '<span class="profile-preview-name">' +
      (user.full_name || user.email || "Welcome") +
      "</span>";
  }

  function openProfileModal(user) {
    if (!profileOverlay) return;
    const orgInput = document.getElementById("profile-organization");
    const roleInput = document.getElementById("profile-role");
    orgInput.value = (user && user.organization) || "";
    roleInput.value = (user && user.role) || "";
    renderProfileUserPreview(user);
    profileMessage.textContent = "";
    profileMessage.className = "auth-message";
    profileOverlay.classList.add("is-open");
    profileOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    orgInput.focus();
  }

  function closeProfileModal() {
    if (!profileOverlay) return;
    profileOverlay.classList.remove("is-open");
    profileOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    profileMessage.textContent = "";
    profileMessage.className = "auth-message";
    renderProfileUserPreview(null);
  }

  function showMessage(element, text, type) {
    element.textContent = text;
    element.className = "auth-message is-visible " + (type === "error" ? "is-error" : "is-success");
  }

  function clearMessages() {
    [signInMessage, signUpMessage].forEach((el) => {
      el.textContent = "";
      el.className = "auth-message";
    });
  }

  function buildLinkedInUrl(tab) {
    const params = new URLSearchParams({ tab });
    if (tab === "signup") {
      const fullName = document.getElementById("signup-full-name").value.trim();
      const organization = document.getElementById("signup-organization").value.trim();
      const role = document.getElementById("signup-role").value.trim();
      if (fullName) params.set("full_name", fullName);
      if (organization) params.set("organization", organization);
      if (role) params.set("role", role);
    }
    return API_BASE + "/api/auth/linkedin/login?" + params.toString();
  }

  async function submitAuth(path, payload, messageEl, submitBtn) {
    clearMessages();
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Please wait...";

    try {
      const response = await fetch(API_BASE + path, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed.");
      }

      storeSession(data.access_token, data.user);
      if (!profileComplete(data.user)) {
        closeModal();
        openProfileModal(data.user);
      } else {
        showMessage(messageEl, "Welcome, " + data.user.full_name + "!", "success");
        setTimeout(closeModal, 900);
      }
    } catch (error) {
      showMessage(messageEl, error.message || "Something went wrong.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  async function submitProfile(event) {
    event.preventDefault();
    const session = getStoredSession();
    if (!session) {
      showMessage(profileMessage, "Your session expired. Please sign in again.", "error");
      closeProfileModal();
      openModal("signin");
      return;
    }

    const submitBtn = profileForm.querySelector(".auth-submit");
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Saving...";
    profileMessage.textContent = "";
    profileMessage.className = "auth-message";

    const organization = document.getElementById("profile-organization").value.trim();
    const role = document.getElementById("profile-role").value.trim();

    try {
      const response = await fetch(API_BASE + "/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + session.token,
        },
        body: JSON.stringify({ organization, role }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || "Unable to save profile.");
      }

      const updatedUser = Object.assign({}, session.user, data);
      storeSession(session.token, updatedUser);
      showMessage(profileMessage, "Profile saved. Welcome to Truva!", "success");
      setTimeout(closeProfileModal, 700);
    } catch (error) {
      showMessage(profileMessage, error.message || "Something went wrong.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (profileOverlay && profileOverlay.classList.contains("is-open")) {
      event.preventDefault();
      return;
    }
    if (overlay.classList.contains("is-open")) closeModal();
  });

  document.querySelectorAll("[data-open-auth]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(trigger.dataset.openAuth || "signin");
    });
  });

  if (navAuthTrigger) {
    navAuthTrigger.addEventListener("click", (event) => {
      if (navAuthTrigger.dataset.signedIn === "1") {
        event.preventDefault();
      }
    });
  }

  signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAuth(
      "/api/auth/signin",
      {
        email: document.getElementById("signin-email").value.trim(),
        password: document.getElementById("signin-password").value,
      },
      signInMessage,
      signInForm.querySelector(".auth-submit")
    );
  });

  signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAuth(
      "/api/auth/signup",
      {
        email: document.getElementById("signup-email").value.trim(),
        password: document.getElementById("signup-password").value,
        full_name: document.getElementById("signup-full-name").value.trim(),
        organization: document.getElementById("signup-organization").value.trim(),
        role: document.getElementById("signup-role").value.trim(),
      },
      signUpMessage,
      signUpForm.querySelector(".auth-submit")
    );
  });

  linkedinSignInBtn.addEventListener("click", () => {
    window.location.href = buildLinkedInUrl("signin");
  });

  linkedinSignUpBtn.addEventListener("click", () => {
    window.location.href = buildLinkedInUrl("signup");
  });

  if (profileForm) {
    profileForm.addEventListener("submit", submitProfile);
  }

  async function fetchCurrentUser(token) {
    const response = await fetch(API_BASE + "/api/auth/me", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || "Unable to load your profile.");
    }
    return data;
  }

  function cleanAuthQueryParams() {
    const params = new URLSearchParams(window.location.search);
    [
      "auth_token",
      "auth_email",
      "auth_name",
      "auth_photo",
      "auth_organization",
      "auth_role",
      "auth_needs_profile",
      "auth_error",
    ].forEach((key) => params.delete(key));

    const nextQuery = params.toString();
    const nextUrl = window.location.pathname + (nextQuery ? "?" + nextQuery : "") + window.location.hash;
    window.history.replaceState({}, "", nextUrl);
  }

  async function handleOAuthRedirect() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("auth_token");
    const needsProfile = params.get("auth_needs_profile") === "1";
    const authError = params.get("auth_error");

    if (!token && !authError) return false;

    cleanAuthQueryParams();

    if (authError) {
      openModal("signin");
      showMessage(signInMessage, authError, "error");
      return true;
    }

    try {
      const user = await fetchCurrentUser(token);
      storeSession(token, user);
      closeModal();
      if (needsProfile || !profileComplete(user)) {
        openProfileModal(user);
      }
    } catch (error) {
      clearSession();
      openModal("signin");
      showMessage(signInMessage, error.message || "LinkedIn sign-in failed.", "error");
    }

    return true;
  }

  async function restoreSession() {
    const session = getStoredSession();
    if (!session) {
      updateNavAuth(null);
      return;
    }

    try {
      const user = await fetchCurrentUser(session.token);
      storeSession(session.token, user);
      if (!profileComplete(user)) {
        openProfileModal(user);
      }
    } catch {
      clearSession();
    }
  }

  if (profileOverlay) {
    profileOverlay.addEventListener("click", (event) => {
      if (event.target === profileOverlay) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  async function initAuth() {
    const handledOAuth = await handleOAuthRedirect();
    if (!handledOAuth) {
      await restoreSession();
    }
  }

  initAuth();
})();
