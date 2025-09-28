/**
 * Service for managing comprehensive theory content for aircraft modules
 */

export interface TheoryContent {
  id: string;
  title: string;
  content: string;
  objectives: string[];
  keyTerms: { term: string; definition: string }[];
  summary: string;
  duration: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  aircraftType: 'A320_FAMILY' | 'B737_FAMILY';
  moduleId: string;
  lessonId: number;
}

export class TheoryContentService {
  private static readonly THEORY_CONTENT: Map<string, TheoryContent> = new Map();

  static {
    // Initialize A320 Theory Content
    this.initializeA320Content();
    
    // Initialize B737 Theory Content
    this.initializeB737Content();
  }

  private static initializeA320Content(): void {
    // A320 Lesson 1: Airplane General
    this.THEORY_CONTENT.set('A320-1', {
      id: 'A320-1',
      title: 'Airbus A320 Family Overview',
      aircraftType: 'A320_FAMILY',
      moduleId: 'fundamentos',
      lessonId: 1,
      difficulty: 'Basic',
      duration: '45m',
      objectives: [
        'Understand the A320 family variants and specifications',
        'Learn the fly-by-wire philosophy and protections',
        'Identify key differences between A318, A319, A320, and A321',
        'Comprehend basic aircraft limitations and operational envelope'
      ],
      keyTerms: [
        { term: 'Fly-by-wire (FBW)', definition: 'Flight control system where pilot inputs are transmitted electronically to control surfaces' },
        { term: 'Flight Envelope Protection', definition: 'Automatic systems that prevent the aircraft from exceeding safe operating limits' },
        { term: 'Alpha Protection', definition: 'Prevents the aircraft from exceeding angle of attack limits' },
        { term: 'Load Factor Protection', definition: 'Limits G-forces to protect aircraft structure' }
      ],
      content: `
# Airbus A320 Family Overview

## Introduction
The Airbus A320 family represents a revolutionary advancement in commercial aviation, introducing fly-by-wire technology to narrow-body aircraft. This family consists of four main variants: A318, A319, A320, and A321, each designed for different market segments while maintaining pilot commonality.

## Aircraft Variants

### A318 (The Baby Bus)
- **Length**: 31.44m (103.1 ft)
- **Wingspan**: 34.10m (111.9 ft)
- **Typical Seating**: 107-132 passengers
- **Range**: 5,750 km (3,107 nm)
- **MTOW**: 68,000 kg (149,914 lb)

### A319
- **Length**: 33.84m (111.0 ft)
- **Wingspan**: 34.10m (111.9 ft)
- **Typical Seating**: 124-156 passengers
- **Range**: 6,850 km (3,700 nm)
- **MTOW**: 75,500 kg (166,449 lb)

### A320 (The Original)
- **Length**: 37.57m (123.3 ft)
- **Wingspan**: 34.10m (111.9 ft)
- **Typical Seating**: 150-180 passengers
- **Range**: 6,150 km (3,321 nm)
- **MTOW**: 78,000 kg (171,961 lb)

### A321
- **Length**: 44.51m (146.0 ft)
- **Wingspan**: 34.10m (111.9 ft)
- **Typical Seating**: 185-220 passengers
- **Range**: 5,950 km (3,212 nm)
- **MTOW**: 93,500 kg (206,132 lb)

## Fly-by-Wire Philosophy

The A320 family was the first commercial airliner to feature full fly-by-wire flight controls. This revolutionary system provides:

### Flight Envelope Protection
1. **Alpha Protection**: Prevents stall by limiting angle of attack
2. **High Speed Protection**: Prevents overspeed conditions
3. **Load Factor Protection**: Limits G-forces to +2.5/-1.0g in normal law
4. **Bank Angle Protection**: Limits bank angle to 67° in normal operation

### Control Laws
- **Normal Law**: Full protections active, aircraft cannot be stalled
- **Alternate Law**: Reduced protections, stall warning active
- **Direct Law**: No protections, conventional control response
- **Mechanical Backup**: Manual reversion for pitch control

## Key Design Features

### Commonality
All A320 family aircraft share:
- Same type rating for pilots
- Identical cockpit layout and procedures
- Common maintenance procedures
- Interchangeable spare parts where possible

### Safety Systems
- Triple redundant flight control computers
- Dual hydraulic systems with manual reversion
- Advanced weather radar and TCAS
- Enhanced ground proximity warning system (EGPWS)

## Operational Considerations

### Performance
- Cruise altitude: Typically FL370-FL410
- Cruise speed: Mach 0.78-0.82
- Approach speed: Typically 130-150 knots
- Service ceiling: 39,000-41,000 ft depending on variant

### Limitations
- Maximum operating altitude: 39,000 ft (A318/A319), 41,000 ft (A320/A321)
- Maximum operating speed: 350 KIAS / Mach 0.82
- Turbulence penetration speed: 280 KIAS / Mach 0.76
- Maximum crosswind: 38 knots (including gusts)
      `,
      summary: 'The A320 family revolutionized commercial aviation with fly-by-wire technology, offering four variants with excellent pilot commonality and advanced safety systems. Understanding these fundamentals is crucial for safe and efficient operation.'
    });

    // Add more A320 lessons here...
  }

  private static initializeB737Content(): void {
    // B737 Lesson 1: Aircraft General Knowledge
    this.THEORY_CONTENT.set('B737-1', {
      id: 'B737-1',
      title: 'Boeing 737 Aircraft General Knowledge',
      aircraftType: 'B737_FAMILY',
      moduleId: 'fundamentos',
      lessonId: 1,
      difficulty: 'Basic',
      duration: '75m',
      objectives: [
        'Understand Boeing 737 family variants and their differences',
        'Learn basic aircraft dimensions, weights, and performance specifications',
        'Comprehend certification standards (EASA/FAA)',
        'Identify key operational limitations and envelope restrictions'
      ],
      keyTerms: [
        { term: 'CFM56', definition: 'High-bypass turbofan engine used on 737-300 through 737-900 series' },
        { term: 'LEAP-1B', definition: 'Next-generation engine used on 737 MAX family' },
        { term: 'MTOW', definition: 'Maximum Takeoff Weight - highest weight at which aircraft is certified for takeoff' },
        { term: 'MLW', definition: 'Maximum Landing Weight - highest weight at which aircraft can safely land' },
        { term: 'Service Ceiling', definition: 'Maximum altitude at which aircraft can maintain 100 fpm climb rate' }
      ],
      content: `
# Boeing 737 Aircraft General Knowledge

## Introduction
The Boeing 737 is the world's most popular commercial aircraft family, with over 10,000 units delivered since its first flight in 1967. The aircraft has evolved through multiple generations, each incorporating advanced technology while maintaining pilot commonality and operational efficiency.

## Aircraft Family Overview

### Original Series (737-100, 737-200)
- **First Flight**: April 9, 1967
- **Production**: 1967-1988
- **Engines**: Pratt & Whitney JT8D
- **Notable**: Shorter fuselage, lower gross weights

### Classic Series (737-300, 737-400, 737-500)
- **Production**: 1984-2000
- **Engines**: CFM56-3 series
- **Improvements**: Stretched fuselage options, improved fuel efficiency
- **Variants**: -300 (most popular), -400 (longest), -500 (shortest)

### Next Generation (737-600, 737-700, 737-800, 737-900)
- **Production**: 1996-2016
- **Engines**: CFM56-7B series
- **Improvements**: Advanced avionics, improved performance, winglets option
- **Most Popular**: 737-800 (most widely used variant)

### MAX Series (737 MAX 7, MAX 8, MAX 9, MAX 10)
- **Production**: 2016-present
- **Engines**: LEAP-1B
- **Improvements**: 15% fuel efficiency improvement, advanced flight deck displays
- **Certification**: Return to service after comprehensive safety updates

## Current Generation Specifications

### Boeing 737-700
- **Length**: 33.63m (110.4 ft)
- **Wingspan**: 35.79m (117.5 ft)
- **Height**: 12.55m (41.2 ft)
- **Typical Seating**: 126-149 passengers
- **Range**: 6,230 km (3,365 nm)
- **MTOW**: 70,080 kg (154,500 lb)
- **MLW**: 58,060 kg (127,900 lb)

### Boeing 737-800 (Most Common)
- **Length**: 39.47m (129.5 ft)
- **Wingspan**: 35.79m (117.5 ft)
- **Height**: 12.55m (41.2 ft)
- **Typical Seating**: 162-189 passengers
- **Range**: 5,765 km (3,115 nm)
- **MTOW**: 79,010 kg (174,200 lb)
- **MLW**: 65,320 kg (144,000 lb)

### Boeing 737-900ER
- **Length**: 42.11m (138.2 ft)
- **Wingspan**: 35.79m (117.5 ft)
- **Height**: 12.55m (41.2 ft)
- **Typical Seating**: 180-215 passengers
- **Range**: 5,925 km (3,200 nm)
- **MTOW**: 85,130 kg (187,700 lb)
- **MLW**: 66,360 kg (146,300 lb)

## Performance Characteristics

### Speed Limitations
- **VMO**: 340 KIAS (Below 10,000 ft)
- **MMO**: Mach 0.82 (Above 10,000 ft)
- **VFE**: Varies by flap setting (190-250 KIAS)
- **VLE**: 270 KIAS (Landing gear extended)
- **VLO**: 270 KIAS (Landing gear operation)

### Altitude Limitations
- **Service Ceiling**: 41,000 ft
- **Maximum Operating Altitude**: 41,000 ft
- **Cabin Pressure Differential**: 8.35 PSI maximum
- **Emergency Descent**: Must reach 14,000 ft within 4 minutes

### Weight Limitations
- **Zero Fuel Weight**: Maximum weight without fuel
- **Maximum Ramp Weight**: Highest weight for ground operations
- **Maximum Structural Payload**: Maximum cargo and passenger weight

### Environmental Limitations
- **Temperature Range**: -54°C to +50°C operational
- **Maximum Crosswind**: 33 knots (dry runway), 15 knots (contaminated)
- **Maximum Tailwind**: 15 knots for takeoff and landing
- **Turbulence**: 280 KIAS / Mach 0.76 penetration speed

## Powerplant Information

### CFM56-7B Engine (Next Generation)
- **Type**: High-bypass turbofan
- **Thrust Range**: 22,700-33,000 lbf
- **Bypass Ratio**: 5.1:1
- **Fuel Consumption**: Approximately 600-900 gallons/hour per engine

### LEAP-1B Engine (MAX Series)
- **Type**: High-bypass turbofan with advanced materials
- **Thrust Range**: 24,500-29,500 lbf
- **Bypass Ratio**: 9:1
- **Fuel Efficiency**: 15% improvement over CFM56

## Certification Standards

### EASA Requirements
- **CS-25**: Certification Specification for Large Aeroplanes
- **Part-OPS**: Operations requirements
- **Part-FCL**: Flight Crew Licensing
- **Part-145**: Maintenance Organization Approvals

### FAA Requirements
- **Part 25**: Airworthiness Standards for Transport Category Airplanes
- **Part 121**: Operating Requirements for Domestic and Flag Operations
- **Part 61**: Certification of Pilots and Instructors
- **Part 145**: Repair Stations

## Operational Philosophy

### Design Principles
- **Pilot Familiarity**: Maintain commonality across variants
- **Operational Efficiency**: Optimize for airline economics
- **Safety**: Redundant systems and proven technology
- **Maintainability**: Easy access and common parts

### Training Requirements
- **Type Rating**: Required for operation as pilot-in-command
- **Differences Training**: Between variants (minimal)
- **Recurrent Training**: Every 6-12 months
- **Line Check**: Operational competency verification

## System Architecture Overview

### Flight Controls
- **Manual Control**: Cable and pushrod system
- **Hydraulic Assist**: Two independent hydraulic systems
- **Trim Systems**: Electric and manual backup
- **Autopilot**: Advanced flight management capabilities

### Avionics
- **Flight Management System**: Navigation and performance optimization
- **Electronic Flight Displays**: Primary flight and navigation displays
- **Weather Radar**: Advanced precipitation and turbulence detection
- **TCAS**: Traffic collision avoidance system

This comprehensive overview provides the foundation for understanding Boeing 737 operations and forms the basis for all subsequent systems training.
      `,
      summary: 'The Boeing 737 family represents decades of aviation evolution, offering multiple variants optimized for different routes while maintaining excellent pilot commonality and operational efficiency. Understanding these fundamentals is essential for safe commercial operations.'
    });

    // B737 Lesson 2: Cockpit Layout & Systems Overview
    this.THEORY_CONTENT.set('B737-2', {
      id: 'B737-2',
      title: 'Boeing 737 Cockpit Layout & Systems Overview',
      aircraftType: 'B737_FAMILY',
      moduleId: 'fundamentos',
      lessonId: 2,
      difficulty: 'Basic',
      duration: '60m',
      objectives: [
        'Familiarize with Boeing 737 cockpit layout and ergonomics',
        'Understand primary flight displays and engine indications',
        'Learn system panel locations and control interfaces',
        'Comprehend information flow and pilot workload distribution'
      ],
      keyTerms: [
        { term: 'PFD', definition: 'Primary Flight Display - main flight instrument display for each pilot' },
        { term: 'ND', definition: 'Navigation Display - shows navigation information and weather radar' },
        { term: 'EICAS', definition: 'Engine Indication and Crew Alerting System - engine parameters and warnings' },
        { term: 'CDU', definition: 'Control Display Unit - interface for Flight Management System' },
        { term: 'MCP', definition: 'Mode Control Panel - autopilot and flight director controls' }
      ],
      content: `
# Boeing 737 Cockpit Layout & Systems Overview

## Introduction
The Boeing 737 cockpit has evolved significantly from the original analog design to the modern glass cockpit configuration. The current generation features an efficient layout designed for two-pilot operation with excellent situational awareness and reduced workload.

## Overall Cockpit Philosophy

### Design Principles
- **Dark Cockpit Concept**: Normal operations show minimal lights/warnings
- **Pilot Workload Distribution**: Logical separation of captain and first officer duties
- **System Accessibility**: Frequently used controls within easy reach
- **Emergency Access**: Critical controls accessible from either pilot position

### Ergonomic Considerations
- **Seat Adjustment**: Multiple axes for optimal pilot positioning
- **Control Reach**: All primary controls within normal arm extension
- **Visual Design**: High contrast displays for various lighting conditions
- **Standardization**: Consistent with other Boeing aircraft where possible

## Primary Flight Displays

### Captain's Primary Flight Display (PFD)
**Location**: Left side of instrument panel
**Information Displayed**:
- Attitude indicator with flight director commands
- Airspeed tape with trend vector and reference speeds
- Altitude tape with barometric setting
- Heading/track information
- Vertical speed indicator
- Flight mode annunciations
- Warning and caution messages

### First Officer's Primary Flight Display (PFD)
**Location**: Right side of instrument panel
**Information**: Identical to captain's PFD for redundancy
**Cross-Reference**: Can display navigation information from either side

### Navigation Displays (ND)
**Location**: Outboard of each PFD
**Display Modes**:
- **MAP Mode**: Shows flight plan, waypoints, and aircraft position
- **PLAN Mode**: Displays flight plan without aircraft symbol
- **CTR Mode**: Weather radar centered on aircraft
- **APP Mode**: Approach guidance and ILS information

**Information Elements**:
- Flight plan route
- Weather radar returns
- TCAS traffic information
- Terrain awareness
- Navigation aids
- Wind information

## Engine Indication and Crew Alerting System (EICAS)

### Upper EICAS Display
**Location**: Center of instrument panel (upper)
**Primary Engine Parameters**:
- N1 RPM (fan speed) - primary power setting
- Exhaust Gas Temperature (EGT)
- N2 RPM (core speed)
- Fuel flow per engine
- Oil pressure and temperature
- Vibration levels

### Lower EICAS Display
**Location**: Center of instrument panel (lower)
**Secondary Parameters**:
- Hydraulic system pressures
- Electrical system status
- Fuel quantity and distribution
- Cabin pressurization
- Air conditioning status
- Landing gear and brake temperatures

### Alert System
**Warning Messages**: Red text for immediate action required
**Caution Messages**: Amber text for abnormal conditions requiring attention
**Advisory Messages**: Blue text for system status information
**Memo Messages**: White text for normal operational reminders

## Flight Management System (FMS)

### Control Display Units (CDU)
**Location**: Center pedestal (two units)
**Functions**:
- Flight plan programming
- Performance calculations
- Navigation database management
- Aircraft configuration setup
- Maintenance information access

**Key Pages**:
- **IDENT**: Aircraft identification and database information
- **POS INIT**: Position initialization
- **ROUTE**: Flight plan programming
- **PERF INIT**: Performance initialization
- **TAKEOFF**: Takeoff performance calculations
- **APPROACH**: Approach setup and guidance

### Navigation Management
- **Flight Plan Storage**: Multiple flight plans and alternates
- **Waypoint Database**: Comprehensive worldwide navigation database
- **Performance Optimization**: Continuous calculation of optimal flight profile
- **Fuel Management**: Fuel planning and monitoring

## Mode Control Panel (MCP)

### Location and Layout
**Position**: Center of glareshield, accessible to both pilots
**Primary Controls**:
- Course selectors (left and right)
- Heading select knob and window
- Altitude select window and knob
- Vertical speed selector
- Speed select window and knob
- IAS/MACH selector

### Autopilot Controls
**Engagement**: CMD A and CMD B buttons
**Flight Director**: F/D switches for each pilot
**Autothrottle**: A/T ARM and disconnect buttons
**VNAV/LNAV**: Vertical and lateral navigation modes

This cockpit overview provides essential knowledge for efficient and safe Boeing 737 operations, forming the foundation for all system-specific training modules.
      `,
      summary: 'The Boeing 737 cockpit features an evolved design optimized for two-pilot operations with comprehensive displays and intuitive control layout. Understanding the cockpit layout and primary systems is fundamental for effective aircraft operation and crew coordination.'
    });

    // Add more B737 theory content for other lessons...
  }

  /**
   * Get theory content for a specific lesson
   */
  public static getTheoryContent(aircraftType: 'A320_FAMILY' | 'B737_FAMILY', lessonId: number): TheoryContent | null {
    const key = `${aircraftType === 'A320_FAMILY' ? 'A320' : 'B737'}-${lessonId}`;
    return this.THEORY_CONTENT.get(key) || null;
  }

  /**
   * Get all theory content for an aircraft type
   */
  public static getAllTheoryContent(aircraftType: 'A320_FAMILY' | 'B737_FAMILY'): TheoryContent[] {
    const prefix = aircraftType === 'A320_FAMILY' ? 'A320' : 'B737';
    const content: TheoryContent[] = [];
    
    for (const [key, value] of this.THEORY_CONTENT.entries()) {
      if (key.startsWith(prefix)) {
        content.push(value);
      }
    }
    
    return content.sort((a, b) => a.lessonId - b.lessonId);
  }

  /**
   * Search theory content by topic
   */
  public static searchContent(searchTerm: string, aircraftType?: 'A320_FAMILY' | 'B737_FAMILY'): TheoryContent[] {
    const results: TheoryContent[] = [];
    const searchLower = searchTerm.toLowerCase();
    
    for (const content of this.THEORY_CONTENT.values()) {
      if (aircraftType && content.aircraftType !== aircraftType) {
        continue;
      }
      
      if (
        content.title.toLowerCase().includes(searchLower) ||
        content.content.toLowerCase().includes(searchLower) ||
        content.summary.toLowerCase().includes(searchLower) ||
        content.keyTerms.some(term => 
          term.term.toLowerCase().includes(searchLower) ||
          term.definition.toLowerCase().includes(searchLower)
        )
      ) {
        results.push(content);
      }
    }
    
    return results;
  }
}