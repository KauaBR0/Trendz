import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Ban, Edit2, ShieldAlert } from 'lucide-react';

export function AdminUsers() {
  const { user } = useApp();
  const [search, setSearch] = useState('');

  // Mocking a list of users based on the current user
  const mockUsers = [
    user,
    { id: 'u2', name: 'Maria Silva', email: 'maria@example.com', avatar: 'https://picsum.photos/seed/maria/100/100', balance: 450.50, role: 'user' },
    { id: 'u3', name: 'Carlos Santos', email: 'carlos@example.com', avatar: 'https://picsum.photos/seed/carlos/100/100', balance: 12.00, role: 'user' },
    { id: 'u4', name: 'Ana Oliveira', email: 'ana@example.com', avatar: 'https://picsum.photos/seed/ana/100/100', balance: 8900.00, role: 'user' },
  ].filter(Boolean) as any[];

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
      </div>

      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome ou e-mail..."
              className="w-full bg-[#121212] border border-[#2a2a2a] text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-lime-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#121212] border-b border-[#2a2a2a]">
              <tr>
                <th scope="col" className="px-6 py-3">Usuário</th>
                <th scope="col" className="px-6 py-3">E-mail</th>
                <th scope="col" className="px-6 py-3">Saldo</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span>{u.name}</span>
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 font-bold text-lime-500">R$ {u.balance.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.role === 'admin' ? 'bg-purple-500/20 text-purple-500' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {u.role === 'admin' ? 'Admin' : 'Usuário'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors" title="Tornar Admin">
                        <ShieldAlert size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Banir Usuário">
                        <Ban size={16} />
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
