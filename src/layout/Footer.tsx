import { Link } from "react-router-dom";
import "../styles/Footer.css"; // Import the CSS file from styles folder
import logo from "../assets/logo/namjh654_logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={logo} alt="namjh654 Logo" className="footer-logo" />
        <ul className="footer-links">
          <li>
            <Link to="/contact">Contact JH</Link>
          </li>
          <li>
            <Link to="/support">Support</Link>
          </li>
        </ul>
        <p>&copy; 2024 namJH654. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
