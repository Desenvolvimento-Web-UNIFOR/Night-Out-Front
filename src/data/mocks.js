export const kpiData = [
  {
    title: "Ganhos Diários",
    value: "R$ 12.450",
    change: "+12%",
    positive: true,
    icon: "TrendingUp"
  },
  {
    title: "Usuários Diários", 
    value: "2.340",
    change: "+8%",
    positive: true,
    icon: "Users"
  },
  {
    title: "Novos Clientes",
    value: "145",
    change: "-3%", 
    positive: false,
    icon: "UserPlus"
  },
  {
    title: "Vendas Totais",
    value: "R$ 84.230",
    change: "+15%",
    positive: true,
    icon: "DollarSign"
  }
];

export const employeesData = [
  {
    id: 1,
    name: "Ana Silva",
    email: "ana@nightout.com",
    role: "Gerente",
    status: "Online",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612d48b?w=40&h=40&fit=crop&crop=face&auto=format",
    joinDate: "15/03/2024"
  },
  {
    id: 2,
    name: "Carlos Mendes",
    email: "carlos@nightout.com", 
    role: "Bartender",
    status: "Offline",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format",
    joinDate: "22/02/2024"
  },
  {
    id: 3,
    name: "Marina Costa",
    email: "marina@nightout.com",
    role: "DJ",
    status: "Online", 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format",
    joinDate: "08/01/2024"
  },
  {
    id: 4,
    name: "João Santos",
    email: "joao@nightout.com",
    role: "Segurança",
    status: "Online",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format", 
    joinDate: "30/12/2023"
  }
];

export const artistsData = [
  {
    id: 1,
    name: "DJ Nattan",
    fee: "R$ 25.000",
    status: "Trabalhando",
    progress: 85,
    avatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop&crop=face&auto=format"
  },
  {
    id: 2,
    name: "João Gomes", 
    fee: "R$ 45.000",
    status: "Disponível",
    progress: 0,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face&auto=format"
  },
  {
    id: 3,
    name: "Mari Fernandez",
    fee: "R$ 35.000", 
    status: "Aguardando propostas",
    progress: 45,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&auto=format"
  }
];

export const establishmentsData = [
  {
    id: 1,
    name: "Bulls Beer",
    description: "Rock, chopp, burguer, karaokê",
    image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=300&h=200&fit=crop&auto=format",
    rating: 4.8,
    location: "Centro"
  },
  {
    id: 2,
    name: "Living", 
    description: "Música eletrônica, drinks autorais, ambiente sofisticado",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=300&h=200&fit=crop&auto=format",
    rating: 4.9,
    location: "Bairro Alto"
  },
  {
    id: 3,
    name: "Retro Bar",
    description: "Música dos anos 80/90, drinks clássicos, decoração vintage", 
    image: "https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=300&h=200&fit=crop&auto=format",
    rating: 4.6,
    location: "Vila Madalena"
  }
];

export const eventsData = [
  {
    id: 1,
    title: "Sunrise Beachclub com Nattan",
    description: "Uma noite inesquecível com o melhor do forró eletrônico",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&h=200&fit=crop&auto=format",
    artist: {
      name: "Nattan",
      avatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop&crop=face&auto=format"
    },
    date: "15 Dez",
    price: "R$ 80"
  },
  {
    id: 2,
    title: "Living com João Gomes",
    description: "Piseiro e sertanejo na balada mais badalada da cidade",
    image: "https://images.unsplash.com/photo-1571266028243-d220c7e8fe28?w=300&h=200&fit=crop&auto=format", 
    artist: {
      name: "João Gomes",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face&auto=format"
    },
    date: "22 Dez",
    price: "R$ 120"
  },
  {
    id: 3,
    title: "Drink Bar com Mari Fernandez",
    description: "A rainha do piseiro em uma noite especial",
    image: "https://images.unsplash.com/photo-1544376664-80b17f09d399?w=300&h=200&fit=crop&auto=format",
    artist: {
      name: "Mari Fernandez", 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&auto=format"
    },
    date: "31 Dez",
    price: "R$ 150"
  }
];

export const salesChartData = [
  { month: 'Jan', vendas: 45000, receita: 38000 },
  { month: 'Fev', vendas: 52000, receita: 41000 },
  { month: 'Mar', vendas: 48000, receita: 35000 },
  { month: 'Abr', vendas: 61000, receita: 52000 },
  { month: 'Mai', vendas: 55000, receita: 48000 },
  { month: 'Jun', vendas: 67000, receita: 58000 },
  { month: 'Jul', vendas: 72000, receita: 65000 },
  { month: 'Ago', vendas: 69000, receita: 62000 },
  { month: 'Set', vendas: 75000, receita: 68000 },
  { month: 'Out', vendas: 78000, receita: 71000 },
  { month: 'Nov', vendas: 82000, receita: 75000 },
  { month: 'Dez', vendas: 89000, receita: 82000 }
];

export const ordersData = [
  { 
    id: 1,
    type: "payment", 
    description: "Pagamento recebido - Mesa 15",
    amount: "R$ 245,00",
    time: "2 min atrás"
  },
  {
    id: 2,
    type: "user",
    description: "Novo usuário cadastrado", 
    amount: "Ana Costa",
    time: "5 min atrás"
  },
  {
    id: 3,
    type: "ticket",
    description: "Ingresso comprado - Living",
    amount: "R$ 120,00", 
    time: "8 min atrás"
  },
  {
    id: 4,
    type: "payment",
    description: "Pagamento recebido - Mesa 8",
    amount: "R$ 180,00",
    time: "12 min atrás"
  }
];