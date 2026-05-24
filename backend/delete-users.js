const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deleteUsers = await prisma.user.deleteMany({});
  console.log(`Deletados ${deleteUsers.count} usuários do banco de dados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
