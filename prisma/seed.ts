/**
 * Prisma Seed Script
 * Run: npm run db:seed
 *
 * Seeds the database with demo data for LUMIÈRE e-commerce.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Categories ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    db.category.upsert({
      where: { slug: "bijoux" },
      update: {},
      create: {
        name: "Bijoux",
        slug: "bijoux",
        description:
          "Bagues, colliers, bracelets et boucles d'oreilles en or et diamants",
      },
    }),
    db.category.upsert({
      where: { slug: "montres" },
      update: {},
      create: {
        name: "Montres",
        slug: "montres",
        description: "Montres de haute horlogerie pour hommes et femmes",
      },
    }),
    db.category.upsert({
      where: { slug: "maroquinerie" },
      update: {},
      create: {
        name: "Maroquinerie",
        slug: "maroquinerie",
        description: "Sacs, portefeuilles et ceintures en cuir pleine fleur",
      },
    }),
    db.category.upsert({
      where: { slug: "mode" },
      update: {},
      create: {
        name: "Mode",
        slug: "mode",
        description: "Vêtements et accessoires de mode de luxe",
      },
    }),
  ]);

  console.log(`✅ ${categories.length} categories created`);

  // ─── Admin User ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@lumiere.fr" },
    update: {},
    create: {
      name: "Admin LUMIÈRE",
      email: "admin@lumiere.fr",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const demoUser = await db.user.upsert({
    where: { email: "demo@lumiere.fr" },
    update: {},
    create: {
      name: "Sophie Martin",
      email: "demo@lumiere.fr",
      password: hashedPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  });

  console.log(
    `✅ Users seeded (admin: admin@lumiere.fr, demo: demo@lumiere.fr, password: password123)`,
  );

  // ─── Products ──────────────────────────────────────────────────────────────
  const bijouxCat = categories[0];

  await db.product.upsert({
    where: { slug: "collier-etoile-doree" },
    update: {},
    create: {
      name: "Collier Étoile Dorée",
      slug: "collier-etoile-doree",
      description: "Collier en or 18 carats serti de diamants naturels.",
      longDescription:
        "Façonné à la main par nos artisans joailliers de la Haute Joaillerie parisienne.",
      price: 1290,
      compareAtPrice: 1650,
      categoryId: bijouxCat.id,
      tags: ["or", "diamants", "collier", "bestseller"],
      rating: 4.9,
      reviewCount: 247,
      stock: 18,
      status: "ACTIVE",
      isFeatured: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
            alt: "Collier Étoile Dorée",
            order: 0,
          },
        ],
      },
      variants: {
        create: [
          { name: "Longueur", value: "38 cm", stock: 5, priceModifier: 0 },
          { name: "Longueur", value: "42 cm", stock: 8, priceModifier: 0 },
          { name: "Longueur", value: "45 cm", stock: 3, priceModifier: 50 },
        ],
      },
    },
  });

  console.log("✅ Products seeded");

  // ─── Promo Codes ───────────────────────────────────────────────────────────
  await db.promoCode.upsert({
    where: { code: "LUMIERE30" },
    update: {},
    create: {
      code: "LUMIERE30",
      discountType: "PERCENTAGE",
      discountValue: 30,
      minOrderValue: 500,
      isActive: true,
    },
  });

  await db.promoCode.upsert({
    where: { code: "BIENVENUE10" },
    update: {},
    create: {
      code: "BIENVENUE10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      isActive: true,
    },
  });

  console.log("✅ Promo codes seeded");
  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📝 Credentials:");
  console.log("   Admin: admin@lumiere.fr / password123");
  console.log("   Demo:  demo@lumiere.fr  / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
