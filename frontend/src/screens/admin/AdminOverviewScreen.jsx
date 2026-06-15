import { useEffect, useState }  from 'react';
import { useSelector }          from 'react-redux';
import { Row, Col }             from 'react-bootstrap';
import axios                    from 'axios';
import AdminLayout              from '../../components/AdminLayout.jsx';
import Loader                   from '../../components/Loader.jsx';
import Message                  from '../../components/Message.jsx';

const AdminOverviewScreen = () => {
  const { userInfo }               = useSelector((s) => s.user);
  const [stats,   setStats]        = useState(null);
  const [loading, setLoading]      = useState(true);
  const [error,   setError]        = useState('');

  const fmt = (v) =>
    Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          axios.get('/api/orders',   config),
          axios.get('/api/products'),
          axios.get('/api/users',    config),
        ]);

        const orders   = ordersRes.data;
        const revenue  = orders.reduce((a, o) => a + o.totalPrice, 0);
        const paid     = orders.filter((o) => o.isPaid).length;

        setStats({
          totalOrders:   orders.length,
          paidOrders:    paid,
          revenue,
          totalProducts: productsRes.data.length,
          totalUsers:    usersRes.data.length,
        });
      } catch (err) {
        setError('Não foi possível carregar as estatísticas.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userInfo]);

  return (
    <AdminLayout>
      <h2 className="nc-admin-section-title">Visão Geral</h2>

      {loading && <Loader label="Carregando estatísticas..." />}
      {error   && <Message variant="error">{error}</Message>}

      {stats && (
        <Row xs={1} sm={2} xl={4} className="g-3">
          {[
            { label: 'Pedidos',          value: stats.totalOrders   },
            { label: 'Pedidos Pagos',    value: stats.paidOrders    },
            { label: 'Receita Total',    value: fmt(stats.revenue)  },
            { label: 'Produtos',         value: stats.totalProducts },
            { label: 'Usuários',         value: stats.totalUsers    },
          ].map((s) => (
            <Col key={s.label}>
              <div className="nc-admin-stat">
                <div className="nc-admin-stat-value">{s.value}</div>
                <div className="nc-admin-stat-label">{s.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </AdminLayout>
  );
};

export default AdminOverviewScreen;