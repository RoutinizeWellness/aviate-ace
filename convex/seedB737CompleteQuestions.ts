import { mutation } from "./_generated/server";

export const seedB737CompleteQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting to seed B737 complete questions system...");
    
    const aircraftGeneralQuestions = [
      {
        question: "La puerta de la cabina de vuelo:",
        options: [
          "Solo puede ser desbloqueada eléctricamente.",
          "Solo puede ser bloqueada con energía A.C.",
          "Solo puede ser bloqueada con una llave."
        ],
        correctAnswer: 0,
        explanation: "La puerta de la cabina solo puede ser desbloqueada eléctricamente como medida de seguridad."
      },
      {
        question: "Los paneles de alivio de presión de la puerta de la cabina:",
        options: [
          "Se abren hacia la cabina.",
          "Se abren hacia la cabina de pasajeros.",
          "Se abren en cualquier dirección para igualación de presión."
        ],
        correctAnswer: 2,
        explanation: "Los paneles de alivio se abren en cualquier dirección para permitir la igualación de presión."
      },
      {
        question: "Para salir de la cabina con la puerta atascada cerrada:",
        options: [
          "Agarrar la manija de salida de emergencia en la parte inferior de la puerta y girar en sentido horario.",
          "Agarrar la manija de salida de emergencia en la parte inferior de la puerta y empujar.",
          "Agarrar la manija de salida de emergencia en la parte superior de la puerta y tirar hacia adelante."
        ],
        correctAnswer: 2,
        explanation: "Para salir con puerta atascada, usar la manija superior y tirar hacia adelante."
      },
      {
        question: "Al girar el 737-800 con winglets en tierra:",
        options: [
          "La geometría del tren de aterrizaje y el ángulo de flecha de las alas resultan en que el arco de cola sea mayor que el arco de punta de ala.",
          "La geometría del tren de aterrizaje y el ángulo de flecha de las alas resultan en que el arco de cola sea menor que el arco de punta de ala.",
          "La geometría del tren de aterrizaje y el ángulo de flecha de las alas resultan en que el arco de cola sea igual al arco de punta de ala."
        ],
        correctAnswer: 0,
        explanation: "Con winglets, el arco de la cola es mayor que el arco de las puntas de ala debido a la geometría del avión."
      },
      {
        question: "Al girar el 737-800 sin winglets en tierra:",
        options: [
          "La geometría del tren de aterrizaje y el ángulo de flecha de las alas resultan en que el arco de cola sea menor que el arco de punta de ala.",
          "La geometría del tren de aterrizaje y el ángulo de flecha de las alas resultan en que el arco de cola sea mayor que el arco de punta de ala.",
          "La geometría del tren de aterrizaje y el ángulo de flecha de las alas resultan en que el arco de cola sea igual al arco de punta de ala."
        ],
        correctAnswer: 1,
        explanation: "Sin winglets, el arco de la cola sigue siendo mayor que el arco de las puntas de ala."
      },
      {
        question: "Al girar un 737-800 con winglets en tierra, el ancho mínimo de pavimento para un giro de 180 grados es:",
        options: [
          "79.1 pies (24.1 metros)",
          "66.4 pies (20.2 metros)",
          "85.9 pies (26.2 metros)"
        ],
        correctAnswer: 2,
        explanation: "Para un giro de 180° con winglets, se requiere un ancho mínimo de pavimento de 85.9 pies (26.2 metros)."
      },
      {
        question: "Los compartimentos de carga están:",
        options: [
          "Presurizados aproximadamente igual a la presión de cabina.",
          "No presurizados.",
          "Presurizados a su presión diferencial normal de 2.0 P.S.I."
        ],
        correctAnswer: 0,
        explanation: "Los compartimentos de carga están presurizados aproximadamente igual a la presión de cabina."
      },
      {
        question: "En caso de pérdida súbita de presurización de la aeronave, el alivio de presión de los compartimentos de carga se logra mediante:",
        options: [
          "Válvulas de alivio de presión configuradas a 7.45 P.S.I.D.",
          "Válvulas de alivio de presión configuradas a 8.65 P.S.I.D.",
          "Paneles de ruptura."
        ],
        correctAnswer: 2,
        explanation: "El alivio de presión de los compartimentos de carga se logra mediante paneles de ruptura."
      },
      {
        question: "El sistema de agua de la aeronave es suministrado por:",
        options: [
          "Dos tanques de agua ubicados a cada lado del compartimento de carga trasero.",
          "Un solo tanque de agua ubicado detrás del compartimento de carga trasero.",
          "Un tanque principal de agua con tanques separados para los baños."
        ],
        correctAnswer: 1,
        explanation: "El sistema de agua es suministrado por un solo tanque ubicado detrás del compartimento de carga trasero."
      },
      {
        question: "La presurización del tanque de agua es suministrada desde:",
        options: [
          "El ducto neumático izquierdo solamente.",
          "El ducto neumático derecho solamente.",
          "La botella de oxígeno de la tripulación."
        ],
        correctAnswer: 0,
        explanation: "La presurización del tanque de agua es suministrada desde el ducto neumático izquierdo solamente."
      },
      {
        question: "La capacidad del tanque de agua (737NG) es:",
        options: [
          "62.1 galones (235 litros)",
          "62.1 galones (235 litros) pero un tubo vertical reduce la capacidad máxima a 60, 50 o 40 galones por opción del cliente",
          "62.1 galones (235 litros) pero un tubo vertical reduce la capacidad máxima a 60 galones (227 litros)"
        ],
        correctAnswer: 2,
        explanation: "La capacidad es de 62.1 galones, pero un tubo vertical la reduce a 60 galones (227 litros)."
      },
      {
        question: "El indicador de cantidad de agua potable está ubicado:",
        options: [
          "En el panel del asistente de vuelo delantero",
          "En el panel del asistente de vuelo trasero",
          "Sobre la puerta de servicio trasera."
        ],
        correctAnswer: 1,
        explanation: "El indicador de cantidad de agua potable está ubicado en el panel del asistente de vuelo trasero."
      },
      {
        question: "Colocar el interruptor de prueba de luces en posición TEST:",
        options: [
          "Inhibe el sistema de recordatorio de precaución maestra.",
          "Ilumina solo las luces de precaución ámbar.",
          "Ilumina toda la iluminación de cabina y luces de advertencia."
        ],
        correctAnswer: 2,
        explanation: "En posición TEST, se ilumina toda la iluminación de cabina y luces de advertencia."
      },
      {
        question: "La falla de un bus principal A.C. causa:",
        options: [
          "Una pérdida parcial de iluminación de cabina y pasajeros.",
          "Que todas las luces de cabina se apaguen.",
          "Ningún efecto en la iluminación de cabina o pasajeros."
        ],
        correctAnswer: 0,
        explanation: "La falla de un bus principal A.C. causa una pérdida parcial de iluminación."
      },
      {
        question: "Cuando están ARMADAS, las luces de salida de emergencia se encenderán automáticamente:",
        options: [
          "Cuando la aeronave alcance un límite preestablecido de fuerza G.",
          "Si falla la energía eléctrica al bus DC 1 o se apaga la energía AC.",
          "Al contacto con agua."
        ],
        correctAnswer: 1,
        explanation: "Las luces de emergencia se activan automáticamente si falla la energía al bus DC 1 o se apaga la AC."
      },
      {
        question: "Los letreros NO SMOKING cuando se seleccionan en AUTO:",
        options: [
          "Se iluminan cuando el tren de aterrizaje está extendido.",
          "Se iluminan cuando los flaps están extendidos y el tren de aterrizaje está retraído.",
          "Se iluminan cuando el tren de aterrizaje está extendido y los flaps están en más de 10 grados."
        ],
        correctAnswer: 2,
        explanation: "En AUTO, los letreros NO SMOKING se iluminan cuando el tren está extendido y flaps >10°."
      },
      {
        question: "Los letreros FASTEN BELTS cuando se seleccionan en AUTO:",
        options: [
          "Se apagan cuando los flaps están extendidos y el tren de aterrizaje está arriba.",
          "Se iluminan cuando el piloto automático no está acoplado.",
          "Se iluminan cuando el tren de aterrizaje o flaps están extendidos."
        ],
        correctAnswer: 2,
        explanation: "En AUTO, los letreros FASTEN BELTS se iluminan cuando el tren o flaps están extendidos."
      },
      {
        question: "Con energía de tierra conectada y el interruptor de batería OFF, las luces de entrada tenues están alimentadas:",
        options: [
          "Solo cuando la energía A.C. está conectada.",
          "Por un suministro eléctrico del bus caliente de batería.",
          "Por las baterías internas de la iluminación de emergencia."
        ],
        correctAnswer: 1,
        explanation: "Las luces de entrada tenues están alimentadas por el bus caliente de batería."
      },
      {
        question: "Las luces y letreros de salida de emergencia están alimentados:",
        options: [
          "Por fuentes de energía de emergencia separadas instaladas en la cabina de pasajeros.",
          "Desde el bus caliente de batería.",
          "Desde el bus de batería."
        ],
        correctAnswer: 1,
        explanation: "Las luces de emergencia están alimentadas desde el bus caliente de batería."
      },
      {
        question: "La iluminación de la brújula magnética de reserva:",
        options: [
          "No puede ser controlada ya que está permanentemente iluminada desde el Bus de Batería.",
          "Es controlada por el control de luz A.F.D.S. del Capitán.",
          "Es controlada por un interruptor separado en la base de la brújula magnética de reserva."
        ],
        correctAnswer: 2,
        explanation: "La iluminación de la brújula de reserva es controlada por un interruptor separado en su base."
      }
    ];

    const airConditioningQuestions = [
      {
        question: "Para usar el APU para aire acondicionado, en tierra/motores apagados, en aeronaves serie 3/4/500, debe seleccionar:",
        options: [
          "Interruptor de Válvula de Aislamiento AUTO, Interruptor de Aire de Sangrado APU ON, Interruptor de Paquete de Aire Acondicionado Izquierdo o Derecho AUTO o HIGH",
          "Interruptor de Válvula de Aislamiento OPEN, Interruptor de Aire de Sangrado APU ON, Interruptores de Paquete de Aire Acondicionado Izquierdo y Derecho AUTO o HIGH",
          "Interruptor de Válvula de Aislamiento CLOSED, Interruptor de Aire de Sangrado APU ON, Interruptor de Paquete de Aire Acondicionado Izquierdo o Derecho AUTO o HIGH"
        ],
        correctAnswer: 0,
        explanation: "Para aire acondicionado con APU: válvula aislamiento AUTO, sangrado APU ON, y paquete izq/der AUTO o HIGH."
      },
      {
        question: "La válvula turbo-fan de una unidad de aire acondicionado se abre:",
        options: [
          "Solo cuando la aeronave está en tierra.",
          "Cuando la aeronave está en tierra o los flaps están extendidos.",
          "Solo cuando la luz RAM DOOR FULL OPEN está iluminada."
        ],
        correctAnswer: 1,
        explanation: "La válvula turbo-fan se abre cuando está en tierra o cuando los flaps están extendidos."
      },
      {
        question: "Si la luz Left DUCT OVERHEAT se ilumina en la aeronave B737-600/700:",
        options: [
          "Las válvulas mezcladoras del compartimento de carga se programarán automáticamente a la posición completamente caliente.",
          "Las válvulas mezcladoras de la cabina de pasajeros se programarán automáticamente a la posición completamente fría.",
          "Las válvulas mezcladoras de la cabina de control se programarán automáticamente a la posición completamente fría."
        ],
        correctAnswer: 2,
        explanation: "Con sobrecalentamiento del ducto izquierdo, las válvulas mezcladoras de cabina de control van a posición fría."
      },
      {
        question: "Si la luz Right PACK TRIP OFF se ilumina:",
        options: [
          "Seleccione una temperatura más cálida en el Selector de Temperatura de cabina de control y presione el interruptor TRIP RESET.",
          "Seleccione una temperatura más cálida en el Selector de Temperatura de cabina de pasajeros y presione el interruptor TRIP RESET.",
          "Presione y mantenga el interruptor TRIP RESET durante 30 segundos solamente."
        ],
        correctAnswer: 1,
        explanation: "Con PACK TRIP OFF derecho: seleccionar temperatura más cálida en cabina pasajeros y TRIP RESET."
      },
      {
        question: "Las luces RAM DOOR FULL OPEN normalmente están iluminadas:",
        options: [
          "Cuando está en tierra, durante vuelo lento con flaps no completamente retraídos o en cualquier momento que el tren de aterrizaje esté retraído.",
          "Solo durante vuelo lento con flaps no completamente retraídos.",
          "Cuando está en tierra o durante vuelo lento con flaps no completamente retraídos."
        ],
        correctAnswer: 2,
        explanation: "Las luces RAM DOOR FULL OPEN se iluminan en tierra o durante vuelo lento con flaps no retraídos."
      },
      {
        question: "Las luces RAM DOOR FULL OPEN normalmente están apagadas:",
        options: [
          "Durante el crucero.",
          "Durante el despegue y ascenso.",
          "Justo antes del aterrizaje."
        ],
        correctAnswer: 0,
        explanation: "Las luces RAM DOOR FULL OPEN están apagadas durante el crucero."
      },
      {
        question: "El compartimento E & E es enfriado por:",
        options: [
          "El sistema de enfriamiento de equipos.",
          "El sistema de aire ram.",
          "Los sistemas de presurización AUTO o STANDBY."
        ],
        correctAnswer: 0,
        explanation: "El compartimento E & E es enfriado por el sistema de enfriamiento de equipos."
      },
      {
        question: "El suministro de aire para el Ventilador de Re-circulación es:",
        options: [
          "Aire de escape de la cabina principal y compartimento de equipos eléctricos y válvula de salida delantera recolectado en una cubierta ubicada sobre el compartimento de carga trasero.",
          "Aire de escape de la cabina principal y compartimento de equipos eléctricos recolectado en una cubierta ubicada sobre el compartimento de carga trasero.",
          "Aire de escape de la cabina principal y compartimento de equipos eléctricos recolectado en una cubierta ubicada sobre el compartimento de carga delantero."
        ],
        correctAnswer: 1,
        explanation: "El ventilador de re-circulación usa aire de escape de cabina principal y compartimento eléctrico."
      },
      {
        question: "La cubierta de aire del Ventilador de Re-circulación está ubicada:",
        options: [
          "Adelante del compartimento E & E.",
          "Sobre el compartimento de carga delantero.",
          "Sobre el compartimento de carga trasero."
        ],
        correctAnswer: 2,
        explanation: "La cubierta del ventilador de re-circulación está sobre el compartimento de carga trasero."
      },
      {
        question: "El Ventilador de Re-circulación opera con el interruptor en posición AUTO excepto:",
        options: [
          "Cuando ambos paquetes están encendidos y uno o ambos interruptores de paquete están seleccionados a HIGH",
          "Cuando un paquete está apagado.",
          "Cuando ambos interruptores de paquete están seleccionados a AUTO."
        ],
        correctAnswer: 0,
        explanation: "El ventilador no opera en AUTO cuando ambos paquetes están ON y uno/ambos en HIGH."
      }
    ];

    const apuQuestions = [
      {
        question: "El APU puede ser operado solo con sangrado APU hasta una altitud máxima de:",
        options: [
          "10,000ft",
          "17,000ft",
          "35,000ft"
        ],
        correctAnswer: 1,
        explanation: "El APU puede operarse solo con sangrado hasta una altitud máxima de 17,000 pies."
      },
      {
        question: "La válvula de sangrado del APU:",
        options: [
          "710 grados C",
          "puede estar abierta durante el arranque del motor, pero evite potencia del motor por encima de ralentí.",
          "725 grados C"
        ],
        correctAnswer: 1,
        explanation: "La válvula de sangrado APU puede estar abierta durante arranque, pero evitar potencia sobre ralentí."
      },
      {
        question: "La luz APU LOW OIL PRESSURE:",
        options: [
          "Está inhibida durante el arranque del APU.",
          "Siempre está iluminada cuando el interruptor APU está en posición OFF.",
          "Está desarmada cuando el interruptor APU está en posición OFF."
        ],
        correctAnswer: 0,
        explanation: "La luz LOW OIL PRESSURE está inhibida durante el arranque del APU."
      },
      {
        question: "En el 737NG, el APU se apagará automáticamente:",
        options: [
          "Cuando el interruptor de batería se coloque OFF en cualquier momento.",
          "Cuando el interruptor de batería se coloque OFF solo en tierra.",
          "Cuando el interruptor de batería se coloque OFF solo en vuelo."
        ],
        correctAnswer: 1,
        explanation: "En 737NG, el APU se apaga automáticamente cuando batería se pone OFF solo en tierra."
      },
      {
        question: "La luz de sobrevelocidad se iluminará cuando una excedencia de RPM del APU cause apagado automático:",
        options: [
          "la luz se apaga después de 5 minutos desde que el interruptor APU se coloca en OFF",
          "la luz no se apaga después de que el interruptor APU se coloca en OFF",
          "la luz se apaga cuando el interruptor APU se coloca en OFF"
        ],
        correctAnswer: 1,
        explanation: "La luz de sobrevelocidad no se apaga después de colocar el interruptor APU en OFF."
      },
      {
        question: "Si el interruptor APU falla en apagar el APU:",
        options: [
          "El interruptor de Reset de Sobrevelocidad APU en el compartimento E & E se ha disparado y debe ser restablecido.",
          "Desconecte el CB de válvula de combustible APU.",
          "Tire hacia arriba el Interruptor de Advertencia de Fuego APU."
        ],
        correctAnswer: 2,
        explanation: "Si el interruptor APU falla en apagar el APU, tire hacia arriba el interruptor de advertencia de fuego APU."
      },
      {
        question: "Si el APU se detiene debido a falta de combustible, el sistema de anunciación Master Caution mostrará:",
        options: [
          "APU solamente.",
          "Solo los servicios que están siendo operados por el APU.",
          "APU y servicios que están siendo operados por el APU."
        ],
        correctAnswer: 2,
        explanation: "Con falta de combustible APU, se muestra APU y los servicios operados por el APU."
      },
      {
        question: "El sistema de advertencia de fuego del APU da advertencias auditivas y visuales:",
        options: [
          "Solo en la cabina de vuelo.",
          "En la cabina de vuelo y el compartimento APU.",
          "En la cabina de vuelo y el compartimento del tren principal."
        ],
        correctAnswer: 0,
        explanation: "Las advertencias de fuego APU se dan solo en la cabina de vuelo."
      },
      {
        question: "Durante un arranque normal del APU:",
        options: [
          "El motor de arranque se acopla tan pronto como el interruptor maestro se libera de START a ON.",
          "La luz ámbar LOW OIL PRESSURE está iluminada hasta que la presión de aceite APU es normal (aprox. 35% RPM).",
          "La luz azul APU GEN OFF BUS se apaga a 95% RPM."
        ],
        correctAnswer: 1,
        explanation: "Durante arranque normal, la luz LOW OIL PRESSURE está iluminada hasta presión normal (~35% RPM)."
      },
      {
        question: "El calentador de combustible del APU:",
        options: [
          "Es operado automáticamente y usa aire de sangrado del compresor APU.",
          "Usa calor suministrado directamente del enfriador de aceite APU.",
          "Es operado automáticamente y usa aire de sangrado de 5ta etapa del Motor No. 2."
        ],
        correctAnswer: 0,
        explanation: "El calentador de combustible APU es automático y usa aire de sangrado del compresor APU."
      }
    ];

    const automaticFlightQuestions = [
      {
        question: "La luz STAB OUT OF TRIM opera:",
        options: [
          "Solo cuando el piloto automático está acoplado.",
          "Solo cuando el sistema de compensación de velocidad está activado.",
          "En cualquier momento."
        ],
        correctAnswer: 2,
        explanation: "La luz STAB OUT OF TRIM opera en cualquier momento para indicar condición de compensación."
      },
      {
        question: "Si la luz de desacople del piloto automático está parpadeando en ámbar, esto indica que:",
        options: [
          "El interruptor de prueba de luces se mantiene en posición 2.",
          "El piloto automático ha revertido a CWS pitch o roll mientras está en CMD.",
          "El piloto automático ha revertido a CMD pitch o roll mientras está en CWS."
        ],
        correctAnswer: 1,
        explanation: "Luz parpadeando ámbar indica que A/P ha revertido a CWS pitch o roll desde CMD."
      },
      {
        question: "Si la luz de desacople del autothrottle está parpadeando en ámbar, esto indica:",
        options: [
          "Un error de velocidad del autothrottle si la velocidad no se mantiene dentro de +10 o -5 nudos de la velocidad comandada cuando está en vuelo, flaps no arriba y autothrottle acoplado en modo MCP SPD o FMC SPD.",
          "El interruptor de prueba de luces se mantiene en posición 2.",
          "Un error de velocidad del autothrottle si la velocidad no se mantiene dentro de +15 o -15 nudos de la velocidad comandada cuando está en vuelo, flaps arriba y autothrottle acoplado en modo MCP SPD o FMC SPD."
        ],
        correctAnswer: 0,
        explanation: "Luz A/T parpadeando indica error de velocidad fuera de +10/-5 nudos en vuelo con flaps no arriba."
      },
      {
        question: "El modo VNAV se termina por:",
        options: [
          "Seleccionar un modo de pitch diferente o captura de Glideslope o Extender los flaps más allá de 15 grados.",
          "Seleccionar un modo de pitch diferente o captura de Glideslope o Deseleccionar LNAV o Extender los flaps más allá de 25 grados.",
          "Seleccionar un modo de pitch diferente o captura de Localizer o Extender los flaps más allá de 5 grados."
        ],
        correctAnswer: 0,
        explanation: "VNAV se termina por: modo pitch diferente, captura GS, o flaps >15°."
      },
      {
        question: "Si durante un ascenso con piloto automático acoplado, se presiona el interruptor ALT HOLD, la aeronave:",
        options: [
          "Detendrá el ascenso y se nivelará.",
          "Continuará el ascenso al siguiente nivel de 1000 pies y se nivelará.",
          "Continuará el ascenso a la altitud preseleccionada seleccionada, ya que el modo de adquisición de altitud ahora está armado."
        ],
        correctAnswer: 0,
        explanation: "Con ALT HOLD presionado durante ascenso, la aeronave detendrá el ascenso y se nivelará."
      }
    ];

    const communicationsQuestions = [
      {
        question: "Con el interruptor Boom/Mask en posición MASK, la transmisión de un mensaje es posible:",
        options: [
          "Usando solo la máscara de oxígeno.",
          "Usando la máscara de oxígeno y auriculares solamente.",
          "Usando la máscara de oxígeno o micrófono de mano solamente."
        ],
        correctAnswer: 2,
        explanation: "En posición MASK, se puede transmitir usando máscara de oxígeno o micrófono de mano."
      },
      {
        question: "El interruptor transmisor VHF-1 en un panel selector de audio está iluminado:",
        options: [
          "El interruptor ALT/NORM debe estar en NORM para obtener recepción a un nivel de volumen cómodo.",
          "La recepción en VHF-1 se proporciona automáticamente.",
          "La recepción se logra tirando y girando el interruptor receptor VHF-1."
        ],
        correctAnswer: 1,
        explanation: "Cuando el transmisor VHF-1 está iluminado, la recepción se proporciona automáticamente."
      },
      {
        question: "El interruptor de Interfono de Servicio en el panel superior trasero cuando se selecciona ON:",
        options: [
          "Permite comunicaciones entre la cabina de vuelo y los asistentes de vuelo cuando se usa el sistema de Interfono de Vuelo.",
          "Desactiva los enchufes externos del sistema de Interfono de Servicio.",
          "Agrega enchufes externos al sistema de Interfono de Servicio."
        ],
        correctAnswer: 2,
        explanation: "El interruptor Service Interphone ON agrega enchufes externos al sistema."
      }
    ];

    const electricsQuestions = [
      {
        question: "La luz STANDBY PWR OFF (ámbar) iluminada significa que uno o más de los siguientes no tienen energía:",
        options: [
          "Bus AC de reserva",
          "Bus de Batería, bus AC de reserva, bus DC de reserva",
          "Bus AC de reserva, bus DC de reserva"
        ],
        correctAnswer: 2,
        explanation: "La luz STANDBY PWR OFF indica que el bus AC de reserva y/o bus DC de reserva no tienen energía."
      },
      {
        question: "El interruptor de Desconexión de Transmisión del Generador cuando se opera:",
        options: [
          "Desconecta la Transmisión del Generador del motor en caso de mal funcionamiento de la Transmisión del Generador.",
          "Desconecta la Transmisión del Generador del generador en caso de mal funcionamiento de la Transmisión del Generador.",
          "Desconecta la Transmisión del Generador del motor en caso de mal funcionamiento de la Transmisión del Generador, solo si el motor se ha apagado primero."
        ],
        correctAnswer: 0,
        explanation: "El interruptor de desconexión desconecta la transmisión del generador del motor en caso de falla."
      },
      {
        question: "El reacoplamiento del eje de transmisión de la Transmisión del Generador al motor puede realizarse:",
        options: [
          "En cualquier momento en vuelo siempre que el Interruptor del Generador y el Relé de Control del Generador hayan sido previamente disparados.",
          "En cualquier momento en tierra o en vuelo.",
          "Solo en tierra."
        ],
        correctAnswer: 2,
        explanation: "El reacoplamiento de la transmisión del generador solo puede realizarse en tierra."
      }
    ];

    const fireProtectionQuestions = [
      {
        question: "El sistema de Protección contra Sobrecalentamiento y Fuego del Motor tiene:",
        options: [
          "Dos bucles de detección de sobrecalentamiento/fuego, cada uno consistiendo en cuatro elementos detectores, instalados en cada nacela del motor.",
          "Cuatro bucles de detección de sobrecalentamiento/fuego de elemento único instalados en cada nacela del motor.",
          "Dos bucles de detección de sobrecalentamiento/fuego de elemento dual instalados en cada nacela del motor."
        ],
        correctAnswer: 2,
        explanation: "El sistema tiene dos bucles de detección de elemento dual en cada nacela del motor."
      },
      {
        question: "Se dará una alerta de sobrecalentamiento o fuego con el interruptor OVHT DET en NORMAL y ambos bucles en servicio cuando:",
        options: [
          "Cualquiera o ambos elementos de un detector señalen una condición de sobrecalentamiento o fuego.",
          "Un elemento detector del bucle A y un elemento detector del bucle B detecten fuego o sobrecalentamiento.",
          "Cualquier elemento de un detector señale una condición de sobrecalentamiento o fuego."
        ],
        correctAnswer: 0,
        explanation: "La alerta se da cuando cualquiera o ambos elementos de un detector señalan sobrecalentamiento o fuego."
      }
    ];

    const flightControlsQuestions = [
      {
        question: "Una de las condiciones para que opere el sistema de compensación de velocidad del 737NG es:",
        options: [
          "Al menos 10 segundos después del despegue.",
          "Piloto automático acoplado.",
          "Los flaps no están arriba."
        ],
        correctAnswer: 0,
        explanation: "El sistema de compensación de velocidad requiere al menos 10 segundos después del despegue."
      },
      {
        question: "La iluminación de la luz Speed Trim Fail (el recordatorio de Precaución Maestra no está activado):",
        options: [
          "Indica falla de ambos canales FCC.",
          "Indica falla de la computadora de sensación del elevador.",
          "Indica falla de un solo canal FCC."
        ],
        correctAnswer: 2,
        explanation: "Speed Trim Fail sin Master Caution indica falla de un solo canal FCC."
      }
    ];

    const flightInstrumentsQuestions = [
      {
        question: "737CL: El Control de Cursor de Velocidad en el Indicador de Mach/Velocidad del Capitán debe ser empujado para permitir:",
        options: [
          "Que el cursor de velocidad sea posicionado manualmente.",
          "Que el cursor de velocidad sea posicionado automáticamente por el FCC del AFDS.",
          "Que el puntero Vmo sea posicionado automáticamente por el FCC del AFDS."
        ],
        correctAnswer: 0,
        explanation: "El control debe ser empujado para permitir posicionamiento manual del cursor de velocidad."
      },
      {
        question: "La bandera Vmo en los indicadores de Mach/Velocidad:",
        options: [
          "Indica que el puntero Vmo está inoperativo.",
          "Indica que la velocidad Vmo está siendo excedida.",
          "Indica que el puntero Vmo está operativo."
        ],
        correctAnswer: 0,
        explanation: "La bandera Vmo indica que el puntero Vmo está inoperativo."
      }
    ];

    const fuelQuestions = [
      {
        question: "La temperatura mínima de combustible antes del despegue y en vuelo para el 737NG/MAX es:",
        options: [
          "- 43°C, o 3°C por encima de la temperatura de congelación del combustible, la que sea mayor.",
          "- 49°C, o 3°C por encima de la temperatura de congelación del combustible, la que sea mayor.",
          "- 45°C, o 3°C por encima de la temperatura de congelación del combustible, la que sea mayor."
        ],
        correctAnswer: 0,
        explanation: "La temperatura mínima de combustible es -43°C o 3°C sobre punto de congelación."
      },
      {
        question: "Un sistema de cierre se usa durante el reabastecimiento para:",
        options: [
          "Cerrar automáticamente la válvula de combustible en cada tanque cuando el tanque está lleno.",
          "Cerrar automáticamente la Válvula Manual de Vaciado cuando los tanques de ala están llenos.",
          "Prevenir presiones de reabastecimiento superiores a 50 psi."
        ],
        correctAnswer: 0,
        explanation: "El sistema de cierre cierra automáticamente la válvula de combustible cuando el tanque está lleno."
      }
    ];

    const hydraulicsQuestions = [
      {
        question: "La pérdida completa de presión del sistema 'B' desactivará:",
        options: [
          "Los spoilers de vuelo exteriores.",
          "Los spoilers de vuelo interiores.",
          "Los spoilers de tierra."
        ],
        correctAnswer: 0,
        explanation: "La pérdida del sistema B desactiva los spoilers de vuelo exteriores."
      },
      {
        question: "Si se enciende una luz OVERHEAT de bomba hidráulica eléctrica:",
        options: [
          "La bomba se apagará automáticamente y la LUZ OVERHEAT se apagará.",
          "Apague las bombas hidráulicas eléctricas y del motor del sistema asociado.",
          "Apague la bomba hidráulica eléctrica del sistema asociado."
        ],
        correctAnswer: 2,
        explanation: "Con luz OVERHEAT de bomba eléctrica, apague la bomba hidráulica eléctrica asociada."
      }
    ];

    const iceRainProtectionQuestions = [
      {
        question: "Si el panel interior de la ventana No 1 se agrieta y comienza el arco eléctrico:",
        options: [
          "No son necesarios ajustes de presurización.",
          "La presión diferencial máxima de cabina debe reducirse a 5 PSID.",
          "Iniciar procedimiento para descenso de emergencia."
        ],
        correctAnswer: 2,
        explanation: "Si el panel interior se agrieta con arco eléctrico, iniciar descenso de emergencia."
      },
      {
        question: "La entrada de calefacción de la ventana derecha No.2 es controlada por:",
        options: [
          "El sistema de control de calefacción de ventana izquierda No.1.",
          "El sistema de control de calefacción de ventana lateral derecha.",
          "El sistema de control de calefacción de ventana derecha No.1."
        ],
        correctAnswer: 2,
        explanation: "La ventana derecha No.2 es controlada por el sistema de ventana derecha No.1."
      }
    ];

    const landingGearQuestions = [
      {
        question: "El sistema antideslizante alternativo tiene:",
        options: [
          "Cuatro válvulas antideslizantes.",
          "Dos válvulas antideslizantes.",
          "Una válvula medidora de freno alternativa conectada a todas las válvulas antideslizantes alternativas."
        ],
        correctAnswer: 1,
        explanation: "El sistema antideslizante alternativo tiene dos válvulas antideslizantes."
      },
      {
        question: "La válvula de aislamiento del acumulador es cerrada por:",
        options: [
          "Presión del acumulador de frenos cuando se pierde el sistema B.",
          "Presión del sistema B cuando se pierde la presión del sistema A.",
          "Presión del sistema A cuando se pierde la presión del sistema B."
        ],
        correctAnswer: 2,
        explanation: "La válvula de aislamiento del acumulador es cerrada por presión del sistema A cuando se pierde sistema B."
      }
    ];

    const navigationQuestions = [
      {
        question: "El No 1. VHF NAV está en sintonización ágil. Las indicaciones DME-1 en cada RDMI:",
        options: [
          "Mostrarán la distancia DME a cada DME sintonizado.",
          "Mostrarán 4 guiones.",
          "Mostrarán una bandera de advertencia."
        ],
        correctAnswer: 1,
        explanation: "Con VHF NAV en sintonización ágil, las indicaciones DME-1 mostrarán 4 guiones."
      },
      {
        question: "Antes de seleccionar la facilidad de prueba ILS:",
        options: [
          "Seleccione una frecuencia ILS en el panel de control VHF NAV asociado.",
          "Seleccione una frecuencia ILS en ambos paneles de control VHF NAV.",
          "Seleccione una frecuencia ILS o VOR en el panel de control VHF NAV asociado."
        ],
        correctAnswer: 0,
        explanation: "Antes de la prueba ILS, seleccione frecuencia ILS en el panel VHF NAV asociado."
      }
    ];

    const pneumaticsQuestions = [
      {
        question: "El aire de sangrado APU usado para arrancar el motor NO.1:",
        options: [
          "Es dirigido vía la válvula de aire de sangrado del motor No. 1 a la válvula del motor de arranque No.1.",
          "Es dirigido directamente a la válvula del motor de arranque No.1.",
          "Es controlado por la válvula moduladora y de cierre."
        ],
        correctAnswer: 1,
        explanation: "El aire de sangrado APU va directamente a la válvula del motor de arranque No.1."
      },
      {
        question: "La cantidad de aire de ventilador que se canaliza a través del pre-enfriador es controlada por:",
        options: [
          "El controlador de aire ram",
          "La válvula moduladora y de cierre.",
          "La válvula termostática del pre-enfriador."
        ],
        correctAnswer: 2,
        explanation: "La cantidad de aire de ventilador al pre-enfriador es controlada por la válvula termostática."
      }
    ];

    const warningSystemsQuestions = [
      {
        question: "NGs solamente: Con flap 15 seleccionado y tren de aterrizaje UP, la bocina de advertencia del tren de aterrizaje no puede ser silenciada con el interruptor HORN CUTOUT si:",
        options: [
          "Ambas palancas de empuje están por debajo de aprox 30 grados",
          "Cualquier palanca de empuje está por debajo de 20 grados o un motor no está funcionando y la otra palanca está a menos de 34 grados.",
          "Cualquier palanca de empuje está por debajo de 10 grados o un motor no está funcionando y la otra palanca está a menos de 30 grados."
        ],
        correctAnswer: 2,
        explanation: "Con flap 15 y gear UP, bocina no se silencia si thrust <10° o motor parado y otro <30°."
      },
      {
        question: "Clásicos: La advertencia de configuración de despegue está armada cuando en tierra y cualquiera o ambas palancas de empuje delanteras están avanzadas para despegue. La bocina de advertencia de despegue suena cuando:",
        options: [
          "El trim del estabilizador NO está en el rango de banda verde, o los flaps de borde de fuga NO están en el rango de despegue Flaps 1 a 15, o el Freno de Estacionamiento NO está puesto.",
          "El trim del estabilizador NO está en el rango de banda verde, o los flaps de borde de fuga NO están en el rango de despegue Flaps 1 a 15, o los FLAPS de borde de ataque NO están en la posición correcta para despegue o el speed brake NO está en posición DOWN o el Freno de Estacionamiento está puesto.",
          "El trim del estabilizador está en el rango de banda verde, o los flaps de borde de fuga están en el rango de despegue Flaps 1 a 15, o los SLATS de borde de ataque no están en la posición correcta para despegue o el speed brake NO está en posición DOWN o el Freno de Estacionamiento está puesto."
        ],
        correctAnswer: 1,
        explanation: "La bocina de despegue suena por: trim fuera de verde, flaps incorrectos, LE flaps mal, speed brake no DOWN, o parking brake puesto."
      }
    ];

    // Combine all questions
    const allQuestions = [
      ...aircraftGeneralQuestions.map(q => ({...q, category: "AIRCRAFT GENERAL"})),
      ...airConditioningQuestions.map(q => ({...q, category: "AIR CONDITIONING"})),
      ...apuQuestions.map(q => ({...q, category: "AUXILIARY POWER UNIT"})),
      ...automaticFlightQuestions.map(q => ({...q, category: "AUTOMATIC FLIGHT"})),
      ...communicationsQuestions.map(q => ({...q, category: "COMMUNICATIONS"})),
      ...electricsQuestions.map(q => ({...q, category: "ELECTRICS"})),
      ...fireProtectionQuestions.map(q => ({...q, category: "FIRE PROTECTION"})),
      ...flightControlsQuestions.map(q => ({...q, category: "FLIGHT CONTROLS"})),
      ...flightInstrumentsQuestions.map(q => ({...q, category: "FLIGHT INSTRUMENTS"})),
      ...fuelQuestions.map(q => ({...q, category: "FUEL"})),
      ...hydraulicsQuestions.map(q => ({...q, category: "HYDRAULICS"})),
      ...iceRainProtectionQuestions.map(q => ({...q, category: "ICE AND RAIN PROTECTION"})),
      ...landingGearQuestions.map(q => ({...q, category: "LANDING GEAR"})),
      ...navigationQuestions.map(q => ({...q, category: "NAVIGATION"})),
      ...pneumaticsQuestions.map(q => ({...q, category: "PNEUMATICS"})),
      ...warningSystemsQuestions.map(q => ({...q, category: "WARNING SYSTEMS"}))
    ];

    // Insert all questions into the database
    const insertedQuestionIds: any[] = [];
    
    for (const questionData of allQuestions) {
      const questionId = await ctx.db.insert("examQuestions", {
        question: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
        aircraftType: "B737_FAMILY",
        category: questionData.category,
        difficulty: "intermediate",
        isActive: true,
        createdAt: Date.now(),
        reference: "B737 FCOM - " + questionData.category,
      });
      
      insertedQuestionIds.push(questionId);
    }

    // Create exam modes for these questions
    const examModes = [
      {
        title: "B737 Comprehensive Training - Practice Mode",
        description: "Practice questions for B737 systems with unlimited time",
        category: "Practice Mode",
        timeLimit: 0,
        passingScore: 70
      },
      {
        title: "B737 Comprehensive Training - Timed Exam Mode", 
        description: "Timed examination of B737 knowledge across all systems",
        category: "Timed Exam Mode",
        timeLimit: 120,
        passingScore: 80
      },
      {
        title: "B737 Comprehensive Training - Review Mode",
        description: "Review previously missed questions on B737 systems",
        category: "Review Mode",
        timeLimit: 0,
        passingScore: 75
      },
      {
        title: "B737 Type Rating - Complete Systems",
        description: "Type rating examination covering all B737 systems for habilitación B737",
        category: "Examen de Habilitación B737",
        timeLimit: 150,
        passingScore: 85
      }
    ];

    const createdExams: any[] = [];
    for (const examMode of examModes) {
      const examId = await ctx.db.insert("exams", {
        title: examMode.title,
        description: examMode.description,
        aircraftType: "B737_FAMILY",
        category: examMode.category,
        difficulty: "intermediate",
        timeLimit: examMode.timeLimit,
        passingScore: examMode.passingScore,
        questionsCount: Math.min(allQuestions.length, 50),
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      createdExams.push({ examId, mode: examMode.category });
    }

    // Create course modules for comprehensive training
    const courseModules = [
      {
        title: "B737 Systems Overview",
        description: "Comprehensive overview of all B737 aircraft systems",
        category: "Systems Training",
        questionsCount: Math.min(allQuestions.length, 100)
      },
      {
        title: "B737 Flight Operations",
        description: "Flight operations procedures and systems integration",
        category: "Flight Operations",
        questionsCount: Math.min(allQuestions.length, 75)
      },
      {
        title: "B737 Emergency Procedures",
        description: "Emergency and abnormal procedures training",
        category: "Emergency Procedures",
        questionsCount: Math.min(allQuestions.length, 60)
      },
      {
        title: "B737 Performance and Limitations",
        description: "Aircraft performance and operational limitations",
        category: "Performance",
        questionsCount: Math.min(allQuestions.length, 40)
      },
      {
        title: "B737 Type Rating Preparation",
        description: "Complete preparation for B737 type rating examination",
        category: "Type Rating Prep",
        questionsCount: Math.min(allQuestions.length, 120)
      }
    ];

    const createdCourseModules: any[] = [];
    for (const courseModule of courseModules) {
      const courseId = await ctx.db.insert("exams", {
        title: courseModule.title,
        description: courseModule.description,
        aircraftType: "B737_FAMILY",
        category: courseModule.category,
        difficulty: "intermediate",
        timeLimit: 0,
        passingScore: 80,
        questionsCount: courseModule.questionsCount,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      createdCourseModules.push({ courseId, module: courseModule.category });
    }

    console.log(`Successfully seeded ${allQuestions.length} B737 questions across ${Object.keys({aircraftGeneralQuestions, airConditioningQuestions, apuQuestions, automaticFlightQuestions, communicationsQuestions, electricsQuestions, fireProtectionQuestions, flightControlsQuestions, flightInstrumentsQuestions, fuelQuestions, hydraulicsQuestions, iceRainProtectionQuestions, landingGearQuestions, navigationQuestions, pneumaticsQuestions, warningSystemsQuestions}).length} categories`);
    console.log(`Created ${createdExams.length} exam modes`);
    console.log(`Created ${createdCourseModules.length} course modules`);

    return {
      success: true,
      message: `Successfully added ${allQuestions.length} B737 questions across all systems to all exam modes`,
      questionsAdded: insertedQuestionIds.length,
      categoriesAdded: [
        "AIRCRAFT GENERAL", "AIR CONDITIONING", "AUXILIARY POWER UNIT", "AUTOMATIC FLIGHT",
        "COMMUNICATIONS", "ELECTRICS", "FIRE PROTECTION", "FLIGHT CONTROLS", 
        "FLIGHT INSTRUMENTS", "FUEL", "HYDRAULICS", "ICE AND RAIN PROTECTION",
        "LANDING GEAR", "NAVIGATION", "PNEUMATICS", "WARNING SYSTEMS"
      ],
      examModesCreated: createdExams.length,
      courseModulesCreated: createdCourseModules.length,
      examModes: createdExams.map(e => e.mode),
      courseModules: createdCourseModules.map(c => c.module),
      integration: {
        practiceMode: "✅ Added to Practice Mode (unlimited time)",
        timedExam: "✅ Added to Timed Exam Mode (120 minutes)",
        reviewMode: "✅ Added to Review Mode (for incorrect answers)",
        typeRating: "✅ Added to B737 Type Rating Exam (habilitación B737)",
        courseModules: "✅ Created 5 comprehensive course modules"
      }
    };
  },
});