import { createContext, useContext, useState, ReactNode } from 'react';

const translations = {
  en: {
    search: { placeholder: 'Search for products, brands, and more...' },
    nav: { flashdeals: 'Flash Deals', topsellers: 'Top Sellers', newarrivals: 'New Arrivals', electronics: 'Electronics', fashion: 'Fashion', home: 'Home & Living', sports: 'Sports & Outdoors', beauty: 'Beauty & Health', becomeSponsor: 'Become Sponsor' },
    auth: { signIn: 'Sign In', signOut: 'Sign Out', login: 'Login', register: 'Register', becomeSeller: 'Become Seller' },
    product: { addToCart: 'Add to Cart', buyNow: 'Buy Now', outOfStock: 'Out of Stock', inStock: 'In Stock', reviews: 'Reviews', rating: 'Rating' },
    categories: { all: 'All', electronics: 'Electronics', fashion: 'Fashion', home: 'Home & Living', sports: 'Sports', beauty: 'Beauty', books: 'Books', toys: 'Toys', automotive: 'Automotive' }
  },
  rw: {
    search: { placeholder: 'Shakisha ibicuruzwa, ibyapa, nibindi...' },
    nav: { flashdeals: 'Amahitamo Yihuse', topsellers: 'Abacuruzi Bakomeye', newarrivals: 'Ibicuruzwa Bishya', electronics: 'Ikoranabuhanga', fashion: 'Imyambaro', home: 'Ingo n\'Ubuzima', sports: 'Siporo', beauty: 'Ubwiza', becomeSponsor: 'Tera Inkunga' },
    auth: { signIn: 'Injira', signOut: 'Sohoka', login: 'Injira', register: 'Iyandikishe', becomeSeller: 'Uba Umucuruzi' },
    product: { addToCart: 'Shyira mu Gitebo', buyNow: 'Gura Nonaha', outOfStock: 'Byarangiye', inStock: 'Birahari', reviews: 'Ibitekerezo', rating: 'Amanota' },
    categories: { all: 'Byose', electronics: 'Ikoranabuhanga', fashion: 'Imyambaro', home: 'Ingo', sports: 'Siporo', beauty: 'Ubwiza', books: 'Ibitabo', toys: 'Ibikinisho', automotive: 'Ibinyabiziga' },
    shops: { title: 'Shakisha Amaduka', subtitle: 'Reba ibihumbi by\'abacuruzi bemejwe', search: 'Shakisha amaduka...', category: 'Icyiciro', location: 'Ahantu', verified: 'Yemejwe', view: 'Reba Iduka' },
    common: { search: 'Shakisha', all: 'Byose', back: 'Subira', follow: 'Kurikira', followers: 'Abakurikira', products: 'Ibicuruzwa', loading: 'Birimo Gupakira...', noResults: 'Nta bisubizo' },
    messages: { chat: 'Ganira', call: 'Hamagara', video: 'Video', sendMessage: 'Ohereza Ubutumwa', typeMessage: 'Andika ubutumwa...', startConversation: 'Tangira ikiganiro' }
  },
  fr: {
    search: { placeholder: 'Rechercher des produits, marques et plus...' },
    nav: { flashdeals: 'Offres Flash', topsellers: 'Meilleurs Vendeurs', newarrivals: 'Nouveautés', electronics: 'Électronique', fashion: 'Mode', home: 'Maison', sports: 'Sports', beauty: 'Beauté', becomeSponsor: 'Devenir Sponsor' },
    auth: { signIn: 'Se Connecter', signOut: 'Se Déconnecter', login: 'Connexion', register: 'S\'inscrire', becomeSeller: 'Devenir Vendeur' },
    product: { addToCart: 'Ajouter au Panier', buyNow: 'Acheter', outOfStock: 'Rupture de Stock', inStock: 'En Stock', reviews: 'Avis', rating: 'Note' },
    categories: { all: 'Tout', electronics: 'Électronique', fashion: 'Mode', home: 'Maison', sports: 'Sports', beauty: 'Beauté', books: 'Livres', toys: 'Jouets', automotive: 'Automobile' }
  },
  sw: {
    search: { placeholder: 'Tafuta bidhaa, chapa na zaidi...' },
    nav: { flashdeals: 'Ofa za Haraka', topsellers: 'Wauzaji Bora', newarrivals: 'Bidhaa Mpya', electronics: 'Elektroniki', fashion: 'Mavazi', home: 'Nyumbani', sports: 'Michezo', beauty: 'Uzuri', becomeSponsor: 'Kuwa Mdhamini' },
    auth: { signIn: 'Ingia', signOut: 'Toka', login: 'Ingia', register: 'Jisajili', becomeSeller: 'Kuwa Muuzaji' },
    product: { addToCart: 'Ongeza Kwenye Kikapu', buyNow: 'Nunua Sasa', outOfStock: 'Haina Stock', inStock: 'Ipo Stock', reviews: 'Maoni', rating: 'Ukadiriaji' },
    categories: { all: 'Yote', electronics: 'Elektroniki', fashion: 'Mavazi', home: 'Nyumbani', sports: 'Michezo', beauty: 'Uzuri', books: 'Vitabu', toys: 'Vichezeo', automotive: 'Magari' }
  },
  es: {
    search: { placeholder: 'Buscar productos, marcas y más...' },
    nav: { flashdeals: 'Ofertas Flash', topsellers: 'Mejores Vendedores', newarrivals: 'Novedades', electronics: 'Electrónica', fashion: 'Moda', home: 'Hogar', sports: 'Deportes', beauty: 'Belleza', becomeSponsor: 'Ser Patrocinador' },
    auth: { signIn: 'Iniciar Sesión', signOut: 'Cerrar Sesión', login: 'Iniciar Sesión', register: 'Registrarse', becomeSeller: 'Ser Vendedor' },
    product: { addToCart: 'Añadir al Carrito', buyNow: 'Comprar Ahora', outOfStock: 'Agotado', inStock: 'En Stock', reviews: 'Reseñas', rating: 'Calificación' },
    categories: { all: 'Todo', electronics: 'Electrónica', fashion: 'Moda', home: 'Hogar', sports: 'Deportes', beauty: 'Belleza', books: 'Libros', toys: 'Juguetes', automotive: 'Automotriz' }
  },
  ar: {
    search: { placeholder: 'ابحث عن المنتجات والعلامات التجارية والمزيد...' },
    nav: { flashdeals: 'عروض سريعة', topsellers: 'أفضل البائعين', newarrivals: 'وصل حديثاً', electronics: 'إلكترونيات', fashion: 'أزياء', home: 'المنزل', sports: 'رياضة', beauty: 'جمال', becomeSponsor: 'كن راعياً' },
    auth: { signIn: 'تسجيل الدخول', signOut: 'تسجيل الخروج', login: 'دخول', register: 'تسجيل', becomeSeller: 'كن بائعاً' },
    product: { addToCart: 'أضف إلى السلة', buyNow: 'اشتر الآن', outOfStock: 'نفذ من المخزون', inStock: 'متوفر', reviews: 'التقييمات', rating: 'التقييم' },
    categories: { all: 'الكل', electronics: 'إلكترونيات', fashion: 'أزياء', home: 'المنزل', sports: 'رياضة', beauty: 'جمال', books: 'كتب', toys: 'ألعاب', automotive: 'سيارات' }
  },
  zh: {
    search: { placeholder: '搜索产品、品牌等...' },
    nav: { flashdeals: '限时抢购', topsellers: '热销商品', newarrivals: '新品上市', electronics: '电子产品', fashion: '时尚', home: '家居', sports: '运动', beauty: '美容', becomeSponsor: '成为赞助商' },
    auth: { signIn: '登录', signOut: '退出', login: '登录', register: '注册', becomeSeller: '成为卖家' },
    product: { addToCart: '加入购物车', buyNow: '立即购买', outOfStock: '缺货', inStock: '有货', reviews: '评论', rating: '评分' },
    categories: { all: '全部', electronics: '电子产品', fashion: '时尚', home: '家居', sports: '运动', beauty: '美容', books: '图书', toys: '玩具', automotive: '汽车' }
  },
  pt: {
    search: { placeholder: 'Pesquisar produtos, marcas e mais...' },
    nav: { flashdeals: 'Ofertas Relâmpago', topsellers: 'Mais Vendidos', newarrivals: 'Novidades', electronics: 'Eletrônicos', fashion: 'Moda', home: 'Casa', sports: 'Esportes', beauty: 'Beleza', becomeSponsor: 'Seja Patrocinador' },
    auth: { signIn: 'Entrar', signOut: 'Sair', login: 'Login', register: 'Registrar', becomeSeller: 'Seja Vendedor' },
    product: { addToCart: 'Adicionar ao Carrinho', buyNow: 'Comprar Agora', outOfStock: 'Fora de Estoque', inStock: 'Em Estoque', reviews: 'Avaliações', rating: 'Classificação' },
    categories: { all: 'Todos', electronics: 'Eletrônicos', fashion: 'Moda', home: 'Casa', sports: 'Esportes', beauty: 'Beleza', books: 'Livros', toys: 'Brinquedos', automotive: 'Automotivo' }
  },
  hi: {
    search: { placeholder: 'उत्पाद, ब्रांड और अधिक खोजें...' },
    nav: { flashdeals: 'फ्लैश डील्स', topsellers: 'शीर्ष विक्रेता', newarrivals: 'नए आगमन', electronics: 'इलेक्ट्रॉनिक्स', fashion: 'फैशन', home: 'घर', sports: 'खेल', beauty: 'सौंदर्य', becomeSponsor: 'प्रायोजक बनें' },
    auth: { signIn: 'साइन इन करें', signOut: 'साइन आउट करें', login: 'लॉगिन', register: 'रजिस्टर', becomeSeller: 'विक्रेता बनें' },
    product: { addToCart: 'कार्ट में जोड़ें', buyNow: 'अभी खरीदें', outOfStock: 'स्टॉक में नहीं', inStock: 'स्टॉक में', reviews: 'समीक्षाएं', rating: 'रेटिंग' },
    categories: { all: 'सभी', electronics: 'इलेक्ट्रॉनिक्स', fashion: 'फैशन', home: 'घर', sports: 'खेल', beauty: 'सौंदर्य', books: 'किताबें', toys: 'खिलौने', automotive: 'ऑटोमोटिव' }
  },
  de: {
    search: { placeholder: 'Produkte, Marken und mehr suchen...' },
    nav: { flashdeals: 'Blitzangebote', topsellers: 'Bestseller', newarrivals: 'Neuankömmlinge', electronics: 'Elektronik', fashion: 'Mode', home: 'Haus', sports: 'Sport', beauty: 'Schönheit', becomeSponsor: 'Sponsor werden' },
    auth: { signIn: 'Anmelden', signOut: 'Abmelden', login: 'Anmelden', register: 'Registrieren', becomeSeller: 'Verkäufer werden' },
    product: { addToCart: 'In den Warenkorb', buyNow: 'Jetzt kaufen', outOfStock: 'Nicht vorrätig', inStock: 'Auf Lager', reviews: 'Bewertungen', rating: 'Bewertung' },
    categories: { all: 'Alle', electronics: 'Elektronik', fashion: 'Mode', home: 'Haus', sports: 'Sport', beauty: 'Schönheit', books: 'Bücher', toys: 'Spielzeug', automotive: 'Automobil' }
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
