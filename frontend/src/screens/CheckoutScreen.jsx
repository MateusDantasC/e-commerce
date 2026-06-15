import { useState }                  from 'react';
import { useNavigate, Link }         from 'react-router-dom';
import { useSelector, useDispatch }  from 'react-redux';
import { Container, Row, Col }       from 'react-bootstrap';
import axios                         from 'axios';
import { clearCart }                 from '../slices/cartSlice.js';
import Message                       from '../components/Message.jsx';

const TAX_RATE     = 0.15;
const FREE_SHIP_AT = 500;
const SHIP_PRICE   = 35;

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((s) => s.cart);
  const { userInfo }  = useSelector((s) => s.user);

  const [address,    setAddress]    = useState('');
  const [city,       setCity]       = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country,    setCountry]    = useState('Brasil');
  const [payment,    setPayment]    = useState('PIX');
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);
  

  const itemsPrice   = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const shippingPrice = itemsPrice >= FREE_SHIP_AT ? 0 : SHIP_PRICE;
  const taxPrice     = Number((itemsPrice * TAX_RATE).toFixed(2));
  const totalPrice   = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  

  const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    
  const cepLimpo = postalCode.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setError('CEP inválido. Informe um CEP com 8 dígitos.');
      return;
    }

    if (!address.trim() || !city.trim() || !postalCode.trim()) {
      setError('Preencha todos os campos de endereço.');
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems.map((i) => ({
          name:    i.name,
          qty:     i.qty,
          image:   i.image,
          price:   i.price,
          product: i._id,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: payment,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }, config);

      dispatch(clearCart());
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Não foi possível criar o pedido. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container style={{ padding: '64px 16px', textAlign: 'center' }}>
        <p className="nc-product-desc">Seu carrinho está vazio.</p>
        <Link to="/" className="btn-gold" style={{ textDecoration: 'none' }}>
          Voltar à coleção
        </Link>
      </Container>
    );
  }

  return (
    <Container className="nc-checkout-page">
      <p className="tag-category" style={{ marginBottom: 8 }}>Finalização</p>
      <h1 className="section-heading" style={{ marginBottom: 32 }}>
        Checkout
      </h1>

      {error && <Message variant="error">{error}</Message>}

      <form onSubmit={submitHandler}>
        <Row>
          <Col lg={7}>
            {/* Endereço */}
            <div className="nc-checkout-section">
              <h2 className="nc-checkout-section-title">Endereço de Entrega</h2>
              <div style={{ marginBottom: 16 }}>
                <label className="nc-label">Endereço</label>
                <input className="nc-input" placeholder="Rua, número, complemento"
                  value={address} onChange={(e) => setAddress(e.target.value)}
                  disabled={loading} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label className="nc-label">Cidade</label>
                  <input className="nc-input" placeholder="Sua cidade"
                    value={city} onChange={(e) => setCity(e.target.value)}
                    disabled={loading} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="nc-label">CEP</label>
                  <input
                    className="nc-input"
                    placeholder="00000-000"
                    value={postalCode}
                    maxLength={9}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setPostalCode(v.length > 5 ? `${v.slice(0,5)}-${v.slice(5)}` : v);
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="nc-label">País</label>
                <input className="nc-input"
                  value={country} onChange={(e) => setCountry(e.target.value)}
                  disabled={loading} />
              </div>
            </div>

            {/* Pagamento */}
            <div className="nc-checkout-section">
              <h2 className="nc-checkout-section-title">Forma de Pagamento</h2>
              {['PIX', 'Cartão de Crédito', 'Boleto'].map((method) => (
                <label
                  key={method}
                  className={`nc-payment-option ${payment === method ? 'selected' : ''}`}
                  onClick={() => setPayment(method)}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={payment === method}
                    onChange={() => setPayment(method)}
                  />
                  {method}
                </label>
              ))}
            </div>
          </Col>

          {/* Resumo */}
          <Col lg={5} style={{ marginTop: 0 }}>
            <div className="nc-cart-summary" style={{ position: 'sticky', top: 100 }}>
              <p className="tag-category" style={{ marginBottom: 16 }}>
                Resumo do Pedido
              </p>

              {cartItems.map((i) => (
                <div className="nc-order-summary-item" key={i._id}>
                  <span style={{ color: '#ccc' }}>{i.name} × {i.qty}</span>
                  <span>{fmt(i.price * i.qty)}</span>
                </div>
              ))}

              <div style={{ marginTop: 16 }}>
                <div className="nc-summary-row">
                  <span>Subtotal</span><span>{fmt(itemsPrice)}</span>
                </div>
                <div className="nc-summary-row">
                  <span>Frete</span>
                  <span style={{ color: shippingPrice === 0 ? '#5ae08a' : 'inherit' }}>
                    {shippingPrice === 0 ? 'Grátis' : fmt(shippingPrice)}
                  </span>
                </div>
                <div className="nc-summary-row">
                  <span>Impostos (15%)</span><span>{fmt(taxPrice)}</span>
                </div>
              </div>

              <div className="nc-summary-total">
                <span>Total</span>
                <span className="gold">{fmt(totalPrice)}</span>
              </div>

              {itemsPrice >= FREE_SHIP_AT && (
                <Message variant="success">
                  🎉 Frete grátis aplicado em compras acima de {fmt(FREE_SHIP_AT)}
                </Message>
              )}

              <button
                type="submit"
                className="btn-gold nc-btn-block"
                disabled={loading}
              >
                {loading && <span className="nc-spinner-btn" />}
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>

              <Link to="/cart"
                style={{ display: 'block', textAlign: 'center',
                  marginTop: 14, fontSize: 12,
                  color: 'var(--nc-gray)', letterSpacing: 1 }}>
                ← Voltar ao carrinho
              </Link>
            </div>
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default CheckoutScreen;