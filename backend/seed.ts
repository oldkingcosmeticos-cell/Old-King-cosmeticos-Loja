import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialProducts = [
  {
    name: 'Pomada Modeladora | Efeito Seco',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMsZ82F05L6f7w6z0dI2H5y02mXpB275rO77e8aE-gq5i-O57sZ-425121b67Qn1223P_7zU2XG98i6e_hI3dJ_pQ58X5vB8VvJ2X88o_5O9J9y5u5y_8Lw6XvT6v2k031j2ZlU9vY3RzO1cI1zZ2x76oWfQ2Z4o2T2YwB9wU4r97eL8y6GZp2YfU0N0X2809u5O3lY_5X72f1xQ7T38kM7wO9_fX4wE8Z7cEwU0K13g28t0d02P84I7t5w9',
    price: 'R$ 55,00',
    originalPrice: 'R$ 60,00',
    listCategory: 'bestsellers',
    tags: '[]',
    wholesalePrices: '[]',
  },
  {
    name: 'Óleo para Barba | Hidratação Intensa',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT8Q4T_F79zX669uH426k2v78V1bN937_l4bT_5rM5e3m2rU14uN4eJ48k53bF8G9g6yZ8l9s0nB7bC7T6cZ19H3vH_Lz9r9p9p834h2X6u8hT49p6Z2aE8i6E79pM53u_l4pE76R74T3pE9y9xX6o06_64bJ180iX9yW4eK0pE9nZ39p6bM7rB4eI2tZ8iW2s7h0q09T5yK9n34l0r_vN87fH3_I5c0vX6sE5T7zY9eY8cK20M8w',
    price: 'R$ 45,00',
    listCategory: 'bestsellers',
    tags: '[]',
    wholesalePrices: '[]',
  },
  {
    name: 'Shampoo 3 em 1 | Cabelo, Barba e Corpo',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlC-j4vW01e1U3dM8Z33u_zG4oY4wH94oU092R28uM4k8vT44sR_e9h3uP_lY42aX8uC73b8qW8bH5hV1iI6pW0zE4aL02eT_4qZ28L68W4cO0z2mX7uF0sU51Y2hY5cO9mE7uJ80jJ_nK8_lO1oP8744iV24bZ506dY2sA2pY5wZ9_iX0v8x3_I8tE_2kE4kU6aH8i_87v0tQ8gD93aX_6I0cR2pX40zB20nJ9s0hX1s8wK4g0uX4gI42_7s',
    price: 'R$ 48,00',
    originalPrice: 'R$ 55,00',
    listCategory: 'bestsellers',
    tags: '[]',
    wholesalePrices: '[]',
  },
  {
    name: 'Kit Completo | Barba Perfeita',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwR10Z4aM_v5dZ6v44kU2q6Y90H80E6lT7xP53v6zY7j64Z0zO_74E9wZ69k808jC43_h332rJ9hN3261aW8uS3sX_iY2pQ00lA_72hH8pL7iS_nF54M9i8fF75bM2uQ_vI6aG35sR_8zJ5cE7wU263O6pW7yA3kF11aE5xH202bE6xM8aN3420V9u89lD150oT5aB_81eW83c_2aG28fX7v_55V2zD6fK_3pL5pZ071c8411H432gZ469sV36fW94fR1_936hW6wE0oH2',
    price: 'R$ 135,00',
    originalPrice: 'R$ 150,00',
    listCategory: 'bestsellers',
    tags: '[]',
    wholesalePrices: '[]',
  },
  {
    name: 'Balm em Barra 13g',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg24Z4oNuFdn8NcMdEs9GL17TQhfzWf-O7KOUn3FWhZE95V8MnChVcDU58tFZmaPOe6x-Y1kauUGf2ygW7VpthjKINIom78E9FlryDcuZlrbicGzd2CEBJisnT60fuGD0qQBY1batKO1rlP1AHfUG-wsML898zE7e-uN8_4EMfHHacN_l_Ji1EbGkLRTy-xQCZ2gZVAZ___7R1koEwkd_7ch6PPPP6rxPw2d-2P00MT8utw3nkdUlhVZWavZVb_yRjg84Bq6a_UySn',
    price: 'R$ 65,00',
    originalPrice: 'R$ 70,00',
    listCategory: 'newreleases',
    tags: '[]',
    wholesalePrices: '[]',
  },
  {
    name: 'Preenchedor Barba, Cabelo, Bigode 10g',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsW-GjLyT1TiRYSDRRismnVij1UiN_SqdSRfsPhz_39XO6c52NwlIgeuNCgkXLQsmhG2rDh6M2qEnD_jtk3IaMrPNGD6183b2iaMd3tGRhEnyJh6dVHJVus5VfYveqEAl8wtRkIJ8REtYwkrxs_OCoySONk026cKrYivXxKZMgpoco-iUgeAHQ1eBGlJLcUyWAeTTb_BUsvG8LOD_EwKbc0-Cd4e-zSfAFEs0rCi2aOTDHyJSvH3z9wh8Rt0RpKRfjcwsTkxAwAZ31',
    price: 'R$ 70,00',
    originalPrice: 'R$ 75,00',
    listCategory: 'newreleases',
    tags: '[]',
    wholesalePrices: '[]',
  },
  {
    name: 'Caneca Senhor Barba',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuJ5tFnO-8_qjAFG27tG46PNy0joM83ezhOJTjzZlAQ65cnQtKmmKAESa9hunUa9AiZuWceF5laMsze3wz3NJL9AZ9W3ygQ1eXesksg6xK_ypyd-YqsgC8DdT6xYZVSH27w4nQ46rIS779a2rnHnYDZb3xGOCjkmMdxkD-egO3rkNMvcc0UliDbIAb9B1MjGzSsmqykjtLOff3bsD2N1XjZKMkpPa2qHnpNVDYrx6ub6EGyzK7_fCo9PnyzHRKC_4-hBzEiva0X9fA',
    price: 'R$ 39,90',
    listCategory: 'newreleases',
    tags: '[]',
    wholesalePrices: '[]',
  },
  {
    name: 'Óculos de Sol Preto Aviador Polarizado | Senhor Barba',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwZe5ZTQn6Ap2LuKDYHQc5nDUExE01-JeIVrWzrH5naEbn4GWbJvB7rFciawOItUCo5HLwSHQ9RqRBeWQann42-3xPRUxB1wWF1_5q9eNlifK6i9STmkq-D-t-7OHtDoIxkAXBnT7wzI8w2OY2sUBm0ctRqEP4sI7n02LJA6GLMLpPmvlV0ohOjjNOi0eMc13nG6Aupuwo49H4xiY69wPLZJGSpupf4XgMvGzrxkBgi9EQZGeH1FWCzydyw5NOsLbQ1V7v6bf1t28j',
    price: 'R$ 99,00',
    originalPrice: 'R$ 120,00',
    listCategory: 'newreleases',
    tags: '[]',
    wholesalePrices: '[]',
  }
];

const initialBanners = [
  { cat: 'barba', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwZe5ZTQn6Ap2LuKDYHQc5nDUExE01-JeIVrWzrH5naEbn4GWbJvB7rFciawOItUCo5HLwSHQ9RqRBeWQann42-3xPRUxB1wWF1_5q9eNlifK6i9STmkq-D-t-7OHtDoIxkAXBnT7wzI8w2OY2sUBm0ctRqEP4sI7n02LJA6GLMLpPmvlV0ohOjjNOi0eMc13nG6Aupuwo49H4xiY69wPLZJGSpupf4XgMvGzrxkBgi9EQZGeH1FWCzydyw5NOsLbQ1V7v6bf1t28j" },
  { cat: 'cabelo', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuJ5tFnO-8_qjAFG27tG46PNy0joM83ezhOJTjzZlAQ65cnQtKmmKAESa9hunUa9AiZuWceF5laMsze3wz3NJL9AZ9W3ygQ1eXesksg6xK_ypyd-YqsgC8DdT6xYZVSH27w4nQ46rIS779a2rnHnYDZb3xGOCjkmMdxkD-egO3rkNMvcc0UliDbIAb9B1MjGzSsmqykjtLOff3bsD2N1XjZKMkpPa2qHnpNVDYrx6ub6EGyzK7_fCo9PnyzHRKC_4-hBzEiva0X9fA" },
  { cat: 'lançamentos', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwZe5ZTQn6Ap2LuKDYHQc5nDUExE01-JeIVrWzrH5naEbn4GWbJvB7rFciawOItUCo5HLwSHQ9RqRBeWQann42-3xPRUxB1wWF1_5q9eNlifK6i9STmkq-D-t-7OHtDoIxkAXBnT7wzI8w2OY2sUBm0ctRqEP4sI7n02LJA6GLMLpPmvlV0ohOjjNOi0eMc13nG6Aupuwo49H4xiY69wPLZJGSpupf4XgMvGzrxkBgi9EQZGeH1FWCzydyw5NOsLbQ1V7v6bf1t28j" },
  { cat: 'kit', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwR10Z4aM_v5dZ6v44kU2q6Y90H80E6lT7xP53v6zY7j64Z0zO_74E9wZ69k808jC43_h332rJ9hN3261aW8uS3sX_iY2pQ00lA_72hH8pL7iS_nF54M9i8fF75bM2uQ_vI6aG35sR_8zJ5cE7wU263O6pW7yA3kF11aE5xH202bE6xM8aN3420V9u89lD150oT5aB_81eW83c_2aG28fX7v_55V2zD6fK_3pL5pZ071c8411H432gZ469sV36fW94fR1_936hW6wE0oH2" },
];

async function main() {
  console.log('Verificando se já existem produtos...');
  const count = await prisma.product.count();
  if (count === 0) {
    console.log('Semeando produtos iniciais...');
    for (const product of initialProducts) {
      await prisma.product.create({ data: product });
    }
    console.log('✅ Produtos semeados com sucesso!');
  } else {
    console.log('Banco de dados já contém produtos.');
  }

  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    console.log('Semeando banners iniciais...');
    for (const banner of initialBanners) {
      await prisma.banner.create({ data: banner });
    }
    console.log('✅ Banners semeados!');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
