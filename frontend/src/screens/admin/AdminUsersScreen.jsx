import { useEffect, useState }  from 'react';
import { useSelector }          from 'react-redux';
import axios                    from 'axios';
import AdminLayout              from '../../components/AdminLayout.jsx';
import Loader                   from '../../components/Loader.jsx';
import Message                  from '../../components/Message.jsx';

const AdminUsersScreen = () => {
  const { userInfo }           = useSelector((s) => s.user);
  const [users,   setUsers]    = useState([]);
  const [loading, setLoading]  = useState(true);
  const [error,   setError]    = useState('');
  const [actMsg,  setActMsg]   = useState('');

  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
    } catch { setError('Não foi possível carregar os usuários.'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteHandler = async (id, name, isAdmin) => {
    if (id === userInfo._id) {
      setActMsg('Você não pode remover sua própria conta.');
      return;
    }
    if (isAdmin) {
      setActMsg('Não é possível remover um administrador.');
      return;
    }
    if (!window.confirm(`Remover o usuário "${name}"? Esta ação não pode ser desfeita.`))
      return;
    try {
      await axios.delete(`/api/users/${id}`, config);
      setActMsg(`Usuário "${name}" removido com sucesso.`);
      fetchUsers();
    } catch (err) {
      setActMsg(err.response?.data?.message || 'Erro ao remover usuário.');
    }
  };

  return (
    <AdminLayout>
      <h2 className="nc-admin-section-title">Usuários</h2>

      {actMsg && (
        <Message variant={actMsg.includes('sucesso') ? 'success' : 'error'}>
          {actMsg}
        </Message>
      )}

      {loading && <Loader label="Carregando usuários..." />}
      {error   && <Message variant="error">{error}</Message>}

      {!loading && (
        <table className="nc-admin-table">
          <thead>
            <tr>
              <th>Nome</th><th>E-mail</th><th>Perfil</th><th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={{ color:'var(--nc-white)', fontSize:14 }}>
                  {u.name}
                  {u._id === userInfo._id && (
                    <span style={{ fontSize:10, color:'var(--nc-gold)',
                      marginLeft:8, letterSpacing:1 }}>VOCÊ</span>
                  )}
                </td>
                <td style={{ color:'var(--nc-gray)', fontSize:13 }}>{u.email}</td>
                <td>
                  <span className={`nc-status-badge ${u.isAdmin?'paid':'unpaid'}`}>
                    {u.isAdmin ? 'Admin' : 'Cliente'}
                  </span>
                </td>
                <td>
                  <button
                    className="nc-admin-action-btn danger"
                    onClick={() => deleteHandler(u._id, u.name, u.isAdmin)}
                    disabled={u._id === userInfo._id || u.isAdmin}
                    title={
                      u._id === userInfo._id ? 'Não pode remover a si mesmo'
                      : u.isAdmin ? 'Não pode remover um admin'
                      : 'Remover usuário'
                    }
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default AdminUsersScreen;