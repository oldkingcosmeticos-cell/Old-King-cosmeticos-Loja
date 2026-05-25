const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main(){ 
  const o = await prisma.order.findUnique({where:{id:'d4f224cd-d40d-4fd4-86b8-2f4897a4558e'}}); 
  console.log(o.items); 
  await prisma.$disconnect();
}
main();
