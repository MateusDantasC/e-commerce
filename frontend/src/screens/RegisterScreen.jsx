import { useState }            from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { useDispatch }         from 'react-redux';
import axios                   from 'axios';
import { setCredentials }      from '../slices/userSlice.js';
import { loadCartForUser }     from '../slices/cartSlice.js';
import Message                 from '../components/Message.jsx';

const RegisterScreen = () => {
  const [name, setName]                 = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirm]   = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos para criar sua conta.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      dispatch(setCredentials(data));
      dispatch(loadCartForUser(data._id));
      setSuccess(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Não foi possível criar sua conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nc-auth-page">

      {/* Painel visual */}
      <div className="nc-auth-visual">
        <div className="nc-auth-glow"></div>
        <div className="nc-auth-watermark">N</div>

        <Link to="/" className="nc-auth-logo">NOIR CELLAR</Link>

        <div className="nc-auth-quote">
          <p className="quote-text">
            A vida é feita de bons momentos
            e melhores escolhas.
          </p>
          <p className="quote-author">NOIR CELLAR</p>
        </div>
      </div>

      {/* Formulário */}
      <div className="nc-auth-form-panel">
        <div className="nc-auth-form-inner">
          <p className="tag-category" style={{ textAlign: 'center', marginBottom: 8 }}>
            Junte-se a nós
          </p>
          <h1 className="nc-card-title">Criar Conta</h1>
          <p className="nc-card-subtitle">
            Acesso à coleção exclusiva NOIR CELLAR
          </p>

          {error   && <Message variant="error">{error}</Message>}
          {success && <Message variant="success">Conta criada! Bem-vindo à NOIR CELLAR. Redirecionando...</Message>}

          <form onSubmit={submitHandler}>
            <div style={{ marginBottom: 18 }}>
              <label className="nc-label" htmlFor="name">Nome completo</label>
              <input
                id="name"
                type="text"
                className="nc-input"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || success}
                autoComplete="name"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label className="nc-label" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="nc-input"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label className="nc-label" htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                className="nc-input"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
                autoComplete="new-password"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label className="nc-label" htmlFor="confirmPassword">Confirmar senha</label>
              <input
                id="confirmPassword"
                type="password"
                className="nc-input"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading || success}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn-gold nc-btn-block"
              disabled={loading || success}
            >
              {loading && <span className="nc-spinner-btn" />}
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="nc-switch-text">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
