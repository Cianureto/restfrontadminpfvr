import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api/bairros';

function Bairros() {
  const [bairros, setBairros] = useState([]);
  const [nome, setNome] = useState('');
  const [taxaEntrega, setTaxaEntrega] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBairros = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBairros(data.data || []);
    } catch (err) {
      setError('Erro ao buscar bairros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBairros();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, taxa_entrega: Number(taxaEntrega) })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Erro desconhecido');
      setNome('');
      setTaxaEntrega('');
      setEditId(null);
      setSuccess(editId ? 'Bairro atualizado com sucesso!' : 'Bairro adicionado com sucesso!');
      fetchBairros();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bairro) => {
    setEditId(bairro.id);
    setNome(bairro.nome);
    setTaxaEntrega(bairro.taxa_entrega);
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este bairro?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Erro ao remover bairro');
      setSuccess('Bairro removido com sucesso!');
      fetchBairros();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-8">
      <div className="flex items-center gap-3 mb-6">
        <i className="fa-solid fa-map-marker-alt text-2xl text-indigo-600"></i>
        <h2 className="text-2xl font-extrabold text-indigo-700 tracking-wide">Gerenciar Bairros</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-8 items-end">
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-1">Nome do bairro</label>
          <input
            type="text"
            placeholder="Ex: Centro"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="border-2 border-indigo-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-1">Taxa de entrega (R$)</label>
          <input
            type="number"
            placeholder="Ex: 5.00"
            value={taxaEntrega}
            onChange={e => setTaxaEntrega(e.target.value)}
            className="border-2 border-indigo-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-indigo-600 text-white rounded-lg px-5 py-2 font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow">
            <i className={`fa-solid ${editId ? 'fa-save' : 'fa-plus'}`}></i>
            {editId ? 'Salvar' : 'Adicionar'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setNome(''); setTaxaEntrega(''); }} className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium hover:bg-gray-300 transition shadow">
              Cancelar
            </button>
          )}
        </div>
      </form>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 font-medium flex items-center gap-2"><i className="fa-solid fa-circle-exclamation"></i> {error}</div>}
      {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 font-medium flex items-center gap-2"><i className="fa-solid fa-circle-check"></i> {success}</div>}
      {loading ? <div className="text-center py-8 text-indigo-600 font-semibold">Carregando...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-indigo-50">
                <th className="text-left py-3 px-4 rounded-l-xl">Nome</th>
                <th className="text-left py-3 px-4">Taxa de Entrega (R$)</th>
                <th className="py-3 px-4 rounded-r-xl text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {bairros.map((bairro, idx) => (
                <tr key={bairro.id} className={`transition hover:bg-indigo-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}> 
                  <td className="py-3 px-4 font-medium text-gray-800 rounded-l-xl">{bairro.nome}</td>
                  <td className="py-3 px-4 text-gray-700">{Number(bairro.taxa_entrega).toFixed(2)}</td>
                  <td className="py-3 px-4 flex gap-2 justify-center rounded-r-xl">
                    <button onClick={() => handleEdit(bairro)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm shadow transition">
                      <i className="fa-solid fa-pen-to-square"></i> Editar
                    </button>
                    <button onClick={() => handleDelete(bairro.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm shadow transition">
                      <i className="fa-solid fa-trash"></i> Remover
                    </button>
                  </td>
                </tr>
              ))}
              {bairros.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-6">Nenhum bairro cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Bairros; 