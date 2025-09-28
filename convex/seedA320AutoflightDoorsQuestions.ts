import { mutation } from "./_generated/server";

export const seedA320AutoflightDoorsQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting to seed A320 AUTOFLIGHT DOORS category questions...");
    
    const questions = [
      // DOORS Questions (17 questions)
      {
        question: "How is it determined that the cockpit sliding window is closed and locked?",
        options: [
          "The pin is engaged.",
          "The red ring below the release button should not be in view.",
          "The locking pin was placed in the forward position when the window was closed.",
          "The red ring below the release button should be in view."
        ],
        correctAnswer: 1,
        explanation: "The cockpit sliding window is closed and locked when the red ring below the release button is not visible, indicating proper engagement."
      },
      {
        question: "Opening a passenger door from the outside disarms the door and the escape slide.",
        options: [
          "True.",
          "False."
        ],
        correctAnswer: 0,
        explanation: "True. Opening a passenger door from the outside automatically disarms both the door and the escape slide system."
      },
      {
        question: "What does illumination of the red cabin pressure light represent on the main cabin door?",
        options: [
          "This indicates that the evacuation slide is armed.",
          "This indicates that the aircraft cabin is still pressurized and the cabin door should not be opened.",
          "Both are correct"
        ],
        correctAnswer: 2,
        explanation: "The red cabin pressure light indicates both that the evacuation slide is armed and that the cabin is pressurized, warning against door opening."
      },
      {
        question: "The cargo doors are powered by:",
        options: [
          "The blue electric pump.",
          "The yellow hydraulic system before engine start and the green hydraulic system after engine start.",
          "The yellow hydraulic system.",
          "The blue hydraulic system before engine start and the green hydraulic system after engine start."
        ],
        correctAnswer: 2,
        explanation: "The cargo doors are powered by the yellow hydraulic system for all operations."
      },
      {
        question: "The forward and aft cargo doors can be opened from:",
        options: [
          "The inside and the outside.",
          "The outside only"
        ],
        correctAnswer: 1,
        explanation: "The forward and aft cargo doors can only be opened from the outside for security and operational reasons."
      },
      {
        question: "On the ECAM DOOR/OXY page, the SLIDE indication appears _____ when the slide is not disarmed.",
        options: [
          "White.",
          "Amber.",
          "Green.",
          "Red."
        ],
        correctAnswer: 1,
        explanation: "On the ECAM DOOR/OXY page, the SLIDE indication appears amber when the slide is not disarmed, indicating a potential hazard."
      },
      {
        question: "Each passenger door has one CABIN PRESSURE warning light that:",
        options: [
          "Warns of residual pressure in the cabin.",
          "Shows a possible unlocked door",
          "Both are correct."
        ],
        correctAnswer: 2,
        explanation: "Each passenger door's CABIN PRESSURE warning light both warns of residual pressure and indicates a possible unlocked door condition."
      },
      {
        question: "Where does the Door and Slide Control System (DSCS) generate warnings?",
        options: [
          "On ECAM.",
          "On the doors.",
          "Both are correct."
        ],
        correctAnswer: 2,
        explanation: "The Door and Slide Control System generates warnings both on ECAM displays and directly on the doors themselves."
      },
      {
        question: "What happens to the cockpit door with electrical power failure?",
        options: [
          "It operates normally on HOT BAT bus.",
          "It automatically unlocks.",
          "It automatically locks from outside but stays unlock from inside."
        ],
        correctAnswer: 0,
        explanation: "With electrical power failure, the cockpit door operates normally on the HOT BAT bus, maintaining security functions."
      },
      {
        question: "The cockpit windows can be opened both from inside and outside.",
        options: [
          "True.",
          "False."
        ],
        correctAnswer: 1,
        explanation: "False. The cockpit windows can only be opened from inside the cockpit for security reasons."
      },
      {
        question: "What does illumination of the white slide armed light represent on the main cabin door?",
        options: [
          "This indicates that the slide has properly inflated and is safe for use.",
          "This indicates that the slide is armed and the slide will inflate if the door is opened from inside the aircraft.",
          "This indicates that the main cabin door has not been properly closed.",
          "This indicates that the main cabin door has not been properly closed but the slide is properly armed."
        ],
        correctAnswer: 1,
        explanation: "The white slide armed light indicates that the slide is armed and will automatically inflate if the door is opened from inside the aircraft."
      },
      {
        question: "Can the flight compartment sliding windows be used as emergency exits?",
        options: [
          "Yes, in the cockpit coat closet is a rope ladder that can be used in such an event.",
          "Yes, there are escape ropes mounted above each window behind an access panel.",
          "No. They are not approved emergency exits.",
          "No, they are too small."
        ],
        correctAnswer: 1,
        explanation: "Yes, the flight compartment sliding windows can be used as emergency exits, with escape ropes mounted above each window behind access panels."
      },
      {
        question: "When the electric pump is operating the FWD or AFT cargo doors, the only other yellow system devices that can operate are braking and engine 2 reverse.",
        options: [
          "True.",
          "False."
        ],
        correctAnswer: 0,
        explanation: "True. When the electric pump operates cargo doors, only braking and engine 2 reverse can operate on the yellow hydraulic system due to load limitations."
      },
      {
        question: "When the slide arming lever, on the emergency opening system, is in the ARMED position, where is the slide connected?",
        options: [
          "To the brackets on the underside of the fuselage.",
          "To the brackets above the door.",
          "To the floor brackets on both sides of the door.",
          "All of the above"
        ],
        correctAnswer: 2,
        explanation: "When armed, the slide is connected to the floor brackets on both sides of the door to ensure proper deployment path."
      },
      {
        question: "When the Cargo door switch for the yellow hydraulic pump is in use, the flight controls are:",
        options: [
          "Fully operational",
          "Inhibited",
          "Hydraulically locked by pressure from the electric pump",
          "Only operated by the green system."
        ],
        correctAnswer: 1,
        explanation: "When the cargo door switch for the yellow hydraulic pump is in use, flight controls are inhibited to prevent hydraulic system conflicts."
      },
      {
        question: "When opened in an emergency, the passenger entry doors:",
        options: [
          "Pneumatically assisted into the open position",
          "Will need two cabin crew to push them open",
          "Are assisted to the open position by slide inflation",
          "Are electrically assisted into the open position."
        ],
        correctAnswer: 2,
        explanation: "In an emergency, passenger entry doors are assisted to the open position by the inflation of the escape slide."
      },
      {
        question: "If door handle is lifted and the white indicator illuminates, what does this mean?",
        options: [
          "The escape slide is armed and if you go on lifting the handle, door opens and slide will deploy.",
          "Pneumatic assistance of the door has failed",
          "The escape slide is in disarmed configuration",
          "The cabin is still pressurized"
        ],
        correctAnswer: 0,
        explanation: "When the door handle is lifted and the white indicator illuminates, it means the escape slide is armed and continuing to lift will open the door and deploy the slide."
      }
    ];

    // Insert all questions into the database
    const insertedQuestionIds: any[] = [];
    
    for (const questionData of questions) {
      const questionId = await ctx.db.insert("examQuestions", {
        question: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
        aircraftType: "A320_FAMILY",
        category: "AUTOFLIGHT - DOORS",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
        reference: "A320 FCOM 52-10-00 DOORS",
      });
      
      insertedQuestionIds.push(questionId);
    }

    console.log(`Successfully seeded ${questions.length} A320 AUTOFLIGHT DOORS questions`);

    return {
      success: true,
      message: `Successfully added ${questions.length} A320 AUTOFLIGHT DOORS questions`,
      questionsAdded: insertedQuestionIds.length,
      category: "AUTOFLIGHT - DOORS"
    };
  },
});