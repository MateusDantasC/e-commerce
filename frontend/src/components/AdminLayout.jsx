import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector }                    from 'react-redux';
import { useEffect }                      from 'react';
import { Container }                      from 'react-bootstrap';

const AdminLayout = ({ children }) => {
  const { userInfo } = useSelector((s) => s.user);
  const location     = useLocation();
  const navigate     = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  if (!userInfo || !userInfo.isAdmin) return null;

  const navItems = [
    { to: '/admin',          label: 'Visão Geral' },
    { to: '/admin/products', label: 'Produtos'    },
    { to: '/admin/orders',   label: 'Pedidos'     },
    { to: '/admin/users',    label: 'Usuários'    },
  ];

  return (
    <Container className="nc-admin-page">
      <p className="tag-category" style={{ marginBottom: 8 }}>Painel</p>
      <h1 className="section-heading" style={{ marginBottom: 32 }}>
        Administração
      </h1>

      <div className="nc-admin-layout">
        <nav className="nc-admin-sidebar">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nc-admin-nav-item ${
                location.pathname === item.to ? 'active' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nc-admin-content">
          {children}
        </div>
      </div>
    </Container>
  );
};

export default AdminLayout;