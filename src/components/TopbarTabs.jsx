import { Building, Calendar } from 'lucide-react';

const tabsConfig = {
  '/': [
    { id: 'overview', label: 'Visão Geral', active: true }
  ],
  '/estabelecimentos': [
    { id: 'establishments', label: 'Estabelecimentos', active: true }
  ],
  '/eventos': [
    { id: 'events', label: 'Eventos', active: true }
  ]
};

export default function TopbarTabs({ currentPath, onNavigate }) {
  const tabs = tabsConfig[currentPath] || [];
  
  if (tabs.length === 0) return null;

  return (
    <div className="glass mb-6">
      <div className="px-6 py-4">
        <nav className="flex space-x-8">
          {currentPath === '/' && (
            <>
              <button
                className="flex items-center space-x-2 text-primary border-b-2 border-primary pb-2 font-medium focus-ring"
                aria-current="page"
              >
                <span>Visão Geral</span>
              </button>
              <button
                onClick={() => onNavigate('/estabelecimentos')}
                className="flex items-center space-x-2 text-muted hover:text-text border-b-2 border-transparent hover:border-border pb-2 font-medium transition-all duration-200 focus-ring"
              >
                <Building size={16} />
                <span>Estabelecimentos</span>
              </button>
              <button
                onClick={() => onNavigate('/eventos')}
                className="flex items-center space-x-2 text-muted hover:text-text border-b-2 border-transparent hover:border-border pb-2 font-medium transition-all duration-200 focus-ring"
              >
                <Calendar size={16} />
                <span>Eventos</span>
              </button>
            </>
          )}
          
          {currentPath === '/estabelecimentos' && (
            <>
              <button
                onClick={() => onNavigate('/')}
                className="flex items-center space-x-2 text-muted hover:text-text border-b-2 border-transparent hover:border-border pb-2 font-medium transition-all duration-200 focus-ring"
              >
                <span>Visão Geral</span>
              </button>
              <button
                className="flex items-center space-x-2 text-primary border-b-2 border-primary pb-2 font-medium focus-ring"
                aria-current="page"
              >
                <Building size={16} />
                <span>Estabelecimentos</span>
              </button>
              <button
                onClick={() => onNavigate('/eventos')}
                className="flex items-center space-x-2 text-muted hover:text-text border-b-2 border-transparent hover:border-border pb-2 font-medium transition-all duration-200 focus-ring"
              >
                <Calendar size={16} />
                <span>Eventos</span>
              </button>
            </>
          )}
          
          {currentPath === '/eventos' && (
            <>
              <button
                onClick={() => onNavigate('/')}
                className="flex items-center space-x-2 text-muted hover:text-text border-b-2 border-transparent hover:border-border pb-2 font-medium transition-all duration-200 focus-ring"
              >
                <span>Visão Geral</span>
              </button>
              <button
                onClick={() => onNavigate('/estabelecimentos')}
                className="flex items-center space-x-2 text-muted hover:text-text border-b-2 border-transparent hover:border-border pb-2 font-medium transition-all duration-200 focus-ring"
              >
                <Building size={16} />
                <span>Estabelecimentos</span>
              </button>
              <button
                className="flex items-center space-x-2 text-primary border-b-2 border-primary pb-2 font-medium focus-ring"
                aria-current="page"
              >
                <Calendar size={16} />
                <span>Eventos</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}