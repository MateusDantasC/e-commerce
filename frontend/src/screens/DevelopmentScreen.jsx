import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const DevelopmentScreen = ({
title = 'Em Desenvolvimento',
description = 'Esta área estará disponível em breve.'
}) => {
const isLight =
document.documentElement.classList.contains('light');

return (
<Container
style={{
minHeight: '70vh',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
}}
>
<div
style={{
textAlign: 'center',
maxWidth: '600px',
}}
>
<div
style={{
fontSize: '4rem',
marginBottom: '20px',
}}
>
🍷 </div>

    <h1
      style={{
        fontFamily: "'Playfair Display', serif",
        color: '#c9a84c',
        marginBottom: '16px',
      }}
    >
      {title}
    </h1>

    <p
      style={{
        color: isLight ? '#666' : '#888',
        marginBottom: '32px',
        lineHeight: 1.8,
      }}
    >
      {description}
    </p>

    <Link
      to="/"
      className="btn-gold"
      style={{ textDecoration: 'none' }}
    >
      Voltar à Coleção
    </Link>
  </div>
</Container>

);
};

export default DevelopmentScreen;
