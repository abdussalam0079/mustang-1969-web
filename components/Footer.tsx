export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__left">
        *Performance figures shown are illustrative. Power output, weight, and
        performance data are based on engineering estimates and may differ from
        final production specifications. Always refer to official manufacturer
        data before publishing.
      </p>
      <nav className="site-footer__links">
        <a href="#">Privacy</a>
        <a href="#">Legal</a>
        <a href="#">Cookies</a>
        <span style={{ color: "#2A2A2A" }}>
          &copy; {new Date().getFullYear()} Mustang Dark Horse Centenario
        </span>
      </nav>
    </footer>
  );
}
