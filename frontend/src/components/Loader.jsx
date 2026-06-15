import { Spinner } from 'react-bootstrap';

const Loader = ({ label = 'Carregando...' }) => (
  <div style={{ textAlign: 'center', padding: '64px 0' }}>
    <Spinner
      animation="border"
      style={{ color: '#c9a84c', width: 40, height: 40 }}
    />
    <p style={{
      color: '#777',
      marginTop: 16,
      fontSize: 13,
      letterSpacing: 2,
      textTransform: 'uppercase',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      {label}
    </p>
  </div>
);

export default Loader;