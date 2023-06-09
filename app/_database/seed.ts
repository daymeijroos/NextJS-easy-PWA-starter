import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function init() {
  //...
  return
}
init().then(async () => {
  await prisma.$disconnect()

}).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})