import { useEffect, useState }       from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch }               from 'react-redux';
import { Container, Row, Col }       from 'react-bootstrap';
import axios                         from 'axios';
import { addToCart }                 from '../slices/cartSlice.js';
import Loader                        from '../components/Loader.jsx';
import Message                       from '../components/Message.jsx';
import { useSelector } from 'react-redux';

const ProductScreen = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [qty,     setQty]     = useState(1);
  const { userInfo } = useSelector((s) => s.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Não foi possível carregar este produto.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
  if (!userInfo) {
    navigate('/login');
    return;
  }
  dispatch(addToCart({
    _id: product._id,
    name: product.name,
    image: product.image,
    price: product.price,
    brand: product.brand,
    countInStock: product.countInStock,
    qty,
  }));
  navigate('/cart');
};

  return (
    <Container>
      <Link to="/" className="nc-back-link">← Voltar à coleção</Link>

      {loading && <Loader label="Carregando produto..." />}

      {error && (
        <div style={{ maxWidth: 480, margin: '40px auto' }}>
          <Message variant="error">{error}</Message>
        </div>
      )}

      {!loading && !error && product && (
        <div className="nc-product-detail">
          <div className="nc-product-detail-image">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%', height: '100%',
              color: '#333', fontSize: 13,
              letterSpacing: 2,
              fontFamily: "'Montserrat', sans-serif",
            }}>
              SEM IMAGEM
            </div>
          </div>

          <div className="nc-product-detail-info">
            <p className="tag-category">{product.category}</p>
            <h1 className="nc-product-title">{product.name}</h1>
            <p className="nc-product-brand">{product.brand}</p>

            <p className="nc-product-price">
              {product.price.toLocaleString('pt-BR', {
                style: 'currency', currency: 'BRL',
              })}
            </p>

            <p className="nc-product-desc">{product.description}</p>

            <div className="nc-stock-row">
              <span className={`nc-stock-dot ${product.countInStock > 0 ? 'in' : 'out'}`} />
              {product.countInStock > 0
                ? `Em estoque (${product.countInStock} unidades)`
                : 'Produto esgotado'}
            </div>

            {product.countInStock > 0 && (
              <div className="nc-qty-selector">
                <button
                  className="nc-qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                <span className="nc-qty-value">{qty}</span>
                <button
                  className="nc-qty-btn"
                  onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))}
                  disabled={qty >= product.countInStock}
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
            )}

            <button
              className="btn-gold"
              style={{ minWidth: 220 }}
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              {product.countInStock === 0 ? 'Esgotado' : 'Adicionar ao carrinho'}
            </button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ProductScreen;