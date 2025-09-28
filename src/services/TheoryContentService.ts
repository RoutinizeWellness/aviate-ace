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
    
    // A320 Lesson 2: Flight Controls
    this.THEORY_CONTENT.set('A320-2', {
      id: 'A320-2',
      title: 'A320 Flight Controls - Fly-by-Wire System',
      aircraftType: 'A320_FAMILY',
      moduleId: 'sistemas',
      lessonId: 2,
      difficulty: 'Intermediate',
      duration: '60m',
      objectives: [
        'Understand the complete fly-by-wire flight control architecture',
        'Learn the different control laws and their characteristics',
        'Master flight envelope protections and their applications',
        'Comprehend normal, alternate, and direct law operations'
      ],
      keyTerms: [
        { term: 'ELAC', definition: 'Elevator Aileron Computer - Primary flight control computer' },
        { term: 'SEC', definition: 'Spoiler Elevator Computer - Secondary flight control computer' },
        { term: 'FAC', definition: 'Flight Augmentation Computer - Rudder and yaw control' },
        { term: 'Alpha Max', definition: 'Maximum angle of attack protection limit' },
        { term: 'Load Factor Protection', definition: 'G-force limitation system in normal law' }
      ],
      content: `
# A320 Flight Controls - Fly-by-Wire System

## Introduction
The Airbus A320 was the first commercial airliner to implement full fly-by-wire flight controls. This revolutionary system replaces conventional mechanical flight controls with an electronic interface between pilot and control surfaces.

## Flight Control Computers

### ELAC (Elevator Aileron Computer)
**Quantity**: 2 units (ELAC 1 & ELAC 2)
**Functions**:
- Elevator control in Normal Law
- Aileron control
- Pitch trim control
- Stabilizer control
- Flight envelope protection
- Auto-trim function

**Priority**: 
- ELAC 1: Master during normal operations
- ELAC 2: Standby, takes over if ELAC 1 fails

### SEC (Spoiler Elevator Computer)
**Quantity**: 3 units (SEC 1, SEC 2, SEC 3)
**Functions**:
- Spoiler control (flight and ground spoilers)
- Backup elevator control (Alternate Law)
- Speed brakes operation
- Ground spoiler deployment

**Degraded Modes**:
- Can control elevators if both ELACs fail
- Provides Alternate Law flight control

### FAC (Flight Augmentation Computer)
**Quantity**: 2 units (FAC 1 & FAC 2)
**Functions**:
- Rudder control and trim
- Yaw damper function
- Turn coordination
- Rudder travel limitation
- Low energy warning
- Windshear detection

## Control Laws

### Normal Law
**Characteristics**:
- Full flight envelope protection active
- Load factor limiting: +2.5g to -1.0g (clean config)
- Bank angle protection: 67° maximum
- Pitch attitude protection: 30° up, 15° down
- High/low speed protection
- Alpha protection (angle of attack limiting)

**Pilot Input Response**:
- Proportional to load factor (not elevator deflection)
- Automatic trim maintains neutral stick position
- Turn coordination automatic
- Stall impossible in Normal Law

### Alternate Law
**Activation Conditions**:
- Multiple computer failures
- Certain system malfunctions
- Abnormal flight attitudes
- Landing gear extended (some configurations)

**Characteristics**:
- Reduced protections
- Load factor protection: +2.5g to -1.0g maintained
- No alpha protection (stall possible)
- No high speed protection
- Direct relationship between sidestick and elevator
- Manual trim required
- Stall warnings active

### Direct Law
**Activation Conditions**:
- Severe multiple failures
- Manual selection (maintenance mode)
- Extreme flight conditions

**Characteristics**:
- No flight envelope protections
- Direct sidestick to surface relationship
- Manual trim required
- Conventional aircraft-like behavior
- Full pilot responsibility for flight envelope

## Flight Envelope Protections

### Alpha Protection
**Function**: Prevents aircraft from exceeding maximum angle of attack
**Operation**:
- Alpha Prot: Initial protection onset
- Alpha Max: Maximum angle of attack
- Automatic pitch down if Alpha Max exceeded
- Sidestick back pressure increases significantly beyond Alpha Prot

### High Speed Protection
**VMO/MMO Protection**:
- Automatic pitch up when approaching speed limits
- Nose-up elevator applied progressively
- Cannot be overridden by pilot input
- Protects against structural damage

### Load Factor Protection
**Normal Operations**:
- Clean configuration: +2.5g to -1.0g
- Landing configuration: +2.0g to 0g
- Prevents structural overload
- Automatic limit regardless of pilot input

### Bank Angle Protection
**Function**: Limits maximum bank angle
**Operation**:
- 67° maximum bank angle in Normal Law
- Automatic roll leveling beyond 67°
- Spiral protection prevents excessive bank

## Sidestick Operation

### Normal Characteristics
**Force Application**: Spring-loaded to neutral
**Priority Logic**: 
- Red button gives priority to pressed sidestick
- Dual input adds forces together
- Audio warning: "DUAL INPUT" when both pilots apply input

**Response Types**:
- **Attitude Mode**: Normal flight regime
- **Direct Mode**: Alternate/Direct Law
- **Flare Mode**: Below 100ft with landing gear extended

### Pitch Control
**Normal Law**: Load factor demand
**Alternate/Direct Law**: Direct elevator control
**Trim**: Automatic in Normal Law, manual in others

### Roll Control
**Bank Angle Demand**: Roll rate proportional to sidestick deflection
**Turn Coordination**: Automatic rudder coordination in Normal Law
**Roll Rate**: Maximum 15°/second

## Rudder Control

### Normal Operations
**Functions**:
- Yaw damping (automatic)
- Turn coordination (automatic in Normal Law)
- Crosswind correction during takeoff/landing
- Engine failure compensation

### Travel Limitation
**Speed Dependent**: Higher speeds = reduced rudder authority
**Protection**: Prevents structural overload
**Manual Override**: Limited manual override capability

## System Monitoring

### Flight Control Indications
**Normal Operations**: Minimal indications (dark cockpit concept)
**Degraded Modes**: Specific ECAM messages and warnings
**Control Law Status**: Displayed on Primary Flight Display (PFD)

### ECAM Messages
**Flight Control Failures**: Specific computer failure indications
**Control Law Changes**: Alerts when changing from Normal to Alternate Law
**Surface Failures**: Individual control surface malfunctions

## Emergency Procedures

### Dual Engine Failure
**Control Law**: Remains in Normal Law
**Protections**: All protections remain active
**Performance**: Optimized glide performance automatically

### Multiple Computer Failures
**Progression**: Normal → Alternate → Direct Law
**Pilot Actions**: Increased monitoring and manual control
**Landing**: Special procedures for Alternate/Direct Law landings

### Control Surface Jams
**Redundancy**: Multiple surfaces provide backup control
**Procedures**: Specific ECAM guidance for each scenario
**Landing**: Modified approach techniques may be required

This comprehensive fly-by-wire system provides unprecedented safety and efficiency while requiring thorough understanding for optimal operation.
      `,
      summary: 'The A320 fly-by-wire system revolutionizes flight control with multiple computers, envelope protections, and different control laws. Understanding Normal, Alternate, and Direct laws is crucial for safe operations in all flight conditions.'
    });
    
    // A320 Lesson 3: Air Conditioning & Pressurization
    this.THEORY_CONTENT.set('A320-3', {
      id: 'A320-3',
      title: 'A320 Air Conditioning and Pressurization Systems',
      aircraftType: 'A320_FAMILY',
      moduleId: 'sistemas',
      lessonId: 3,
      difficulty: 'Intermediate',
      duration: '55m',
      objectives: [
        'Understand the air conditioning system architecture and operation',
        'Learn cabin pressurization control and safety systems',
        'Master air distribution and temperature control',
        'Comprehend emergency procedures for pressurization failures'
      ],
      keyTerms: [
        { term: 'Pack', definition: 'Air cycle machine that provides conditioned air to the cabin' },
        { term: 'Outflow Valve', definition: 'Valve controlling cabin pressure by regulating air flow out' },
        { term: 'Safety Valve', definition: 'Backup pressure relief valve for cabin overpressure protection' },
        { term: 'Trim Air', definition: 'Hot bleed air for fine temperature control in cabin zones' }
      ],
      content: `
# A320 Air Conditioning and Pressurization Systems

## System Overview
The A320 air conditioning and pressurization system provides a comfortable and safe cabin environment through automated control of temperature, pressure, and air quality for passengers and crew.

## Air Supply Sources

### Engine Bleed Air
**Primary Source**: Hot, high-pressure air from engine compressors
**Extraction Points**:
- Low pressure: 5th stage compressor
- High pressure: 9th stage compressor (backup)
- Automatic switching based on engine power settings

**Temperature**: 200-500°C depending on flight phase
**Pressure**: 45-60 PSI typical operating range
**Flow Rate**: Sufficient for all pneumatic systems

### APU Bleed Air
**Availability**: Ground operations and emergency backup
**Characteristics**: Similar to engine bleed air
**Priority**: Lower than engine bleed air when both available
**Usage**: Primarily for ground air conditioning and engine start

### Ground Air Connection
**External Source**: Ground cart or terminal building supply
**Usage**: Aircraft parked at gate with APU/engines off
**Advantages**: Fuel savings and reduced noise

## Air Conditioning Packs

### Pack System Architecture
**Quantity**: 2 packs (Pack 1 and Pack 2)
**Location**: Lower fuselage, forward and aft of wing
**Independence**: Each pack can supply entire aircraft if needed
**Normal Operation**: Both packs operating for optimal efficiency

### Air Cycle Machine (ACM)
**Function**: Cools hot bleed air to required temperature
**Components**:
- Compressor wheel
- Turbine wheels (2)
- Heat exchangers (Primary and Secondary)
- Water separator
- Reheater

**Process**:
1. Hot bleed air enters primary heat exchanger
2. Partially cooled air compressed further
3. Air passes through secondary heat exchanger
4. Expanded through turbine (cooling effect)
5. Moisture removed in water separator
6. Reheated if necessary for final temperature

### Pack Controllers
**Function**: Automatic pack operation control
**Inputs**:
- Cabin temperature demands
- Flight phase information
- System status monitoring
- Manual override commands

**Outputs**:
- Pack valve positioning
- Temperature control valve operation
- Flow control regulation
- System status indications

## Temperature Control

### Zone Control System
**Cabin Zones**:
- Cockpit zone
- Forward cabin zone
- Aft cabin zone
- Each zone independently controlled

**Temperature Sensors**:
- Zone temperature sensors
- Duct temperature sensors
- Outside air temperature
- Cabin temperature feedback

### Trim Air System
**Purpose**: Fine temperature adjustment for each zone
**Operation**: Hot bleed air mixed with conditioned pack air
**Control**: Automatic trim air valve positioning
**Range**: ±15°C adjustment from pack outlet temperature

### Manual Temperature Control
**Cockpit Controls**: Individual zone temperature selectors
**Range**: Typically 18°C to 30°C cabin temperature
**Override**: Manual control overrides automatic system
**Display**: Current and selected temperatures shown

## Pressurization System

### Cabin Pressure Control
**Objective**: Maintain cabin altitude below 8,000 ft
**Normal Operation**: Automatic control via cabin pressure controller
**Backup Systems**: Manual control and safety systems

**Pressure Schedule**:
- Ground: Ambient pressure
- Climb: Gradual pressure reduction
- Cruise: Maintain selected cabin altitude
- Descent: Gradual pressure increase
- Landing: Return to ambient pressure

### Outflow Valve
**Function**: Primary pressure control device
**Location**: Aft fuselage, lower section
**Operation**: Modulates air flow out of cabin
**Control**: Automatic positioning by pressure controller
**Backup**: Manual override capability

**Valve Characteristics**:
- Normally open (fail-safe)
- Electric motor operation
- Position feedback to controller
- Emergency manual control

### Safety Relief System

#### Positive Pressure Relief
**Safety Valves**: 2 valves protect against overpressure
**Activation**: 8.6 PSI differential pressure
**Function**: Automatic opening to prevent structural damage
**Reset**: Automatic closure when pressure normalizes

#### Negative Pressure Relief
**Function**: Prevents cabin pressure below ambient
**Activation**: Slight negative differential pressure
**Protection**: Structural integrity and door operation

### Cabin Pressure Controller
**Functions**:
- Automatic pressure schedule calculation
- Outflow valve positioning
- Pressure rate control (300 fpm typical)
- Landing field elevation input
- System monitoring and fault detection

**Operating Modes**:
- **Auto**: Normal automatic operation
- **Manual**: Direct pilot control of outflow valve
- **Backup**: Alternative controller operation

## Air Distribution

### Distribution Network
**Ducting**: Insulated ducts throughout aircraft
**Mixing**: Pack air and trim air combined
**Flow Control**: Valves regulate air to different zones
**Outlets**: Gaspers, sidewall outlets, floor distribution

### Recirculation System
**Function**: Recirculate cabin air for efficiency
**Filters**: HEPA filters remove contaminants
**Fans**: Electric fans circulate air
**Mixing**: Recirculated air mixed with fresh pack air
**Ratio**: Typically 50% fresh air, 50% recirculated

### Emergency Air Supply
**Ram Air**: Direct outside air in emergency
**Activation**: Manual ram air valve operation
**Limitations**: Altitude and speed restrictions
**Usage**: Smoke, fumes, or pack failure scenarios

## System Controls and Indications

### Overhead Panel Controls
**Pack Flow Control**: High/Normal/Low flow selection
**Pack Switches**: Individual pack ON/OFF control
**Zone Temperature**: Individual zone temperature selection
**Cabin Pressure**: Landing elevation setting

### ECAM Monitoring
**Normal Display**: Temperatures, pressures, flow rates
**Warning Systems**: Automatic alerts for malfunctions
**Status Information**: Pack operation, valve positions
**Trending**: Historical data for maintenance

## Abnormal Operations

### Pack Failure
**Single Pack**: Remaining pack increases output
**Dual Pack**: Ram air operation required
**Limitations**: Altitude and passenger load restrictions
**Procedures**: ECAM guided troubleshooting

### Pressurization Failure
**Slow Leak**: Gradual altitude increase
**Rapid Decompression**: Emergency descent required
**Door Seal Failure**: Pressure loss and noise
**Outflow Valve Failure**: Manual control required

### Smoke and Fumes
**Pack Isolation**: Remove contaminated air source
**Ram Air**: Provide emergency ventilation
**Recirculation**: Stop recirculation of contaminated air
**Emergency Descent**: May be required for cabin safety

This system ensures passenger and crew comfort and safety throughout all phases of flight.
      `,
      summary: 'The A320 air conditioning and pressurization system automatically maintains cabin comfort and safety through sophisticated pack systems, zone temperature control, and pressure management with multiple backup systems for emergencies.'
    });
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
    
    // B737 Lesson 3: Air Systems
    this.THEORY_CONTENT.set('B737-3', {
      id: 'B737-3',
      title: 'Boeing 737 Air Systems - Pneumatic, Pressurization & Air Conditioning',
      aircraftType: 'B737_FAMILY',
      moduleId: 'sistemas',
      lessonId: 3,
      difficulty: 'Intermediate',
      duration: '65m',
      objectives: [
        'Understand pneumatic system architecture and bleed air sources',
        'Learn cabin pressurization control and safety systems',
        'Master air conditioning pack operations and temperature control',
        'Comprehend emergency procedures for air system failures'
      ],
      keyTerms: [
        { term: 'Bleed Air', definition: 'Hot, high-pressure air extracted from engine compressors for various aircraft systems' },
        { term: 'Pack', definition: 'Air cycle cooling unit that conditions bleed air for cabin use' },
        { term: 'Outflow Valve', definition: 'Valve controlling cabin pressure by regulating air discharge' },
        { term: 'Precooler', definition: 'Heat exchanger that cools hot bleed air before entering packs' }
      ],
      content: `
# Boeing 737 Air Systems

## Introduction
The Boeing 737 air systems provide pneumatic power, cabin pressurization, and air conditioning using engine bleed air. These systems ensure crew and passenger comfort while supporting various aircraft operations.

## Pneumatic System

### Bleed Air Sources
**Engine Bleed Air**: Primary source from both engines
**APU Bleed Air**: Ground operations and emergency backup
**Ground Air Cart**: External pneumatic source for ground operations

#### Engine Bleed Air Extraction
**5th Stage Bleed**: Low-pressure source (normal operations)
**9th Stage Bleed**: High-pressure source (low engine power)
**Automatic Selection**: System automatically selects optimal source
**Temperature**: 200-500°C depending on engine power setting
**Pressure**: 25-60 PSI typical range

#### Bleed Air Control
**Engine Bleed Switches**: Manual control of bleed air valves
**Automatic Operation**: Normal automatic bleed air management
**Isolation Capability**: Each engine bleed can be isolated
**Cross-Feed**: Bleed air can cross-feed between systems

### Pneumatic Distribution
**Left System**: Supplied by Engine 1 or APU
**Right System**: Supplied by Engine 2 or APU
**Isolation Valves**: Separate systems for redundancy
**Priority Logic**: APU bleed has priority over engine bleed

### Pneumatic System Uses
**Air Conditioning Packs**: Primary consumer of bleed air
**Engine Starting**: Pneumatic starter operation
**Wing Anti-Ice**: Hot air for wing leading edge heating
**Water System**: Tank pressurization

## Cabin Pressurization System

### Pressurization Control
**Automatic Mode**: Computer-controlled pressure schedule
**Manual Mode**: Direct pilot control of outflow valve
**Standby Mode**: Backup pressurization controller

#### Cabin Pressure Controller
**Functions**:
- Calculate optimal pressure schedule
- Control outflow valve position  
- Monitor cabin altitude and rate
- Provide crew alerts for abnormal conditions

**Inputs**:
- Flight altitude
- Landing field elevation
- Aircraft configuration
- Manual pilot inputs

### Outflow Valve
**Location**: Aft fuselage, lower section
**Type**: Motor-operated butterfly valve
**Control**: Electric motor with manual backup
**Position Feedback**: Valve position indication
**Fail-Safe**: Fails to open position

#### Pressure Schedule
**Ground**: Cabin at ambient pressure
**Takeoff**: Slight positive pressure
**Climb**: Gradual pressure reduction
**Cruise**: Maintain cabin altitude (typically 6,000-8,000 ft)
**Descent**: Gradual pressure increase
**Landing**: Return to ambient pressure

### Pressure Protection
**Positive Relief**: Two pressure relief valves prevent overpressure
**Negative Relief**: Prevents cabin pressure below ambient
**Maximum Differential**: 8.35 PSI structural limit
**Relief Setting**: 8.6 PSI positive relief valve opening

### Cabin Altitude Monitoring
**Normal Range**: Sea level to 8,000 ft cabin altitude
**Warning**: 10,000 ft cabin altitude warning
**Oxygen Deployment**: 14,000 ft automatic mask deployment
**Emergency**: Rapid descent required above 10,000 ft

## Air Conditioning System

### Air Conditioning Packs
**Quantity**: 2 packs (left and right)
**Function**: Cool and condition hot bleed air
**Capacity**: Each pack can supply entire aircraft if needed
**Location**: Lower fuselage equipment bay

#### Pack Components
**Primary Heat Exchanger**: Initial cooling of bleed air
**Air Cycle Machine**: Turbine-driven cooling cycle
**Secondary Heat Exchanger**: Further air cooling
**Water Separator**: Removes moisture from cooled air
**Reheater**: Final temperature adjustment
**Pack Valve**: Controls bleed air flow to pack

#### Air Cycle Machine Operation
**Compressor**: Increases air pressure and temperature
**Turbines**: Extract energy and cool air through expansion
**Bootstrap Effect**: Compressor driven by turbine
**Cooling Process**: Hot air expanded and cooled

### Temperature Control
**Zone Control**: Separate temperature control for different cabin zones
**Mix Valves**: Blend hot and cold air for temperature control
**Temperature Sensors**: Monitor cabin and duct temperatures
**Automatic Regulation**: Computer-controlled temperature management

#### Temperature Zones
**Flight Deck**: Independent temperature control
**Forward Cabin**: Passenger area forward of wing
**Aft Cabin**: Passenger area aft of wing
**Individual Control**: Each zone independently controllable

### Air Distribution
**Supply Ducts**: Distribute conditioned air throughout cabin
**Return Air**: Recirculation through cabin floor
**Gaspers**: Individual passenger air outlets
**Sidewall Outlets**: General cabin air distribution
**Floor Outlets**: Warm air for passenger comfort

## Emergency and Abnormal Operations

### Engine Bleed Failure
**Single Engine**: Remaining engine supplies both systems
**Cross-Bleed**: Bleed air shared between systems
**APU Backup**: APU bleed air available
**Performance Impact**: May limit altitude or require reduced thrust

### Pack Failure
**Single Pack**: Remaining pack supplies entire aircraft
**High Flow**: Increase pack flow to compensate
**Temperature Limitations**: May limit cabin temperature control
**Altitude Restrictions**: May require lower cruise altitude

### Pressurization Failure
**Slow Leak**: Gradual cabin altitude increase
**Rapid Decompression**: Immediate emergency descent
**Manual Control**: Direct outflow valve control
**Emergency Descent**: Descend to 10,000 ft or MEA

#### Emergency Descent Procedure
**Immediate Actions**: 
- Don oxygen masks
- Declare emergency
- Begin emergency descent
- Establish communication

**Target Altitude**: 10,000 ft or MEA, whichever is higher
**Descent Rate**: Maximum practical descent rate
**Speed**: Do not exceed structural limits

### Air Conditioning Failure
**Pack Failure**: Use remaining pack at high flow
**Temperature Control**: Manual temperature control
**Recirculation**: May need to disable recirculation fans
**Altitude Limitation**: May require descent for passenger comfort

This system ensures safe and comfortable cabin environment throughout all phases of flight.
      `,
      summary: 'The Boeing 737 air systems use engine bleed air to provide pneumatic power, cabin pressurization, and air conditioning. Understanding normal operations and emergency procedures ensures safe flight operations and passenger comfort.'
    });
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