const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main(){ 
  await prisma.order.update({where:{id:'d4f224cd-d40d-4fd4-86b8-2f4897a4558e'}, data: {status: 'pending'}}); 
  await prisma.$disconnect();
}
main();
