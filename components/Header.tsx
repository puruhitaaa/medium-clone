import Link from 'next/link';

const Header = () => {
  return (
    <header className="header">
      <div className="header-brand">
        <Link href="/">
          <img
            alt="medium-logo"
            className="header-icon"
            src="https://bit.ly/32nVsxE"
          />
        </Link>

        <nav className="header-nav">
          <h3 className="header-navItem">About</h3>
          <h3 className="header-navItem">Contact</h3>
          <h3 className="btn-filled">Follow</h3>
        </nav>
      </div>

      <div className="header-cta">
        <h3 className="header-navItem">Sign in</h3>
        <h3 className="btn-outline">Get started</h3>
      </div>
    </header>
  );
};

export default Header;
