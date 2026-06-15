import { useEffect, useState }        from 'react';
import { useParams, Link }            from 'react-router-dom';
import { useSelector }                from 'react-redux';
import { Container, Row, Col }        from 'react-bootstrap';
import axios                          from 'axios';
import Loader                         from '../components/Loader.jsx';
import Message                        from '../components/Message.jsx';

const OrderScreen = () => {
  const { id }        = useParams();
  const { userInfo }  = useSelector((s) => s.user);

  const [order,    setOrder]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [actMsg,   setActMsg]   = useState('');
  const [actErr,   setActErr]   = useState('');
  const [actLoad,  setActLoad]  = useState(false);

  const fmt = (v) =>
    Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`, config);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível carregar o pedido.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const simulatePayHandler = async () => {
    setActMsg(''); setActErr('');
    try {
      setActLoad(true);
      await axios.put(`/api/orders/${id}/simulate-pay`, {}, config);
      setActMsg('Pagamento confirmado com sucesso!');
      fetchOrder();
    } catch (err) {
      setActErr(err.response?.data?.message || 'Erro ao processar pagamento.');
    } finally { setActLoad(false); }
  };

  const cancelHandler = async () => {
    if (!window.confirm('Deseja cancelar este pedido? Esta ação não pode ser desfeita.')) return;
    setActMsg(''); setActErr('');
    try {
      setActLoad(true);
      await axios.put(`/api/orders/${id}/cancel`, {}, config);
      setActMsg('Pedido cancelado.');
      fetchOrder();
    } catch (err) {
      setActErr(err.response?.data?.message || 'Erro ao cancelar pedido.');
    } finally { setActLoad(false); }
  };

  if (loading) return <Loader label="Buscando pedido..." />;
  if (error)   return (
    <Container style={{ padding: '48px 0' }}>
      <Message variant="error">{error}</Message>
    </Container>
  );

  // Linha de status
  const steps = [
    { key: 'placed',    label: 'Pedido realizado',    done: true },
    { key: 'paid',      label: 'Pagamento confirmado', done: order.isPaid },
    { key: 'preparing', label: 'Em preparo',           done: order.isPaid && !order.isDelivered },
    { key: 'shipped',   label: 'Enviado',              done: order.isDelivered },
    { key: 'delivered', label: 'Entregue',             done: order.isDelivered },
  ];

  const activeStep = order.isCancelled ? -1
    : order.isDelivered ? 4
    : order.isPaid ? 2
    : 0;

  return (
    <Container style={{ padding: '48px 0' }}>
      <p className="tag-category" style={{ marginBottom: 8 }}>Pedido confirmado</p>
      <h1 className="section-heading" style={{ marginBottom: 4 }}>
        Obrigado, {order.user?.name?.split(' ')[0]}!
      </h1>
      <p className="nc-order-id" style={{ marginBottom: 32 }}>
        #{order._id}
      </p>

      {actMsg && <Message variant="success">{actMsg}</Message>}
      {actErr && <Message variant="error">{actErr}</Message>}

      {/* ── Linha de status ── */}
      {!order.isCancelled ? (
        <div style={{
          background: 'var(--nc-black2)', border: '1px solid var(--nc-border)',
          padding: '20px 28px', marginBottom: 28,
        }}>
          <p className="tag-category" style={{ marginBottom: 16 }}>Status do pedido</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const isPast   = i < activeStep;
              const color    = isPast || isActive ? 'var(--nc-gold)' : 'var(--nc-border)';
              const textColor= isPast || isActive ? 'var(--nc-white)' : 'var(--nc-gray)';
              return (
                <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? '1' : '0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}>
                    <div style={{
                      width: 12, height: 12, borderRadius: '50%',
                      background: isPast || isActive ? 'var(--nc-gold)' : 'var(--nc-black3)',
                      border: `2px solid ${color}`,
                      marginBottom: 8,
                    }} />
                    <span style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
                      color: textColor, textAlign: 'center', lineHeight: 1.3 }}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      flex: 1, height: 1,
                      background: isPast ? 'var(--nc-gold)' : 'var(--nc-border)',
                      margin: '0 4px', marginBottom: 24,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Message variant="error">Este pedido foi cancelado.</Message>
      )}

      <Row>
        <Col lg={7}>
          {/* Entrega */}
          <div className="nc-checkout-section">
            <h2 className="nc-checkout-section-title">Endereço de Entrega</h2>
            <p style={{ color: '#bbb', fontSize: 14, lineHeight: 1.8 }}>
              {order.shippingAddress.address},&nbsp;
              {order.shippingAddress.city},&nbsp;
              {order.shippingAddress.postalCode},&nbsp;
              {order.shippingAddress.country}
            </p>
            <div style={{ marginTop: 12 }}>
              <span className={`nc-status-badge ${order.isDelivered ? 'delivered' : 'unpaid'}`}>
                {order.isDelivered
                  ? `Entregue em ${new Date(order.deliveredAt).toLocaleDateString('pt-BR')}`
                  : 'Aguardando envio'}
              </span>
            </div>
          </div>

          {/* Pagamento */}
          <div className="nc-checkout-section">
            <h2 className="nc-checkout-section-title">Forma de Pagamento</h2>
            <p style={{ color: '#bbb', fontSize: 14 }}>{order.paymentMethod}</p>
            <div style={{ marginTop: 12 }}>
              <span className={`nc-status-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                {order.isPaid
                  ? `Pago em ${new Date(order.paidAt).toLocaleDateString('pt-BR')}`
                  : 'Aguardando pagamento'}
              </span>
            </div>

            {/* Botões de ação */}
            {!order.isPaid && !order.isCancelled && (
              <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                <button
                  className="btn-gold"
                  onClick={simulatePayHandler}
                  disabled={actLoad}
                >
                  {actLoad ? 'Processando...' : '✓ Simular Pagamento'}
                </button>
                <button
                  className="btn-outline"
                  onClick={cancelHandler}
                  disabled={actLoad}
                  style={{ borderColor: 'var(--nc-wine)', color: '#e08a92' }}
                >
                  Cancelar Pedido
                </button>
              </div>
            )}
          </div>

          {/* Itens */}
          <div className="nc-checkout-section">
            <h2 className="nc-checkout-section-title">Itens do Pedido</h2>
            {order.orderItems.map((item, i) => (
              <div key={i} className="nc-cart-item" style={{ paddingTop: 14, paddingBottom: 14 }}>
                <div className="nc-cart-item-img">
                  <img src={item.image} alt={item.name}
                    onError={(e) => { e.target.style.opacity = 0; }} />
                </div>
                <div className="nc-cart-item-info">
                  <p className="nc-cart-item-name" style={{ fontSize: 15 }}>{item.name}</p>
                  <p className="nc-cart-item-brand">{item.qty} × {fmt(item.price)}</p>
                </div>
                <div className="nc-cart-item-price">{fmt(item.qty * item.price)}</div>
              </div>
            ))}
          </div>
        </Col>

        {/* Resumo */}
        <Col lg={5}>
          <div className="nc-cart-summary">
            <p className="tag-category" style={{ marginBottom: 16 }}>Resumo</p>
            <div className="nc-summary-row">
              <span>Subtotal</span><span>{fmt(order.itemsPrice)}</span>
            </div>
            <div className="nc-summary-row">
              <span>Frete</span>
              <span style={{ color: order.shippingPrice === 0 ? '#5ae08a' : 'inherit' }}>
                {order.shippingPrice === 0 ? 'Grátis' : fmt(order.shippingPrice)}
              </span>
            </div>
            <div className="nc-summary-row">
              <span>Impostos</span><span>{fmt(order.taxPrice)}</span>
            </div>
            <div className="nc-summary-total">
              <span>Total</span>
              <span className="gold">{fmt(order.totalPrice)}</span>
            </div>
            <Link to="/orders"
              className="btn-outline nc-btn-block"
              style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
              Ver meus pedidos
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderScreen;
