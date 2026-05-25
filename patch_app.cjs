const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add pixPaymentId state
code = code.replace(
  'const [pixData, setPixData] = useState<any>(null);',
  'const [pixData, setPixData] = useState<any>(null);\n  const [pixPaymentId, setPixPaymentId] = useState<string | null>(null);'
);

// Add poll useEffect
code = code.replace(
  '  useEffect(() => {\n    fetchProducts();\n    fetchBanners();',
  `  // Monitora o pagamento PIX
  useEffect(() => {
    let interval: any;
    if (pixPaymentId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(\`\${import.meta.env.VITE_API_URL}/api/orders/check/\${pixPaymentId}\`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'approved') {
              clearInterval(interval);
              alert('Pagamento PIX aprovado com sucesso! Muito obrigado!');
              setCart([]);
              localStorage.removeItem('oldking_cart');
              setCurrentView('home');
              setPixData(null);
              setPixPaymentId(null);
            }
          }
        } catch (e) {
          console.error("Erro ao checar status do PIX", e);
        }
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pixPaymentId]);

  useEffect(() => {
    fetchProducts();
    fetchBanners();`
);

// Add userId to checkout body
code = code.replace(
  'transaction_amount: cartTotal,\n                          customer: formData,',
  'transaction_amount: cartTotal,\n                          userId: user?.email || null,\n                          customer: formData,'
);

// Add setPixPaymentId and comment out old fetch /api/orders blocks
code = code.replace(
  'setPixData(data.paymentResponse.point_of_interaction.transaction_data);',
  'setPixData(data.paymentResponse.point_of_interaction.transaction_data);\n                          setPixPaymentId(String(data.paymentResponse.id));'
);

// Now remove the two big fetch blocks for orders to avoid duplicates.
// We will replace them with simple comments.
code = code.replace(
  / \/\/ Salva o pedido como PENDENTE[\s\S]*?\} catch \(e\) \{\s*console\.error\('Erro ao salvar pedido PIX no BD:', e\);\s*\}/,
  '// O backend agora salva o pedido PIX automaticamente!'
);

code = code.replace(
  / \/\/ Registra no nosso BD oficial[\s\S]*?\} catch \(e\) \{\s*console\.error\('Erro ao salvar order no BD:', e\);\s*\}/,
  '// O backend agora salva o pedido Cartão/Boleto automaticamente!'
);

fs.writeFileSync(file, code);
console.log('App.tsx patched for PIX polling');
