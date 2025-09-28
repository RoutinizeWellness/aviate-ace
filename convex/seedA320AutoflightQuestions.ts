import { mutation } from "./_generated/server";

export const seedA320AutoflightQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting to seed A320 AUTOFLIGHT questions...");
    
    const questions = [
      // AUTOFLIGHT Questions (41 questions)
      {
        question: "The Flight Management part of the FMGC includes the following elements:",
        options: [
          "Navigation, flight planning and A/THR commands.",
          "Performance optimization, A/THR and AP commands",
          "Navigation, flight planning, performance optimization and flight predictions",
          "AP and FD commands and flight envelope computation."
        ],
        correctAnswer: 2,
        explanation: "The Flight Management part of the FMGC includes navigation, flight planning, performance optimization and flight predictions, providing comprehensive flight management capabilities."
      },
      {
        question: "How can the present position of the aircraft be initialized?",
        options: [
          "Present position can be entered through the ADIRS CDU.",
          "Present position can be entered on the INIT page of the MCDU.",
          "Both are correct."
        ],
        correctAnswer: 2,
        explanation: "Present position can be initialized both through the ADIRS CDU and on the INIT page of the MCDU, providing redundant initialization methods."
      },
      {
        question: "What are the correct positions for the PFD and ND?",
        options: [
          "The PFD should be outboard and the ND should be inboard.",
          "The PFD should be inboard and the ND should be inboard.",
          "The PFD should be to the left of the ND for both seat positions.",
          "The PFD should be inboard and the ND should be inboard."
        ],
        correctAnswer: 1,
        explanation: "The PFD (Primary Flight Display) should be positioned inboard and the ND (Navigation Display) should be inboard for optimal pilot monitoring and cross-checking."
      },
      {
        question: "What information is supplied by the IR's and displayed on the PFD?",
        options: [
          "Heading, attitude, and vertical speed.",
          "Heading, altitude, and vertical speed",
          "Airspeed, altitude, and backup vertical speed.",
          "Heading, attitude, and altitude."
        ],
        correctAnswer: 0,
        explanation: "The Inertial Reference systems supply heading, attitude, and vertical speed information that is displayed on the PFD for flight control reference."
      },
      {
        question: "How long does a normal IR alignment take?",
        options: [
          "Approximately 3 minutes.",
          "Approximately 6 minutes.",
          "Approximately 10 minutes.",
          "Approximately 13 minutes."
        ],
        correctAnswer: 2,
        explanation: "A normal IR (Inertial Reference) alignment takes approximately 10 minutes to complete the initialization process."
      },
      {
        question: "The IR ALIGN light is extinguished. What does this mean?",
        options: [
          "Alignment has been completed.",
          "Air data output has been disconnected.",
          "The respective IR is operating normally."
        ],
        correctAnswer: 0,
        explanation: "When the IR ALIGN light is extinguished, it indicates that the alignment process has been completed successfully."
      },
      {
        question: "An amber flashing IR FAULT light indicates that:",
        options: [
          "Present position needs to be reentered.",
          "Attitude and heading information may be recovered in ATT mode.",
          "A complete failure of the respective IR has occurred."
        ],
        correctAnswer: 1,
        explanation: "An amber flashing IR FAULT light indicates that attitude and heading information may be recoverable by switching to ATT mode."
      },
      {
        question: "What action should be taken if IR #2 is lost:",
        options: [
          "Move the EIS DMC rotary selector knob to F/O 3.",
          "Move the ATT HDG rotary selector knob to CAPT 3.",
          "Move the ATT HDG rotary selector knob to F/O 3.",
          "Move the ATT HDG rotary selector knob to F/O 1."
        ],
        correctAnswer: 2,
        explanation: "If IR #2 is lost, the ATT HDG rotary selector knob should be moved to F/O 3 to maintain attitude and heading reference."
      },
      {
        question: "A/THR in white means that A/THR is:",
        options: [
          "Disconnected.",
          "Armed.",
          "Active"
        ],
        correctAnswer: 2,
        explanation: "When A/THR is displayed in white, it means the autothrust system is active and controlling engine thrust."
      },
      {
        question: "The white IR ALIGN light is flashing. What does this mean?",
        options: [
          "No present position has been entered and ten minutes has elapsed since the IR was selected ON.",
          "No present position has been entered and ten minutes has elapsed since the IR was selected ON. An alignment fault may exist.",
          "Attitude and heading information have been lost. An alignment fault may exist."
        ],
        correctAnswer: 1,
        explanation: "A flashing white IR ALIGN light indicates no present position has been entered after ten minutes, and an alignment fault may exist."
      },
      {
        question: "What message is displayed if the database effective date does not match the clock date?",
        options: [
          "Check Data Base Cycle.",
          "Check Data Base Date.",
          "Check Effective Date.",
          "Check the changeover date."
        ],
        correctAnswer: 0,
        explanation: "When the database effective date doesn't match the clock date, the message 'Check Data Base Cycle' is displayed."
      },
      {
        question: "Placing one of the ADR push buttons OFF will accomplish what?",
        options: [
          "The OFF light will illuminate and air data output will disconnect.",
          "The respective ADIRU will become deenergized.",
          "Both AD and IR information will be disconnected.",
          "All of the above."
        ],
        correctAnswer: 0,
        explanation: "When an ADR push button is placed OFF, the OFF light illuminates and air data output from that unit is disconnected."
      },
      {
        question: "While in-flight, operating in Normal law, in the Alpha Prot range:",
        options: [
          "The flight controls revert to direct law.",
          "The flight controls remain in the load factor demand law.",
          "The sidestick controller and flight controls revert to the AOA mode, and side stick deflection is proportional to AOA."
        ],
        correctAnswer: 2,
        explanation: "In Alpha Protection range during Normal law, the sidestick and flight controls revert to AOA mode where sidestick deflection is proportional to angle of attack."
      },
      {
        question: "What is the difference between -FD2 and 2FD- on the FMA?",
        options: [
          "1 inop, 2 engaged. 2 engaged, 1 off.",
          "1 off, 2 engaged. 2 engaged, 1 inop"
        ],
        correctAnswer: 1,
        explanation: "On the FMA, -FD2 means FD1 is off and FD2 is engaged, while 2FD- means FD2 is engaged and FD1 is inoperative."
      },
      {
        question: "What does the LOW ACCURACY message mean?",
        options: [
          "FMGC 1 & 2 position difference exceeds limits.",
          "FMGC position & actual radio position difference exceeds limits.",
          "FMCG position & IR position difference exceeds limits."
        ],
        correctAnswer: 0,
        explanation: "The LOW ACCURACY message indicates that the position difference between FMGC 1 and FMGC 2 exceeds allowable limits."
      },
      {
        question: "The thrust delivered by A/THR is already at MAX CLB thrust. Is it possible to obtain some additional thrust?",
        options: [
          "Yes, by setting a higher speed target.",
          "Yes, by moving the thrust levers forward from the CL detent.",
          "No, because the A/THR already delivers the maximum available thrust."
        ],
        correctAnswer: 1,
        explanation: "Additional thrust can be obtained by manually moving the thrust levers forward from the CL detent, overriding the A/THR system."
      },
      {
        question: "What information is supplied by the Air Data Modules (ADMs) and displayed on the PFD's?",
        options: [
          "Heading, attitude, and vertical speed.",
          "Airspeed, altitude, and backup vertical speed.",
          "Airspeed, vertical speed, and altitude.",
          "Airspeed, attitude, altitude, and vertical speed."
        ],
        correctAnswer: 2,
        explanation: "The Air Data Modules supply airspeed, vertical speed, and altitude information displayed on the PFDs."
      },
      {
        question: "Can the autopilot be used for a single engine approach and autoland?",
        options: [
          "Yes.",
          "No."
        ],
        correctAnswer: 0,
        explanation: "Yes, the autopilot can be used for single engine approach and autoland operations, providing enhanced safety during critical phases."
      },
      {
        question: "During the takeoff phase:",
        options: [
          "SRS mode will provide guidance to maintain V2+10 kts (minimum) as a speed reference",
          "SRS mode is available up to 1500 ft.",
          "SRS mode will not engage if TOGA is selected."
        ],
        correctAnswer: 0,
        explanation: "During takeoff, SRS (Speed Reference System) mode provides guidance to maintain V2+10 knots minimum as the speed reference."
      },
      {
        question: "If the IR mode rotary selector is selected OFF:",
        options: [
          "AD and IR information will be disconnected.",
          "AD information will be disconnected.",
          "IR information will be disconnected.",
          "The ADIRU is not energized: AD and IR information is lost."
        ],
        correctAnswer: 2,
        explanation: "When the IR mode rotary selector is selected OFF, only the IR (Inertial Reference) information will be disconnected."
      },
      {
        question: "Which of the following statements is always true when operating in alternate law?",
        options: [
          "Extending the landing gear will place the aircraft in Direct law.",
          "Extending the landing gear will place the aircraft in Mechanical backup law.",
          "Extending the landing gear will place the aircraft in Mechanical backup law."
        ],
        correctAnswer: 0,
        explanation: "In alternate law, extending the landing gear will always place the aircraft in Direct law, removing flight envelope protections."
      },
      {
        question: "Which protection is not available below 100 feet AGL?",
        options: [
          "Pitch attitude.",
          "VLS.",
          "ALPHA SPD (alpha speed)",
          "Alpha floor."
        ],
        correctAnswer: 3,
        explanation: "Alpha floor protection is not available below 100 feet AGL to prevent unwanted thrust increases during landing."
      },
      {
        question: "What does amber SPEED BRAKES mean on lower ECAM?",
        options: [
          "Speed brakes have a fault.",
          "Speed brakes are extended and flap handle is not at 0.",
          "Speed brakes are extended and engines are not at idle.",
          "All of the above."
        ],
        correctAnswer: 3,
        explanation: "Amber SPEED BRAKES on lower ECAM can indicate a fault, extension with flaps not at 0, or extension with engines not at idle."
      },
      {
        question: "If LOW ACCURACY message is displayed, are there any approach restrictions?",
        options: [
          "No",
          "Yes, ILS approach only.",
          "Yes, both LNAV and VNAV approaches are forbidden."
        ],
        correctAnswer: 2,
        explanation: "When LOW ACCURACY message is displayed, both LNAV and VNAV approaches are forbidden due to navigation accuracy limitations."
      },
      {
        question: "The DDRMI provides the pilot with:",
        options: [
          "Bearing only for VOR 1.",
          "Bearing and DME information for VOR 1 and ADF 1.",
          "Bearing and DME information for VOR 2 and ADF 2.",
          "Bearing only for VOR 1 and VOR 2."
        ],
        correctAnswer: 1,
        explanation: "The DDRMI (Digital Distance and Radio Magnetic Indicator) provides bearing and DME information for VOR 1 and ADF 1."
      },
      {
        question: "The ON BAT light will illuminate amber:",
        options: [
          "When one or more IR's are operating on aircraft battery power.",
          "For a few seconds at the beginning of the alignment process.",
          "Both are correct."
        ],
        correctAnswer: 2,
        explanation: "The ON BAT light illuminates amber both when IRs operate on battery power and briefly during alignment startup."
      },
      {
        question: "If both ELACs fail, what controls the elevator and stabilizer?",
        options: [
          "FACs.",
          "SECs.",
          "Elevator and stabilizer revert to mechanical backup.",
          "Backup mode of ELAC's"
        ],
        correctAnswer: 1,
        explanation: "If both ELACs fail, the SECs (Spoiler Elevator Computers) take control of the elevator and stabilizer functions."
      },
      {
        question: "Where is the information displayed by DMC #1 and DMC #2?",
        options: [
          "DMC #1 supplies data to PFD #2, ND #2 and LOWER ECAM. DMC #2 supplies data for PFD #1, ND #1, and UPPER ECAM.",
          "DMC #1 supplies data to PFD #1, ND #1 and LOWER ECAM. DMC #2 supplies data for PFD #2, ND #2, and UPPER ECAM.",
          "DMC #1 supplies data to PFD #1, ND #1, and UPPER ECAM. DMC #2 supplies data for PFD #2, ND #2, and LOWER ECAM.",
          "DMC #1 supplies data to PFD #1, ND #1 and LOWER ECAM. DMC #2 supplies data for PFD #2, ND #2, and LOWER ECAM."
        ],
        correctAnswer: 2,
        explanation: "DMC #1 supplies data to PFD #1, ND #1, and UPPER ECAM, while DMC #2 supplies data to PFD #2, ND #2, and LOWER ECAM."
      },
      {
        question: "While in flight operating in Normal law, movement of the sidestick and subsequent return to neutral will command:",
        options: [
          "A load factor proportional to stick deflection, then maintain one G flight corrected for pitch attitude.",
          "Control surface movements proportional to stick deflection, then return the aircraft to straight and level flight.",
          "Control surface movements proportional to stick deflection, disconnect auto trim, and maintain its current attitude."
        ],
        correctAnswer: 0,
        explanation: "In Normal law, sidestick movement commands load factor proportional to deflection, then maintains 1G flight corrected for pitch attitude when returned to neutral."
      },
      {
        question: "In normal law all protections are active, which of the following lists is the most complete list?",
        options: [
          "Protections, Load Factor, Pitch attitude, High AOA, and High speed.",
          "Protections, Load Factor, Pitch attitude, High AOA, Alpha floor, angle of bank, and High speed.",
          "Protections, Load Factor, Pitch attitude, High AOA, VLS, Alpha floor, and High speed.",
          "Protections, Load Factor and Pitch attitude."
        ],
        correctAnswer: 2,
        explanation: "In Normal law, all protections are active including Load Factor, Pitch attitude, High AOA, VLS, Alpha floor, and High speed protections."
      },
      {
        question: "When in alternate law, all protections except _____ protection will be lost.",
        options: [
          "Roll attitude.",
          "Pitch attitude.",
          "Bank angle.",
          "Load factor."
        ],
        correctAnswer: 3,
        explanation: "In alternate law, all protections are lost except load factor protection, which remains to prevent structural damage."
      },
      {
        question: "When does the sideslip indicator change to a blue Beta target?",
        options: [
          "Flaps configuration 1.",
          "Any EPR exceeds 1.25, and EPR's differ by more than 0.30",
          "Heading differs from track by 20 deg or more",
          "Flaps configuration 1, 2."
        ],
        correctAnswer: 1,
        explanation: "The sideslip indicator changes to a blue Beta target when any EPR exceeds 1.25 and EPRs differ by more than 0.30 (or N1 >80% with >35% difference)."
      },
      {
        question: "High and low speed stabilities may be available in alternate law, stabilities:",
        options: [
          "Will not allow the pilot to stall the aircraft.",
          "Prohibit steep bank angles.",
          "Prohibit steep climb angles and bank angles.",
          "Can be overridden by the pilot, and it is possible to exceed Vmo, Mmo and stall the aircraft."
        ],
        correctAnswer: 3,
        explanation: "High and low speed stabilities in alternate law can be overridden by the pilot, making it possible to exceed Vmo, Mmo and stall the aircraft."
      },
      {"question": "What is the function of the FACs?",
        options: [
          "Rudder and Yaw damping inputs, Flight envelope and speed computations",
          "Rudder and Yaw damping inputs",
          "Rudder and Yaw damping inputs and windshear protection",
          "Rudder and Yaw damping inputs, Flight envelope and speed computations, and windshear protection"
        ],
        correctAnswer: 3,
        explanation: "The FACs (Flight Augmentation Computers) provide rudder and yaw damping inputs, flight envelope and speed computations, and windshear protection."
      },
      {
        question: "What causes a DU to display a black screen with a white diagonal line?",
        options: [
          "The circuit breaker for that particular DU has popped.",
          "DMC failure.",
          "No power."
        ],
        correctAnswer: 1,
        explanation: "A black screen with a white diagonal line on a Display Unit indicates a DMC (Display Management Computer) failure."
      },
      {
        question: "Can the aircraft be controlled with a loss of all electrics?",
        options: [
          "Yes.",
          "No."
        ],
        correctAnswer: 0,
        explanation: "Yes, the aircraft retains mechanical backup control for rudder and horizontal stabilizer, allowing basic control even with total electrical failure."
      },
      {
        question: "The ATT HDG and AIR DATA selectors on the switching panel in the NORM position indicate that:",
        options: [
          "ADIRU 1 is supplying information to PFD 1 and ND 2, and ADIRU 2 is supplying power to PFD 2 and ND 1.",
          "ADIRU 1 is supplying information to PFD 1, ND 1 and the DDRMI; ADIRU 2 is supplying power to PFD 2 and ND 2."
        ],
        correctAnswer: 1,
        explanation: "In NORM position, ADIRU 1 supplies information to PFD 1, ND 1 and the DDRMI, while ADIRU 2 supplies power to PFD 2 and ND 2."
      },
      {
        question: "What action should be taken if ADR #1 is lost?",
        options: [
          "Nothing.",
          "Move the ATT HDG knob on the switching panel to CAPT 3.",
          "Move the AIR DATA knob on the switching panel to CAPT 3."
        ],
        correctAnswer: 2,
        explanation: "If ADR #1 is lost, the AIR DATA knob on the switching panel should be moved to CAPT 3 to restore air data information."
      },
      {
        question: "How many Air Data/Inertial Reference Units (ADIRU's) are installed?",
        options: [
          "One",
          "Two",
          "Three",
          "Four"
        ],
        correctAnswer: 2,
        explanation: "The A320 has three Air Data/Inertial Reference Units (ADIRUs) installed for redundancy and reliability."
      },
      {
        question: "On an autoland approach, with both autopilots on, which FMGC is master?",
        options: [
          "FMGC 1",
          "FMGC 2",
          "Both"
        ],
        correctAnswer: 0,
        explanation: "During autoland approach with both autopilots engaged, FMGC 1 is the master flight management computer."
      },
      {
        question: "After a single DMC failure, how could a crewmember recover the display units?",
        options: [
          "Once a DMC has failed the information is unrecoverable",
          "No action is needed as recovery is automatic.",
          "Rotate the EIS DMC switch on the switching panel to replace the failed DMC with DMC #3."
        ],
        correctAnswer: 2,
        explanation: "After a single DMC failure, the EIS DMC switch can be rotated to replace the failed DMC with the backup DMC #3."
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
        category: "AUTOFLIGHT",
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
        reference: "A320 FCOM 22-10-00 AUTOFLIGHT",
      });
      
      insertedQuestionIds.push(questionId);
    }

    // Create exam modes for these questions
    const examModes = [
      {
        title: "A320 AUTOFLIGHT - Practice Mode",
        description: "Practice questions for A320 AUTOFLIGHT systems with unlimited time",
        category: "Practice Mode",
        timeLimit: 0,
        passingScore: 70
      },
      {
        title: "A320 AUTOFLIGHT - Timed Exam Mode", 
        description: "Timed examination of A320 AUTOFLIGHT knowledge",
        category: "Timed Exam Mode",
        timeLimit: 60,
        passingScore: 80
      },
      {
        title: "A320 AUTOFLIGHT - Review Mode",
        description: "Review previously missed questions on A320 AUTOFLIGHT systems",
        category: "Review Mode",
        timeLimit: 0,
        passingScore: 75
      },
      {
        title: "A320 Type Rating - AUTOFLIGHT Module",
        description: "Type rating examination module covering A320 AUTOFLIGHT for habilitación A320",
        category: "Examen de Habilitación A320",
        timeLimit: 75,
        passingScore: 85
      }
    ];

    const createdExams: any[] = [];
    for (const examMode of examModes) {
      const examId = await ctx.db.insert("exams", {
        title: examMode.title,
        description: examMode.description,
        aircraftType: "A320_FAMILY",
        category: examMode.category,
        difficulty: "intermediate",
        timeLimit: examMode.timeLimit,
        passingScore: examMode.passingScore,
        questionsCount: Math.min(questions.length, 25),
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      createdExams.push({ examId, mode: examMode.category });
    }

    console.log(`Successfully seeded ${questions.length} A320 AUTOFLIGHT questions`);
    console.log(`Created ${createdExams.length} exam modes`);

    return {
      success: true,
      message: `Successfully added ${questions.length} A320 AUTOFLIGHT questions to all exam modes`,
      questionsAdded: insertedQuestionIds.length,
      examModesCreated: createdExams.length,
      examModes: createdExams.map(e => e.mode),
      integration: {
        practiceMode: "✅ Added to Practice Mode (unlimited time)",
        timedExam: "✅ Added to Timed Exam Mode (60 minutes)",
        reviewMode: "✅ Added to Review Mode (for incorrect answers)",
        typeRating: "✅ Added to A320 Type Rating Exam (habilitación A320)"
      }
    };
  },
});