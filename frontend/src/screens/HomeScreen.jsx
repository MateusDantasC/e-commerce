import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch {
        setError('Não foi possível carregar os produtos. Tente novamente em instantes.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ background: 'var(--nc-black)', minHeight: '100vh' }}>

      {/* ── Hero banner ── */}
      <div style={{
        position: 'relative',
        minHeight: 520,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid var(--nc-border)',
      }}>
        {/* Imagem de fundo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35) saturate(0.8)',
          transition: 'filter .3s',
        }} className="nc-hero-bg" />

        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)',
        }} />

        {/* Linha dourada */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: 3,
          background: 'linear-gradient(to bottom, transparent, var(--nc-gold), transparent)',
        }} />

        {/* Texto — sempre branco pois fica sobre a foto escura */}
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 580, padding: '64px 0', textAlign: 'center', margin: '0 auto' }}>
            <p className="tag-category" style={{ marginBottom: 20, letterSpacing: 4, color: '#c9a84c' }}>
              Curadoria Exclusiva
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(32px, 5vw, 58px)',
              fontWeight: 400,
              color: '#f0ece4',
              lineHeight: 1.2,
              letterSpacing: 1,
              marginBottom: 20,
            }}>
              O Prazer das<br />Grandes Escolhas
            </h1>
            <p style={{
              color: '#ccc',
              fontSize: 15,
              lineHeight: 1.8,
              letterSpacing: 0.5,
              marginBottom: 36,
            }}>
              Vinhos, whiskies, gins e cervejas artesanais<br />
              selecionados por sommeliers
            </p>
            <button
              className="btn-gold"
              onClick={() => document.getElementById('colecao').scrollIntoView({ behavior: 'smooth' })}
            >
              Explorar Coleção
            </button>
          </div>
        </Container>
      </div>

      {/* ── Coleção ── */}
      <Container id="colecao" style={{ padding: '48px 16px' }}>
        <p className="tag-category" style={{ textAlign: 'center', marginBottom: 8 }}>
          Destaques
        </p>
        <h2 className="section-heading" style={{ textAlign: 'center', marginBottom: 40 }}>
          Nossa Coleção
        </h2>

        {loading && (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <Spinner animation="border" style={{ color: 'var(--nc-gold)', width: 40, height: 40 }} />
            <p style={{ color: 'var(--nc-gray)', marginTop: 16, fontSize: 13, letterSpacing: 2 }}>
              CARREGANDO COLEÇÃO...
            </p>
          </div>
        )}

        {error && (
          <div style={{
            background: 'var(--nc-black2)', border: '1px solid var(--nc-wine)',
            borderRadius: 4, padding: '20px 24px',
            textAlign: 'center', maxWidth: 480, margin: '40px auto',
          }}>
            <p style={{ color: '#e05a5a', fontSize: 14, letterSpacing: 1 }}>{error}</p>
            <button className="btn-outline" style={{ marginTop: 16 }}
              onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <Row xs={1} sm={2} lg={3} className="g-4">
            {products.map(product => (
              <Col key={product._id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Light mode: imagem do hero um pouco mais clara */}
      <style>{`
        html.light .nc-hero-bg {
          filter: brightness(0.55) saturate(0.6) !important;
        }
      `}</style>
    </div>
  );
};

const ProductCard = ({ product }) => (
  <a href={`/product/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
    <div
      className="nc-product-card"
      style={{ transition: 'border-color .25s', height: '100%' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--nc-gold)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--nc-border)'}
    >
      <div style={{
        background: 'var(--nc-black3)',
        aspectRatio: '4/3',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid var(--nc-border)',
        overflow: 'hidden',
      }}>
        <img
          src={product.image} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>
      <div style={{ padding: '18px 20px 20px' }}>
        <p className="tag-category" style={{ marginBottom: 6 }}>{product.category}</p>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 17, fontWeight: 400,
          color: 'var(--nc-white)',
          marginBottom: 4, letterSpacing: '.5px',
        }}>{product.name}</h3>
        <p style={{ color: 'var(--nc-gray)', fontSize: 12, marginBottom: 14, letterSpacing: 1 }}>
          {product.brand}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--nc-gold)', fontSize: 18, fontFamily: "'Playfair Display', serif" }}>
            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          {product.countInStock === 0 && (
            <span style={{ color: 'var(--nc-wine)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
              Esgotado
            </span>
          )}
        </div>
      </div>
    </div>
  </a>
);

export default HomeScreen;