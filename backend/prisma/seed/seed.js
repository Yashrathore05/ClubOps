const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});


async function main() {
  const club = await prisma.club.create({
    data: {
      name: "ClubOps Demo Club",
      collegeName: "Demo College",
      clubEmail: "clubops@demo.com",
    },
  });

  const year = await prisma.academicYear.create({
    data: {
      clubId: club.id,
      yearLabel: "2024-25",
      isActive: true,
    },
  });

  const passwordHash = await bcrypt.hash("admin123", 12);

  const user = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@clubops.in",
      passwordHash,
    },
  });

  await prisma.roleAssignment.create({
    data: {
      userId: user.id,
      clubId: club.id,
      academicYearId: year.id,
      role: "ADMIN",
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
