const Config = (() => {
  const DEV_HOSTS = ["localhost", "127.0.0.1"];
  const isDev = DEV_HOSTS.includes(window.location.hostname);

  return {
    API_BASE: isDev ? "http://localhost:5000" : "https://vcart-api.onrender.com",
    isDevelopment: isDev,
  };
})();
