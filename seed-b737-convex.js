import { api } from "./convex/_generated/api.js";
import { ConvexHttpClient } from "convex/browser";

// Create a Convex HTTP client with the correct deployment URL
const client = new ConvexHttpClient("https://accomplished-swordfish-668.convex.cloud");

async function seedB737TypeRating() {
  try {
    console.log("Seeding B737 Type Rating exam and questions...");
    
    // Call the Convex mutation to seed the B737 Type Rating
    const result = await client.mutation(api.exams.seedB737TypeRating, {});
    
    console.log("B737 Type Rating seeding result:", result);
    console.log("Successfully seeded B737 Type Rating exam and questions!");
  } catch (error) {
    console.error("Error seeding B737 Type Rating:", error);
  }
}

seedB737TypeRating();