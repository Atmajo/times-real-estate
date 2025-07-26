import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const addDeveloperSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters"),
});

export const updateDeveloperSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

// Area schemas
export const addAreaSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const updateAreaSchema = z.object({
  name: z.string().optional(),
});

// Community schemas
export const addCommunitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  areaId: z.string().min(1, "Area ID is required"),
});

export const updateCommunitySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  areaId: z.string().optional(),
});

// Accommodation schemas
export const addAccommodationSchema = z.object({
  value: z.string().min(1, "Value is required"),
});

export const updateAccommodationSchema = z.object({
  value: z.string().optional(),
});

// Possession schemas
export const addPossessionSchema = z.object({
  value: z.string().min(1, "Value is required"),
});

export const updatePossessionSchema = z.object({
  value: z.string().optional(),
});

// PaymentPlan schemas
export const addPaymentPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
});

export const updatePaymentPlanSchema = z.object({
  name: z.string().optional(),
  value: z.string().optional(),
});

// FeatureAmenities schemas
export const addFeatureAmenitiesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().url("Logo must be a valid URL"),
});

export const updateFeatureAmenitiesSchema = z.object({
  name: z.string().optional(),
  logo: z.string().url("Logo must be a valid URL").optional(),
});

// Property schemas
export const addPropertySchema = z.object({
  developerId: z.string().min(1, "Developer ID is required"),
  communityId: z.string().min(1, "Community ID is required"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  name: z.string().min(1, "Name is required"),
  overview: z.string().min(1, "Overview is required"),
  status: z.enum(["Coming_Soon", "Offplan", "Ready_To_Move", "Resale"]),
  type: z.enum(["Apartments", "Villas", "Townhouses", "Penthouses", "Lands", "Offices", "Mansions", "Duplex", "Warehouse", "Lofts"]),
  isFeatured: z.boolean(),
  accommodation: z.array(z.string()).min(1, "At least one accommodation is required"),
  possession: z.string().min(1, "Possession is required"),
  size: z.number().positive("Size must be positive"),
  downPayment: z.number().positive("Down payment must be positive"),
  paymentPlanId: z.string().min(1, "Payment plan ID is required"),
  handover: z.string().datetime("Invalid handover date"),
  featureAmenitiesId: z.string().min(1, "Feature amenities ID is required"),
  brochure: z.string().url("Brochure must be a valid URL"),
  floorPlanBrochure: z.string().url("Floor plan brochure must be a valid URL"),
  paymentPlanBrochure: z.string().url("Payment plan brochure must be a valid URL"),
  price: z.number().positive("Price must be positive"),
  accommodationId: z.string().min(1, "Accommodation ID is required"),
  possessionId: z.string().min(1, "Possession ID is required"),
  areaId: z.string().min(1, "Area ID is required"),
});

export const updatePropertySchema = z.object({
  developerId: z.string().optional(),
  communityId: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  name: z.string().optional(),
  overview: z.string().optional(),
  status: z.enum(["Coming_Soon", "Offplan", "Ready_To_Move", "Resale"]).optional(),
  type: z.enum(["Apartments", "Villas", "Townhouses", "Penthouses", "Lands", "Offices", "Mansions", "Duplex", "Warehouse", "Lofts"]).optional(),
  isFeatured: z.boolean().optional(),
  accommodation: z.array(z.string()).optional(),
  possession: z.string().optional(),
  size: z.number().positive().optional(),
  downPayment: z.number().positive().optional(),
  paymentPlanId: z.string().optional(),
  handover: z.string().datetime().optional(),
  featureAmenitiesId: z.string().optional(),
  brochure: z.string().url().optional(),
  floorPlanBrochure: z.string().url().optional(),
  paymentPlanBrochure: z.string().url().optional(),
  price: z.number().positive().optional(),
  accommodationId: z.string().optional(),
  possessionId: z.string().optional(),
  areaId: z.string().optional(),
});

// PropertyContact schemas
export const addPropertyContactSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email format"),
  type: z.enum(["Individual", "Agent", "Investor", "Do_not_want_to_disclose", "Others"]),
  message: z.string().min(1, "Message is required"),
});

export const updatePropertyContactSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  type: z.enum(["Individual", "Agent", "Investor", "Do_not_want_to_disclose", "Others"]).optional(),
  message: z.string().optional(),
});

// Contact schemas
export const addContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email format"),
});

export const updateContactSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

// Collection schemas
export const addCollectionSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
});

export const getCollectionsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

// RequestTour schemas
export const addRequestTourSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  mode: z.enum(["OFFLINE", "ONLINE"], { message: "Mode is required" }),
  timeframe: z.enum(["MORNING", "AFTERNOON", "EVENING", "ANYTIME"], { message: "Timeframe is required" }),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(1, "Message is required"),
});

export const getRequestToursSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const updateRequestTourSchema = z.object({
  mode: z.enum(["OFFLINE", "ONLINE"]).optional(),
  timeframe: z.enum(["MORNING", "AFTERNOON", "EVENING", "ANYTIME"]).optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  message: z.string().optional(),
});
