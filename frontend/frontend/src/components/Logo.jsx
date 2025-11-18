import { Link } from 'react-router-dom';
import logo from '/logo GD.svg';
import './Logo.css';

function Logo({ size = 'medium', clickable = true }) {
  const sizes = {
    small: '40px',
    medium: '50px',
    large: '70px'
  };

  const logoStyle = {
    height: sizes[size],
    width: 'auto'
  };

  if (clickable) {
    return (
      <Link to="/" className="logo-link">
        <img 
          src={logo} 
          alt="Gabriel Diseña" 
          style={logoStyle}
          className="logo-image"
        />
      </Link>
    );
  }

  return (
    <img 
      src={logo} 
      alt="Gabriel Diseña" 
      style={logoStyle}
      className="logo-image"
    />
  );
}

export default Logo;