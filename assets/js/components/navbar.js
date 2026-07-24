/* Desktop nav links + actions — default hidden (mobile-first) */
.navbar-links,
.navbar-actions { display: none; }

.navbar-links { align-items: center; gap: 28px; }
.navbar-links a {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-ink);
  padding: 6px 0;
  border-bottom: 2px solid transparent;
  transition: color .15s ease, border-color .15s ease;
}
.navbar-links a:hover { color: var(--color-primary); }
.navbar-links a.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
.navbar-actions { align-items: center; gap: 12px; }
.navbar-actions .btn { padding: 9px 18px; font-size: 14px; }

/* Desktop: links/actions dikhao, hamburger chhupao */
@media (min-width: 900px) {
  .navbar-links { display: flex; }
  .navbar-actions { display: flex; }
  .navbar-toggle { display: none; }
}
