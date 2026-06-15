import { useState, useEffect } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout }      from '../slices/userSlice.js';
import { unloadCart }  from '../slices/cartSlice.js';
import { Container, Navbar, Nav, Badge, Dropdown } from 'react-bootstrap';

// Aplica o tema salvo antes de qualquer render
const savedTheme = localStorage.getItem('nc-theme') || 'dark';
document.documentElement.classList.toggle('light', savedTheme === 'light');

const Header = () => {
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const { userInfo } = useSelector(s => s.user);
  const { cartItems} = useSelector(s => s.cart);

  const [logoHover,     setLogoHover]     = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [logoutMsg,     setLogoutMsg]     = useState(false);
  const [isLight,       setIsLight]       = useState(savedTheme === 'light');

  const totalItems = cartItems.reduce((acc, i) => acc + i.qty, 0);

  const toggleTheme = () => {
    const next = isLight ? 'dark' : 'light';
    setIsLight(!isLight);
    localStorage.setItem('nc-theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  const handleLogoutClick   = () => setConfirmLogout(true);
  const handleLogoutCancel  = () => setConfirmLogout(false);
  const handleLogoutConfirm = () => {
    setConfirmLogout(false);
    setLogoutMsg(true);
    setTimeout(() => {
      dispatch(unloadCart());
      dispatch(logout());
      setLogoutMsg(false);
      navigate('/login');
    }, 1200);
  };

  return (
    <>
      <header style={{
        background: isLight ? '#ede8df' : '#0d0d0d',
        borderBottom: '1px solid #c9a84c',
        position: 'sticky', top: 0, zIndex: 1000,
        transition: 'background .2s',
      }}>
        <Container>
          <Navbar expand="lg" variant={isLight ? 'light' : 'dark'}
            style={{ background: 'transparent', padding: '14px 0' }}>

            <Navbar.Brand as={Link} to="/"
              onMouseEnter={() => setLogoHover(true)}
              onMouseLeave={() => setLogoHover(false)}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: logoHover ? '#a8873a' : '#c9a84c',
                fontSize: '18px', letterSpacing: '4px',
                fontWeight: 700, textTransform: 'uppercase',
                transition: 'color .2s', textDecoration: 'none',
              }}>
              NOIR CELLAR
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="main-nav" />

            <Navbar.Collapse id="main-nav">
              <Nav className="ms-auto align-items-center" style={{ gap: '8px' }}>

                <Nav.Link as={Link} to="/" className="nav-link-custom">Coleção</Nav.Link>
                <Nav.Link as={Link} to="/cart" className="nav-link-custom">
                  Carrinho
                  {totalItems > 0 && (
                    <Badge bg="warning" text="dark" className="ms-1" style={{ fontSize: '10px' }}>
                      {totalItems}
                    </Badge>
                  )}
                </Nav.Link>

                {/* Botão de tema */}
                <button
                  onClick={toggleTheme}
                  title={isLight ? 'Modo escuro' : 'Modo claro'}
                  style={{
                    background: 'none',
                    border: `1px solid ${isLight ? '#ccc4b4' : '#2a2a2a'}`,
                    borderRadius: 2,
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: 14,
                    lineHeight: 1,
                    transition: 'border-color .2s',
                    color: isLight ? '#555' : '#aaa',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = isLight ? '#ccc4b4' : '#2a2a2a'}
                >
                  {isLight ? '🌙' : '☀️'}
                </button>

                {userInfo ? (
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="outline-warning" size="sm" style={dropStyle}>
                      {userInfo.name.split(' ')[0]}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{
                      background: isLight ? '#ede8df' : '#111',
                      border: `1px solid ${isLight ? '#ccc4b4' : '#2a2a2a'}`,
                    }}>
                      <Dropdown.Item as={Link} to="/profile"
                        style={{ ...dropItemStyle, color: isLight ? '#333' : '#aaa' }}>
                        Minha Área
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/orders"
                        style={{ ...dropItemStyle, color: isLight ? '#333' : '#aaa' }}>
                        Meus Pedidos
                      </Dropdown.Item>
                      {userInfo.isAdmin && (<>
                        <Dropdown.Divider style={{ borderColor: isLight ? '#ccc4b4' : '#2a2a2a' }} />
                        <Dropdown.Item as={Link} to="/admin"
                          style={{ ...dropItemStyle, color: '#c9a84c' }}>
                          Painel Admin
                        </Dropdown.Item>
                      </>)}
                      <Dropdown.Divider style={{ borderColor: isLight ? '#ccc4b4' : '#2a2a2a' }} />
                      <Dropdown.Item onClick={handleLogoutClick}
                        style={{ ...dropItemStyle, color: '#e05a5a' }}>
                        Sair
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Nav.Link as={Link} to="/login" className="login-btn"
                    style={{ ...navStyle, border: '1px solid #c9a84c',
                      padding: '6px 16px', borderRadius: '2px', color: '#c9a84c' }}>
                    Entrar
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </header>

      {logoutMsg && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 9999,
          background: '#0a1a10', border: '1px solid #2f7b45',
          color: '#7be0a0', padding: '12px 20px', borderRadius: 2,
          fontSize: 13, fontFamily: "'Montserrat', sans-serif", letterSpacing: 1,
        }}>
          Até logo! Sessão encerrada com sucesso.
        </div>
      )}

      {confirmLogout && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: isLight ? '#f5f0e8' : '#111',
            border: `1px solid ${isLight ? '#ccc4b4' : '#2a2a2a'}`,
            padding: '36px 40px', maxWidth: 360, width: '90%', textAlign: 'center',
          }}>
            <p style={{ fontFamily: "'Playfair Display', serif",
              fontSize: 20, color: isLight ? '#1a1410' : '#f0ece4', marginBottom: 10 }}>
              Sair da conta?
            </p>
            <p style={{ color: '#777', fontSize: 13, marginBottom: 28 }}>
              Você será desconectado da sua conta NOIR CELLAR.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-gold" onClick={handleLogoutConfirm}>Confirmar</button>
              <button className="btn-outline" onClick={handleLogoutCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const navStyle   = { fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#aaaaaa', transition: 'color .2s' };
const dropStyle  = { background: 'transparent', border: '1px solid #c9a84c', color: '#c9a84c', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' };
const dropItemStyle = { fontSize: '13px', fontFamily: "'Montserrat', sans-serif" };

export default Header;