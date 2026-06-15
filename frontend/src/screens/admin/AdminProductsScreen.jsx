import { useEffect, useState, useRef } from 'react';
import { useSelector }                 from 'react-redux';
import axios                           from 'axios';
import AdminLayout                     from '../../components/AdminLayout.jsx';
import Loader                          from '../../components/Loader.jsx';
import Message                         from '../../components/Message.jsx';

const EMPTY = {
  name:'', brand:'', category:'', price:'',
  countInStock:'', image:'', description:'',
};

const AdminProductsScreen = () => {
  const { userInfo }              = useSelector((s) => s.user);
  const [products, setProducts]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState('');
  const [form,     setForm]       = useState(null);
  const [saving,   setSaving]     = useState(false);
  const [formErr,  setFormErr]    = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const formRef = useRef();

  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch { setError('Não foi possível carregar produtos.'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setFormErr(''); setForm({ ...EMPTY }); };
  const openEdit = (p) => {
    setFormErr('');
    setForm({ ...p });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };
  const closeForm  = ()   => setForm(null);

  // Converte arquivo para base64 e usa como URL da imagem (ou envia ao servidor)
  const handleImageFile = async (file) => {
    if (!file) return;
    // Valida tipo
    if (!file.type.startsWith('image/')) {
      setFormErr('Selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }
    // Converte para base64 para preview imediato
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((prev) => ({ ...prev, image: e.target.result }));
    };
    reader.readAsDataURL(file);
    // Nota: se quiser fazer upload real para o servidor,
    // substitua a leitura base64 por um FormData e axios.post('/api/upload', ...)
  };

  const saveHandler = async (e) => {
    e.preventDefault();
    setFormErr('');
    if (!form.name || !form.price || !form.brand || !form.category || !form.image) {
      setFormErr('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      setSaving(true);
      if (form._id) {
        await axios.put(`/api/products/${form._id}`, form, config);
      } else {
        await axios.post('/api/products', form, config);
      }
      closeForm();
      fetchProducts();
    } catch (err) {
      setFormErr(err.response?.data?.message || 'Erro ao salvar produto.');
    } finally { setSaving(false); }
  };

  const deleteHandler = async (id, name) => {
    if (!window.confirm(`Remover "${name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await axios.delete(`/api/products/${id}`, config);
      fetchProducts();
    } catch { setError('Não foi possível remover o produto.'); }
  };

  const f = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  // Campos que só aceitam número
  const numericField = (k) => (e) => {
    const val = e.target.value.replace(/[^0-9.,]/g, '');
    setForm((prev) => ({ ...prev, [k]: val }));
  };

  return (
    <AdminLayout>
      <div style={{ display:'flex', justifyContent:'space-between',
        alignItems:'center', marginBottom: 20 }}>
        <h2 className="nc-admin-section-title" style={{ marginBottom:0, border:0 }}>
          Produtos
        </h2>
        <button className="btn-gold" onClick={openCreate}>+ Novo Produto</button>
      </div>

      {loading && <Loader label="Carregando produtos..." />}
      {error   && <Message variant="error">{error}</Message>}

      {/* Formulário inline */}
      {form && (
        <div ref={formRef} style={{ background:'var(--nc-black2)', border:'1px solid var(--nc-border)',
          padding:28, marginBottom:24 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18,
            color:'var(--nc-white)', marginBottom:20 }}>
            {form._id ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          {formErr && <Message variant="error">{formErr}</Message>}

          <form onSubmit={saveHandler}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {/* Nome */}
              <div>
                <label className="nc-label">Nome do produto *</label>
                <input className="nc-input" value={form.name || ''}
                  onChange={f('name')} disabled={saving} />
              </div>
              {/* Marca */}
              <div>
                <label className="nc-label">Marca *</label>
                <input className="nc-input" value={form.brand || ''}
                  onChange={f('brand')} disabled={saving} />
              </div>
              {/* Categoria */}
              <div>
                <label className="nc-label">Categoria *</label>
                <input className="nc-input" value={form.category || ''}
                  onChange={f('category')} disabled={saving} />
              </div>
              {/* Preço — apenas números */}
              <div>
                <label className="nc-label">Preço (R$) *</label>
                <input
                  className="nc-input"
                  value={form.price || ''}
                  onChange={numericField('price')}
                  disabled={saving}
                  inputMode="decimal"
                  placeholder="Ex: 159.90"
                />
              </div>
              {/* Estoque — apenas inteiros */}
              <div>
                <label className="nc-label">Estoque *</label>
                <input
                  className="nc-input"
                  value={form.countInStock || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setForm((prev) => ({ ...prev, countInStock: val }));
                  }}
                  disabled={saving}
                  inputMode="numeric"
                  placeholder="Ex: 10"
                />
              </div>

              {/* Imagem — URL ou upload */}
              <div>
                <label className="nc-label">Imagem *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="nc-input"
                    value={form.image && form.image.startsWith('data:') ? '(imagem carregada)' : (form.image || '')}
                    onChange={f('image')}
                    disabled={saving || (form.image && form.image.startsWith('data:'))}
                    placeholder="URL da imagem"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ whiteSpace: 'nowrap', padding: '0 12px', fontSize: 11 }}
                    onClick={() => fileRef.current.click()}
                    disabled={saving}
                  >
                    Upload
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageFile(e.target.files[0])}
                  />
                </div>
                {/* Preview */}
                {form.image && (
                  <div style={{ marginTop: 8, position: 'relative', display: 'inline-block' }}>
                    <img
                      src={form.image}
                      alt="Preview"
                      style={{
                        width: 80, height: 80, objectFit: 'cover',
                        border: '1px solid var(--nc-border)',
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                      style={{
                        position: 'absolute', top: 2, right: 2,
                        background: 'rgba(0,0,0,0.7)', border: 'none',
                        color: '#fff', cursor: 'pointer', fontSize: 12,
                        width: 18, height: 18, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        borderRadius: 2,
                      }}
                    >✕</button>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div style={{ marginTop:14 }}>
              <label className="nc-label">Descrição</label>
              <textarea className="nc-input"
                style={{ minHeight:90, resize:'vertical' }}
                value={form.description || ''}
                onChange={f('description')}
                disabled={saving}
              />
            </div>

            <div style={{ display:'flex', gap:12, marginTop:20 }}>
              <button type="submit" className="btn-gold" disabled={saving}>
                {saving && <span className="nc-spinner-btn" />}
                {saving ? 'Salvando...' : 'Salvar Produto'}
              </button>
              <button type="button" className="btn-outline" onClick={closeForm}
                disabled={saving}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {!loading && (
        <table className="nc-admin-table">
          <thead>
            <tr>
              <th>Produto</th><th>Categoria</th>
              <th>Preço</th><th>Estoque</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td style={{ maxWidth:220 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {p.image && (
                      <img src={p.image} alt={p.name}
                        style={{ width: 36, height: 36, objectFit: 'cover',
                          border: '1px solid var(--nc-border)', flexShrink: 0 }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div>
                      <div style={{ fontFamily:"'Playfair Display',serif",
                        fontSize:14, color:'var(--nc-white)', marginBottom:2 }}>{p.name}</div>
                      <div style={{ fontSize:11, color:'var(--nc-gray)' }}>{p.brand}</div>
                    </div>
                  </div>
                </td>
                <td><span className="tag-category">{p.category}</span></td>
                <td style={{ color:'var(--nc-gold)', fontFamily:"'Playfair Display',serif" }}>
                  {Number(p.price).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
                </td>
                <td>
                  <span style={{ color: p.countInStock > 0 ? '#5ae08a':'#e08a92' }}>
                    {p.countInStock}
                  </span>
                </td>
                <td>
                  <button className="nc-admin-action-btn" onClick={() => openEdit(p)}>
                    Editar
                  </button>
                  
                  <button className="nc-admin-action-btn danger"
                    onClick={() => deleteHandler(p._id, p.name)}>
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

export default AdminProductsScreen;
