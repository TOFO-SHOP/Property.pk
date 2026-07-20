const storage = {
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  get(key) {
    const item = localStorage.getItem(key);
    try { return item ? JSON.parse(item) : null; } catch { return item; }
  },
  remove(key) { localStorage.removeItem(key); },
  clear() { localStorage.clear(); }
};
