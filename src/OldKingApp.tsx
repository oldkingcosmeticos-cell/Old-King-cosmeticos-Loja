import logo from './assets/671820305_17917652571349694_6608811899973837934_n (1).jpg';
import { 
  Menu, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Award, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail,
  Globe,
  Share2
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useRef } from 'react';

// --- Data ---

const CATEGORIES = [
  { id: 'pomadas', name: 'Pomadas', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVL2WtqEzQpEpHcYT6HW10xpxlQg5-XMrjDlJVAihQ0XjPFWI6QhzXwOQsg57wOi5v55OmubWJP-KXROLCSUwcU82DOOIGVJc5Zqe6fdkf7ay1xs1i4EV0Grj8IbVHciNvxApRJIjHYYwujJAJ7PWdT8nHWmzz-MwhDuFREkghI88S4PntsFcu4t_VD3AwqFfgL1Ub47KImfOAaWauZlmUrsT6Y9yHewC_AlznpCYBvixPDtPCAvq5CmDJqv4wSkmYM5w5AcCyDWku' },
  { id: 'shampoos', name: 'Shampoos', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8ReOm9uwTam7Rij6nPlpqdWw8_tBsuZ_5FwOFF1o_0WIAjw3HIIZcM21wg2V3LXei8IE-hovqIVzSYOVLsudtdFtT09wKJKQvx9VjvGAlIpjpttuTQ1ql6ofJLNbkhn-YFeXGOHt8-33TnQQjlHK8FQywGjuCY3RAv1wQq5dxNginRTKk4rqg-F1QUI_1MLR7Exfce57ygSe7wQVebgqZBMR9gXpLj2wp0hIofa0WW6psBCHrtVEanul5a2E72Z6rOgMWp-TOH9H3' },
  { id: 'balms', name: 'Balms', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABp9_GUTcRmkYqqLCQkEZOpjZfmpyEMTW5PCSWwC4Kz4Xb74sxUKtvRQTekv5nxOfawQbD9DUEwg1hSWPnJomUm2-Az2kUJcHLIlNdrcGymD_2QmkXpH87hETFr0trfQVf_0VlY3pkcI3q-TE0OUq_7fuAEMV6KzQFthd-XmhWoL6bt8JQvbZT-_G2F6RKxgoh7Pipl1b4A4TL66llDUOCJTf_JzUXmxfybbBnWoOcLZuGq5bQvC1H8_ki1HtG5qDSDgOR9hjRJoAq' },
  { id: 'oleos', name: 'Óleos', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt1k_fImhQsnhiBqCgDF19VVDsXY3mXI3CSKIyRSKnm9MZM89rpN6yf7lEJCnC0NgdUegIcoJejyR6TrTCbJPwIOapJAdLl1-74bRBf5RT8LuRRrzCdWYXqJv0gRVQsh4Nd0KB14uQZktPqzP0vkxr78UI1QucZmEYReMB0f-ubrxIojrM536vB4-U0IMQcLuMdio9odtDGPzd6Hllc-2TE6XjYIZ2Ha_9q84U0YvXu2sUr5BAmT354SpXqzHRAxUPPUH1DUoInk1K' },
  { id: 'kits', name: 'Kits', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg24Z4oNuFdn8NcMdEs9GL17TQhfzWf-O7KOUn3FWhZE95V8MnChVcDU58tFZmaPOe6x-Y1kauUGf2ygW7VpthjKINIom78E9FlryDcuZlrbicGzd2CEBJisnT60fuGD0qQBY1batKO1rlP1AHfUG-wsML898zE7e-uN8_4EMfHHacN_l_Ji1EbGkLRTy-xQCZ2gZVAZ___7R1koEwkd_7ch6PPPP6rxPw2d-2P00MT8utw3nkdUlhVZWavZVb_yRjg84Bq6a_UySn' },
  { id: 'perfumes', name: 'Perfumes', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsW-GjLyT1TiRYSDRRismnVij1UiN_SqdSRfsPhz_39XO6c52NwlIgeuNCgkXLQsmhG2rDh6M2qEnD_jtk3IaMrPNGD6183b2iaMd3tGRhEnyJh6dVHJVus5VfYveqEAl8wtRkIJ8REtYwkrxs_OCoySONk026cKrYivXxKZMgpoco-iUgeAHQ1eBGlJLcUyWAeTTb_BUsvG8LOD_EwKbc0-Cd4e-zSfAFEs0rCi2aOTDHyJSvH3z9wh8Rt0RpKRfjcwsTkxAwAZ31' },
];

const BEST_SELLERS = [
  { id: 1, name: 'Old King Classic Balm', price: 'R$ 89,90', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFqRNY1PeyUv56sGGX7uwPZftuw9xbT2ggblW5hT6CJzagK10U_D7T0-NeFhPShOCLxPMe5zA-CawtpjhthhVJwQd7saVuBhzxucEeOfFbMCqHvZgw8J1sVhKPPMJKzjmmPLB9vsmxwU8zzx4Q87xCZ6DPsmyoAf8eNPWxK9M-wTlA7Mswr3FMYBFjUVrV2d0BBed3eKBsJm8QwHzFpgLQ1IPqYGwWy_gtihGdANeo35E5gQSqV5cXwmsx4eJ-4GeNrhl27YSlfAt6' },
  { id: 2, name: 'Legacy Hair Styling', price: 'R$ 110,00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNbwQJW2GFTDkpE8XRIZUXa1KYv0aRhBWlJAMXj8SgMNK5uNKUeXJGmAKMUHt8bMfmAg54kwgmwCqWx80SEtBcJPFTmHLa8qnpfieMb_1yPO4bD_Lbsgi1Dr8s2Re5RshvR2whT43QHj6QuPgE1O5y_S8km088BQn495GelJiDT1fS7AkRykRCm_Thc29oXnGTywrQlHEuMttit5VMDCjBL5T57AcbBO86GW_E_R4WUI0T6KpmjNasgQdiKx77S7w36eln5OH57G4b' },
  { id: 3, name: 'The Crown Oil', price: 'R$ 145,00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm_KNxt2d9Ri1VSnrtp6hIeWWc1iBp9L5oYx0kGXBh4S52ilFKgpyhAGRm3qA9HyNUzrM_qQWYWr_ruw8saS6ZBnRVNsFfpIgv07ssFt9FWcB40pSJhgvXGEvjmwCMBBZ2sqXQsmrXgr4Vzfy36rGUkJYMb3VkKqBXKBZMGXlXIiCZ37rhE2Wl2B5jvptk1dkfqm6_MwiW5U9nwLe7lTxySOEYk7IxdxSdqnGTTKs04j3a8gQvMtzZd8J29g1UpjwxPNMK9hunKTYw' },
  { id: 4, name: 'Ritual Cleansing Kit', price: 'R$ 210,00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATFwn0jld17_9YVYlcaMZT6jCnGgyue6qWJ_H27UaGsqsPsVKg63MW3aWq41bBiJwsoftL0aK5axxZAtSgBMdYRAO6j-PazjKxF7rVvX82IGrRHrVmlx1kvWO9zZW6FnY_sqPR92PsgwE-I6jpXpftua0yx-RggSKFPpP2QudDgAaCe-A7V0ziUbZ5v-31HbauQzW06s5pg99rEmee9uLq27uNipUgZ5r1JYTqugwws5DFzh7JNizSUrE-e8IiVfqaUzeZzKSynuJO' },
];

const BEARD_PRODUCTS = [
  { id: 1, name: 'Óleo The Crown', price: 'R$ 145,00', image: CATEGORIES[3].image },
  { id: 2, name: 'Classic Balm', price: 'R$ 89,90', image: CATEGORIES[2].image },
  { id: 3, name: 'Shampoo de Barba', price: 'R$ 65,00', image: CATEGORIES[1].image },
  { id: 4, name: 'Kit Barba Ritual', price: 'R$ 210,00', image: CATEGORIES[4].image },
];

const HAIR_PRODUCTS = [
  { id: 1, name: 'Legacy Styling', price: 'R$ 110,00', image: CATEGORIES[0].image },
  { id: 2, name: 'Pomada Matte', price: 'R$ 85,00', image: CATEGORIES[0].image },
  { id: 3, name: 'Shampoo Hair', price: 'R$ 70,00', image: CATEGORIES[1].image },
  { id: 4, name: 'Tônico Fortificante', price: 'R$ 120,00', image: CATEGORIES[3].image },
];

// --- Components ---

const Header = () => {
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ['rgba(19, 19, 19, 0)', 'rgba(19, 19, 19, 0.9)']);
  const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)']);

  return (
    <motion.header 
      style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
      className="fixed top-0 w-full z-50 h-24 border-b border-white/5 flex items-center justify-between px-6 md:px-16 transition-all"
    >
      <div className="flex items-center gap-6">
        <button className="text-primary hover:scale-110 transition-transform">
          <Menu size={28} />
        </button>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <img 
          src={logo} 
          alt="Old King Logo" 
          className="h-16 md:h-20 w-auto object-contain mix-blend-screen"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="text-primary hover:scale-110 transition-transform relative">
          <ShoppingBag size={28} />
          <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            2
          </span>
        </button>
      </div>
    </motion.header>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuJ5tFnO-8_qjAFG27tG46PNy0joM83ezhOJTjzZlAQ65cnQtKmmKAESa9hunUa9AiZuWceF5laMsze3wz3NJL9AZ9W3ygQ1eXesksg6xK_ypyd-YqsgC8DdT6xYZVSH27w4nQ46rIS779a2rnHnYDZb3xGOCjkmMdxkD-egO3rkNMvcc0UliDbIAb9B1MjGzSsmqykjtLOff3bsD2N1XjZKMkpPa2qHnpNVDYrx6ub6EGyzK7_fCo9PnyzHRKC_4-hBzEiva0X9fA" 
          alt="Premium Grooming" 
          className="w-full h-full object-cover brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-8xl text-primary leading-tight mb-6 uppercase tracking-wider"
        >
          Old King Cosméticos — Estilo, presença e autenticidade.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-sans"
        >
          Produtos premium para homens que valorizam cuidado e personalidade.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <button className="w-full md:w-auto px-12 py-5 bg-primary text-on-primary font-bold uppercase tracking-widest transition-all hover:brightness-110 active:scale-95">
            Comprar Agora
          </button>
          <button className="w-full md:w-auto px-12 py-5 border border-primary text-primary font-bold uppercase tracking-widest transition-all hover:bg-primary/10 active:scale-95">
            Conheça os Produtos
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const Benefits = () => {
  return (
    <section className="bg-surface-container-lowest border-y border-white/5 py-8">
      <div className="flex flex-wrap justify-center gap-12 md:gap-24 px-6">
        {[
          { icon: <Truck size={24} />, text: "Frete Grátis" },
          { icon: <ShieldCheck size={24} />, text: "Compra Segura" },
          { icon: <Award size={24} />, text: "Produtos Premium" },
          { icon: <Zap size={24} />, text: "Entrega Rápida" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-primary">{item.icon}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Categories = () => {
  return (
    <section className="py-24 px-6 md:px-16">
      <div className="mb-16 flex flex-col items-center">
        <h2 className="font-display text-5xl text-primary uppercase">Categorias</h2>
        <div className="golden-thread w-24 mt-4" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <motion.a 
            key={cat.id}
            whileHover={{ scale: 1.02 }}
            className="group relative aspect-[4/5] bg-surface overflow-hidden inner-glow cursor-pointer"
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-75"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
            <div className="absolute bottom-8 left-8">
              <span className="font-display text-3xl text-primary uppercase block mb-1">{cat.name}</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-300" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState('mais-vendidos');

  const tabs = [
    { id: 'mais-vendidos', label: 'Mais Vendidos', data: BEST_SELLERS },
    { id: 'barba', label: 'Para a Barba', data: BEARD_PRODUCTS },
    { id: 'cabelo', label: 'Para Cabelo', data: HAIR_PRODUCTS },
  ];

  const currentData = tabs.find(t => t.id === activeTab)?.data || [];

  return (
    <section className="py-24 bg-surface-container-lowest">
      <div className="px-6 md:px-16 flex flex-col items-center mb-12">
        <h2 className="font-display text-5xl text-primary uppercase mb-8 text-center">Nossos Produtos</h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 max-w-full scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 whitespace-nowrap font-bold uppercase tracking-widest text-sm transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {currentData.map((product) => (
          <a 
            key={product.id} 
            href="#" 
            className="flex bg-surface border border-white/5 hover:border-primary/50 transition-all rounded-lg overflow-hidden group h-32 shadow-lg"
          >
            <div className="w-1/3 overflow-hidden bg-black/20">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90 group-hover:brightness-100"
              />
            </div>
            <div className="w-2/3 p-4 flex flex-col justify-center bg-gradient-to-r from-transparent to-black/20">
              <h3 className="font-sans font-bold text-gray-100 uppercase text-sm mb-1 line-clamp-2">{product.name}</h3>
              <p className="font-sans font-bold text-primary tracking-widest text-sm mb-2">{product.price}</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-primary transition-colors mt-auto">
                Ver Detalhes <ChevronRight size={12} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section className="py-24 flex flex-col md:flex-row items-center gap-16 px-6 md:px-16">
      <div className="w-full md:w-1/2 relative group">
        <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-primary group-hover:-top-4 group-hover:-left-4 transition-all" />
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwZe5ZTQn6Ap2LuKDYHQc5nDUExE01-JeIVrWzrH5naEbn4GWbJvB7rFciawOItUCo5HLwSHQ9RqRBeWQann42-3xPRUxB1wWF1_5q9eNlifK6i9STmkq-D-t-7OHtDoIxkAXBnT7wzI8w2OY2sUBm0ctRqEP4sI7n02LJA6GLMLpPmvlV0ohOjjNOi0eMc13nG6Aupuwo49H4xiY69wPLZJGSpupf4XgMvGzrxkBgi9EQZGeH1FWCzydyw5NOsLbQ1V7v6bf1t28j" 
          alt="The Visionary" 
          className="w-full h-[600px] object-cover inner-glowgrayscale opacity-90 transition-all hover:grayscale-0 hover:opacity-100"
        />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-primary group-hover:-bottom-4 group-hover:-right-4 transition-all" />
      </div>

      <div className="w-full md:w-1/2">
        <h2 className="font-display text-6xl text-primary uppercase mb-8 leading-tight">O Legado do Cuidado</h2>
        <p className="text-xl text-gray-300 mb-10 leading-relaxed font-sans">
          A Old King Cosméticos nasceu para homens que carregam atitude, elegância e autenticidade no dia a dia. Nossa missão é oferecer o que há de mais sofisticado em produtos de grooming, unindo tradição e inovação para o homem moderno que não abre mão da sua melhor versão.
        </p>
        <button className="px-10 py-4 border-b-2 border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary/10 transition-all">
          Nossa História
        </button>
      </div>
    </section>
  );
};

const Newsletter = () => {
  return (
    <section className="py-24 bg-surface-container border-y border-white/5 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <Mail className="text-primary mx-auto mb-6" size={48} />
        <h2 className="font-display text-4xl text-gray-100 uppercase mb-4 tracking-wider">Faça Parte da Corte</h2>
        <p className="text-gray-400 mb-10 font-sans">Receba lançamentos e ofertas exclusivas direto no seu e-mail.</p>
        <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="SEU MELHOR E-MAIL" 
            className="flex-1 bg-surface-container-lowest border-0 border-b border-primary/40 text-gray-100 px-6 py-4 focus:ring-0 focus:border-primary transition-all placeholder:text-gray-600 font-sans tracking-widest uppercase text-sm"
          />
          <button className="px-12 py-4 bg-primary text-on-primary font-bold uppercase tracking-widest hover:brightness-110 transition-all">
            Inscrever
          </button>
        </form>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest py-24 border-t border-white/5">
      <div className="px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div>
          <h4 className="font-display text-4xl text-primary mb-8 tracking-wider">OLD KING</h4>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-primary transition-all"><Globe size={24} /></a>
            <a href="#" className="text-gray-500 hover:text-primary transition-all"><Share2 size={24} /></a>
            <a href="#" className="text-gray-500 hover:text-primary transition-all"><Instagram size={24} /></a>
          </div>
        </div>

        <div>
          <h5 className="font-sans font-bold text-primary uppercase mb-6 tracking-widest text-xs">Produtos</h5>
          <ul className="space-y-4">
            {['Barba', 'Cabelo', 'Perfumes', 'Acessórios'].map(item => (
              <li key={item}>
                <a href="#" className="text-sm text-gray-500 uppercase tracking-widest hover:text-primary transition-all">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-sans font-bold text-primary uppercase mb-6 tracking-widest text-xs">Suporte</h5>
          <ul className="space-y-4">
            {['Envio', 'Trocas', 'Contatos'].map(item => (
              <li key={item}>
                <a href="#" className="text-sm text-gray-500 uppercase tracking-widest hover:text-primary transition-all">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-sans font-bold text-primary uppercase mb-6 tracking-widest text-xs">Legal</h5>
          <ul className="space-y-4">
            {['Privacidade', 'Termos'].map(item => (
              <li key={item}>
                <a href="#" className="text-sm text-gray-500 uppercase tracking-widest hover:text-primary transition-all">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-6 md:px-16 text-center pt-12 border-t border-white/5">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em]">
          © 2024 OLD KING COSMÉTICOS. THE CROWN OF GROOMING.
        </p>
      </div>
    </footer>
  );
};

const WhatsAppButton = () => (
  <motion.a 
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    href="https://wa.me/5500000000000"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-transform"
  >
    <svg fill="currentColor" height="32" viewBox="0 0 16 16" width="32">
      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
    </svg>
  </motion.a>
);

export default function OldKingApp() {
  return (
    <div className="min-h-screen font-body bg-background text-white">
      <Header />
      <Hero />
      <Benefits />
      <Categories />
      <ProductTabs />
      <About />
      <Newsletter />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
