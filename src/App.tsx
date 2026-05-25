import React, { useState, useEffect } from 'react';
import { Menu, ShoppingBag, Star, ChevronLeft, ChevronRight, User, X, LogOut, Edit2, MoreVertical, Heart, Minus, Plus, Trash2, MessageCircle, Phone, Mail, Clock, Instagram, Facebook, ShieldCheck, Search } from 'lucide-react';
import logo from './assets/671820305_17917652571349694_6608811899973837934_n (1).jpg';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

// Inicializa o Mercado Pago
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY || 'TEST-1762df85-2fba-42b3-8e90-aa4cb720b65c');

// Constants removidas para o backend

const INITIAL_FOOTER_CONFIG = {
  phone: '(11) 99469-1444',
  whatsapp: '(11) 99469-1444',
  email: 'contato@oldkingcosmeticos.com.br',
  hours: 'seg a sex das 9h às 18h',
  description: 'A Old King Cosméticos fabrica produtos masculinos premium para Barba, Cabelo e Bigode.',
  instagram: 'https://instagram.com/oldking',
  facebook: 'https://facebook.com/oldking',
  melhorEnvioToken: '',
  originCep: ''
};

const ReviewCard = ({ review, type = 'site', currentUser, isAdmin, onDelete }: any) => {
  const canDelete = isAdmin || (currentUser && currentUser.name === review.name);

  return (
    <div className={`relative bg-white/5 border border-white/10 rounded-lg p-5 flex flex-col gap-4 ${type === 'site' ? 'min-w-[300px] snap-center shrink-0' : 'w-full'} hover:border-primary/30 transition-colors`}>
      {canDelete && (
        <button 
          onClick={onDelete}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-400 hover:bg-white/5 p-1.5 rounded-md transition-colors"
          title="Excluir Avaliação"
        >
          <Trash2 size={16} />
        </button>
      )}
      <div className={`flex items-center justify-between ${canDelete ? 'mt-2' : ''}`}>
        <div className="flex items-center gap-3">
          <img src={review.photo} alt={review.name} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm">{review.name}</span>
            {review.date && <span className="text-gray-500 text-xs">{review.date}</span>}
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < review.rating ? "fill-primary text-primary" : "fill-white/10 text-white/10"} />
          ))}
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed italic">"{review.text}"</p>
    </div>
  );
};

const SiteReviewSection = ({ reviews, onWriteReview, user, isAdmin, onDeleteReview }: any) => {
  const [visibleCount, setVisibleCount] = useState(5);
  
  return (
    <section className="py-12 mt-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 mb-8 flex flex-col items-center text-center">
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-primary text-primary" />)}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">O que dizem sobre nós</h2>
        <p className="text-gray-400 text-sm mb-6">A opinião de quem já faz parte da realeza Old King.</p>
        <button onClick={onWriteReview} className="bg-primary hover:bg-primary/90 text-on-primary font-bold px-6 py-2.5 rounded-md transition-colors shadow-[0_0_15px_rgba(233,193,118,0.2)] hover:shadow-[0_0_25px_rgba(233,193,118,0.4)] flex items-center gap-2">
          <MessageCircle size={18} /> Deixe sua Avaliação
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-6 px-4 md:px-8 xl:px-16 scrollbar-hide snap-x">
        {reviews.slice(0, visibleCount).map((review: any) => (
          <ReviewCard key={review.id} review={review} type="site" currentUser={user} isAdmin={isAdmin} onDelete={() => onDeleteReview(review.id, 'site')} />
        ))}
        {reviews.length > visibleCount && (
          <div className="min-w-[300px] flex items-center justify-center snap-center shrink-0">
            <button 
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="bg-white/5 hover:bg-white/10 text-primary border border-primary/20 rounded-lg h-full min-h-[150px] w-2/3 flex flex-col items-center justify-center gap-2 transition-all"
            >
              <Plus size={24} />
              <span className="font-bold text-sm">Ver Mais</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const ProductCard = ({ product, isAdmin, onEdit, onBuy, onDelete, onAddToCart, isFavorite, onToggleFavorite, productReviews }: any) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const specificReviews = productReviews ? productReviews.filter((r: any) => r.productId === product.id) : [];
  const dynamicRating = specificReviews.length > 0 ? Math.round(specificReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / specificReviews.length) : 0;
  
  return (
    <div 
      className="flex flex-col border border-white/5 bg-surface relative p-4 transition-all hover:border-primary/30 hover:shadow-[0_0_15px_rgba(233,193,118,0.1)] h-full rounded-md group"
      onMouseLeave={() => setShowMenu(false)}
    >
      {isAdmin && onEdit && (
        <div className="absolute top-2 right-2 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="bg-black/50 text-white p-1.5 rounded-full hover:bg-primary transition-colors backdrop-blur-sm"
            title="Opções"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div className="absolute top-full right-0 mt-1 bg-surface border border-white/10 rounded shadow-xl overflow-hidden min-w-[120px] flex flex-col z-30">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(product); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-primary transition-colors flex items-center gap-2"
              >
                <Edit2 size={14} /> Editar
              </button>
              {onDelete && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(product); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors flex items-center gap-2 border-t border-white/5"
                >
                  <X size={14} /> Excluir
                </button>
              )}
            </div>
          )}
        </div>
      )}
      <div className="w-full aspect-square mb-4 flex items-center justify-center p-2 bg-white/5 rounded-sm overflow-hidden relative cursor-pointer" onClick={(e) => { e.stopPropagation(); onBuy && onBuy(product); }}>
        {onToggleFavorite && (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
            className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm"
          >
            <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-white"} />
          </button>
        )}
        <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-screen group-hover:scale-105 transition-transform" />
      </div>
    
    <div className="flex flex-col flex-1 items-center text-center">
      <h3 className="text-gray-300 text-[11px] font-medium line-clamp-3 mb-2 min-h-[48px] px-1">{product.name}</h3>
      
      <div className="flex gap-0.5 my-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={12} 
            className={i < dynamicRating ? "fill-primary text-primary" : "fill-white/10 text-white/10"} 
          />
        ))}
        {specificReviews.length > 0 && <span className="text-[10px] text-gray-400 ml-1">({specificReviews.length})</span>}
      </div>
      
      <div className="mt-auto flex flex-col items-center w-full mb-3">
        <div className="flex items-center justify-center gap-2 h-[16px]">
          {product.originalPrice && (
            <span className="text-gray-500 text-[10px] line-through">{product.originalPrice}</span>
          )}
          <span className="text-primary font-bold text-sm">{product.price}</span>
        </div>
      </div>
    </div>
    
      <button 
        onClick={(e) => { e.stopPropagation(); onBuy && onBuy(product); }}
        className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] py-2.5 px-2 flex items-center justify-center gap-2 border border-primary/20 rounded-sm transition-colors mt-auto"
      >
        <ShoppingBag size={14} />
        Comprar
      </button>
    </div>
  );
};

const WhatsAppIcon = ({ size = 24, className = '' }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const BannerCard = ({ banner, isAdmin, onEdit, onDelete, onClick }: { banner: any, isAdmin?: boolean, onEdit?: (banner: any) => void, onDelete?: (banner: any) => void, onClick?: () => void }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div 
      className="w-[90vw] max-w-[90vw] md:w-[calc(50%-8px)] md:max-w-[calc(50%-8px)] bg-surface aspect-video rounded-sm overflow-hidden relative group/banner cursor-pointer border border-white/5 flex-shrink-0 snap-center"
      onClick={onClick}
      onMouseLeave={() => setShowMenu(false)}
    >
      {isAdmin && (onEdit || onDelete) && (
        <div className="absolute top-2 right-2 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="bg-black/50 text-white p-1.5 rounded-full hover:bg-primary transition-colors backdrop-blur-sm"
            title="Opções"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div className="absolute top-full right-0 mt-1 bg-surface border border-white/10 rounded shadow-xl overflow-hidden min-w-[120px] flex flex-col z-30">
              {onEdit && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(banner); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Edit2 size={14} /> Editar
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(banner); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors flex items-center gap-2 border-t border-white/5"
                >
                  <X size={14} /> Excluir
                </button>
              )}
            </div>
          )}
        </div>
      )}
      <img src={banner.img} className="w-full h-full object-cover group-hover/banner:scale-105 transition-transform duration-500" />
    </div>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="flex items-center mb-6 relative">
    <div className="flex items-baseline gap-2 bg-background pr-4 z-10">
      <h2 className="text-white text-lg md:text-xl font-bold border-b-2 border-primary pb-1">{title}</h2>
      <span className="text-gray-400 text-xs md:text-sm">{subtitle}</span>
    </div>
    <div className="absolute left-0 right-0 top-[26px] h-[1px] bg-white/10 z-0"></div>
  </div>
);

const ProductDetailsView = ({ product, onBack, onAddToCart, isFavorite, onToggleFavorite, reviews, onWriteReview, user, isAdmin, onDeleteReview }: any) => {
  const [mainImage, setMainImage] = useState(product.image);
  const [cep, setCep] = useState('');
  const [freteResult, setFreteResult] = useState('');
  const [visibleReviews, setVisibleReviews] = useState(5);

  const productSpecificReviews = reviews ? reviews.filter((r: any) => r.productId === product.id) : [];
  const averageRating = productSpecificReviews.length > 0 
    ? (productSpecificReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / productSpecificReviews.length).toFixed(1) 
    : '0.0';

  // Array com a foto original e fotos de placeholder para indicar que mais podem ser adicionadas
  const gallery = [
    product.image,
    product.image2 || 'https://placehold.co/600x600/111111/E9C176?text=FOTO+2',
    product.image3 || 'https://placehold.co/600x600/111111/E9C176?text=FOTO+3',
    product.image4 || 'https://placehold.co/600x600/111111/E9C176?text=FOTO+4'
  ];

  const handleCalculateFrete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.length < 8) return;
    setFreteResult('⏳ Calculando frete...');
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep })
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.options || data.options.length === 0) {
          setFreteResult('❌ Nenhuma opção de entrega encontrada para este CEP.');
          return;
        }
        let resultString = '';
        data.options.forEach((opt: any) => {
          // Formata o preço para BRL
          const formattedPrice = opt.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          resultString += `✅ ${opt.company} ${opt.name}: ${formattedPrice} (até ${opt.delivery_time} dias úteis)\n`;
        });
        setFreteResult(resultString);
      } else {
        const err = await res.json();
        setFreteResult(`❌ ${err.error || 'Erro ao calcular frete'}`);
      }
    } catch (err) {
      setFreteResult('❌ Erro de conexão ao calcular o frete.');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors w-fit">
        <ChevronLeft size={20} /> Voltar para a loja
      </button>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left: Images */}
        <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 shrink-0 pb-2 md:pb-0 scrollbar-hide">
            {gallery.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border-2 rounded-md overflow-hidden bg-white/5 p-2 transition-all ${mainImage === img ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
              >
                <img src={img} className="w-full h-full object-contain mix-blend-screen" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 aspect-[4/5] md:aspect-square bg-white/5 border border-white/10 rounded-md p-4 flex items-center justify-center min-w-0">
            <img src={mainImage} className="w-full h-full object-contain mix-blend-screen" />
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{product.name}</h1>
              <button 
                onClick={() => onToggleFavorite(product.id)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0"
              >
                <Heart size={24} className={isFavorite ? "fill-red-500 text-red-500" : "text-white"} />
              </button>
            </div>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < product.rating ? "fill-primary text-primary" : "fill-white/10 text-white/10"} />
              ))}
              <span className="text-gray-400 text-sm ml-2">({productSpecificReviews.length} avaliações)</span>
            </div>
            
            <div className="flex flex-col gap-1 mb-6">
              {product.originalPrice && (
                <span className="text-gray-500 text-sm line-through">{product.originalPrice}</span>
              )}
              <span className="text-primary font-bold text-4xl">{product.price}</span>
              {product.installments && (
                <span className="text-gray-400 text-sm">{product.installments}</span>
              )}
              {product.wholesalePrices && product.wholesalePrices.length > 0 && (
                <div className="mt-4 bg-primary/10 border border-primary/20 rounded p-3 flex flex-col gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">🔥 Desconto Progressivo</span>
                  {product.wholesalePrices.map((wp: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-1 last:border-0 last:pb-0">
                      <span className="text-gray-300">Comprando <strong className="text-white">{wp.quantity} un. ou mais</strong></span>
                      <span className="text-primary font-bold">{wp.price} cada</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onAddToCart(product)} 
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-lg py-4 rounded-md transition-all hover:shadow-[0_0_20px_rgba(233,193,118,0.3)] flex items-center justify-center gap-2"
            >
              Comprar
            </button>
            <button 
              onClick={() => onAddToCart(product)} 
              className="w-full bg-surface border border-primary/30 hover:bg-primary/10 text-primary font-bold text-lg py-4 rounded-md transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} /> Adicionar ao Carrinho
            </button>
          </div>

          {/* Frete Calculator */}
          <div className="mt-2 border border-white/10 bg-white/5 rounded-md p-4">
            <h3 className="text-sm font-bold text-white mb-3">Calcular Frete e Prazo</h3>
            <form onSubmit={handleCalculateFrete} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Digite seu CEP" 
                value={cep}
                onChange={e => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="flex-1 bg-background/50 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
              <button type="submit" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-white/10">
                Calcular
              </button>
            </form>
            {freteResult && (
              <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                {freteResult}
              </div>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-400 leading-relaxed">
            <h3 className="font-bold text-white mb-2">Detalhes do Produto</h3>
            <p>O produto ideal para quem busca qualidade e resultado imediato. Desenvolvido com ingredientes selecionados para proporcionar a melhor experiência de uso diário, com foco em performance de excelência para sua barba e cabelo.</p>
          </div>
        </div>
      </div>
      
      {/* Avaliações do Produto Específico */}
      <div className="mt-8 pt-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-white/5 rounded-lg border border-white/5 h-fit">
            <h3 className="text-white font-bold text-lg mb-2">Avaliações do Produto</h3>
            <span className="text-5xl font-bold text-primary mb-3">{averageRating}</span>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} className={i < Math.round(Number(averageRating)) ? "fill-primary text-primary" : "fill-white/10 text-white/10"} />)}
            </div>
            <span className="text-gray-400 text-sm mb-6">{productSpecificReviews.length === 0 ? 'Sem avaliações ainda' : `Baseado em ${productSpecificReviews.length} avaliações reais`}</span>
            <button onClick={() => onWriteReview && onWriteReview(product.id)} className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold py-2.5 rounded transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={18} /> Avaliar Produto
            </button>
          </div>
          
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            {productSpecificReviews.slice(0, visibleReviews).map((review: any) => (
              <ReviewCard key={review.id} review={review} type="product" currentUser={user} isAdmin={isAdmin} onDelete={() => onDeleteReview(review.id, 'product')} />
            ))}
            {productSpecificReviews.length > visibleReviews && (
              <button 
                onClick={() => setVisibleReviews(prev => prev + 5)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-primary font-bold text-sm flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <Plus size={18} /> Ver Mais Avaliações
              </button>
            )}
            {productSpecificReviews.length === 0 && (
              <div className="text-center text-gray-500 py-8 border border-white/5 rounded-md">Seja o primeiro a avaliar este produto!</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const CategoryView = ({ category, products, onBack, onBuy, onEdit, onDelete, isAdmin, onAddToCart, favorites, onToggleFavorite, productReviews }: any) => {
  // Filtra produtos apenas se a categoria for uma das tags padrões
  const validTags = ['barba', 'cabelo', 'nossa-linha'];
  const filteredProducts = validTags.includes(category.toLowerCase())
    ? products.filter((p: any) => p.tags && p.tags.includes(category.toLowerCase()))
    : products; // Para "Meus Favoritos" e "Busca", os produtos já vêm filtrados do pai

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors w-fit mb-4">
        <ChevronLeft size={20} /> Voltar para a loja
      </button>

      <SectionHeader 
        title={`Produtos para ${category.charAt(0).toUpperCase() + category.slice(1)}`} 
        subtitle={`Confira os melhores itens`} 
      />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {filteredProducts.map((product: any) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isAdmin={isAdmin}
              onEdit={onEdit}
              onBuy={onBuy}
              onDelete={onDelete}
              onAddToCart={onAddToCart}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              productReviews={productReviews}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400 border border-white/5 rounded-md bg-white/5 mt-4">
          <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhum produto encontrado</h3>
          <p>Ainda não temos itens desta categoria cadastrados no sistema.</p>
        </div>
      )}
    </main>
  );
};
const AccountView = ({ user, onBack, formData, setFormData, handleProfileUpdate }: any) => {
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem('oldking_token');
        if (!token) return;
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/orders/my-orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setMyOrders(await res.json());
        }
      } catch (err) {
        console.error('Erro ao buscar pedidos do cliente', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 animate-in fade-in">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 bg-surface border border-white/10 flex items-center justify-center rounded-full hover:bg-white/5 hover:text-primary transition-colors text-gray-400">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white">Minha Conta</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel Esquerdo: Perfil */}
        <div className="bg-surface border border-white/10 rounded-lg p-6 flex flex-col items-center h-fit">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 bg-background flex items-center justify-center mb-4">
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={60} className="text-gray-500" />
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
          <p className="text-gray-400 text-sm mb-6">{user.email}</p>

          <form className="w-full flex flex-col gap-4 border-t border-white/5 pt-6" onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(e); }}>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Alterar Foto de Perfil (URL)</label>
              <input 
                type="url" 
                required
                value={formData.photoUrl}
                onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background text-sm transition-all" 
                placeholder="https://exemplo.com/foto.jpg" 
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-on-primary font-bold text-sm py-2.5 rounded-md transition-all"
            >
              Atualizar Perfil
            </button>
          </form>
        </div>

        {/* Painel Direito: Meus Pedidos */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-white mb-2">Meus Pedidos</h3>
          
          {loading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : myOrders.length === 0 ? (
            <div className="text-center py-12 bg-surface border border-white/5 rounded-lg">
              <ShoppingBag size={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-gray-400">Você ainda não realizou nenhuma compra.</p>
              <button onClick={onBack} className="mt-4 text-primary hover:underline">Ir para a loja</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myOrders.map((order: any) => {
                let items = [];
                try { items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items; } catch(e) {}
                
                // Mapeamento de status para exibir bonito
                const statusMap: Record<string, { label: string, color: string }> = {
                  'approved': { label: 'Aprovado', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                  'processing': { label: 'Processando', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
                  'shipped': { label: 'Enviado', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                  'delivered': { label: 'Entregue', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                  'cancelled': { label: 'Cancelado', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
                };
                const statusInfo = statusMap[order.status] || { label: order.status, color: 'bg-white/10 text-gray-300 border-white/20' };

                return (
                  <div key={order.id} className="bg-surface border border-white/10 rounded-lg p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-white">Pedido #{order.id.slice(0, 8)}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR')}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-lg font-bold text-primary">R$ {order.totalAmount.toFixed(2).replace('.', ',')}</p>
                        <p className="text-xs text-gray-500 uppercase">{order.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500">{item.quantity}x</span>
                          <span className="text-gray-300">{item.title || item.product?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

const OrdersPanel = ({ orders, onStatusChange, onBack }: { orders: any[], onStatusChange: (id: string, status: string) => void, onBack: () => void }) => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 animate-in fade-in">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 bg-surface border border-white/10 flex items-center justify-center rounded-full hover:bg-white/5 hover:text-primary transition-colors text-gray-400">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white">Gerenciar Pedidos</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-white/5 rounded-lg">
          <ShoppingBag size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-gray-400">Nenhum pedido encontrado no sistema.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order: any) => {
            let items = [];
            try { items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items; } catch(e) {}
            return (
              <div key={order.id} className="bg-surface border border-white/10 rounded-lg p-6 flex flex-col gap-4 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">Pedido <span className="text-primary text-sm font-normal ml-2">#{order.id.slice(0, 8)}</span></h3>
                    <p className="text-gray-400 text-sm">Data: {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR')}</p>
                    <p className="text-gray-400 text-sm">Cliente: <span className="text-white">{order.userId || 'Visitante'}</span></p>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <p className="text-xl font-bold text-primary">R$ {order.totalAmount.toFixed(2).replace('.', ',')}</p>
                    {order.shippingFee > 0 && <p className="text-xs text-primary font-bold">Inclui Frete: R$ {order.shippingFee.toFixed(2).replace('.', ',')}</p>}
                    <p className="text-sm text-gray-400 mt-1">Pagamento: <span className="uppercase text-white">{order.paymentMethod}</span></p>
                    <select 
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value)}
                      className="bg-background border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary mt-2"
                    >
                      <option value="approved">Aprovado</option>
                      <option value="processing">Processando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
                
                {order.address && (
                  <div className="bg-background/50 p-4 rounded-md border border-white/5 mb-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Endereço de Entrega</h4>
                    <p className="text-sm text-white">
                      {(() => {
                        try {
                          const addr = JSON.parse(order.address);
                          return `${addr.street}, ${addr.number}${addr.complement ? ' - ' + addr.complement : ''} | ${addr.neighborhood}, ${addr.city} - ${addr.state} | CEP: ${addr.cep}`;
                        } catch(e) { return order.address; }
                      })()}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Itens do Pedido</h4>
                  <div className="flex flex-col gap-2">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-black/20 p-3 rounded text-sm">
                        <div className="flex items-center gap-3">
                          <span className="bg-white/10 px-2 py-0.5 rounded font-bold">{item.quantity}x</span>
                          <span className="text-gray-200">{item.title || item.product?.name}</span>
                        </div>
                        <span className="text-gray-400">R$ {parseFloat(item.unit_price || item.product?.price?.replace('R$ ', '').replace('.', '').replace(',', '.') || '0').toFixed(2).replace('.', ',')} un.</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

const UsersView = ({ onBack }: { onBack: () => void }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('oldking_token');
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError('Erro ao carregar usuários.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId: string) => {
    try {
      const token = localStorage.getItem('oldking_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers(); // recarrega a lista
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao alterar permissão');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-primary transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
          <p className="text-gray-400 text-sm">Controle de acessos e permissões do site</p>
        </div>
      </div>

      <div className="bg-surface border border-white/5 rounded-lg overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4 text-center">Permissão</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Carregando...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="text-center py-8 text-red-400">{error}</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{u.phone || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-400'}`}>
                        {u.role === 'ADMIN' ? 'Administração' : 'Cliente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.email.toLowerCase() !== 'caioh0455@gmail.com' && (
                        <button 
                          onClick={() => handleToggleAdmin(u.id)}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${u.role === 'ADMIN' ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : 'border-primary/50 text-primary hover:bg-primary/10'}`}
                        >
                          {u.role === 'ADMIN' ? 'Revogar Admin' : 'Conceder Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && users.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum usuário cadastrado no banco de dados.
          </div>
        )}
      </div>
    </main>
  );
};

const CheckoutView = ({ cart, onBack, user }: any) => {
  const [step, setStep] = useState(1);
  const [pixData, setPixData] = useState<any>(null);
  const [pixPaymentId, setPixPaymentId] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: '',
    phone: user?.phone || '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const cartTotal = cart.reduce((acc: number, item: any) => {
    const priceStr = String(item.product.price);
    const priceNum = parseFloat(priceStr.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    return acc + (priceNum * item.quantity);
  }, 0) + (selectedShipping ? selectedShipping.price : 0);

  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    
    setLoadingCep(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cleanCep })
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          cep: cleanCep,
          street: data.address.street || prev.street,
          neighborhood: data.address.neighborhood || prev.neighborhood,
          city: data.address.city || prev.city,
          state: data.address.state || prev.state
        }));
        setShippingOptions(data.options || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors w-fit">
        <ChevronLeft size={20} /> Voltar para a loja
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          {/* Timeline */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 z-0"></div>
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500`} style={{ width: step === 1 ? '50%' : '100%' }}></div>
            
            <div className="flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm mb-2 shadow-[0_0_15px_rgba(233,193,118,0.5)]">1</div>
              <span className="text-xs font-bold text-primary">Identificação</span>
            </div>
            
            <div className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors duration-500 ${step === 2 ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(233,193,118,0.5)]' : 'bg-surface border border-white/20 text-gray-400'}`}>2</div>
              <span className={`text-xs font-bold transition-colors duration-500 ${step === 2 ? 'text-primary' : 'text-gray-400'}`}>Pagamento</span>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-surface border border-white/5 rounded-lg p-6 shadow-2xl animate-in fade-in slide-in-from-left-4">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Dados Pessoais e Entrega</h2>
              <form onSubmit={handleNextStep} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Nome Completo</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">CPF / CNPJ</label>
                    <input required type="text" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" placeholder="Para emissão da NF" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">E-mail</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Telefone / WhatsApp</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mt-4 mb-2">Endereço</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">CEP</label>
                    <input required type="text" value={formData.cep} onChange={e => { setFormData({...formData, cep: e.target.value}); if(e.target.value.length >= 8) fetchCep(e.target.value); }} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" />
                    {loadingCep && <span className="text-xs text-primary mt-1 inline-block">Buscando CEP...</span>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Rua</label>
                    <input required type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Número</label>
                    <input required type="text" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Complemento</label>
                    <input type="text" value={formData.complement} onChange={e => setFormData({...formData, complement: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Bairro</label>
                    <input required type="text" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Cidade</label>
                    <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Estado</label>
                    <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" placeholder="SP" />
                  </div>
                </div>

                {shippingOptions.length > 0 && (
                  <div className="mt-4 border-t border-white/10 pt-4 animate-in fade-in">
                    <h3 className="text-lg font-bold text-white mb-3">Opções de Frete</h3>
                    <div className="flex flex-col gap-3">
                      {shippingOptions.map((opt, idx) => (
                        <label key={idx} className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${selectedShipping?.name === opt.name ? 'border-primary bg-primary/10' : 'border-white/10 bg-background/50 hover:border-white/30'}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="shipping" required checked={selectedShipping?.name === opt.name} onChange={() => setSelectedShipping(opt)} className="accent-primary w-4 h-4" />
                            <div>
                              <span className="text-white font-medium block">{opt.company} {opt.name}</span>
                              <span className="text-gray-400 text-xs">Entrega em até {opt.delivery_time} dias úteis</span>
                            </div>
                          </div>
                          <span className="text-primary font-bold">R$ {opt.price.toFixed(2).replace('.', ',')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-lg py-4 rounded-md mt-6 transition-all hover:shadow-[0_0_20px_rgba(233,193,118,0.3)]">
                  Ir para Pagamento
                </button>
              </form>
            </div>
          )}

          {step === 2 && !pixData && (
            <div className="bg-surface border border-white/5 rounded-lg p-6 shadow-2xl animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white">Pagamento Seguro</h2>
                <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-primary transition-colors">Voltar para Identificação</button>
              </div>
              
              <div className="bg-background border border-white/10 rounded-md p-2 min-h-[300px]">
                <Payment
                  initialization={{
                    amount: cartTotal,
                    payer: {
                      email: formData.email,
                    },
                  }}
                  customization={{
                    paymentMethods: {
                      ticket: "all",
                      bankTransfer: "all",
                      creditCard: "all",
                      debitCard: "all",
                      mercadoPago: "all",
                    },
                  }}
                  onSubmit={async (param) => {
                    try {
                      const res = await fetch(import.meta.env.VITE_API_URL + '/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ...param.formData,
                          transaction_amount: cartTotal,
                          userId: user?.email || null,
                          customer: formData,
                          items: cart.map((c: any) => ({ id: c.product.id, title: c.product.name, quantity: c.quantity, unit_price: c.product.price }))
                        })
                      });
                      const data = await res.json();
                      if (data.success) {
                        if (data.paymentResponse && data.paymentResponse.payment_method_id === 'pix') {
                          setPixData(data.paymentResponse.point_of_interaction.transaction_data);
                          setPixPaymentId(String(data.paymentResponse.id));
                          
                         // O backend agora salva o pedido PIX automaticamente!
                          
                        } else {
                         // O backend agora salva o pedido Cartão/Boleto automaticamente!
                          alert('Pagamento aprovado com sucesso!');
                          setCart([]);
                          localStorage.removeItem('oldking_cart');
                          setCurrentView('home');
                        }
                      } else {
                        alert('Erro ao processar pagamento: ' + data.message);
                      }
                    } catch (err) {
                      console.error('Erro na requisição de pagamento:', err);
                      alert('Erro ao processar pagamento no servidor.');
                    }
                  }}
                  onError={(error) => {
                    console.error('Erro no Mercado Pago Brick:', error);
                  }}
                  onReady={() => {
                    console.log('Payment Brick carregado e pronto');
                  }}
                />
              </div>
            </div>
          )}

          {step === 2 && pixData && (
            <div className="bg-surface border border-white/5 rounded-lg p-6 shadow-2xl animate-in fade-in slide-in-from-right-4 text-center min-h-[300px] flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-white mb-2">Pagamento via PIX</h2>
              <p className="text-gray-400 mb-6">Abra o app do seu banco e escaneie o QR Code ou use o Copia e Cola.</p>
              
              <div className="bg-white p-4 rounded-lg inline-block mb-6 shadow-[0_0_20px_rgba(233,193,118,0.2)]">
                <img src={`data:image/jpeg;base64,${pixData.qr_code_base64}`} alt="QR Code PIX" className="w-48 h-48" />
              </div>
              
              <div className="text-left w-full max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-400 mb-2">Ou use o PIX Copia e Cola:</label>
                <div className="flex">
                  <input type="text" readOnly value={pixData.qr_code} className="flex-1 bg-background border border-white/10 rounded-l-md px-3 py-3 text-white text-sm focus:outline-none" />
                  <button onClick={() => { navigator.clipboard.writeText(pixData.qr_code); alert('Chave PIX copiada!'); }} className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-3 rounded-r-md font-bold transition-colors shrink-0">
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resumo do Pedido */}
        <div className="w-full md:w-1/3">
          <div className="bg-surface border border-white/5 rounded-lg p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">Resumo do Pedido</h3>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
              {cart.map((item: any) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-white/5 rounded flex-shrink-0">
                    <img src={item.product.image} className="w-full h-full object-contain mix-blend-screen" />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <span className="text-sm text-gray-200 line-clamp-2">{item.product.name}</span>
                    <span className="text-xs text-gray-500">Qtd: {item.quantity}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-primary">{item.product.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>R$ {(cartTotal - (selectedShipping ? selectedShipping.price : 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              {selectedShipping && (
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Frete ({selectedShipping.name})</span>
                  <span>R$ {selectedShipping.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-primary pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-primary">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const Footer = ({ config, isAdmin, onEdit, onInstitutionalClick, onCategoryClick }: { config: typeof INITIAL_FOOTER_CONFIG, isAdmin: boolean, onEdit: () => void, onInstitutionalClick: (page: string) => void, onCategoryClick: (cat: string) => void }) => (
  <footer className="bg-black border-t border-white/5 mt-16 pb-8 md:pb-12 pt-12 md:pt-16 relative">
    {isAdmin && (
      <div className="absolute top-4 right-4 z-10 animate-in fade-in">
        <button 
          onClick={onEdit}
          className="bg-primary text-on-primary px-4 py-2 rounded-md font-bold text-sm shadow-lg hover:brightness-110 flex items-center gap-2"
        >
          <Edit2 size={16} /> Editar Rodapé
        </button>
      </div>
    )}
    <div className="max-w-6xl mx-auto px-4 mt-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Atendimento */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-lg mb-2">Atendimento</h4>
          
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-sm flex items-center gap-2"><Phone size={14} /> Telefone:</span>
            <span className="text-white text-sm font-medium">{config.phone}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-sm flex items-center gap-2"><WhatsAppIcon size={14} /> WhatsApp:</span>
            <span className="text-white text-sm font-medium">{config.whatsapp}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-sm flex items-center gap-2"><Mail size={14} /> E-mail:</span>
            <span className="text-white text-sm font-medium hover:text-primary transition-colors cursor-pointer break-all">{config.email}</span>
          </div>
          
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-gray-400 text-sm flex items-center gap-2"><Clock size={14} /> Horário de atendimento</span>
            <span className="text-gray-500 text-xs">{config.hours}</span>
          </div>
        </div>

        {/* Categorias */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-lg mb-2">Categorias</h4>
          <ul className="flex flex-col gap-3">
            <li><button onClick={() => onCategoryClick('barba')} className="text-gray-400 hover:text-primary transition-colors text-sm text-left w-full">Produtos para Barba</button></li>
            <li><button onClick={() => onCategoryClick('cabelo')} className="text-gray-400 hover:text-primary transition-colors text-sm text-left w-full">Produtos para Cabelo</button></li>
            <li><button onClick={() => onCategoryClick('nossa-linha')} className="text-gray-400 hover:text-primary transition-colors text-sm text-left w-full">Nossa Linha</button></li>
          </ul>
        </div>

        {/* Institucional */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-lg mb-2">Institucional</h4>
          <ul className="flex flex-col gap-3">
            <li><button onClick={() => onInstitutionalClick('about')} className="text-gray-400 hover:text-primary transition-colors text-sm text-left">Sobre a Old King</button></li>
            <li><button onClick={() => onInstitutionalClick('exchanges')} className="text-gray-400 hover:text-primary transition-colors text-sm text-left">Trocas e Devoluções</button></li>
            <li><button onClick={() => onInstitutionalClick('privacy')} className="text-gray-400 hover:text-primary transition-colors text-sm text-left">Termos e Privacidade</button></li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-lg mb-2">Redes Sociais</h4>
          <div className="flex gap-4">
            <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-2 rounded hover:bg-primary hover:text-on-primary transition-colors text-gray-400"><Instagram size={20} /></a>
            <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-2 rounded hover:bg-primary hover:text-on-primary transition-colors text-gray-400"><Facebook size={20} /></a>
          </div>
          <div 
            className="mt-4 bg-white/5 border border-white/10 rounded p-4 flex items-center gap-3 w-fit cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => window.open(config.facebook, '_blank')}
          >
             <img src={logo} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
             <div className="flex flex-col pr-2">
               <span className="text-white text-sm font-bold">Old King</span>
               <span className="text-gray-500 text-xs flex items-center gap-1"><Facebook size={10} className="fill-blue-500 text-blue-500" /> Seguir Página</span>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <img src={logo} alt="Old King Logo" className="w-16 h-16 rounded object-cover border border-white/10" />
          <p className="text-gray-500 text-xs leading-relaxed text-justify">
            {config.description}
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Formas de pagamento</h4>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="bg-white px-2 py-1 rounded text-xs font-black italic text-blue-900 border border-gray-200">VISA</div>
            <div className="bg-white px-2 py-1 rounded text-xs font-black italic text-red-600 border border-gray-200 flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 -mr-1 z-10 mix-blend-multiply"></div><div className="w-2 h-2 rounded-full bg-yellow-500 mix-blend-multiply"></div> mastercard</div>
            <div className="bg-white px-2 py-1 rounded text-xs font-bold text-black border border-gray-200 uppercase tracking-widest">Boleto</div>
            <div className="bg-[#32BCA1]/10 px-2 py-1 rounded flex items-center gap-1 border border-[#32BCA1]/30 text-[#32BCA1] font-bold text-xs">
              <div className="w-2 h-2 rotate-45 bg-[#32BCA1]"></div> pix
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Selos de segurança</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-green-500 border border-green-500/20 bg-green-500/5 px-3 py-2.5 rounded hover:bg-green-500/10 transition-colors w-fit">
               <ShieldCheck size={24} />
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase font-bold tracking-widest">Compra Segura</span>
                 <span className="text-xs text-white">Site Protegido SSL</span>
               </div>
            </div>
            <div className="flex items-center gap-3 border border-white/10 bg-white/5 px-3 py-2.5 rounded hover:bg-white/10 transition-colors w-fit">
               <ShieldCheck size={24} className="text-green-500" />
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase font-bold text-gray-400">Safe Browsing</span>
                 <span className="text-xs text-blue-400 font-bold tracking-widest">Google</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Formas de envio</h4>
          <div className="flex flex-wrap gap-2">
             <div className="bg-yellow-400 text-blue-900 font-black italic px-3 py-1.5 rounded text-sm">SEDEX</div>
             <div className="bg-blue-900 text-yellow-400 font-black italic px-3 py-1.5 rounded text-sm">PAC</div>
             <div className="bg-red-600 text-white font-black px-3 py-1.5 rounded text-sm tracking-widest flex items-center gap-1"><div className="w-2 h-2 bg-white"></div> jadlog</div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const INSTITUTIONAL_PAGES = {
  about: {
    title: 'Sobre a Old King',
    content: `
A **Old King Cosméticos** nasceu da paixão por cuidados masculinos de alta qualidade. Nossa missão é proporcionar a melhor experiência para o homem moderno, oferecendo produtos premium que aliam tradição, tecnologia e respeito à essência masculina.

Nossos produtos são desenvolvidos com fórmulas exclusivas, testadas e aprovadas por especialistas e barbeiros de todo o Brasil. Não vendemos apenas cosméticos, entregamos confiança, estilo e atitude.

Seja bem-vindo à realeza dos cuidados masculinos.
    `
  },
  exchanges: {
    title: 'Política de Trocas e Devoluções',
    content: `
A **Old King Cosméticos** preza pela sua satisfação e transparência. Nossa política de trocas e devoluções segue rigorosamente o Código de Defesa do Consumidor.

**Direito de Arrependimento:** Você tem o prazo de 7 (sete) dias corridos a partir do recebimento do produto para solicitar a devolução, desde que o produto esteja na embalagem original, sem indícios de uso e com o lacre intacto.

**Produtos com Defeito:** Caso o seu produto apresente algum defeito de fabricação, você poderá solicitar a troca em até 30 dias corridos.

Para iniciar o processo, entre em contato através dos nossos canais de atendimento informando o número do pedido.
    `
  },
  privacy: {
    title: 'Termos de Privacidade',
    content: `
A **Old King Cosméticos** respeita a sua privacidade e garante o sigilo total das informações que você nos fornece, de acordo com a Lei Geral de Proteção de Dados (LGPD).

Seus dados pessoais são armazenados de forma criptografada em nosso banco de dados e são utilizados exclusivamente para o processamento de suas compras, entregas e para o envio de ofertas personalizadas (caso autorizado).

Nós não comercializamos ou compartilhamos seus dados com terceiros. As senhas fornecidas são criptografadas e não podem ser lidas nem mesmo por nossa equipe.

Seus dados de pagamento, como o número do cartão de crédito, são processados de forma segura e direta pelo gateway de pagamento (Mercado Pago), não ficando armazenados em nossos servidores.
    `
  }
};

export default function App() {
  const [siteReviews, setSiteReviews] = useState<any[]>([]);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [reviewMode, setReviewMode] = useState<'site' | string | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });

  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [footerConfig, setFooterConfig] = useState(INITIAL_FOOTER_CONFIG);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/products');
      if (res.ok) {
        const data = await res.json();
        setAllProducts(data);
        setBestSellers(data.filter((p: any) => p.listCategory === 'bestsellers'));
        setNewReleases(data.filter((p: any) => p.listCategory === 'newreleases'));
      }
      const resB = await fetch(import.meta.env.VITE_API_URL + '/api/banners');
      if (resB.ok) setBanners(await resB.json());

      const resR = await fetch(import.meta.env.VITE_API_URL + '/api/reviews');
      if (resR.ok) {
        const dataR = await resR.json();
        setSiteReviews(dataR.filter((r: any) => r.type === 'site'));
        setProductReviews(dataR.filter((r: any) => r.type === 'product'));
      }

      const resS = await fetch(import.meta.env.VITE_API_URL + '/api/settings');
      if (resS.ok) {
        const dataS = await resS.json();
        setFooterConfig(dataS);
        setFooterForm(dataS);
      }

      const resO = await fetch(import.meta.env.VITE_API_URL + '/api/orders');
      if (resO.ok) setOrders(await resO.json());
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [currentView, setCurrentView] = useState<'home' | 'product' | 'category' | 'users' | 'checkout' | 'orders' | 'account' | 'search' | 'institutional' | 'favorites'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [institutionalPage, setInstitutionalPage] = useState<'about' | 'exchanges' | 'privacy'>('about');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('oldking_users_db');
    const parsedUsers = saved ? JSON.parse(saved) : [];
    
    // Garante que o usuário Admin exista por padrão
    if (!parsedUsers.find((u: any) => u.email.toLowerCase() === 'caioh0455@gmail.com')) {
      const adminUser = {
        name: 'Caio',
        email: 'caioh0455@gmail.com',
        password: 'Caio1506@',
        phone: '11988478272',
        photo: ''
      };
      parsedUsers.push(adminUser);
      localStorage.setItem('oldking_users_db', JSON.stringify(parsedUsers));
    }
    return parsedUsers;
  });

  const [user, setUser] = useState<{name: string, email: string, photo?: string, isAdmin?: boolean} | null>(() => {
    const saved = localStorage.getItem('oldking_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'verify' | 'editProduct' | 'addProduct' | 'editBanner' | 'addBanner' | 'editFooter' | null>(null);

  const [footerForm, setFooterForm] = useState(INITIAL_FOOTER_CONFIG);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', photoUrl: '' });
  const [verifyCode, setVerifyCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState(() => localStorage.getItem('oldking_whatsapp') || '5511999999999');
  const [productForm, setProductForm] = useState<{name: string, price: string, originalPrice: string, wholesalePrices: {quantity: string, price: string}[], sku: string, image: string, image2: string, image3: string, image4: string, tags: string[], listCategory: 'bestsellers' | 'newreleases'}>({ name: '', price: '', originalPrice: '', wholesalePrices: [], sku: '', image: '', image2: '', image3: '', image4: '', tags: [], listCategory: 'newreleases' });

  const [cart, setCart] = useState<{product: any, quantity: number}[]>(() => {
    const savedUser = localStorage.getItem('oldking_user');
    const u = savedUser ? JSON.parse(savedUser) : null;
    const key = u ? `oldking_cart_${u.id}` : 'oldking_cart_guest';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedUser = localStorage.getItem('oldking_user');
    const u = savedUser ? JSON.parse(savedUser) : null;
    const key = u ? `oldking_favorites_${u.id}` : 'oldking_favorites_guest';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [bannerForm, setBannerForm] = useState({ cat: '', img: '' });

  const isAdmin = user?.email?.toLowerCase() === 'caioh0455@gmail.com' || user?.role === 'ADMIN' || user?.isAdmin;

  const handleLogout = () => {
    localStorage.removeItem('oldking_user');
    setUser(null);
  };

  useEffect(() => {
    const userId = user ? user.id : 'guest';
    const savedCart = localStorage.getItem(`oldking_cart_${userId}`);
    setCart(savedCart ? JSON.parse(savedCart) : []);
    
    const savedFav = localStorage.getItem(`oldking_favorites_${userId}`);
    setFavorites(savedFav ? JSON.parse(savedFav) : []);
  }, [user?.id]);

  const handleAddToCart = (product: any) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    let newCart;
    if (existingItem) {
      newCart = cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
    } else {
      newCart = [...cart, { product, quantity: 1 }];
    }
    setCart(newCart);
    const userId = user ? user.id : 'guest';
    localStorage.setItem(`oldking_cart_${userId}`, JSON.stringify(newCart));
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(newCart);
    const userId = user ? user.id : 'guest';
    localStorage.setItem(`oldking_cart_${userId}`, JSON.stringify(newCart));
  };

  const handleRemoveFromCart = (productId: number) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    setCart(newCart);
    const userId = user ? user.id : 'guest';
    localStorage.setItem(`oldking_cart_${userId}`, JSON.stringify(newCart));
  };

  const handleToggleFavorite = (productId: string) => {
    let newFavorites;
    if (favorites.includes(productId)) {
      newFavorites = favorites.filter(id => id !== productId);
    } else {
      newFavorites = [...favorites, productId];
    }
    setFavorites(newFavorites);
    const userId = user ? user.id : 'guest';
    localStorage.setItem(`oldking_favorites_${userId}`, JSON.stringify(newFavorites));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Gera código aleatório de 6 dígitos no frontend (ou o backend poderia gerar)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setError('');

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setAuthMode('verify');
      } else {
        setError(data.error || 'Erro ao enviar e-mail.');
      }
    } catch (err) {
      console.error('Erro ao solicitar envio de e-mail:', err);
      setError('Erro de conexão com o servidor.');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewMode) return;
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reviewMode === 'site' ? 'site' : 'product',
          productId: reviewMode === 'site' ? null : reviewMode,
          text: reviewForm.text,
          rating: reviewForm.rating,
          name: user?.name || formData.name || 'Cliente Old King',
          photo: user?.photo || formData.photoUrl || `https://ui-avatars.com/api/?name=${user?.name || formData.name || 'C'}&background=E9C176&color=111`
        })
      });
      if (res.ok) {
        fetchData();
        setReviewMode(null);
        setReviewForm({ rating: 5, text: '' });
      } else {
        alert('Erro ao enviar avaliação.');
      }
    } catch (err) {
      alert('Erro de conexão.');
    }
  };

  const handleDeleteReview = async (id: number, type: 'site' | 'product') => {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) return;
    try {
      const token = localStorage.getItem('oldking_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Erro ao excluir avaliação.');
      }
    } catch (err) {
      alert('Erro de conexão.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, targetType: 'product' | 'banner' | 'user' = 'product') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (targetType === 'banner') {
          setBannerForm(prev => ({ ...prev, [fieldName]: reader.result as string }));
        } else if (targetType === 'user') {
          setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
        } else {
          setProductForm(prev => ({ ...prev, [fieldName]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode) {
      setError('Por favor, digite o código.');
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || 'Usuário',
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          photo: formData.photoUrl || '',
          code: verifyCode
        })
      });

      const data = await res.json();

      if (data.success) {
        // Salva token e dados básicos no localStorage
        localStorage.setItem('oldking_token', data.token);
        localStorage.setItem('oldking_user', JSON.stringify(data.user));
        setUser(data.user);

        setAuthMode(null);
        setFormData({ name: '', email: '', phone: '', password: '', photoUrl: '' });
        setVerifyCode('');
        setGeneratedCode('');
        setError('');
      } else {
        setError(data.error || 'Erro ao verificar o código.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão com o servidor.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('oldking_token', data.token);
        localStorage.setItem('oldking_user', JSON.stringify(data.user));
        setUser(data.user);
        setAuthMode(null);
        setFormData({ name: '', email: '', phone: '', password: '', photoUrl: '' });
        setError('');
      } else {
        setError(data.error || 'E-mail ou senha incorretos.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão com o servidor.');
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const updatedUser = { ...user, photo: formData.photoUrl };
    setUser(updatedUser);
    localStorage.setItem('oldking_user', JSON.stringify(updatedUser));
    
    const updatedUsers = users.map(u => u.email === user.email ? { ...u, photo: formData.photoUrl } : u);
    setUsers(updatedUsers);
    localStorage.setItem('oldking_users_db', JSON.stringify(updatedUsers));
    
    setAuthMode(null);
  };

  const handleDeleteProduct = async (product: any) => {
    if (window.confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
      try {
        const token = localStorage.getItem('oldking_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          fetchData();
        } else {
          alert('Erro ao excluir produto.');
        }
      } catch (err) {
        alert('Erro de conexão com o servidor.');
      }
    }
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const token = localStorage.getItem('oldking_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });

      if (res.ok) {
        fetchData();
        setAuthMode(null);
        setEditingProduct(null);
      } else {
        alert('Erro ao atualizar produto.');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('oldking_token');
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });

      if (res.ok) {
        fetchData();
        setAuthMode(null);
      } else {
        alert('Erro ao adicionar produto.');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  };

  const handleDeleteBanner = async (banner: any) => {
    if (window.confirm('Tem certeza que deseja excluir este destaque?')) {
      try {
        const token = localStorage.getItem('oldking_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/banners/${banner.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchData();
      } catch (err) {
        alert('Erro de conexão.');
      }
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('oldking_token');
      const url = authMode === 'editBanner' && editingBanner 
        ? `${import.meta.env.VITE_API_URL}/api/banners/${editingBanner.id}` 
        : import.meta.env.VITE_API_URL + '/api/banners';
      const method = authMode === 'editBanner' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(bannerForm)
      });
      if (res.ok) {
        fetchData();
        setAuthMode(null);
        setEditingBanner(null);
      } else {
        alert('Erro ao salvar destaque.');
      }
    } catch (err) {
      alert('Erro de conexão.');
    }
  };

  const handleSearch = (queryOverride?: string) => {
    const q = queryOverride !== undefined ? queryOverride : searchQuery;
    if (!q.trim()) return;
    const lowerQ = q.toLowerCase();
    const results = allProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQ) || 
      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(lowerQ))) ||
      p.listCategory.toLowerCase().includes(lowerQ)
    );
    setSearchResults(results);
    setCurrentView('search');
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans bg-background text-white">
      {/* Navbar Mocks */}
      <nav className="w-full h-20 border-b border-white/5 bg-surface flex items-center justify-between px-4 md:px-8 xl:px-16 sticky top-0 z-50">
        <div className="flex items-center gap-4 xl:gap-6">
          <button 
            className="text-gray-300 hover:text-primary transition-colors shrink-0"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center bg-background/80 border border-white/10 rounded-full px-4 py-2 focus-within:border-primary/50 transition-colors w-48 lg:w-64">
            <Search size={16} className="text-gray-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500 w-full"
            />
          </div>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-10 md:h-12 w-auto object-contain mix-blend-screen opacity-90"
          />
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setCurrentView('account'); setFormData({...formData, photoUrl: user.photo || ''}); }}
                className="w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-primary transition-colors flex items-center justify-center bg-surface cursor-pointer"
                title="Minha Conta"
              >
                {user.photo ? (
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-gray-400" />
                )}
              </button>
              <span className="text-sm text-primary hidden md:inline-block font-medium">Olá, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors ml-2"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setAuthMode('login')}
              className="text-gray-300 hover:text-primary transition-colors"
              title="Criar Conta / Entrar"
            >
              <User size={24} />
            </button>
          )}
          <button onClick={() => setIsCartOpen(true)} className="text-gray-300 hover:text-primary transition-colors relative">
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-200">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative w-[80vw] max-w-xs h-full bg-surface border-r border-white/5 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <span className="font-bold text-xl text-primary">Navegação</span>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col py-4 overflow-y-auto">
              <div className="px-4 mb-4 md:hidden">
                <div className="flex items-center bg-background/80 border border-white/10 rounded-full px-4 py-2 focus-within:border-primary/50 transition-colors w-full">
                  <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Buscar produtos..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500 w-full"
                  />
                </div>
              </div>
              {[
                { label: 'Todos os Produtos', icon: null, action: () => setCurrentView('home') },
                { label: 'Meus Favoritos', icon: <Heart size={18} className={favorites.length > 0 ? "text-red-500 fill-red-500 mr-2" : "text-gray-400 mr-2"} />, action: () => setCurrentView('favorites') },
                { label: 'Produtos para barba', icon: null, action: () => { setActiveCategory('barba'); setCurrentView('category'); } },
                { label: 'Produtos para cabelo', icon: null, action: () => { setActiveCategory('cabelo'); setCurrentView('category'); } },
                { label: 'Nossa linha', icon: null, action: () => { setActiveCategory('nossa-linha'); setCurrentView('category'); } }
              ].map((item, idx) => (
                <button 
                  key={idx} 
                  className="w-full text-left px-6 py-4 text-gray-300 hover:text-primary hover:bg-white/5 transition-all text-base font-medium border-l-2 border-transparent hover:border-primary"
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {item.label}
                  </div>
                </button>
              ))}
              {isAdmin && (
                <>
                  <button 
                    className="w-full text-left px-6 py-4 text-primary hover:text-white hover:bg-primary/20 transition-all text-base font-medium border-l-2 border-transparent hover:border-primary mt-2 border-t border-white/5 flex items-center gap-2"
                    onClick={() => {
                      setCurrentView('users');
                      setIsMenuOpen(false);
                    }}
                  >
                    <User size={18} /> Gerenciar Usuários
                  </button>
                  <button 
                    className="w-full text-left px-6 py-4 text-primary hover:text-white hover:bg-primary/20 transition-all text-base font-medium border-l-2 border-transparent hover:border-primary flex items-center gap-2"
                    onClick={() => {
                      setCurrentView('orders');
                      setIsMenuOpen(false);
                    }}
                  >
                    <ShoppingBag size={18} /> Gerenciar Pedidos
                  </button>
                  <button 
                    className="w-full text-left px-6 py-4 text-primary hover:text-white hover:bg-primary/20 transition-all text-base font-medium border-l-2 border-transparent hover:border-primary flex items-center gap-2"
                    onClick={() => {
                      setProductForm({ name: '', price: '', originalPrice: '', wholesalePrices: [], sku: '', image: '', image2: '', image3: '', image4: '', tags: [], listCategory: 'newreleases' });
                      setAuthMode('addProduct');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Plus size={18} /> Adicionar Produto
                  </button>
                </>
              )}
            </div>
            <div className="mt-auto p-6 border-t border-white/5">
              <p className="text-xs text-gray-500 text-center uppercase tracking-wider">Old King Cosméticos</p>
            </div>
          </div>
        </div>
      )}

      {currentView === 'home' ? (
        <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-12">
          
          {/* Top Banners Mock */}
        <div className="relative group">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {banners.map((banner: any) => (
              <BannerCard 
                key={banner.id}
                banner={banner}
                isAdmin={isAdmin}
                onEdit={(b) => {
                  setEditingBanner(b);
                  setBannerForm({ cat: b.cat, img: b.img });
                  setAuthMode('editBanner');
                }}
                onDelete={handleDeleteBanner}
                onClick={() => { setActiveCategory(banner.cat); setCurrentView('category'); }}
              />
            ))}
            {isAdmin && (
              <div 
                onClick={() => {
                  setBannerForm({ cat: '', img: '' });
                  setAuthMode('addBanner');
                }}
                className="w-[90vw] max-w-[90vw] md:w-[calc(50%-8px)] md:max-w-[calc(50%-8px)] bg-background aspect-video rounded-sm flex items-center justify-center border-2 border-dashed border-white/20 hover:border-primary/50 text-white/50 hover:text-primary transition-all cursor-pointer flex-shrink-0 snap-center group/add"
              >
                <div className="flex flex-col items-center gap-2 group-hover/add:scale-110 transition-transform">
                  <Plus size={32} />
                  <span className="font-bold text-sm uppercase tracking-wider">Novo Destaque</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Carousel Arrows for Banners */}
          <button 
            className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 bg-surface border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all z-10 shadow-lg opacity-0 group-hover:opacity-100 hidden md:flex rounded-full"
            onClick={(e) => { e.currentTarget.parentElement?.querySelector('div.overflow-x-auto')?.scrollBy({ left: -300, behavior: 'smooth' }); }}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 bg-surface border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all z-10 shadow-lg opacity-0 group-hover:opacity-100 hidden md:flex rounded-full"
            onClick={(e) => { e.currentTarget.parentElement?.querySelector('div.overflow-x-auto')?.scrollBy({ left: 300, behavior: 'smooth' }); }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Mais Vendidos Section */}
        <section>
          <SectionHeader title="Mais vendidos" subtitle="Todo mundo comprando!" />
          <div className="relative group">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {bestSellers.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isAdmin={isAdmin}
                  onEdit={(p) => {
                    setEditingProduct({...p, category: 'bestsellers'});
                    setProductForm({ name: p.name, price: p.price, originalPrice: p.originalPrice || '', wholesalePrices: p.wholesalePrices || (p.wholesalePrice ? [{quantity: '1', price: p.wholesalePrice}] : []), sku: p.sku || '', image: p.image, image2: p.image2 || '', image3: p.image3 || '', image4: p.image4 || '', tags: p.tags || [], listCategory: 'bestsellers' });
                    setAuthMode('editProduct');
                  }}
                  onBuy={(p) => {
                    setViewingProduct(p);
                    setCurrentView('product');
                  }}
                  onDelete={(p) => handleDeleteProduct({...p, category: 'bestsellers'})}
                  onAddToCart={handleAddToCart}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                  productReviews={productReviews}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Lançamentos Section */}
        <section>
          <SectionHeader title="Lançamentos" subtitle="Confira nossas novidades" />
          <div className="relative group">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {newReleases.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isAdmin={isAdmin}
                  onEdit={(p) => {
                    setEditingProduct({...p, category: 'newreleases'});
                    setProductForm({ name: p.name, price: p.price, originalPrice: p.originalPrice || '', wholesalePrices: p.wholesalePrices || (p.wholesalePrice ? [{quantity: '1', price: p.wholesalePrice}] : []), sku: p.sku || '', image: p.image, image2: p.image2 || '', image3: p.image3 || '', image4: p.image4 || '', tags: p.tags || [], listCategory: 'newreleases' });
                    setAuthMode('editProduct');
                  }}
                  onBuy={(p) => {
                    setViewingProduct(p);
                    setCurrentView('product');
                  }}
                  onDelete={(p) => handleDeleteProduct({...p, category: 'newreleases'})}
                  onAddToCart={handleAddToCart}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                  productReviews={productReviews}
                />
              ))}
            </div>
          </div>
        </section>

        <SiteReviewSection reviews={siteReviews} onWriteReview={() => setReviewMode('site')} user={user} isAdmin={isAdmin} onDeleteReview={handleDeleteReview} />

        </main>
      ) : currentView === 'product' ? (
        <ProductDetailsView 
          product={viewingProduct} 
          onBack={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }} 
          onAddToCart={handleAddToCart}
          isFavorite={favorites.includes(viewingProduct.id)}
          onToggleFavorite={handleToggleFavorite}
          reviews={productReviews}
          onWriteReview={(productId: string) => setReviewMode(productId)}
          user={user}
          isAdmin={isAdmin}
          onDeleteReview={handleDeleteReview}
        />
      ) : currentView === 'users' && isAdmin ? (
        <UsersView onBack={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }} />
      ) : currentView === 'orders' && isAdmin ? (
        <OrdersPanel orders={orders} onStatusChange={async (id: string, status: string) => {
          try {
            const token = localStorage.getItem('oldking_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ status })
            });
            if (res.ok) {
              fetchData();
            } else {
              alert('Erro ao atualizar status');
            }
          } catch(err) { alert('Erro de conexão'); }
        }} onBack={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }} />
      ) : currentView === 'account' && user ? (
        <AccountView 
          user={user} 
          onBack={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }} 
          formData={formData} 
          setFormData={setFormData} 
          handleProfileUpdate={handleProfileUpdate} 
        />
      ) : currentView === 'search' ? (
        <CategoryView 
          category={`Resultados para "${searchQuery}"`} 
          products={searchResults} 
          onBack={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }} 
          onBuy={(p: any) => { setViewingProduct(p); setCurrentView('product'); }}
          onEdit={(p: any) => {
            const isBestseller = bestSellers.find((b: any) => b.id === p.id);
            setProductForm({
              name: p.name,
              price: p.price,
              originalPrice: p.originalPrice || '',
              wholesalePrices: p.wholesalePrices || [],
              sku: p.sku || '',
              image: p.image,
              image2: p.image2 || '',
              image3: p.image3 || '',
              image4: p.image4 || '',
              tags: p.tags || [],
              listCategory: isBestseller ? 'bestsellers' : 'newreleases'
            });
            setEditingProduct(p);
            setAuthMode('editProduct');
          }}
          onDelete={handleDeleteProduct}
          isAdmin={isAdmin}
          onAddToCart={handleAddToCart}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          productReviews={productReviews}
        />
      ) : currentView === 'favorites' ? (
        <CategoryView 
          category="Meus Favoritos" 
          products={allProducts.filter(p => favorites.includes(p.id))} 
          onBack={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }} 
          onBuy={(p: any) => { setViewingProduct(p); setCurrentView('product'); }}
          onEdit={(p: any) => {
            const isBestseller = bestSellers.find((b: any) => b.id === p.id);
            setProductForm({
              name: p.name,
              price: p.price,
              originalPrice: p.originalPrice || '',
              wholesalePrices: p.wholesalePrices || [],
              sku: p.sku || '',
              image: p.image,
              image2: p.image2 || '',
              image3: p.image3 || '',
              image4: p.image4 || '',
              tags: p.tags || [],
              listCategory: isBestseller ? 'bestsellers' : 'newreleases'
            });
            setEditingProduct(p);
            setAuthMode('editProduct');
          }}
          onDelete={handleDeleteProduct}
          isAdmin={isAdmin}
          onAddToCart={handleAddToCart}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          productReviews={productReviews}
        />
      ) : currentView === 'institutional' ? (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4">
          <button 
            onClick={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }}
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8"
          >
            <ChevronLeft size={20} /> Voltar
          </button>
          <div className="bg-surface border border-white/5 rounded-lg p-8 md:p-12 shadow-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 border-b border-white/10 pb-6">
              {INSTITUTIONAL_PAGES[institutionalPage].title}
            </h1>
            <div className="prose prose-invert prose-p:text-gray-300 prose-strong:text-white max-w-none">
              {INSTITUTIONAL_PAGES[institutionalPage].content.split('\\n\\n').map((paragraph, idx) => {
                if (paragraph.trim() === '') return null;
                // Renderização básica de markdown para negrito
                const formatted = paragraph.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
                return <p key={idx} className="mb-4 leading-relaxed">{formatted}</p>;
              })}
            </div>
          </div>
        </div>
      ) : currentView === 'category' ? (
        <CategoryView 
          category={activeCategory} 
          products={[...bestSellers, ...newReleases]} 
          onBack={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }} 
          onBuy={(p: any) => { setViewingProduct(p); setCurrentView('product'); }}
          onEdit={(p: any) => {
            const isBestseller = bestSellers.find((b: any) => b.id === p.id);
            setEditingProduct({...p, category: isBestseller ? 'bestsellers' : 'newreleases'});
            setProductForm({ name: p.name, price: p.price, originalPrice: p.originalPrice || '', wholesalePrices: p.wholesalePrices || (p.wholesalePrice ? [{quantity: '1', price: p.wholesalePrice}] : []), sku: p.sku || '', image: p.image, image2: p.image2 || '', image3: p.image3 || '', image4: p.image4 || '', tags: p.tags || [], listCategory: isBestseller ? 'bestsellers' : 'newreleases' });
            setAuthMode('editProduct');
          }}
          onDelete={(p: any) => handleDeleteProduct({...p, category: bestSellers.find((b: any) => b.id === p.id) ? 'bestsellers' : 'newreleases'})}
          isAdmin={isAdmin}
          onAddToCart={handleAddToCart}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          productReviews={productReviews}
        />
      ) : currentView === 'checkout' ? (
        <CheckoutView 
          cart={cart}
          onBack={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }} 
          user={user}
        />
      ) : currentView === 'institutional' ? (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4">
          <button 
            onClick={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }}
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8"
          >
            <ChevronLeft size={20} /> Voltar
          </button>
          <div className="bg-surface border border-white/5 rounded-lg p-8 md:p-12 shadow-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 border-b border-white/10 pb-6">
              {INSTITUTIONAL_PAGES[institutionalPage].title}
            </h1>
            <div className="prose prose-invert prose-p:text-gray-300 prose-strong:text-white max-w-none">
              {INSTITUTIONAL_PAGES[institutionalPage].content.split('\\n\\n').map((paragraph, idx) => {
                if (paragraph.trim() === '') return null;
                // Renderização básica de markdown para negrito
                const formatted = paragraph.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
                return <p key={idx} className="mb-4 leading-relaxed">{formatted}</p>;
              })}
            </div>
          </div>
        </div>
      ) : null}


      {/* Auth Modal */}
      {authMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-white/10 rounded-lg w-full max-w-md p-6 relative shadow-2xl shadow-primary/5">
            <button 
              onClick={() => { setAuthMode(null); setError(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            {authMode === 'register' && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">Criar Conta</h2>
                  <p className="text-gray-400 text-sm">Junte-se à realeza</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleRegisterSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Nome de Usuário</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                      placeholder="Como gostaria de ser chamado" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">E-mail</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                      placeholder="seu@email.com.br" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Telefone</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                      placeholder="(00) 00000-0000" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Senha</label>
                    <input 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                      placeholder="••••••••" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Foto de Perfil (Opcional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'photoUrl', 'user')}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                    {formData.photoUrl && <div className="mt-2 text-xs text-green-400">Foto carregada com sucesso</div>}
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary font-bold text-lg py-3 rounded-md mt-4 hover:brightness-110 hover:shadow-[0_0_20px_rgba(233,193,118,0.3)] transition-all active:scale-[0.98]"
                  >
                    Continuar
                  </button>
                  {error && <p className="text-red-400 text-xs text-center mt-2 font-medium">{error}</p>}
                  <p className="text-center text-sm text-gray-400 mt-4">
                    Já tem uma conta? <button type="button" onClick={() => {setAuthMode('login'); setError('');}} className="text-primary hover:underline transition-colors">Entrar</button>
                  </p>
                </form>
              </>
            )}

            {authMode === 'login' && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">Acessar Conta</h2>
                  <p className="text-gray-400 text-sm">Bem-vindo de volta!</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">E-mail</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                      placeholder="seu@email.com.br" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Senha</label>
                    <input 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                      placeholder="••••••••" 
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary font-bold text-lg py-3 rounded-md mt-4 hover:brightness-110 hover:shadow-[0_0_20px_rgba(233,193,118,0.3)] transition-all active:scale-[0.98]"
                  >
                    Entrar
                  </button>
                  {error && <p className="text-red-400 text-xs text-center mt-2 font-medium">{error}</p>}
                  <p className="text-center text-sm text-gray-400 mt-4">
                    Ainda não tem conta? <button type="button" onClick={() => setAuthMode('register')} className="text-primary hover:underline transition-colors">Criar agora</button>
                  </p>
                </form>
              </>
            )}

            {authMode === 'verify' && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">Verificação</h2>
                  <p className="text-gray-400 text-sm">Enviamos um código para <strong className="text-white">{formData.email}</strong></p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleVerifySubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5 text-center">Código de 6 dígitos</label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      value={verifyCode}
                      onChange={e => { setVerifyCode(e.target.value); setError(''); }}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-3 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                      placeholder="000000" 
                    />
                    {error && <p className="text-red-400 text-xs text-center mt-2 font-medium">{error}</p>}
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary font-bold text-lg py-3 rounded-md mt-4 hover:brightness-110 hover:shadow-[0_0_20px_rgba(233,193,118,0.3)] transition-all active:scale-[0.98]"
                  >
                    Verificar e Criar Conta
                  </button>
                  <p className="text-center text-sm text-gray-400 mt-4">
                    Não recebeu? <button type="button" onClick={() => {
                      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                      setGeneratedCode(newCode);
                      fetch(import.meta.env.VITE_API_URL + '/api/auth/send-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: formData.email, code: newCode })
                      }).catch(err => console.error('Erro ao reenviar e-mail:', err));
                      alert('Um novo código foi enviado para o seu e-mail!');
                    }} className="text-primary hover:underline transition-colors">Reenviar código</button>
                  </p>
                </form>
              </>
            )}

            {(authMode === 'editProduct' || authMode === 'addProduct') && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">{authMode === 'editProduct' ? 'Editar Produto' : 'Adicionar Produto'}</h2>
                  <p className="text-gray-400 text-sm">{authMode === 'editProduct' ? 'Modifique as informações visíveis na loja' : 'Cadastre um novo item no sistema'}</p>
                </div>

                <div className="flex flex-col items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-background/50 border border-white/10 rounded-md flex items-center justify-center overflow-hidden p-2">
                    {productForm.image ? (
                      <img src={productForm.image} alt="Preview" className="w-full h-full object-contain mix-blend-screen" />
                    ) : (
                      <ShoppingBag size={24} className="text-gray-500" />
                    )}
                  </div>
                </div>

                <form className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 pb-2" onSubmit={authMode === 'editProduct' ? handleEditProductSubmit : handleAddProductSubmit}>
                  {authMode === 'addProduct' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Onde listar este produto?</label>
                      <select 
                        value={productForm.listCategory}
                        onChange={e => setProductForm({...productForm, listCategory: e.target.value as any})}
                        className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all"
                      >
                        <option value="newreleases">Lançamentos</option>
                        <option value="bestsellers">Mais Vendidos</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Nome do Produto</label>
                    <input 
                      type="text" 
                      required
                      value={productForm.name}
                      onChange={e => setProductForm({...productForm, name: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">SKU (Opcional)</label>
                      <input 
                        type="text" 
                        value={productForm.sku}
                        onChange={e => setProductForm({...productForm, sku: e.target.value})}
                        className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                        placeholder="Ex: BARBA-001" 
                      />
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-300">Preços de Atacado</label>
                      <button 
                        type="button" 
                        onClick={() => setProductForm({...productForm, wholesalePrices: [...productForm.wholesalePrices, { quantity: '', price: '' }]})}
                        className="text-xs flex items-center gap-1 bg-primary/20 text-primary hover:bg-primary hover:text-on-primary px-2 py-1 rounded transition-colors"
                      >
                        <Plus size={14} /> Adicionar
                      </button>
                    </div>
                    {productForm.wholesalePrices.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">Nenhum preço de atacado configurado.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {productForm.wholesalePrices.map((wp, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input 
                              type="number"
                              placeholder="Qtd (ex: 5)"
                              value={wp.quantity}
                              onChange={(e) => {
                                const newWP = [...productForm.wholesalePrices];
                                newWP[idx].quantity = e.target.value;
                                setProductForm({...productForm, wholesalePrices: newWP});
                              }}
                              className="w-20 bg-background/50 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-primary/50"
                            />
                            <span className="text-gray-500 text-sm">=</span>
                            <input 
                              type="text"
                              placeholder="Valor cada (ex: R$ 35,00)"
                              value={wp.price}
                              onChange={(e) => {
                                const newWP = [...productForm.wholesalePrices];
                                newWP[idx].price = e.target.value;
                                setProductForm({...productForm, wholesalePrices: newWP});
                              }}
                              className="flex-1 bg-background/50 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-primary/50"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                const newWP = productForm.wholesalePrices.filter((_, i) => i !== idx);
                                setProductForm({...productForm, wholesalePrices: newWP});
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1.5 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Categorias</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'barba', label: 'Produtos para Barba' },
                        { id: 'cabelo', label: 'Produtos para Cabelo' },
                        { id: 'nossa-linha', label: 'Nossa Linha' }
                      ].map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={productForm.tags.includes(cat.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProductForm({...productForm, tags: [...productForm.tags, cat.id]});
                              } else {
                                setProductForm({...productForm, tags: productForm.tags.filter((t: string) => t !== cat.id)});
                              }
                            }}
                            className="rounded border-white/20 bg-background/50 text-primary focus:ring-primary focus:ring-offset-0"
                          />
                          <span>{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Preço Atual</label>
                      <input 
                        type="text" 
                        required
                        value={productForm.price}
                        onChange={e => setProductForm({...productForm, price: e.target.value})}
                        className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                        placeholder="Ex: R$ 78,00" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Preço Antigo (Promo)</label>
                      <input 
                        type="text" 
                        value={productForm.originalPrice}
                        onChange={e => setProductForm({...productForm, originalPrice: e.target.value})}
                        className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                        placeholder="Ex: R$ 90,00" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Imagem 1 (Principal)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      required={authMode === 'addProduct'}
                      onChange={e => handleImageUpload(e, 'image')}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                    {productForm.image && <div className="mt-2 text-xs text-green-400">Imagem atual carregada</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Imagem 2 (Opcional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'image2')}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                    {productForm.image2 && <div className="mt-2 text-xs text-green-400">Imagem 2 atual carregada</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Imagem 3 (Opcional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'image3')}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                    {productForm.image3 && <div className="mt-2 text-xs text-green-400">Imagem 3 atual carregada</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Imagem 4 (Opcional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'image4')}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                    {productForm.image4 && <div className="mt-2 text-xs text-green-400">Imagem 4 atual carregada</div>}
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary font-bold text-lg py-3 rounded-md mt-4 hover:brightness-110 hover:shadow-[0_0_20px_rgba(233,193,118,0.3)] transition-all active:scale-[0.98]"
                  >
                    {authMode === 'editProduct' ? 'Salvar Alterações' : 'Adicionar Produto'}
                  </button>
                </form>
              </>
            )}

            {(authMode === 'editBanner' || authMode === 'addBanner') && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">{authMode === 'editBanner' ? 'Editar Destaque' : 'Novo Destaque'}</h2>
                  <p className="text-gray-400 text-sm">{authMode === 'editBanner' ? 'Modifique a categoria e a imagem do banner' : 'Adicione um novo banner à página inicial'}</p>
                </div>

                <div className="flex flex-col items-center gap-4 mb-4">
                  <div className="w-full aspect-video bg-background/50 border border-white/10 rounded-md flex items-center justify-center overflow-hidden p-2 max-h-[160px]">
                    {bannerForm.img ? (
                      <img src={bannerForm.img} alt="Preview" className="w-full h-full object-cover rounded-sm" />
                    ) : (
                      <ShoppingBag size={24} className="text-gray-500" />
                    )}
                  </div>
                </div>

                <form className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 pb-2" onSubmit={handleBannerSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Qual Categoria este Banner abre?</label>
                    <select 
                      required
                      value={bannerForm.cat}
                      onChange={e => setBannerForm({...bannerForm, cat: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    >
                      <option value="" disabled>Selecione a Categoria</option>
                      <option value="barba">Produtos para Barba</option>
                      <option value="cabelo">Produtos para Cabelo</option>
                      <option value="nossa-linha">Nossa Linha</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Imagem do Destaque</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      required={authMode === 'addBanner'}
                      onChange={e => handleImageUpload(e, 'img', 'banner')}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary font-bold text-lg py-3 rounded-md mt-4 hover:brightness-110 hover:shadow-[0_0_20px_rgba(233,193,118,0.3)] transition-all active:scale-[0.98]"
                  >
                    {authMode === 'editBanner' ? 'Salvar Alterações' : 'Adicionar Destaque'}
                  </button>
                </form>
              </>
            )}

            {authMode === 'editFooter' && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">Editar Rodapé</h2>
                  <p className="text-gray-400 text-sm">Altere as informações de contato e links sociais</p>
                </div>
                <form className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 pb-2" onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const token = localStorage.getItem('oldking_token');
                    const res = await fetch(import.meta.env.VITE_API_URL + '/api/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                      body: JSON.stringify(footerForm)
                    });
                    if (res.ok) {
                      fetchData();
                      setAuthMode(null);
                    } else {
                      alert('Erro ao salvar rodapé.');
                    }
                  } catch (err) {
                    alert('Erro de conexão.');
                  }
                }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Telefone</label>
                    <input 
                      type="text" 
                      value={footerForm.phone}
                      onChange={e => setFooterForm({...footerForm, phone: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">WhatsApp</label>
                    <input 
                      type="text" 
                      value={footerForm.whatsapp}
                      onChange={e => setFooterForm({...footerForm, whatsapp: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">E-mail</label>
                    <input 
                      type="email" 
                      value={footerForm.email}
                      onChange={e => setFooterForm({...footerForm, email: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Horário de Atendimento</label>
                    <input 
                      type="text" 
                      value={footerForm.hours}
                      onChange={e => setFooterForm({...footerForm, hours: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Link do Instagram</label>
                      <input 
                        type="url" 
                        value={footerForm.instagram}
                        onChange={e => setFooterForm({...footerForm, instagram: e.target.value})}
                        className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Link do Facebook</label>
                      <input 
                        type="url" 
                        value={footerForm.facebook}
                        onChange={e => setFooterForm({...footerForm, facebook: e.target.value})}
                        className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">CEP de Origem (Sua Loja)</label>
                      <input 
                        type="text" 
                        value={footerForm.originCep || ''}
                        onChange={e => setFooterForm({...footerForm, originCep: e.target.value})}
                        className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                        placeholder="Ex: 01001-000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Token Melhor Envio</label>
                      <input 
                        type="password" 
                        value={footerForm.melhorEnvioToken || ''}
                        onChange={e => setFooterForm({...footerForm, melhorEnvioToken: e.target.value})}
                        className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                        placeholder="Cole o token gigante aqui"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Descrição da Marca (Inferior)</label>
                    <textarea 
                      rows={4}
                      value={footerForm.description}
                      onChange={e => setFooterForm({...footerForm, description: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all resize-none" 
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary font-bold text-lg py-3 rounded-md mt-2 hover:brightness-110 hover:shadow-[0_0_20px_rgba(233,193,118,0.3)] transition-all active:scale-[0.98]"
                  >
                    Salvar Rodapé
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-white/10 rounded-lg w-full max-w-md p-6 relative shadow-2xl shadow-primary/5">
            <button 
              onClick={() => { setReviewMode(null); setReviewForm({ rating: 5, text: '' }); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">Deixe sua Avaliação</h2>
              <p className="text-gray-400 text-sm">
                {reviewMode === 'site' ? 'Como foi sua experiência com a nossa loja?' : 'O que você achou deste produto?'}
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleReviewSubmit}>
              {!user && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Seu Nome</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                      placeholder="João da Silva" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Sua Foto (Opcional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'photoUrl', 'user')}
                      className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all" 
                    />
                    {formData.photoUrl && <div className="mt-2 text-xs text-green-400">Foto carregada com sucesso</div>}
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 text-center">Sua Nota</label>
                <div className="flex justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star size={32} className={star <= reviewForm.rating ? "fill-primary text-primary" : "fill-white/10 text-white/10"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">O que você achou?</label>
                <textarea 
                  required
                  rows={4}
                  value={reviewForm.text}
                  onChange={e => setReviewForm({...reviewForm, text: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-md px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-background transition-all resize-none" 
                  placeholder="Excelente produto, entrega super rápida..." 
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-primary text-on-primary font-bold text-lg py-3 rounded-md mt-2 hover:brightness-110 hover:shadow-[0_0_20px_rgba(233,193,118,0.3)] transition-all active:scale-[0.98]"
              >
                Enviar Avaliação
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { if(cart.length > 0) { if(window.confirm('Você deseja mesmo fechar o carrinho?')) setIsCartOpen(false); } else { setIsCartOpen(false); } }} />
          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-surface border-l border-white/5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <span className="font-bold text-xl text-primary flex items-center gap-2">
                <ShoppingBag size={20} /> Seu Carrinho
              </span>
              <button onClick={() => { if(cart.length > 0) { if(window.confirm('Você deseja mesmo fechar o carrinho?')) setIsCartOpen(false); } else { setIsCartOpen(false); } }} className="text-gray-400 hover:text-white transition-colors p-2">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingBag size={48} className="mb-4 opacity-50" />
                  <p>Seu carrinho está vazio.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 bg-background/50 border border-white/5 p-3 rounded-md relative group">
                    <div className="w-20 h-20 bg-white/5 rounded overflow-hidden flex-shrink-0">
                      <img src={item.product.image} className="w-full h-full object-contain mix-blend-screen" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h4 className="text-sm font-medium text-gray-200 line-clamp-2 pr-6">{item.product.name}</h4>
                      <div className="mt-auto flex items-end justify-between">
                        <span className="text-primary font-bold text-sm">{item.product.price}</span>
                        <div className="flex items-center bg-surface border border-white/10 rounded-sm">
                          <button onClick={() => handleUpdateQuantity(item.product.id, -1)} className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="px-2 py-1 text-sm text-white min-w-[2rem] text-center">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.product.id, 1)} className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-white/5 bg-background/80 backdrop-blur-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {cart.reduce((acc, item) => {
                      const priceStr = String(item.product.price);
                      const priceNum = parseFloat(priceStr.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
                      return acc + (priceNum * item.quantity);
                    }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button 
                  onClick={() => { setIsCartOpen(false); setCurrentView('checkout'); }}
                  className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-lg py-4 rounded-md transition-all">
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer 
        config={footerConfig} 
        isAdmin={isAdmin} 
        onEdit={() => { setFooterForm(footerConfig); setAuthMode('editFooter'); }} 
        onInstitutionalClick={(page) => {
          setInstitutionalPage(page as 'about' | 'exchanges' | 'privacy');
          setCurrentView('institutional');
          window.scrollTo(0, 0);
        }}
        onCategoryClick={(cat) => {
          setActiveCategory(cat);
          setCurrentView('category');
          window.scrollTo(0, 0);
        }}
      />
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 animate-in fade-in duration-500 delay-500">
        {isAdmin && (
          <button 
            onClick={() => {
              const newNumber = prompt('Digite o número do WhatsApp com código do país e DDD (ex: 5511999999999):', whatsappNumber);
              if (newNumber) {
                const cleaned = newNumber.replace(/\D/g, '');
                if (cleaned) {
                  setWhatsappNumber(cleaned);
                  localStorage.setItem('oldking_whatsapp', cleaned);
                }
              }
            }}
            className="bg-surface border border-white/10 text-gray-400 p-2 rounded-full shadow-lg hover:text-primary transition-colors flex items-center justify-center bg-black/80 backdrop-blur-sm"
            title="Editar número do WhatsApp"
          >
            <Edit2 size={16} />
          </button>
        )}
        <button 
          onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] transition-all hover:-translate-y-1 group relative flex items-center justify-center"
          title="Fale conosco no WhatsApp"
        >
          <WhatsAppIcon size={28} className="group-hover:scale-110 transition-transform" />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black px-3 py-1.5 rounded text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Fale conosco
          </span>
        </button>
      </div>
    </div>
  );
}
