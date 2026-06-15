import { useState }                  from 'react';
import { Link, useNavigate }         from 'react-router-dom';
import { useSelector, useDispatch }  from 'react-redux';
import { Container, Row, Col }       from 'react-bootstrap';
import { addToCart, removeFromCart } from '../slices/cartSlice.js';
import Message                       from '../components/Message.jsx';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((s) => s.cart);
  const { userInfo }  = useSelector((s) => s.user);

  const [checkoutMsg,   setCheckoutMsg]   = useState('');
  const [removeSuccess, setRemoveSuccess] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(null); // item a remover

  const updateQtyHandler = (item, newQty) => {
    dispatch(addToCart({ ...item, qty: Number(newQty) }));
  };

  const removeHandler = (item) => {
    setConfirmRemove(item);
  };

  const confirmRemoveHandler = () => {
    dispatch(removeFromCart(confirmRemove._id));
    setRemoveSuccess(`"${confirmRemove.name}" removido do carrinho.`);
    setConfirmRemove(null);
    setTimeout(() => setRemoveSuccess(''), 3000);
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container>
        <div className="nc-empty-cart">
          <p className="tag-category" style={{ marginBottom: 12 }}>
            Seu carrinho
          </p>
          <h2 className="section-heading" style={{ marginBottom: 16 }}>
            Está vazio por aqui
          </h2>
          <p>Explore nossa coleção e encontre algo especial.</p>
          <Link
            to="/"
            className="btn-gold"
            style={{ textDecoration: 'none', display: 'inline-block', marginTop: 8 }}
          >
            Explorar Coleção
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container className="nc-cart-page">
        <p className="tag-category" style={{ marginBottom: 8 }}>
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </p>
        <h1 className="section-heading" style={{ marginBottom: 32 }}>
          Seu Carrinho
        </h1>

        {removeSuccess && <Message variant="success">{removeSuccess}</Message>}

        <Row>
          <Col lg={8}>
            {cartItems.map((item) => (
              <div className="nc-cart-item" key={item._id}>
                <div className="nc-cart-item-img">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { e.target.style.opacity = 0; }}
                  />
                </div>

                <div className="nc-cart-item-info">
                  <Link to={`/product/${item._id}`} style={{ textDecoration: 'none' }}>
                    <p className="nc-cart-item-name">{item.name}</p>
                  </Link>
                  <p className="nc-cart-item-brand">{item.brand}</p>

                  <select
                    className="nc-qty-select"
                    value={item.qty}
                    onChange={(e) => updateQtyHandler(item, e.target.value)}
                    style={{ marginTop: 10 }}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        Qtd: {x + 1}
                      </option>
                    ))}
                  </select>

                  <div>
                    <button
                      className="nc-remove-btn"
                      onClick={() => removeHandler(item)}
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <div className="nc-cart-item-price">
                  {(item.price * item.qty).toLocaleString('pt-BR', {
                    style: 'currency', currency: 'BRL',
                  })}
                </div>
              </div>
            ))}
          </Col>

          <Col lg={4} style={{ marginTop: 24 }}>
            <div className="nc-cart-summary">
              <p className="tag-category" style={{ marginBottom: 16 }}>
                Resumo do pedido
              </p>

              <div className="nc-summary-row">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                <span>
                  {itemsPrice.toLocaleString('pt-BR', {
                    style: 'currency', currency: 'BRL',
                  })}
                </span>
              </div>

              <div className="nc-summary-total">
                <span>Total</span>
                <span className="gold">
                  {itemsPrice.toLocaleString('pt-BR', {
                    style: 'currency', currency: 'BRL',
                  })}
                </span>
              </div>

              {checkoutMsg && <Message variant="success">{checkoutMsg}</Message>}

              <button
                className="btn-gold nc-btn-block"
                onClick={checkoutHandler}
              >
                Finalizar Compra
              </button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal de confirmação de remoção */}
      {confirmRemove && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#111', border: '1px solid #2a2a2a',
            padding: '36px 40px', maxWidth: 360, width: '90%',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18, color: '#f0ece4', marginBottom: 10,
            }}>
              Remover item?
            </p>
            <p style={{ color: '#777', fontSize: 13, marginBottom: 28 }}>
              "{confirmRemove.name}" será removido do seu carrinho.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-gold" onClick={confirmRemoveHandler}>
                Remover
              </button>
              <button className="btn-outline" onClick={() => setConfirmRemove(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartScreen;
