import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create exam
export const createExam = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    aircraftType: v.string(),
    category: v.string(),
    difficulty: v.string(),
    timeLimit: v.number(),
    passingScore: v.number(),
    questionsCount: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("exams", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get all active exams
export const getExams = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("exams")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get exams by aircraft type
export const getExamsByAircraft = query({
  args: { aircraftType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exams")
      .withIndex("by_aircraft", (q) => q.eq("aircraftType", args.aircraftType))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Create exam question
export const createExamQuestion = mutation({
  args: {
    examId: v.optional(v.id("exams")),
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(),
    explanation: v.optional(v.string()),
    aircraftType: v.string(),
    category: v.string(),
    difficulty: v.string(),
    reference: v.optional(v.string()), // Official reference documentation
    regulationCode: v.optional(v.string()), // Applicable regulation
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("examQuestions", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// Get exam questions
export const getExamQuestions = query({
  args: { 
    examId: v.optional(v.id("exams")),
    aircraftType: v.optional(v.string()),
    category: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let questions;
    
    if (args.examId) {
      questions = await ctx.db
        .query("examQuestions")
        .withIndex("by_exam", (q) => q.eq("examId", args.examId!))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    } else if (args.aircraftType) {
      questions = await ctx.db
        .query("examQuestions")
        .withIndex("by_aircraft", (q) => q.eq("aircraftType", args.aircraftType!))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    } else if (args.category) {
      questions = await ctx.db
        .query("examQuestions")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    } else if (args.difficulty) {
      questions = await ctx.db
        .query("examQuestions")
        .withIndex("by_difficulty", (q) => q.eq("difficulty", args.difficulty!))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    } else {
      questions = await ctx.db
        .query("examQuestions")
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    }
    
    // Shuffle questions and limit if specified
    questions = questions.sort(() => Math.random() - 0.5);
    
    if (args.limit) {
      questions = questions.slice(0, args.limit);
    }
    
    return questions;
  },
});

// Get random exam questions
export const getRandomExamQuestions = query({
  args: {
    aircraftType: v.string(),
    count: v.number(),
    categories: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let questions = await ctx.db
      .query("examQuestions")
      .withIndex("by_aircraft", (q) => q.eq("aircraftType", args.aircraftType))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    // Filter by categories if provided
    if (args.categories && args.categories.length > 0) {
      questions = questions.filter(q => args.categories!.includes(q.category));
    }
    
    // Shuffle and return requested count
    questions = questions.sort(() => Math.random() - 0.5);
    return questions.slice(0, args.count);
  },
});

// Start exam session (creates a new session without results)
export const startExamSession = mutation({
  args: {
    userId: v.id("users"),
    examId: v.optional(v.id("exams")),
    sessionType: v.string(),
  },
  handler: async (ctx, args) => {
    // Return session info for the client to track
    return {
      sessionId: `session_${Date.now()}_${args.userId}`,
      startTime: Date.now(),
      userId: args.userId,
      examId: args.examId,
      sessionType: args.sessionType,
    };
  },
});

// Complete exam session (saves results)
export const completeExamSession = mutation({
  args: {
    userId: v.id("users"),
    examId: v.optional(v.id("exams")),
    sessionType: v.string(),
    questionsCount: v.number(),
    correctAnswers: v.number(),
    score: v.number(),
    timeSpent: v.number(),
    answers: v.array(v.object({
      questionId: v.id("examQuestions"),
      selectedAnswer: v.number(),
      isCorrect: v.boolean(),
      timeSpent: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("userExamSessions", {
      ...args,
      completedAt: Date.now(),
    });

    // Also record in user progress
    await ctx.db.insert("userProgress", {
      userId: args.userId,
      activityType: "exam_taken",
      referenceId: args.examId || "general",
      pointsEarned: args.score >= 75 ? 100 : 50,
      metadata: {
        score: args.score,
        questionsCount: args.questionsCount,
        timeSpent: args.timeSpent,
        passed: args.score >= 75,
      },
      createdAt: Date.now(),
    });

    return sessionId;
  },
});

// Get single exam by ID
export const getExam = query({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.examId);
  },
});

// Get user exam sessions
export const getUserExamSessions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userExamSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Seed A320 Type Rating exam with real aviation questions
export const seedA320TypeRatingExam = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if A320 type rating exam already exists
    const existingExams = await ctx.db.query("exams").collect();
    if (existingExams.length > 0) {
      return { message: "A320 Type Rating exam already exists" };
    }

    // Create A320 Type Rating exam
    const examId = await ctx.db.insert("exams", {
      title: "A320 Type Rating - Real Examination",
      description: "Comprehensive A320 type rating examination based on real EASA/FAA content including electrical systems, hydraulics, flight management, and emergency procedures.",
      aircraftType: "A320_FAMILY",
      category: "General",
      difficulty: "intermediate",
      timeLimit: 60, // 60 minutes
      passingScore: 75,
      questionsCount: 10,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create real A320 system questions
    const questions = [
      {
        question: "During an 'ELEC IDG 1 FAULT' condition, what is the correct sequence of actions according to the QRH?",
        options: ["ENG 1 IDG pb - OFF, Monitor electrical parameters, Consider APU start", "ENG 1 IDG pb - DISC, Land as soon as practical, Emergency electrical config", "Continue normal ops, Monitor oil temperature, Land at nearest suitable airport", "IDG 1 - DISCONNECT, RAT deployment, Essential power only"],
        correctAnswer: 1,
        explanation: "According to A320 QRH ELEC.IDG FAULT procedure: The IDG should be disconnected (not just turned off), land as soon as practical should be considered, and emergency electrical configuration may be required depending on the severity.",
        aircraftType: "A320_FAMILY",
        category: "Electrical System",
        difficulty: "advanced",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        question: "What is the minimum battery voltage required for APU start in emergency electrical configuration?",
        options: ["22V for at least 2 minutes duration", "24V for at least 3 minutes duration", "25V for at least 5 minutes duration", "23V for at least 1 minute duration"],
        correctAnswer: 0,
        explanation: "Per A320 FCOM, the minimum battery voltage for APU start in emergency conditions is 22V, and it must be maintained for at least 2 minutes to ensure successful APU start sequence.",
        aircraftType: "A320_FAMILY",
        category: "Electrical System",
        difficulty: "advanced",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        question: "¿Qué voltaje proporciona el generador principal de una aeronave comercial?",
        options: ["115V AC", "28V DC", "220V AC", "12V DC"],
        correctAnswer: 0,
        explanation: "El generador principal proporciona 115V AC trifásico a 400Hz al sistema eléctrico de la aeronave.",
        category: "Sistema Eléctrico",
      },
      {
        question: "¿Cuál es la función principal del elevador en una aeronave?",
        options: ["Control de cabeceo (pitch)", "Control de alabeo (roll)", "Control de guiñada (yaw)", "Control de potencia"],
        correctAnswer: 0,
        explanation: "El elevador controla el movimiento de cabeceo (pitch) de la aeronave, permitiendo subir o bajar el morro.",
        category: "Controles de Vuelo",
      },
      {
        question: "¿Dónde se almacena principalmente el combustible en aeronaves comerciales?",
        options: ["En tanques ubicados en las alas", "En el fuselaje central", "En la cola de la aeronave", "En compartimientos del motor"],
        correctAnswer: 0,
        explanation: "El combustible se almacena principalmente en tanques integrales ubicados dentro de la estructura de las alas.",
        category: "Sistema de Combustible",
      },
      {
        question: "¿Qué tipo de sistema de frenos utilizan las aeronaves comerciales modernas?",
        options: ["Sistema hidráulico con discos múltiples", "Sistema neumático simple", "Frenos eléctricos electromagnéticos", "Sistema mecánico con cables"],
        correctAnswer: 0,
        explanation: "Las aeronaves comerciales modernas utilizan sistemas de frenos hidráulicos con discos múltiples de carbono para máxima eficiencia.",
        category: "Sistema de Frenos",
      },
      {
        question: "¿Cuál es la altitud de cabina típica mantenida durante el vuelo de crucero?",
        options: ["8000 pies", "6000 pies", "10000 pies", "12000 pies"],
        correctAnswer: 0,
        explanation: "La altitud de cabina se mantiene típicamente alrededor de 8000 pies durante el vuelo de crucero para comodidad de los pasajeros.",
        category: "Sistema de Presurización",
      },
      {
        question: "¿Cuál es el principio básico de funcionamiento de un motor turbofan?",
        options: ["Compresión, combustión y expansión de gases", "Solo compresión de aire", "Combustión externa", "Propulsión por hélice únicamente"],
        correctAnswer: 0,
        explanation: "Los motores turbofan funcionan mediante el ciclo de compresión del aire, combustión del combustible y expansión de los gases calientes.",
        category: "Motores",
      },
      {
        question: "¿Qué significa GPS en aviación?",
        options: ["Global Positioning System", "Ground Proximity System", "General Purpose System", "Glide Path System"],
        correctAnswer: 0,
        explanation: "GPS significa Global Positioning System, un sistema de navegación por satélite utilizado para determinar la posición exacta de la aeronave.",
        category: "Navegación",
      },
      {
        question: "¿Cuál es la frecuencia de emergencia internacional en aviación?",
        options: ["121.5 MHz", "118.1 MHz", "132.0 MHz", "126.9 MHz"],
        correctAnswer: 0,
        explanation: "121.5 MHz es la frecuencia de emergencia internacional monitoreada por torres de control y servicios de búsqueda y rescate.",
        category: "Comunicaciones",
      },
      {
        question: "¿Cuál es la primera acción en caso de falla de motor durante el despegue después de V1?",
        options: ["Continuar el despegue", "Abortar inmediatamente", "Reducir potencia", "Activar reversores"],
        correctAnswer: 0,
        explanation: "Después de V1 (velocidad de decisión), se debe continuar el despegue ya que no hay suficiente pista para detenerse de forma segura.",
        category: "Procedimientos de Emergencia",
      },
    ];

    // Insert all questions
    for (const q of questions) {
      await ctx.db.insert("examQuestions", {
        examId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        aircraftType: "A320_FAMILY",
        category: q.category,
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      });
    }

    return { message: "A320 Type Rating exam and questions seeded successfully", examId };
  },
});

// Seed B737 Type Rating exam and questions
export const seedB737TypeRating = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if B737 exam already exists
    const existingExams = await ctx.db.query("exams")
      .filter((q) => q.eq(q.field("aircraftType"), "boeing_737"))
      .collect();
      
    if (existingExams.length > 0) {
      return { message: "B737 Type Rating exam already exists", examId: existingExams[0]._id };
    }

    // Create B737 Type Rating exam
    const examId = await ctx.db.insert("exams", {
      title: "B737 Type Rating Exam",
      description: "Complete type rating examination for Boeing 737 aircraft covering all systems and procedures",
      aircraftType: "boeing_737",
      category: "Type Rating",
      difficulty: "advanced",
      timeLimit: 180, // 180 minutes
      passingScore: 75,
      questionsCount: 50,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create B737 questions
    const questions = [
      {
        examId,
        question: "How many air conditioning packs does the B737 have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "The B737 has 2 air conditioning packs that provide pressurized and conditioned air to the cabin.",
        aircraftType: "boeing_737",
        category: "Air Conditioning & Pressurization",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the maximum cabin differential pressure in the B737?",
        options: ["7.45 PSI", "8.65 PSI", "9.10 PSI", "7.80 PSI"],
        correctAnswer: 3,
        explanation: "The maximum cabin differential pressure is 7.80 PSI to ensure structural safety.",
        aircraftType: "boeing_737",
        category: "Air Conditioning & Pressurization",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "At what cabin altitude do oxygen masks automatically deploy?",
        options: ["10,000 ft", "12,500 ft", "14,000 ft", "15,000 ft"],
        correctAnswer: 2,
        explanation: "Oxygen masks automatically deploy at 14,000 ft cabin altitude.",
        aircraftType: "boeing_737",
        category: "Air Conditioning & Pressurization",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "During takeoff, what position should the packs be in?",
        options: ["ON", "OFF", "AUTO", "Does not matter"],
        correctAnswer: 1,
        explanation: "During takeoff, packs are placed in OFF to maximize available engine power.",
        aircraftType: "boeing_737",
        category: "Air Conditioning & Pressurization",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many main generators does the B737 have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "The B737 has 2 main generators (IDG), one per engine.",
        aircraftType: "boeing_737",
        category: "Electrical System",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the frequency of the AC power generated?",
        options: ["50 Hz", "60 Hz", "400 Hz", "Variable"],
        correctAnswer: 2,
        explanation: "The B737 generators produce AC power at 400 Hz.",
        aircraftType: "boeing_737",
        category: "Electrical System",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many batteries does the B737 have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "The B737 is equipped with 2 nickel-cadmium 24V batteries.",
        aircraftType: "boeing_737",
        category: "Electrical System",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "In case of IDG failure, what can provide electrical power?",
        options: ["APU generator", "RAT", "External power", "All of the above"],
        correctAnswer: 3,
        explanation: "APU generator, RAT, and external power can act as alternative sources.",
        aircraftType: "boeing_737",
        category: "Electrical System",
        difficulty: "advanced",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many independent hydraulic systems does the B737 have?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 1,
        explanation: "The B737 has 3 independent hydraulic systems: System A, System B, and Standby.",
        aircraftType: "boeing_737",
        category: "Hydraulic System",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the normal operating pressure of the hydraulic system?",
        options: ["2500 PSI", "3000 PSI", "3500 PSI", "4000 PSI"],
        correctAnswer: 1,
        explanation: "The normal operating pressure is 3000 PSI ±150 PSI.",
        aircraftType: "boeing_737",
        category: "Hydraulic System",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "Which hydraulic system powers the main landing gear?",
        options: ["System A", "System B", "Standby", "System A and B"],
        correctAnswer: 0,
        explanation: "System A powers the retraction/extension of the main landing gear.",
        aircraftType: "boeing_737",
        category: "Hydraulic System",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "In an emergency, which system can power the RAT?",
        options: ["System A", "System B", "Standby", "All"],
        correctAnswer: 2,
        explanation: "The Standby system powers the RAT in emergency situations.",
        aircraftType: "boeing_737",
        category: "Hydraulic System",
        difficulty: "advanced",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What type of flight control system does the B737 have?",
        options: ["Mechanical", "Hydraulic", "Fly-by-wire", "Hybrid"],
        correctAnswer: 3,
        explanation: "The B737 uses a hybrid system with mechanical and hydraulic controls.",
        aircraftType: "boeing_737",
        category: "Flight Controls",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many Flight Control Computers (FCCs) does the B737 have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "The B737 has 2 Flight Control Computers (FCCs).",
        aircraftType: "boeing_737",
        category: "Flight Controls",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What protection does the Stall Protection System provide?",
        options: ["Stall protection", "Overspeed protection", "Load factor protection", "Bank angle protection"],
        correctAnswer: 0,
        explanation: "The Stall Protection System provides stall protection by automatically commanding nose down.",
        aircraftType: "boeing_737",
        category: "Flight Controls",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the maximum bank angle allowed by the system?",
        options: ["30°", "45°", "60°", "67°"],
        correctAnswer: 1,
        explanation: "The system limits bank angle to 45° in normal flight.",
        aircraftType: "boeing_737",
        category: "Flight Controls",
        difficulty: "advanced",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What type of engines typically equip the B737?",
        options: ["CFM56", "LEAP-1B", "Both", "Only CFM56"],
        correctAnswer: 2,
        explanation: "The B737 can be equipped with CFM56 engines or newer LEAP-1B engines.",
        aircraftType: "boeing_737",
        category: "Engines and APU",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the typical thrust range of B737 engines?",
        options: ["18,000-27,000 lbf", "24,000-33,000 lbf", "30,000-35,000 lbf", "35,000-40,000 lbf"],
        correctAnswer: 0,
        explanation: "B737 engines have a thrust range between 18,000 and 27,000 lbf depending on the variant.",
        aircraftType: "boeing_737",
        category: "Engines and APU",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the maximum APU operating altitude?",
        options: ["25,000 ft", "35,000 ft", "37,000 ft", "41,000 ft"],
        correctAnswer: 2,
        explanation: "The APU can operate up to 37,000 ft altitude.",
        aircraftType: "boeing_737",
        category: "Engines and APU",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What system automatically monitors engine status?",
        options: ["ECAM", "EICAS", "FADEC", "FWC"],
        correctAnswer: 2,
        explanation: "FADEC (Full Authority Digital Engine Control) automatically monitors and controls engines.",
        aircraftType: "boeing_737",
        category: "Engines and APU",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many fire detectors does each engine have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "Each engine has 2 independent fire detectors for redundancy.",
        aircraftType: "boeing_737",
        category: "Fire Protection",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many fire extinguisher bottles does each engine have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "Each engine has access to 2 fire extinguisher bottles (1 dedicated + 1 shared).",
        aircraftType: "boeing_737",
        category: "Fire Protection",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What extinguishing agent is used in engines?",
        options: ["Water", "CO2", "Halon", "Chemical powder"],
        correctAnswer: 2,
        explanation: "Halon is used as the extinguishing agent for engines and APU.",
        aircraftType: "boeing_737",
        category: "Fire Protection",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many FMCs does the B737 have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "The B737 has 2 Flight Management Computers (FMCs).",
        aircraftType: "boeing_737",
        category: "Flight Management and Navigation",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What system provides automatic lateral and vertical guidance?",
        options: ["Autopilot", "FMC", "FADEC", "EICAS"],
        correctAnswer: 1,
        explanation: "The FMC provides lateral and vertical guidance for the autopilot.",
        aircraftType: "boeing_737",
        category: "Flight Management and Navigation",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many wheels does the main landing gear of the B737 have?",
        options: ["2", "4", "6", "8"],
        correctAnswer: 1,
        explanation: "Each main landing gear of the B737 has 4 wheels (2 per axle).",
        aircraftType: "boeing_737",
        category: "Landing Gear",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the maximum speed with landing gear extended (VLE)?",
        options: ["220 kts", "250 kts", "270 kts", "300 kts"],
        correctAnswer: 2,
        explanation: "The maximum speed with landing gear extended (VLE) is 270 kts.",
        aircraftType: "boeing_737",
        category: "Landing Gear",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many fuel tanks does the B737 have?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 1,
        explanation: "The B737 has 3 fuel tanks: 2 in the wings and 1 center tank.",
        aircraftType: "boeing_737",
        category: "Fuel System",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the total fuel capacity of the B737?",
        options: ["15,000 kg", "18,000 kg", "20,820 kg", "24,000 kg"],
        correctAnswer: 2,
        explanation: "The total fuel capacity of the B737 is approximately 20,820 kg.",
        aircraftType: "boeing_737",
        category: "Fuel System",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many primary displays does the B737 cockpit have?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 1,
        explanation: "The B737 cockpit has 5 primary displays: 2 PFD, 2 ND, and 1 EICAS.",
        aircraftType: "boeing_737",
        category: "Flight Instruments and Displays",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What does EICAS stand for?",
        options: ["Electronic Centralized Aircraft Monitoring", "Engine Indicating and Crew Alerting System", "Electronic Control and Management System", "Emergency Control and Management"],
        correctAnswer: 1,
        explanation: "EICAS stands for Engine Indicating and Crew Alerting System.",
        aircraftType: "boeing_737",
        category: "Flight Instruments and Displays",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What color indicates an emergency alert on EICAS?",
        options: ["Yellow", "Red", "Orange", "White"],
        correctAnswer: 1,
        explanation: "Red color indicates emergency alerts requiring immediate action.",
        aircraftType: "boeing_737",
        category: "Warning Systems",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What does GPWS stand for?",
        options: ["Ground Proximity Warning System", "Ground Position Warning System", "General Purpose Warning System", "Ground Protection Warning System"],
        correctAnswer: 0,
        explanation: "GPWS stands for Ground Proximity Warning System.",
        aircraftType: "boeing_737",
        category: "Warning Systems",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What hot air source is used for wing anti-ice?",
        options: ["APU bleed", "Engine bleed", "Electric heaters", "Hot oil"],
        correctAnswer: 1,
        explanation: "Engine bleed air is used for wing anti-ice.",
        aircraftType: "boeing_737",
        category: "Anti-ice and Rain",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "When should engine anti-ice be activated?",
        options: ["Visible moisture and OAT ≤ 10°C", "Only in icing conditions", "Whenever flying in clouds", "Only below freezing"],
        correctAnswer: 0,
        explanation: "Should be activated with visible moisture and OAT ≤ 10°C.",
        aircraftType: "boeing_737",
        category: "Anti-ice and Rain",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many autopilot channels does the B737 have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "The B737 has 2 independent autopilot channels.",
        aircraftType: "boeing_737",
        category: "Automatic Flight",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the minimum altitude to engage autopilot after takeoff?",
        options: ["100 ft", "400 ft", "800 ft", "1000 ft"],
        correctAnswer: 1,
        explanation: "Autopilot can be engaged from 400 ft after takeoff.",
        aircraftType: "boeing_737",
        category: "Automatic Flight",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many VHF systems does the B737 have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 2,
        explanation: "The B737 is equipped with 3 VHF radio systems.",
        aircraftType: "boeing_737",
        category: "Communication",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What system provides emergency communication?",
        options: ["VHF 3", "Backup VHF", "Emergency radio", "121.5 MHz"],
        correctAnswer: 3,
        explanation: "In emergency, the international frequency 121.5 MHz can be used.",
        aircraftType: "boeing_737",
        category: "Communication",
        difficulty: "advanced",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the maximum service altitude of the B737?",
        options: ["37,000 ft", "39,000 ft", "41,000 ft", "43,000 ft"],
        correctAnswer: 1,
        explanation: "The maximum service altitude of the B737 is 39,000 ft (FL390).",
        aircraftType: "boeing_737",
        category: "General Systems",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the maximum operating speed (VMO)?",
        options: ["320 kts", "340 kts", "350 kts", "370 kts"],
        correctAnswer: 1,
        explanation: "The maximum operating speed (VMO) of the B737 is 340 kts.",
        aircraftType: "boeing_737",
        category: "General Systems",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "How many passengers can a typical B737 carry?",
        options: ["100-120", "120-140", "140-160", "160-180"],
        correctAnswer: 1,
        explanation: "A B737 can typically carry between 120-140 passengers depending on configuration.",
        aircraftType: "boeing_737",
        category: "General Systems",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "In case of rapid decompression, what is the first action?",
        options: ["Put on oxygen masks", "Begin emergency descent", "Declare emergency", "Check cabin altitude"],
        correctAnswer: 0,
        explanation: "The first action is to put on oxygen masks immediately.",
        aircraftType: "boeing_737",
        category: "Emergency Procedures",
        difficulty: "advanced",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the emergency descent speed?",
        options: ["320 kts", "M 0.78", "350 kts", "Maximum speed"],
        correctAnswer: 1,
        explanation: "The emergency descent speed is M 0.78 or maximum permitted speed.",
        aircraftType: "boeing_737",
        category: "Emergency Procedures",
        difficulty: "advanced",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What does V2 represent?",
        options: ["Takeoff safety speed", "Rotation speed", "Decision speed", "Climb speed"],
        correctAnswer: 0,
        explanation: "V2 is the takeoff safety speed.",
        aircraftType: "boeing_737",
        category: "Performance",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        examId,
        question: "What is the typical minimum runway length for the B737?",
        options: ["1,200 m", "1,500 m", "1,800 m", "2,100 m"],
        correctAnswer: 1,
        explanation: "The typical minimum runway length for the B737 is approximately 1,500 m.",
        aircraftType: "boeing_737",
        category: "Performance",
        difficulty: "advanced",
        isActive: true,
        createdAt: Date.now(),
      }
    ];

    // Insert all questions
    for (const q of questions) {
      await ctx.db.insert("examQuestions", q);
    }

    return { message: "B737 Type Rating exam and questions seeded successfully", examId };
  },
});