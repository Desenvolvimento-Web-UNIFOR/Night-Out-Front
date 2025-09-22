import { motion } from 'framer-motion';
import { Search, Filter, Edit, MoreVertical } from 'lucide-react';
import { employeesData, artistsData } from '../data/mocks';

export default function Tabelas() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass"
      >
        <div className="p-6 border-b border-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-text">Funcionários</h2>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  type="text"
                  placeholder="Buscar funcionários..."
                  className="pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-text placeholder-muted focus-ring w-64"
                />
              </div>
              
              <button className="flex items-center space-x-2 btn-secondary">
                <Filter size={16} />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 text-muted font-medium">Funcionário</th>
                <th className="text-left py-4 px-6 text-muted font-medium">Email</th>
                <th className="text-left py-4 px-6 text-muted font-medium">Função</th>
                <th className="text-left py-4 px-6 text-muted font-medium">Status</th>
                <th className="text-left py-4 px-6 text-muted font-medium">Data de Admissão</th>
                <th className="text-left py-4 px-6 text-muted font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {employeesData.map((employee, index) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border-b border-border hover:bg-panel/30 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-text">{employee.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-muted">{employee.email}</td>
                  <td className="py-4 px-6 text-text">{employee.role}</td>
                  <td className="py-4 px-6">
                    <span className={employee.status === 'Online' ? 'chip-success' : 'chip-offline'}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted">{employee.joinDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring">
                        <Edit size={16} className="text-muted hover:text-text" />
                      </button>
                      <button className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring">
                        <MoreVertical size={16} className="text-muted hover:text-text" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass"
      >
        <div className="p-6 border-b border-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-text">Artistas</h2>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-muted" />
                <input
                  type="text"
                  placeholder="Buscar artistas..."
                  className="pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-text placeholder-muted focus-ring w-64"
                />
              </div>
              
              <select className="bg-panel border border-border rounded-lg px-4 py-2 text-text focus-ring">
                <option>Todos os status</option>
                <option>Disponível</option>
                <option>Trabalhando</option>
                <option>Aguardando</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 text-muted font-medium">Artista</th>
                <th className="text-left py-4 px-6 text-muted font-medium">Cachê</th>
                <th className="text-left py-4 px-6 text-muted font-medium">Status</th>
                <th className="text-left py-4 px-6 text-muted font-medium">Meta</th>
                <th className="text-left py-4 px-6 text-muted font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {artistsData.map((artist, index) => (
                <motion.tr
                  key={artist.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border-b border-border hover:bg-panel/30 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-text">{artist.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-success font-semibold">{artist.fee}</td>
                  <td className="py-4 px-6">
                    <span className={
                      artist.status === 'Trabalhando' ? 'chip-success' :
                      artist.status === 'Disponível' ? 'chip-success bg-primary/15 text-primary' :
                      'chip-warning'
                    }>
                      {artist.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-panel rounded-full h-2">
                        <div 
                          className="h-2 bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${artist.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted">{artist.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring">
                        <Edit size={16} className="text-muted hover:text-text" />
                      </button>
                      <button className="p-2 hover:bg-panel rounded-lg transition-colors focus-ring">
                        <MoreVertical size={16} className="text-muted hover:text-text" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}