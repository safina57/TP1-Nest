// prisma/seed/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    // Create user1
    const user1 = await prisma.user.create({
      data: {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password1', // In a real app, hash this password
      },
    });
    console.log('Created user1:', user1);

    // Create user2
    const user2 = await prisma.user.create({
      data: {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password2', // In a real app, hash this password
      },
    });
    console.log('Created user2:', user2);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();