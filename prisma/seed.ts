import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const categories = [
  { name: "Development", slug: "development" },
  { name: "Design", slug: "design" },
  { name: "Business", slug: "business" },
  { name: "Marketing", slug: "marketing" },
  { name: "Photography", slug: "photography" },
]

async function main() {
  console.log("Seeding categories...")

  for (const category of categories) {
    const existing = await prisma.courseCategory.findUnique({
      where: { slug: category.slug },
    })

    if (!existing) {
      await prisma.courseCategory.create({
        data: {
          name: category.name,
          slug: category.slug,
        },
      })
      console.log(`Created category: ${category.name}`)
    } else {
      console.log(`Category already exists: ${category.name}`)
    }
  }

  console.log("Seeding finished successfully.")
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
