(function () {
  const config = window.__APP_CONFIG__ || {};
  const API_BASE_URL = String(config.API_BASE_URL || "").replace(/\/$/, "");
  const TOKEN_KEY = "uzbekistan_api_token";

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getToken();

    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Server bilan bog'lanishda xatolik yuz berdi.");
    }

    return data;
  }

  async function register(payload) {
    const result = await request("/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setToken(result.token);
    return result;
  }

  async function login(payload) {
    const result = await request("/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setToken(result.token);
    return result;
  }

  function getUsers() {
    return request("/users");
  }

  function updateUser(id, payload) {
    return request(`/users/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  }

  function deleteUser(id) {
    return request(`/users/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  }

  window.UzbekistanAPI = {
    request,
    register,
    login,
    getUsers,
    updateUser,
    deleteUser,
    getToken,
    setToken,
    clearToken
  };
})();
