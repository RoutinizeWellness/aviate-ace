# A320 Questions Seeding Instructions

## Current Status
✅ Convex deployment is configured
✅ A320 exam exists in Convex database
✅ Convex mutation for seeding A320 questions is ready

## Solution Options

### Option 1: Using Convex Dashboard (Recommended)
1. Go to your Convex dashboard
2. Navigate to the "Functions" section
3. Find the `exams:seedA320TypeRating` mutation
4. Click "Run" to execute the mutation

### Option 2: Using Convex HTTP Client
If you want to seed programmatically:
1. Ensure you have the correct Convex deployment URL
2. Run: `node seed-b737-convex.js` (this example shows the pattern for seeding)

## Migration Approach
The seeding is now handled through Convex mutations which:
- Check if the A320 exam exists
- If not, create it
- Clear any existing questions for the exam
- Insert 44 comprehensive A320 Type Rating questions covering:
  - Air Conditioning & Pressurization (4 questions)
  - Sistema Eléctrico (4 questions)  
  - Sistema Hidráulico (4 questions)
  - Controles de Vuelo (4 questions)
  - Motores y APU (4 questions)
  - Protección Contra Incendios (3 questions)
  - Flight Management and Navigation (2 questions)
  - Landing Gear (2 questions)
  - Fuel System (2 questions)
  - Flight Instruments and Displays (2 questions)
  - Warning Systems (2 questions)
  - Anti-ice and Rain (2 questions)
  - Automatic Flight (2 questions)
  - Communication (2 questions)
  - General Systems (3 questions)
  - Emergency Procedures (2 questions)
  - Performance (2 questions)

## Next Steps
Use Option 1 (Convex Dashboard) for the quickest solution. The seeding function is ready to be executed.