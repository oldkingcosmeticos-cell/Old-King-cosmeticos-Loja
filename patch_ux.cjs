const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Salvar dados de checkout no localStorage
code = code.replace(
  /const \[formData, setFormData\] = useState<any>\(\{\s*name: '',\s*email: user\?\.email \|\| '',\s*cpf: '',\s*phone: '',\s*cep: '',\s*street: '',\s*number: '',\s*complement: '',\s*neighborhood: '',\s*city: '',\s*state: ''\s*\}\);/,
  `const [formData, setFormData] = useState<any>(() => {
    const saved = localStorage.getItem('oldking_checkout_data');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (user?.email && !parsed.email) parsed.email = user.email;
        return parsed;
      } catch (e) {}
    }
    return { name: '', email: user?.email || '', cpf: '', phone: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' };
  });

  useEffect(() => {
    localStorage.setItem('oldking_checkout_data', JSON.stringify(formData));
  }, [formData]);`
);

// 2. Adicionar confirmação ao voltar do painel de admin ou checkout
// Procurar todos os setCurrentView('home') que estão dentro de ações de voltar, e adicionar window.confirm

// No ProductManager
code = code.replace(
  /onBack=\{\(\) => setCurrentView\('home'\)\}/g,
  `onBack={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }}`
);

// No botão voltar do Checkout
code = code.replace(
  /onClick=\{\(\) => setCurrentView\('home'\)\}/g,
  `onClick={() => { if(window.confirm('Você deseja mesmo sair?')) setCurrentView('home'); }}`
);

// Na remoção do carrinho
code = code.replace(
  /setCart\(cart\.filter\(\(c: any\) => c\.product\.id !== id\)\);/g,
  `if(window.confirm('Deseja mesmo apagar este produto do carrinho?')) setCart(cart.filter((c: any) => c.product.id !== id));`
);

// No fechamento do carrinho
code = code.replace(
  /onClick=\{\(\) => setIsCartOpen\(false\)\}/g,
  `onClick={() => { if(cart.length > 0) { if(window.confirm('Você deseja mesmo fechar o carrinho?')) setIsCartOpen(false); } else { setIsCartOpen(false); } }}`
);

fs.writeFileSync(file, code);
console.log('App.tsx patched for UX fixes');
