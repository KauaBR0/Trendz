import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';

export function AdminMarkets() {
  const { markets } = useApp();
  const [search, setSearch] = useState('');

  const filteredMarkets = markets.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Gerenciar Mercados</h2>
        <button className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} /> Novo Mercado
        </button>
      </div>

      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar mercados..."
              className="w-full bg-[#121212] border border-[#2a2a2a] text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-lime-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#121212] border-b border-[#2a2a2a]">
              <tr>
                <th scope="col" className="px-6 py-3">Mercado</th>
                <th scope="col" className="px-6 py-3">Categoria</th>
                <th scope="col" className="px-6 py-3">Tipo</th>
                <th scope="col" className="px-6 py-3">Volume</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarkets.map((market) => (
                <tr key={market.id} className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <img src={market.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="line-clamp-1 max-w-[200px]">{market.title}</span>
                  </td>
                  <td className="px-6 py-4">{market.category}</td>
                  <td className="px-6 py-4 capitalize">{market.type === 'binary' ? 'Binário' : 'Múltiplo'}</td>
                  <td className="px-6 py-4">{market.volume}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      market.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                      market.status === 'resolved' ? 'bg-blue-500/20 text-blue-500' : 
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {market.status === 'active' ? 'Ativo' : market.status === 'resolved' ? 'Resolvido' : 'Cancelado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Resolver Mercado">
                        <CheckCircle size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
