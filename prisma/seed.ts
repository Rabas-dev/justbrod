import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const program = await db.program.upsert({
    where: { id: "default-program" },
    update: {},
    create: {
      id: "default-program",
      name: "Brod Rewards",
      requiredStamps: 7,
      rewardName: "Free Sandwich",
      rewardValidDays: 14,
      checkinFrequency: "DAILY",
      active: true,
    },
  });

  console.log("Seeded program:", program.id);
}

main()
  .then(async () => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
