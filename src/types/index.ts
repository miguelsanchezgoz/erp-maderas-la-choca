export type UserRole = "ADMIN" | "VENTAS" | "TALLER" | "ALMACEN";
export type UserStatus = "ACTIVO" | "INACTIVO";

export interface UserType {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  avatar?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type DemoUser = UserType;

export interface CustomerType {
  id: string;
  businessName: string;
  commercialName?: string | null;
  rfc?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  contactPerson?: string | null;
  deliveryAddress?: string | null;
  freightZone: string;
  notes?: string | null;
  createdAt: string | Date;
}

export interface WoodSpeciesType {
  id: string;
  commonName: string;
  scientificName?: string | null;
  category: string;
  densityKgM3?: number | null;
  basePricePerPt: number;
  description?: string | null;
  commonUses?: string | null;
  isAvailable: boolean;
}

export interface LeadType {
  id: string;
  title: string;
  customerId?: string | null;
  customer?: CustomerType | null;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  estimatedValue: number;
  stage: "NUEVO" | "CONTACTADO" | "POR_COTIZAR" | "COTIZADO" | "EN_NEGOCIACION" | "GANADO" | "PERDIDO";
  priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
  notes?: string | null;
  expectedCloseDate?: string | Date | null;
  createdAt: string | Date;
}

export interface QuoteItemType {
  id?: string;
  woodSpeciesId?: string | null;
  speciesName: string;
  thicknessInches: number;
  widthInches: number;
  lengthValue: number;
  lengthUnit: "PIES" | "METROS";
  pieces: number;
  boardFeetTotal: number;
  cubicMetersTotal: number;
  unitPricePerPt: number;
  woodSubtotal: number;
  cuttingService: boolean;
  cuttingCost: number;
  planingService: "NINGUNO" | "DOS_CARAS" | "CUATRO_CARAS";
  planingCost: number;
  dryingService: boolean;
  dryingCost: number;
  itemTotal: number;
}

export interface QuoteType {
  id: string;
  quoteNumber: string;
  customerId?: string | null;
  customer?: CustomerType | null;
  customerName: string;
  rfc?: string | null;
  deliveryAddress?: string | null;
  freightZone: string;
  subtotalWood: number;
  valueAddedTotal: number;
  freightCost: number;
  discount: number;
  subtotal: number;
  iva: number;
  total: number;
  status: "BORRADOR" | "ENVIADA" | "ACEPTADA" | "RECHAZADA" | "VENCIDA";
  notes?: string | null;
  validityDays: number;
  deliveryTimeDays: number;
  paymentTerms: string;
  items: QuoteItemType[];
  createdAt: string | Date;
}

export interface WorkOrderMaterialType {
  id?: string;
  materialName: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  subtotal: number;
}

export interface WorkOrderType {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customer?: CustomerType | null;
  customerName: string;
  quoteId?: string | null;
  serviceType: "REPARACION_TRANSPORTE" | "FABRICACION_INDUSTRIAL";
  subcategory: string;
  status: "PENDIENTE" | "EN_PROCESO" | "CONTROL_CALIDAD" | "LISTO_ENTREGA" | "ENTREGADO";
  priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
  title: string;
  description?: string | null;
  requiresNom144: boolean;
  nom144BatchCode?: string | null;
  semarnatStampRegistry?: string | null;
  estimatedHours: number;
  actualHours: number;
  estimatedBoardFeet: number;
  estimatedCost: number;
  finalPrice: number;
  startDate?: string | Date | null;
  targetDeliveryDate?: string | Date | null;
  completionDate?: string | Date | null;
  assignedTo?: string | null;
  notes?: string | null;
  materials?: WorkOrderMaterialType[];
  createdAt: string | Date;
}

export interface InventoryItemType {
  id: string;
  sku: string;
  name: string;
  category: "MADERA_BRUTO" | "MADERA_PROCESADA" | "INSUMOS_TALLER" | "SUBPRODUCTOS";
  woodSpeciesId?: string | null;
  woodSpecies?: WoodSpeciesType | null;
  unit: string;
  currentStock: number;
  minimumStock: number;
  costPrice: number;
  salePrice: number;
  locationInYard?: string | null;
  description?: string | null;
  createdAt: string | Date;
}

export interface StockMovementType {
  id: string;
  inventoryItemId: string;
  inventoryItem?: InventoryItemType;
  type: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceNumber?: string | null;
  notes?: string | null;
  recordedBy?: string | null;
  createdAt: string | Date;
}
