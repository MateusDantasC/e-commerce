import { useEffect, useState }  from 'react';
import { useSelector }          from 'react-redux';
import { Link }                 from 'react-router-dom';
import axios                    from 'axios';
import AdminLayout              from '../../components/AdminLayout.jsx';
import Loader                   from '../../components/Loader.jsx';
import Message                  from '../../components/Message.jsx';

const AdminOrdersScreen = () => {
  const { userInfo }            = useSelector((s) => s.user);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [actMsg,   setActMsg]   = useState('');

  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const fmt    = (v) => Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch { setError('Não foi possível carregar os pedidos.'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const deliverHandler = async (id) => {
    try {
      setActMsg('');
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      setActMsg('Pedido marcado como entregue.');
      fetchOrders();
    } catch (err) {
      setActMsg(err.response?.data?.message || 'Erro ao atualizar pedido.');
    }
  };

  const payHandler = async (id) => {
    try {
      setActMsg('');
      await axios.put(`/api/orders/${id}/simulate-pay`, {}, config);
      setActMsg('Pagamento confirmado manualmente.');
      fetchOrders();
    } catch (err) {
      setActMsg(err.response?.data?.message || 'Erro ao confirmar pagamento.');
    }
  };

  const statusOf = (o) => {
    if (o.isCancelled)  return { label: 'Cancelado',  cls: 'unpaid' };
    if (o.isDelivered)  return { label: 'Entregue',   cls: 'delivered' };
    if (o.isPaid)       return { label: 'Pago',        cls: 'paid' };
    return               { label: 'Pendente',          cls: 'unpaid' };
  };

  return (
    <AdminLayout>
      <h2 className="nc-admin-section-title">Todos os Pedidos</h2>

      {actMsg && (
        <Message variant={actMsg.toLowerCase().includes('erro') ? 'error' : 'success'}>
          {actMsg}
        </Message>
      )}

      {loading && <Loader label="Carregando pedidos..." />}
      {error   && <Message variant="error">{error}</Message>}

      {!loading && (
        <table className="nc-admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Cliente</th><th>Total</th>
              <th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const { label, cls } = statusOf(o);
              return (
                <tr key={o._id}>
                  <td>
                    <Link to={`/orders/${o._id}`}
                      style={{ fontSize:11, color:'var(--nc-gold)',
                        fontFamily:'monospace', letterSpacing:1 }}>
                      #{o._id.slice(-8)}
                    </Link>
                  </td>
                  <td>
                    <div style={{ fontSize:13, color:'var(--nc-white)' }}>{o.user?.name}</div>
                    <div style={{ fontSize:11, color:'var(--nc-gray)' }}>{o.user?.email}</div>
                  </td>
                  <td style={{ color:'var(--nc-gold)',
                    fontFamily:"'Playfair Display',serif" }}>
                    {fmt(o.totalPrice)}
                  </td>
                  <td>
                    <span className={`nc-status-badge ${cls}`}>{label}</span>
                  </td>
                  <td>
                    {/* Confirmar pagamento se ainda não pago e não cancelado */}
                    {!o.isPaid && !o.isCancelled && (
                      <button
                        className="nc-admin-action-btn"
                        onClick={() => payHandler(o._id)}
                        title="Confirmar pagamento manualmente"
                      >
                        Confirmar Pag.
                      </button>
                    )}
                    {/* Marcar como entregue se pago e não entregue e não cancelado */}
                    {o.isPaid && !o.isDelivered && !o.isCancelled && (
                      <button
                        className="nc-admin-action-btn success-btn"
                        onClick={() => deliverHandler(o._id)}
                      >
                        Marcar Entregue
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default AdminOrdersScreen;
