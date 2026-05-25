const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main(){
  const order = await prisma.order.findUnique({where:{id:'d4f224cd-d40d-4fd4-86b8-2f4897a4558e'}});
  console.log(JSON.stringify(JSON.parse(order.items), null, 2));
  await prisma.$disconnect();
}
main();
