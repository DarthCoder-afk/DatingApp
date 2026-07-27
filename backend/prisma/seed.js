import bcrypt from "bcryptjs";
import prisma from "./client.js";

const profiles = [
  ["Avery Park", 26, "female", "Coffee walks, film photography, and finding the city’s best dumplings."],
  ["Noah Reyes", 29, "male", "Weekend hiker, home cook, and always up for live music."],
  ["Mia Santos", 24, "female", "Bookshops, beach sunsets, and playlists for every mood."],
  ["Ethan Cole", 31, "male", "Designer by day. Amateur baker and basketball fan after hours."],
  ["Sofia Lim", 28, "female", "Museum dates, trying new recipes, and laughing at terrible puns."],
  ["Liam Cruz", 27, "male", "Looking for a partner for food trips and spontaneous weekend plans."],
  ["Isla Morgan", 30, "female", "Plant parent, dog person, and a believer in slow Sunday mornings."],
  ["Theo Ramos", 25, "male", "Gym sessions, indie games, and a good conversation over ramen."],
  ["Chloe Bennett", 32, "female", "Pilates, podcasts, and planning the next little adventure."],
  ["Daniel Kim", 28, "male", "Night-market explorer, casual runner, and aspiring travel photographer."],
  ["Zoe Flores", 27, "female", "Creative soul with a soft spot for art fairs and rescue cats."],
  ["Marcus Tan", 33, "male", "Sundays are for brunch, basketball, and calling my family."],
  ["Nina Patel", 29, "female", "Tea enthusiast, museum wanderer, and thoughtful conversation seeker."],
  ["Owen Blake", 26, "male", "Learning guitar, finding hidden cafés, and saying yes to new things."],
  ["Grace Villanueva", 31, "female", "Travel lists, homemade pasta, and people who are kind to everyone."],
  ["Jay Rivera", 30, "other", "Curious, creative, and usually searching for the next favorite neighborhood spot."],
];

const password = await bcrypt.hash("HeartLink123!", 10);

try {
  for (const [name, age, gender, bio] of profiles) {
    const slug = name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "");
    const photoUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffe4e6`;

    await prisma.user.upsert({
      where: { email: `${slug}@seed.heartlink.local` },
      update: {
        password,
        profile: { upsert: { update: { name, age, gender, bio, photoUrl }, create: { name, age, gender, bio, photoUrl } } },
      },
      create: {
        email: `${slug}@seed.heartlink.local`,
        password,
        profile: { create: { name, age, gender, bio, photoUrl } },
      },
    });
  }

  console.log(`Seeded ${profiles.length} sample profiles.`);
  console.log("Sample account password: HeartLink123!");
} finally {
  await prisma.$disconnect();
}
