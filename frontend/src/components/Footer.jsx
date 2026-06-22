import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <h5 className="footer-title">Noir Cellar</h5>
            <p className="footer-text">
              Bebidas selecionadas para apreciadores que valorizam tradição,
              qualidade e exclusividade.
            </p>
          </Col>

          <Col md={2}>
            <h5 className="footer-title">Loja</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Coleção</Link>
              </li>
              <li>
                <Link to="/cart">Carrinho</Link>
              </li>
              <li>
                <Link to="/profile">Perfil</Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h5 className="footer-title">Suporte</h5>
            <ul className="footer-links">
              <li>
                <Link to="/contact">Contato</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy">Privacidade</Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h5 className="footer-title">Conecte-se</h5>
            <ul className="social-links">
                <li>
                    <Link to="/instagram">Intagram</Link>
                </li>
                <li>
                    <Link to="/facebook">Facebook</Link>
                </li>
                <li>
                    <Link to="/whatsapp">WhatsApp</Link>
                </li>
            </ul>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          © {year} Noir Cellar. Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;