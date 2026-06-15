import { useEffect, useState }  from 'react';
import { Link }                 from 'react-router-dom';
import { useSelector }          from 'react-redux';
import { Container }            from 'react-bootstrap';
import axios                    from 'axios';
import Loader                   from '../components/Loader.jsx';
import Message                  from '../components/Message.jsx';

const MyOrdersScreen = () => {
  const { userInfo }  = useSelector((s) => s.user);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const fmt = (v) =>
    Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Não foi possível carregar seus pedidos.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo]);

  return (
    <Container className="nc-orders-page">
      <p className="tag-category" style={{ marginBottom: 8 }}>Sua conta</p>
      <h1 className="section-heading" style={{ marginBottom: 32 }}>Meus Pedidos</h1>

      {loading && <Loader label="Buscando pedidos..." />}
      {error   && <Message variant="error">{error}</Message>}

      {!loading && !error && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <p style={{ color: 'var(--nc-gray)', marginBottom: 24, fontSize: 14 }}>
            Você ainda não fez nenhum pedido.
          </p>
          <Link to="/" className="btn-gold" style={{ textDecoration: 'none' }}>
            Explorar Coleção
          </Link>
        </div>
      )}

      {!loading && !error && orders.map((order) => (
        <Link
          key={order._id}
          to={`/orders/${order._id}`}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <div className="nc-order-card">
            <div className="nc-order-card-header">
              <div>
                <p className="nc-order-id">#{order._id}</p>
                <p style={{ color: 'var(--nc-gray)', fontSize: 12, marginTop: 4 }}>
                  {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <p className="nc-order-total">{fmt(order.totalPrice)}</p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {order.isCancelled ? (
                <span className="nc-status-badge unpaid">Cancelado</span>
              ) : (
                <>
                  <span className={`nc-status-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                    {order.isPaid ? 'Pago' : 'Aguardando pagamento'}
                  </span>
                  {order.isDelivered && (
                    <span className="nc-status-badge delivered">Entregue</span>
                  )}
                </>
              )}
            </div>

            <div className="nc-order-items-preview">
              {order.orderItems.slice(0, 4).map((item, i) => (
                <div className="nc-order-item-thumb" key={i}>
                  <img src={item.image} alt={item.name}
                    onError={(e) => { e.target.style.opacity = 0; }} />
                </div>
              ))}
              {order.orderItems.length > 4 && (
                <div className="nc-order-item-thumb"
                  style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'var(--nc-gray)', fontSize: 11 }}>
                  +{order.orderItems.length - 4}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </Container>
  );
};

export default MyOrdersScreen;