import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log("Usage: npx tsx prisma/make-admin.ts <email>");
    console.log("\nExisting profiles in DB:");
    const profiles = await prisma.profile.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
    console.table(profiles);
    return;
  }

  const profile = await prisma.profile.findUnique({
    where: { email },
  });

  if (!profile) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  const updated = await prisma.profile.update({
    where: { email },
    data: { role: Role.admin },
  });

  console.log(`✅ Successfully promoted ${updated.name || updated.email} to ADMIN!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
