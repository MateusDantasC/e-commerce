import { useEffect, useState, useRef } from 'react';
import { Link }                        from 'react-router-dom';
import { useDispatch, useSelector }    from 'react-redux';
import axios                           from 'axios';
import { setCredentials }              from '../slices/userSlice.js';
import Message                         from '../components/Message.jsx';
import Loader                          from '../components/Loader.jsx';

const ProfileScreen = () => {
  const dispatch     = useDispatch();
  const { userInfo } = useSelector((s) => s.user);

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [saving,  setSaving]  = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [saveOk,  setSaveOk]  = useState('');

  // Avatar — salvo em localStorage por usuário
  const [avatar,       setAvatar]       = useState('');
  const [avatarHover,  setAvatarHover]  = useState(false);
  const fileRef = useRef();

  const [orders,        setOrders] = useState([]);
  const [ordersLoading, setOL]     = useState(true);

  const fmt = (v) =>
    Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Carrega avatar do localStorage ao montar
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      const saved = localStorage.getItem(`avatar_${userInfo._id}`);
      if (saved) setAvatar(saved);
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
      } catch { /* silencia */ }
      finally  { setOL(false); }
    };
    if (userInfo) fetchOrders();
  }, [userInfo]);

  // Upload de avatar: converte para base64 e salva no localStorage
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    // Limita a 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Imagem muito grande. Use uma imagem menor que 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setAvatar(base64);
      localStorage.setItem(`avatar_${userInfo._id}`, base64);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatar('');
    localStorage.removeItem(`avatar_${userInfo._id}`);
  };

  const saveHandler = async (e) => {
    e.preventDefault();
    setSaveErr(''); setSaveOk('');
    if (!name.trim()) { setSaveErr('O nome não pode ficar em branco.'); return; }
    try {
      setSaving(true);
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.put('/api/users/profile', { name, email }, config);
      dispatch(setCredentials(data));
      setSaveOk('Dados atualizados com sucesso!');
    } catch (err) {
      setSaveErr(err.response?.data?.message || 'Não foi possível salvar. Tente novamente.');
    } finally { setSaving(false); }
  };

  const initial     = userInfo?.name?.charAt(0).toUpperCase() || '?';
  const totalOrders = orders.length;
  const totalSpent  = orders.filter(o => o.isPaid).reduce((a, o) => a + o.totalPrice, 0);
  const lastOrder   = orders[0];

  const statusLabel = (o) => {
    if (o.isCancelled) return { label: 'Cancelado',         cls: 'unpaid'    };
    if (o.isDelivered) return { label: 'Entregue',          cls: 'delivered' };
    if (o.isPaid)      return { label: 'Pago — Em preparo', cls: 'paid'      };
    return                    { label: 'Aguardando pag.',   cls: 'unpaid'    };
  };

  return (
    <div style={{ background: 'var(--nc-black)', minHeight: 'calc(100vh - 81px)', padding: '48px 0' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>

        {/* ── Cabeçalho ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 24,
          background: 'var(--nc-black2)', border: '1px solid var(--nc-border)',
          padding: '28px 32px', marginBottom: 28,
        }}>

          {/* Avatar clicável */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              onClick={() => fileRef.current.click()}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
              style={{
                width: 80, height: 80, borderRadius: '50%',
                border: `2px solid ${avatarHover ? '#a8873a' : 'var(--nc-gold)'}`,
                background: 'rgba(201,168,76,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden',
                transition: 'border-color .2s',
                position: 'relative',
              }}
            >
              {avatar ? (
                <img src={avatar} alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 32, color: 'var(--nc-gold)',
                  pointerEvents: 'none',
                }}>{initial}</span>
              )}

              {/* Overlay de hover */}
              {avatarHover && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                }}>
                  <span style={{ fontSize: 20 }}>📷</span>
                </div>
              )}
            </div>

            {/* Botão de remover foto */}
            {avatar && (
              <button
                onClick={removeAvatar}
                title="Remover foto"
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#7b2935', border: '2px solid var(--nc-black2)',
                  color: '#fff', fontSize: 11, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}
              >✕</button>
            )}

            {/* Input oculto */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>

          {/* Nome + email */}
          <div style={{ flex: 1 }}>
            <p className="tag-category" style={{ marginBottom: 4 }}>Minha Área</p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 26, fontWeight: 400, color: 'var(--nc-white)', margin: 0,
            }}>
              {userInfo?.name}
            </h1>
            <p style={{ color: 'var(--nc-gray)', fontSize: 12, marginTop: 4, letterSpacing: 1 }}>
              {userInfo?.email}
            </p>
            <p style={{ color: '#444', fontSize: 10, letterSpacing: 1, marginTop: 4 }}>
              Clique na foto para alterar
            </p>
          </div>

          {/* Badge */}
          <span style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            padding: '5px 12px', borderRadius: 2,
            background: userInfo?.isAdmin ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${userInfo?.isAdmin ? 'var(--nc-gold)' : 'var(--nc-border)'}`,
            color: userInfo?.isAdmin ? 'var(--nc-gold)' : 'var(--nc-gray)',
          }}>
            {userInfo?.isAdmin ? 'Administrador' : 'Membro'}
          </span>
        </div>

        {/* ── Resumo rápido ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Pedidos realizados', value: totalOrders },
            { label: 'Total investido',    value: fmt(totalSpent) },
            {
              label: 'Último pedido',
              value: lastOrder
                ? new Date(lastOrder.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                : '—',
            },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'var(--nc-black2)', border: '1px solid var(--nc-border)',
              padding: '20px 24px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
                color: 'var(--nc-gray)', marginBottom: 8 }}>{label}</p>
              <p style={{ fontFamily: "'Playfair Display', serif",
                fontSize: 22, color: 'var(--nc-gold)', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Grid: Pedidos + Editar dados ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

          {/* Últimos pedidos */}
          <div style={{ background: 'var(--nc-black2)', border: '1px solid var(--nc-border)', padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p className="tag-category">Pedidos recentes</p>
              <Link to="/orders" style={{ fontSize: 11, letterSpacing: 1, color: 'var(--nc-gray)', textDecoration: 'none' }}>
                Ver todos →
              </Link>
            </div>

            {ordersLoading && <Loader label="Buscando pedidos..." />}

            {!ordersLoading && orders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ color: 'var(--nc-gray)', fontSize: 13, marginBottom: 16 }}>
                  Você ainda não fez nenhum pedido.
                </p>
                <Link to="/" className="btn-gold" style={{ textDecoration: 'none' }}>
                  Explorar Coleção
                </Link>
              </div>
            )}

            {!ordersLoading && orders.slice(0, 3).map((order) => {
              const { label, cls } = statusLabel(order);
              return (
                <Link key={order._id} to={`/orders/${order._id}`}
                  style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 0', borderBottom: '1px solid var(--nc-border)', transition: 'opacity .15s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = .75}
                    onMouseLeave={e => e.currentTarget.style.opacity = 1}
                  >
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      {order.orderItems.slice(0, 2).map((item, i) => (
                        <div key={i} style={{ width: 40, height: 40, background: 'var(--nc-black3)',
                          border: '1px solid var(--nc-border)', overflow: 'hidden' }}>
                          <img src={item.image} alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { e.target.style.opacity = 0; }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, color: 'var(--nc-gray)', fontFamily: 'monospace', marginBottom: 2 }}>
                        #{order._id.slice(-8)}
                      </p>
                      <span className={`nc-status-badge ${cls}`}>{label}</span>
                    </div>
                    <p style={{ fontFamily: "'Playfair Display', serif",
                      fontSize: 16, color: 'var(--nc-gold)', flexShrink: 0 }}>
                      {fmt(order.totalPrice)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Editar dados */}
          <div style={{ background: 'var(--nc-black2)', border: '1px solid var(--nc-border)', padding: '24px 28px' }}>
            <p className="tag-category" style={{ marginBottom: 20 }}>Editar dados</p>

            {saveErr && <Message variant="error">{saveErr}</Message>}
            {saveOk  && <Message variant="success">{saveOk}</Message>}

            <form onSubmit={saveHandler}>
              <div style={{ marginBottom: 16 }}>
                <label className="nc-label" htmlFor="pname">Nome</label>
                <input id="pname" type="text" className="nc-input"
                  value={name} onChange={(e) => setName(e.target.value)} disabled={saving} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="nc-label" htmlFor="pemail">E-mail</label>
                <input id="pemail" type="email" className="nc-input"
                  value={email} onChange={(e) => setEmail(e.target.value)} disabled={saving} />
              </div>
              <button type="submit" className="btn-gold nc-btn-block" disabled={saving}>
                {saving && <span className="nc-spinner-btn" />}
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>

            <div className="divider-gold" style={{ margin: '20px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/orders" className="btn-outline nc-btn-block"
                style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                Meus Pedidos
              </Link>
              {userInfo?.isAdmin && (
                <Link to="/admin" className="btn-outline nc-btn-block"
                  style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                  Painel Admin
                </Link>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 700px) {
            .nc-profile-grid { grid-template-columns: 1fr !important; }
            .nc-profile-stats { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProfileScreen;