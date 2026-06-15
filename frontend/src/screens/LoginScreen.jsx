import { useState }            from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { useDispatch }         from 'react-redux';
import axios                   from 'axios';
import { setCredentials }      from '../slices/userSlice.js';
import { loadCartForUser }     from '../slices/cartSlice.js';
import Message                 from '../components/Message.jsx';

const LoginScreen = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Preencha e-mail e senha para continuar.');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/login', { email, password });
      dispatch(setCredentials(data));
      dispatch(loadCartForUser(data._id));
      setSuccess(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nc-auth-page">
      <div className="nc-auth-visual">
        <div className="nc-auth-glow"></div>
        <div className="nc-auth-watermark">N</div>
        <Link to="/" className="nc-auth-logo">NOIR CELLAR</Link>
        <div className="nc-auth-quote">
          <p className="quote-text">
            Cada garrafa guarda uma história.
            Aqui, você escreve o próximo capítulo.
          </p>
          <p className="quote-author">Coleção NOIR CELLAR</p>
        </div>
      </div>

      <div className="nc-auth-form-panel">
        <div className="nc-auth-form-inner">
          <p className="tag-category" style={{ textAlign: 'center', marginBottom: 8 }}>
            Bem-vindo de volta
          </p>
          <h1 className="nc-card-title">Entrar</h1>
          <p className="nc-card-subtitle">Acesse sua conta NOIR CELLAR</p>

          {error   && <Message variant="error">{error}</Message>}
          {success && <Message variant="success">Login realizado com sucesso! Redirecionando...</Message>}

          <form onSubmit={submitHandler}>
            <div style={{ marginBottom: 18 }}>
              <label className="nc-label" htmlFor="email">E-mail</label>
              <input
                id="email" type="email" className="nc-input"
                placeholder="seuemail@exemplo.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success} autoComplete="email"
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="nc-label" htmlFor="password">Senha</label>
              <input
                id="password" type="password" className="nc-input"
                placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success} autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn-gold nc-btn-block" disabled={loading || success}>
              {loading && <span className="nc-spinner-btn" />}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="nc-switch-text">
            Ainda não tem conta? <Link to="/register">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;