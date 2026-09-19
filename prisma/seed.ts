import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando semillero de datos para Maderas La Choca ERP/CRM...");

  // 1. Limpieza de datos existentes
  await prisma.stockMovement.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.workOrderMaterial.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.woodSpecies.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // 2. Usuarios del Sistema (Cuentas Base Oficiales)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Administrador General",
        email: "admin@maderaslachoca.com",
        phone: "993 123 4567",
        role: "ADMIN",
        status: "ACTIVO",
      },
    }),
    prisma.user.create({
      data: {
        name: "Asesor Comercial & Cubicaje",
        email: "ventas@maderaslachoca.com",
        phone: "993 234 5678",
        role: "VENTAS",
        status: "ACTIVO",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jefe de Producción & Taller",
        email: "taller@maderaslachoca.com",
        phone: "993 345 6789",
        role: "TALLER",
        status: "ACTIVO",
      },
    }),
    prisma.user.create({
      data: {
        name: "Encargado de Patio & Almacén",
        email: "almacen@maderaslachoca.com",
        phone: "993 456 7890",
        role: "ALMACEN",
        status: "ACTIVO",
      },
    }),
  ]);

  console.log(`✓ ${users.length} usuarios base creados.`);

  // 3. Catálogo de Especies de Madera de Tabasco y Comerciales
  const speciesData = [
    {
      commonName: "Pino",
      scientificName: "Pinus caribaea / oocarpa",
      category: "COMERCIAL_BLANDA",
      densityKgM3: 540,
      basePricePerPt: 48.0,
      description: "Pino estufado y tratado, versátil para embalajes, tarimas, cimbra y carpintería en general.",
      commonUses: "Tarimas, cajas industriales, cimbra, estructuras ligeras",
    },
    {
      commonName: "Teca",
      scientificName: "Tectona grandis",
      category: "PRECIOSA",
      densityKgM3: 670,
      basePricePerPt: 95.0,
      description: "Madera preciosa cultivada con alta resistencia natural al agua, humedad e insectos. Excelente estabilidad.",
      commonUses: "Mobiliario exterior, cuñas para intemperie, duelas marinas, acabados premium",
    },
    {
      commonName: "Mango",
      scientificName: "Mangifera indica",
      category: "COMERCIAL_BLANDA",
      densityKgM3: 580,
      basePricePerPt: 42.0,
      description: "Madera sustentable de plantaciones de Tabasco, veta atractiva y excelente maquinabilidad.",
      commonUses: "Cajas ligeras, artesanías, tableros decorativos, muebles rústicos",
    },
    {
      commonName: "Maculis",
      scientificName: "Tabebuia rosea",
      category: "DURA_TROPICAL",
      densityKgM3: 720,
      basePricePerPt: 88.0,
      description: "Madera emblemática de Tabasco (Rosa Morada), resistente, veta dorada y gran belleza estética.",
      commonUses: "Carrocerías, duelas, pisos de remolques, ebanistería, vigas expuestas",
    },
    {
      commonName: "Jahua",
      scientificName: "Guazuma ulmifolia",
      category: "DURA_TROPICAL",
      densityKgM3: 650,
      basePricePerPt: 45.0,
      description: "Madera local de Tabasco, resistente al impacto y de fácil clavado.",
      commonUses: "Estacas topográficas, costillajes, cajones de uso rudo",
    },
    {
      commonName: "Parota",
      scientificName: "Enterolobium cyclocarpum",
      category: "PRECIOSA",
      densityKgM3: 520,
      basePricePerPt: 92.0,
      description: "Guanacaste tradicional. Veta espectacular, resistente a plagas y liviana para su rigidez.",
      commonUses: "Mesas de una sola pieza, cubiertas industriales, tarimas petroleras pesadas",
    },
    {
      commonName: "Amargoso",
      scientificName: "Vatairea lundellii",
      category: "DURA_TROPICAL",
      densityKgM3: 850,
      basePricePerPt: 85.0,
      description: "Madera sumamente pesada y tenaz de la selva tabasqueña, inmune al comején y pudrición.",
      commonUses: "Pisos de Low-Boys, plataformas de transporte pesado, durmientes",
    },
    {
      commonName: "Caracolillo",
      scientificName: "Pithecellobium dulce",
      category: "DURA_TROPICAL",
      densityKgM3: 780,
      basePricePerPt: 78.0,
      description: "Madera dura con alta resistencia a la fricción y al desgaste mecánico severo.",
      commonUses: "Chock-blocks para tractocamión, cuñas petroleras, defensas para muelles",
    },
    {
      commonName: "Macayo",
      scientificName: "Andira galeottiana",
      category: "DURA_TROPICAL",
      densityKgM3: 880,
      basePricePerPt: 89.0,
      description: "Madera pesada de grano entrelazado, durabilidad extrema bajo agua y tierra.",
      commonUses: "Carrocerías ganaderas, redilas de trabajo pesado, pilotes y vigas",
    },
    {
      commonName: "Cachimbo",
      scientificName: "Platymiscium yucatanum",
      category: "DURA_TROPICAL",
      densityKgM3: 830,
      basePricePerPt: 82.0,
      description: "Excelente acabado y resistencia a la intemperie tropical extrema.",
      commonUses: "Pizarras para motor, patines de bombeo, piezas de alta fricción",
    },
    {
      commonName: "Coco",
      scientificName: "Cocos nucifera",
      category: "PALMA_ESPECIAL",
      densityKgM3: 690,
      basePricePerPt: 40.0,
      description: "Tronco de palma de coco procesado en aserradero local de Paraíso y Frontera.",
      commonUses: "Estructuras rústicas, duelas de cabaña, postes decorativos",
    },
    {
      commonName: "Mangle Prieto",
      scientificName: "Avicennia germinans",
      category: "REGULADA",
      densityKgM3: 920,
      basePricePerPt: 75.0,
      description: "Madera de manejo forestal sustentable regulado por SEMARNAT. Imputrescible en fango y agua.",
      commonUses: "Postes de contención, cercados perimetrales duraderos, muelles",
    },
    {
      commonName: "Mangle Blanco",
      scientificName: "Laguncularia racemosa",
      category: "REGULADA",
      densityKgM3: 820,
      basePricePerPt: 70.0,
      description: "Postes y puntales con registro de procedencia legal forestal.",
      commonUses: "Puntales para construcción, estacados de ríos y lagunas",
    },
    {
      commonName: "Mangle Rojo",
      scientificName: "Rhizophora mangle",
      category: "REGULADA",
      densityKgM3: 960,
      basePricePerPt: 80.0,
      description: "Alta concentración de taninos que evita totalmente la pudrición fúngica.",
      commonUses: "Obras portuarias, amarres náuticos, pilotes sumergidos",
    },
    {
      commonName: "Postes y Puntales",
      scientificName: "Eucalyptus / Pinus tratados",
      category: "COMERCIAL_BLANDA",
      densityKgM3: 600,
      basePricePerPt: 35.0,
      description: "Postes rollizos y puntales cilíndricos para cimbra en obra civil y cercas ganaderas.",
      commonUses: "Cimbra de puentes, cercados de ranchos ganaderos, puntales",
    },
  ];

  const speciesMap = new Map();
  for (const s of speciesData) {
    const created = await prisma.woodSpecies.create({ data: s });
    speciesMap.set(s.commonName, created);
  }
  console.log(`✓ ${speciesMap.size} especies de madera registradas.`);

  // 4. Clientes Locales y Regionales
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        businessName: "Transportes y Grúas del Sureste S.A. de C.V.",
        commercialName: "Grúas Sureste",
        rfc: "TGS150320KL9",
        phone: "993 310 9800",
        whatsapp: "529933109800",
        email: "operaciones@gruassureste.com",
        contactPerson: "Ing. Mauricio Landero",
        deliveryAddress: "Av. Periférico Carlos Pellicer Cámara 1240, Tamulté, Villahermosa, Tabasco",
        freightZone: "LOCAL_VILLAHERMOSA",
        notes: "Cliente recurrente de cambio de pisos de madera dura para Low-Boys de 50 y 80 toneladas.",
      },
    }),
    prisma.customer.create({
      data: {
        businessName: "Perforadora Petrolera del Golfo S.A. de C.V.",
        commercialName: "PPG Servicios Petroleros",
        rfc: "PPG180905M72",
        phone: "933 112 4455",
        whatsapp: "529331124455",
        email: "logistica@ppgservicios.com",
        contactPerson: "Lic. Arantza Solís",
        deliveryAddress: "Parque Industrial Dos Bocas, Manzana 4 Lote 2, Paraíso, Tabasco",
        freightZone: "MUNICIPIO_TABASCO",
        notes: "Requieren empaque con certificación NOM-144-SEMARNAT-2017 (Tratamiento Térmico HT) para exportación a plataformas.",
      },
    }),
    prisma.customer.create({
      data: {
        businessName: "Constructora Tabasqueña Olmeca S.A. de C.V.",
        commercialName: "Olmeca Construcciones",
        rfc: "CTO1104184J1",
        phone: "937 372 9010",
        whatsapp: "529373729010",
        email: "compras@olmecaconstruye.mx",
        contactPerson: "Arq. Gerardo Leyva",
        deliveryAddress: "Carretera Cárdenas - Huimanguillo Km 2.5, Cárdenas, Tabasco",
        freightZone: "MUNICIPIO_TABASCO",
        notes: "Consumo de estacas de topografía, trompos y puntales para obras del tren y refinería.",
      },
    }),
    prisma.customer.create({
      data: {
        businessName: "Agroindustrias y Empacadoras de Teapa S.P.R.",
        commercialName: "Platanera del Grijalva",
        rfc: "AET140228HN3",
        phone: "932 322 1500",
        whatsapp: "529323221500",
        email: "almacen@plataneragrijalva.com",
        contactPerson: "Don Efraín Quintero",
        deliveryAddress: "Rancho San Manuel s/n, Teapa, Tabasco",
        freightZone: "MUNICIPIO_TABASCO",
        notes: "Tarimas reforzadas para 1.5 toneladas de carga y viruta para control de humedad.",
      },
    }),
    prisma.customer.create({
      data: {
        businessName: "Logística y Fletes Peninsulares del Sureste S.A. de C.V.",
        commercialName: "Fletes Peninsulares",
        rfc: "LFP191112TX5",
        phone: "981 811 7733",
        whatsapp: "529818117733",
        email: "mantenimiento@fletespeninsulares.com",
        contactPerson: "Sr. Héctor Ceballos",
        deliveryAddress: "Av. Héroe de Nacozari 450, San Francisco de Campeche, Camp.",
        freightZone: "FORANEO",
        notes: "Reparación de redilas y cajas secas completas en maderas tropicales.",
      },
    }),
  ]);

  console.log(`✓ ${customers.length} clientes creados.`);

  // 5. Leads para el Kanban de CRM
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        title: "50 Tarimas Industriales de Parota Grado Pesado (Carga 2.5 Ton)",
        customerId: customers[1].id,
        contactName: "Lic. Arantza Solís",
        phone: "933 112 4455",
        email: "logistica@ppgservicios.com",
        estimatedValue: 145000,
        stage: "EN_NEGOCIACION",
        priority: "ALTA",
        notes: "Cotización enviada con sello NOM-144. Esperando orden de compra corporativa.",
      },
    }),
    prisma.lead.create({
      data: {
        title: "Rehabilitación de piso para Low-Boy de 40 pies con Amargoso",
        customerId: customers[0].id,
        contactName: "Ing. Mauricio Landero",
        phone: "993 310 9800",
        email: "operaciones@gruassureste.com",
        estimatedValue: 88500,
        stage: "COTIZADO",
        priority: "ALTA",
        notes: "Requieren madera curada de 2 pulg de espesor x 8 pulg de ancho con tornillería galvanizada grado 8.",
      },
    }),
    prisma.lead.create({
      data: {
        title: "3 Cajas de Exportación Fitosanitaria HT para Turbobombas",
        customerId: customers[1].id,
        contactName: "Lic. Arantza Solís",
        phone: "933 112 4455",
        email: "logistica@ppgservicios.com",
        estimatedValue: 62000,
        stage: "POR_COTIZAR",
        priority: "URGENTE",
        notes: "Dimensiones especiales: 2.80m x 1.80m x 2.20m con forro interior impermeable.",
      },
    }),
    prisma.lead.create({
      data: {
        title: "Lote de 3,500 PT de Pino Tratado y Maculis para Cimbra de Puente",
        customerId: customers[2].id,
        contactName: "Arq. Gerardo Leyva",
        phone: "937 372 9010",
        email: "compras@olmecaconstruye.mx",
        estimatedValue: 230000,
        stage: "CONTACTADO",
        priority: "MEDIA",
        notes: "Se agendó visita técnica a su campamento en Cárdenas para cubicaje de trozas.",
      },
    }),
    prisma.lead.create({
      data: {
        title: "180 Cuñas de Teca para Tubería Petrolera de 16 pulgadas (Pipe Saddles)",
        customerId: customers[1].id,
        contactName: "Ing. Manuel Rovirosa",
        phone: "993 289 1100",
        email: "compras@serviciosmarinos.mx",
        estimatedValue: 54000,
        stage: "NUEVO",
        priority: "MEDIA",
        notes: "Solicitaron muestra física del radio de corte para la tubería de acero al carbón.",
      },
    }),
    prisma.lead.create({
      data: {
        title: "40 Chock-Blocks de Seguridad en Caracolillo con Manija de Cabo",
        customerId: customers[4].id,
        contactName: "Sr. Héctor Ceballos",
        phone: "981 811 7733",
        email: "mantenimiento@fletespeninsulares.com",
        estimatedValue: 28000,
        stage: "GANADO",
        priority: "MEDIA",
        notes: "Aprobado. Ya se canalizó a orden de taller OT-2026-0004.",
      },
    }),
  ]);

  console.log(`✓ ${leads.length} leads de CRM creados.`);

  // 6. Cotización Ejemplo
  const quote1 = await prisma.quote.create({
    data: {
      quoteNumber: "COT-2026-0042",
      customerId: customers[1].id,
      customerName: customers[1].businessName,
      rfc: customers[1].rfc,
      deliveryAddress: customers[1].deliveryAddress,
      freightZone: customers[1].freightZone,
      subtotalWood: 52440,
      valueAddedTotal: 6800,
      freightCost: 3500,
      discount: 0,
      subtotal: 62740,
      iva: 10038.4,
      total: 72778.4,
      status: "ENVIADA",
      notes: "Cotización incluye tratamiento térmico y certificación NOM-144-SEMARNAT-2017. Precios LAB Puerto Dos Bocas.",
      validityDays: 15,
      deliveryTimeDays: 7,
      paymentTerms: "50% Anticipo, saldo contra aviso de entrega",
      items: {
        create: [
          {
            woodSpeciesId: speciesMap.get("Maculis")?.id,
            speciesName: "Maculis",
            thicknessInches: 2.0,
            widthInches: 8.0,
            lengthValue: 12.0,
            lengthUnit: "PIES",
            pieces: 25,
            boardFeetTotal: 400.0, // (2*8*12/12) * 25 = 400 PT
            cubicMetersTotal: 0.9439, // 400 * 0.00235974
            unitPricePerPt: 88.0,
            woodSubtotal: 35200.0,
            cuttingService: true,
            cuttingCost: 1200.0,
            planingService: "CUATRO_CARAS",
            planingCost: 3200.0,
            dryingService: true,
            dryingCost: 2400.0,
            itemTotal: 42000.0,
          },
          {
            woodSpeciesId: speciesMap.get("Parota")?.id,
            speciesName: "Parota",
            thicknessInches: 3.0,
            widthInches: 6.0,
            lengthValue: 3.5, // 3.5 metros = ~11.48 pies
            lengthUnit: "METROS",
            pieces: 12,
            boardFeetTotal: 172.24,
            cubicMetersTotal: 0.4064,
            unitPricePerPt: 92.0,
            woodSubtotal: 15846.08,
            cuttingService: false,
            cuttingCost: 0,
            planingService: "DOS_CARAS",
            planingCost: 1400.0,
            dryingService: false,
            dryingCost: 0,
            itemTotal: 17246.08,
          },
        ],
      },
    },
  });

  console.log(`✓ Cotización ${quote1.quoteNumber} creada.`);

  // 7. Órdenes de Trabajo de Taller y Fabricación Industrial
  const workOrders = await Promise.all([
    prisma.workOrder.create({
      data: {
        orderNumber: "OT-2026-0101",
        customerId: customers[1].id,
        customerName: customers[1].businessName,
        quoteId: quote1.id,
        serviceType: "FABRICACION_INDUSTRIAL",
        subcategory: "CAJA_EXPORTACION_NOM144",
        status: "EN_PROCESO",
        priority: "ALTA",
        title: "Caja de Exportación para Válvulas Submarinas (Certificada NOM-144)",
        description: "Construcción de caja de alta resistencia con soleras de pino tratado y bastidor de Maculis. Aplicación de sello térmico HT.",
        requiresNom144: true,
        nom144BatchCode: "LOTE-HT-2026-088",
        semarnatStampRegistry: "MX-04-1234-SEMARNAT-HT",
        estimatedHours: 32,
        actualHours: 18,
        estimatedBoardFeet: 520,
        estimatedCost: 34000,
        finalPrice: 48500,
        targetDeliveryDate: new Date(Date.now() + 86400000 * 3),
        assignedTo: "Jefe de Taller",
        notes: "Verificar prueba de humedad con higrómetro digital (<18%) antes de colocar el sello oficial.",
        materials: {
          create: [
            {
              materialName: "Tablón de Pino Estufado HT 1\" x 6\" x 10'",
              category: "MADERA",
              quantity: 340,
              unit: "PT",
              unitCost: 38,
              subtotal: 12920,
            },
            {
              materialName: "Polín de Maculis 4\" x 4\" x 8'",
              category: "MADERA",
              quantity: 180,
              unit: "PT",
              unitCost: 72,
              subtotal: 12960,
            },
            {
              materialName: "Tornillos cabeza hexagonal 3/8\" x 4\" y arandelas",
              category: "HERRAJES_TORNILLERIA",
              quantity: 90,
              unit: "PIEZAS",
              unitCost: 18,
              subtotal: 1620,
            },
            {
              materialName: "Sello Fitosanitario y Tinta Oficial SEMARNAT",
              category: "QUIMICOS_PINTURA",
              quantity: 1,
              unit: "JUEGO",
              unitCost: 850,
              subtotal: 850,
            },
          ],
        },
      },
    }),
    prisma.workOrder.create({
      data: {
        orderNumber: "OT-2026-0102",
        customerId: customers[0].id,
        customerName: customers[0].businessName,
        serviceType: "REPARACION_TRANSPORTE",
        subcategory: "LOW_BOY",
        status: "CONTROL_CALIDAD",
        priority: "URGENTE",
        title: "Rehabilitación de Piso de Cama Baja (Low-Boy 60T) con Amargoso y Caracolillo",
        description: "Retiro de piso fatigado, sopleteado de vigas IPR, montaje de tablón de Amargoso 2\" x 8\" con rebajes y sujeción con pernos especiales.",
        requiresNom144: false,
        estimatedHours: 45,
        actualHours: 42,
        estimatedBoardFeet: 890,
        estimatedCost: 65000,
        finalPrice: 94000,
        targetDeliveryDate: new Date(Date.now() + 86400000 * 1),
        assignedTo: "Don Chema Carpintero & Equipo Soldadura",
        notes: "Piso terminado. En revisión de apriete de pernos y prueba de rodamiento con montacargas.",
        materials: {
          create: [
            {
              materialName: "Tablón de Amargoso 2\" x 8\" x 12'",
              category: "MADERA",
              quantity: 750,
              unit: "PT",
              unitCost: 75,
              subtotal: 56250,
            },
            {
              materialName: "Pernos autorroscantes Torx grado 8 para piso de remolque",
              category: "HERRAJES_TORNILLERIA",
              quantity: 240,
              unit: "PIEZAS",
              unitCost: 22,
              subtotal: 5280,
            },
          ],
        },
      },
    }),
    prisma.workOrder.create({
      data: {
        orderNumber: "OT-2026-0103",
        customerId: customers[1].id,
        customerName: customers[1].businessName,
        serviceType: "FABRICACION_INDUSTRIAL",
        subcategory: "CUNAS_TUBERIA_PIPE_SADDLE",
        status: "PENDIENTE",
        priority: "MEDIA",
        title: "150 Cuñas para Tubería de Perforación de 12 Pulg (Pipe Saddles de Teca)",
        description: "Corte curvo computarizado y fresado en madera de Teca para no rayar tubería de revestimiento API.",
        requiresNom144: false,
        estimatedHours: 20,
        actualHours: 0,
        estimatedBoardFeet: 360,
        estimatedCost: 26000,
        finalPrice: 39500,
        targetDeliveryDate: new Date(Date.now() + 86400000 * 6),
        assignedTo: "Taller de Torno y Moldurado",
        notes: "Plantilla de radio 6.375\" lista en taller.",
      },
    }),
    prisma.workOrder.create({
      data: {
        orderNumber: "OT-2026-0104",
        customerId: customers[2].id,
        customerName: customers[2].businessName,
        serviceType: "FABRICACION_INDUSTRIAL",
        subcategory: "ESTACAS_TOPOGRAFIA",
        status: "LISTO_ENTREGA",
        priority: "MEDIA",
        title: "2,000 Estacas y Trompos de Topografía en Jahua y Maculis con Cabeza Roja",
        description: "Estacas de 40cm afiladas en cuatro caras para fácil penetración en suelos arcillosos de Tabasco.",
        requiresNom144: false,
        estimatedHours: 16,
        actualHours: 15,
        estimatedBoardFeet: 420,
        estimatedCost: 14000,
        finalPrice: 22000,
        targetDeliveryDate: new Date(Date.now()),
        assignedTo: "Línea de Afilado y Pintura",
        notes: "Empacado en 40 atados de 50 piezas flejados listos en almacén de producto terminado.",
      },
    }),
  ]);

  console.log(`✓ ${workOrders.length} órdenes de trabajo creadas.`);

  // 8. Inventario Especializado y Movimientos
  const inventoryItems = await Promise.all([
    prisma.inventoryItem.create({
      data: {
        sku: "MAD-PAR-2X8X10",
        name: "Tablón de Parota en Bruto 2\" x 8\" x 10'",
        category: "MADERA_BRUTO",
        woodSpeciesId: speciesMap.get("Parota")?.id,
        unit: "PT",
        currentStock: 4850,
        minimumStock: 1200,
        costPrice: 65,
        salePrice: 92,
        locationInYard: "Patio Principal - Nave A (Estiba 4)",
        description: "Madera de Guanacaste de primera calidad, secada al aire libre 6 meses.",
      },
    }),
    prisma.inventoryItem.create({
      data: {
        sku: "MAD-MAC-1.5X6X8",
        name: "Madera de Maculis Habilitada y Cepillada 4 Caras 1.5\" x 6\" x 8'",
        category: "MADERA_PROCESADA",
        woodSpeciesId: speciesMap.get("Maculis")?.id,
        unit: "PT",
        currentStock: 2980,
        minimumStock: 800,
        costPrice: 62,
        salePrice: 88,
        locationInYard: "Nave B - Estantería Seca",
        description: "Maculis listo para armado de carrocerías y muebles finos.",
      },
    }),
    prisma.inventoryItem.create({
      data: {
        sku: "MAD-AMA-2X8X12",
        name: "Tablón de Amargoso de Alta Densidad 2\" x 8\" x 12'",
        category: "MADERA_BRUTO",
        woodSpeciesId: speciesMap.get("Amargoso")?.id,
        unit: "PT",
        currentStock: 3400,
        minimumStock: 1000,
        costPrice: 60,
        salePrice: 85,
        locationInYard: "Patio Pesado - Nave C",
        description: "Especial para pisos de transporte pesado, remolques y plataformas petroleras.",
      },
    }),
    prisma.inventoryItem.create({
      data: {
        sku: "MAD-PIN-HT-2X4X8",
        name: "Polín de Pino Estufado y Certificado HT 2\" x 4\" x 8'",
        category: "MADERA_PROCESADA",
        woodSpeciesId: speciesMap.get("Pino")?.id,
        unit: "PT",
        currentStock: 6200,
        minimumStock: 1500,
        costPrice: 32,
        salePrice: 48,
        locationInYard: "Bodega de Exportación NOM-144",
        description: "Pino con tratamiento térmico avalado por SEMARNAT para embalajes de exportación.",
      },
    }),
    prisma.inventoryItem.create({
      data: {
        sku: "INS-PER-58X6",
        name: "Perno Cabeza Coche Galvanizado 5/8\" x 6\" con Tuerca y Roldana",
        category: "INSUMOS_TALLER",
        unit: "PIEZAS",
        currentStock: 850,
        minimumStock: 300,
        costPrice: 14.5,
        salePrice: 24.0,
        locationInYard: "Almacén de Ferretería Industrial - Gaveta 12",
        description: "Sujeción de alto torque para piso de remolques y cajas secas.",
      },
    }),
    prisma.inventoryItem.create({
      data: {
        sku: "INS-FLE-34",
        name: "Rollo de Fleje de Acero Pavonado 3/4\" de Alta Tensión",
        category: "INSUMOS_TALLER",
        unit: "PIEZAS",
        currentStock: 18,
        minimumStock: 5,
        costPrice: 680,
        salePrice: 950,
        locationInYard: "Almacén de Herramientas y Flejado",
        description: "Aseguramiento de tarimas y cajas industriales de exportación.",
      },
    }),
    prisma.inventoryItem.create({
      data: {
        sku: "SUB-VIR-BUL",
        name: "Bulto de Viruta de Maderas Tropicales (Cama Avícola/Ganadera)",
        category: "SUBPRODUCTOS",
        unit: "BULTOS",
        currentStock: 320,
        minimumStock: 50,
        costPrice: 15,
        salePrice: 45,
        locationInYard: "Silos y Tolvas de Aserradero",
        description: "Subproducto seco de cepilladoras, altamente absorbente y desinfectado.",
      },
    }),
    prisma.inventoryItem.create({
      data: {
        sku: "SUB-ASE-M3",
        name: "Aserrín Fino para Absorción Industrial de Hidrocarburos",
        category: "SUBPRODUCTOS",
        unit: "M3",
        currentStock: 45,
        minimumStock: 10,
        costPrice: 40,
        salePrice: 160,
        locationInYard: "Patio Trasero - Bodega de Secado",
        description: "Utilizado en talleres mecánicos y patios de maniobras para contención de derrames.",
      },
    }),
  ]);

  // Movimientos de Stock Iniciales
  for (const item of inventoryItems) {
    await prisma.stockMovement.create({
      data: {
        inventoryItemId: item.id,
        type: "ENTRADA_RECEPCION_TROZA",
        quantity: item.currentStock,
        previousStock: 0,
        newStock: item.currentStock,
        referenceNumber: "INV-INICIAL-2026",
        notes: "Carga inicial de inventario auditada en patio de Maderas La Choca.",
        recordedBy: "Encargado de Patio",
      },
    });
  }

  console.log(`✓ ${inventoryItems.length} artículos de inventario registrados con bitácora de movimientos.`);

  console.log("\n¡Semillero completado exitosamente con datos representativos de Tabasco!");
}

main()
  .catch((e) => {
    console.error("Error al sembrar la base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
