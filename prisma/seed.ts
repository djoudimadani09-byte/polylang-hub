import { PrismaClient, UserRole, LanguageProficiency } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@polylang.com' },
    update: {},
    create: {
      email: 'admin@polylang.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      preferredLanguage: 'ar',
      country: 'DZ',
    },
  });

  // Create sample client
  const clientPassword = await bcrypt.hash('client123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@polylang.com' },
    update: {},
    create: {
      email: 'client@polylang.com',
      name: 'عميل تجريبي',
      passwordHash: clientPassword,
      role: UserRole.CLIENT,
      preferredLanguage: 'ar',
      country: 'DZ',
      walletBalance: {
        create: {
          balance: 100000,
          currency: 'DZD',
        },
      },
    },
  });

  // Create sample translator
  const translatorPassword = await bcrypt.hash('translator123', 10);
  const translator = await prisma.user.upsert({
    where: { email: 'translator@polylang.com' },
    update: {},
    create: {
      email: 'translator@polylang.com',
      name: 'محترف ترجمة',
      passwordHash: translatorPassword,
      role: UserRole.TRANSLATOR,
      preferredLanguage: 'ar',
      country: 'DZ',
      walletBalance: {
        create: {
          balance: 50000,
          currency: 'DZD',
        },
      },
    },
  });

  // Add languages to translator
  await prisma.translatorLanguage.createMany({
    data: [
      {
        translatorId: translator.id,
        language: 'en',
        proficiency: LanguageProficiency.NATIVE,
        yearsOfExperience: 5,
      },
      {
        translatorId: translator.id,
        language: 'fr',
        proficiency: LanguageProficiency.ADVANCED,
        yearsOfExperience: 3,
      },
      {
        translatorId: translator.id,
        language: 'ar',
        proficiency: LanguageProficiency.NATIVE,
        yearsOfExperience: 5,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeding completed!');
  console.log('\n📋 Seed Accounts:');
  console.log('Admin:', { email: 'admin@polylang.com', password: 'admin123' });
  console.log('Client:', { email: 'client@polylang.com', password: 'client123' });
  console.log('Translator:', { email: 'translator@polylang.com', password: 'translator123' });
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
