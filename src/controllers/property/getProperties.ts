import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import logger from "@/logger/logger";
import { paginate } from "@/lib/paginate";
import { validator } from "@/lib/validator";
import { getPropertiesQuerySchema } from "@/schemas";

export const getProperties = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Validate query parameters
    const validatedQuery = validator({
      schema: getPropertiesQuerySchema,
      body: req.query,
    });
    if (!validatedQuery) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }
    
    const {
      sort,
      status,
      type,
      isFeatured,
      developerId,
      communityId,
      areaId,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      // Filter fields
      beds,
      baths,
      price_range_min,
      price_range_max,
      sqft_min,
      sqft_max,
      lot_size_min,
      lot_size_max,
      year_built_min,
      year_built_max,
      garage_min,
      garage_max,
      property_type,
      property_status,
      popular_features,
      community_features,
      interior_features,
      parking_features,
      view,
      heating,
      financial_information,
      home_style,
      heating_features,
      property_subtypes,
      lot_features,
      pool_features,
      green_features,
      stories,
      exterior_features,
      property_features,
    } = validatedQuery;

    const where: any =
      req.user.role !== "AGENT" ? {} : { userId: req.user.id };

    if (status) where.status = status;
    if (type) where.type = type;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === "true";
    if (developerId) where.developerId = developerId;
    if (communityId) where.communityId = communityId;
    if (areaId) where.areaId = areaId;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (minSize || maxSize) {
      where.size = {};
      if (minSize) where.size.gte = parseFloat(minSize as string);
      if (maxSize) where.size.lte = parseFloat(maxSize as string);
    }

    // Add property filters for direct field matching
    if (beds) where.beds = beds;
    if (baths) where.baths = baths;
    
    // Range filters
    if (price_range_min) where.price_range_min = price_range_min;
    if (price_range_max) where.price_range_max = price_range_max;
    if (sqft_min) where.sqft_min = sqft_min;
    if (sqft_max) where.sqft_max = sqft_max;
    if (lot_size_min) where.lot_size_min = lot_size_min;
    if (lot_size_max) where.lot_size_max = lot_size_max;
    if (year_built_min) where.year_built_min = year_built_min;
    if (year_built_max) where.year_built_max = year_built_max;
    if (garage_min) where.garage_min = garage_min;
    if (garage_max) where.garage_max = garage_max;
    
    // Multi-select array filters
    if (property_type && property_type.length > 0) {
      where.property_type = { hasSome: property_type };
    }
    if (property_status && property_status.length > 0) {
      where.property_status = { hasSome: property_status };
    }
    if (popular_features && popular_features.length > 0) {
      where.popular_features = { hasSome: popular_features };
    }
    if (community_features && community_features.length > 0) {
      where.community_features = { hasSome: community_features };
    }
    if (interior_features && interior_features.length > 0) {
      where.interior_features = { hasSome: interior_features };
    }
    if (parking_features && parking_features.length > 0) {
      where.parking_features = { hasSome: parking_features };
    }
    if (view && view.length > 0) {
      where.view = { hasSome: view };
    }
    if (heating && heating.length > 0) {
      where.heating = { hasSome: heating };
    }
    if (financial_information && financial_information.length > 0) {
      where.financial_information = { hasSome: financial_information };
    }
    if (home_style && home_style.length > 0) {
      where.home_style = { hasSome: home_style };
    }
    if (heating_features && heating_features.length > 0) {
      where.heating_features = { hasSome: heating_features };
    }
    if (property_subtypes && property_subtypes.length > 0) {
      where.property_subtypes = { hasSome: property_subtypes };
    }
    if (lot_features && lot_features.length > 0) {
      where.lot_features = { hasSome: lot_features };
    }
    if (pool_features && pool_features.length > 0) {
      where.pool_features = { hasSome: pool_features };
    }
    if (green_features && green_features.length > 0) {
      where.green_features = { hasSome: green_features };
    }
    if (stories && stories.length > 0) {
      where.stories = { hasSome: stories };
    }
    if (exterior_features && exterior_features.length > 0) {
      where.exterior_features = { hasSome: exterior_features };
    }
    if (property_features && property_features.length > 0) {
      where.property_features = { hasSome: property_features };
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        developer: true,
        community: true,
        paymentPlan: true,
        area: true,
        propertyContacts: true,
      },
      orderBy: {
        createdAt: sort === "desc" ? "desc" : "asc",
      },
    });

    const { page, limit, totalPages, totalItems, items } = paginate(
      properties,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );

    return res.status(200).json({ page, limit, totalPages, totalItems, items });
  } catch (error) {
    logger.error("Error in getProperties controller:", error);
    res.status(500).json({ error: "Failed to get properties" });
  }
};

export const getProperty = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: {
        id,
        ...(req.user.role === "AGENT" && { userId: req.user.id }),
      },
      include: {
        developer: true,
        community: {
          include: {
            area: true,
          },
        },
        paymentPlan: true,
        area: true,
        propertyContacts: true,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Format the response in the requested structure
    const formattedProperty = {
      houseDescription: property.overview,

      highlights: {
        listedBy: property.developer?.name || "N/A",
        propertyType: property.type,
        size: `${property.sqft_min || "N/A"} sq ft`,
        handover: property.handover
          ? new Date(property.handover).getFullYear()
          : "N/A",
        area: property.area?.name || "N/A",
        community: property.community?.name || "N/A",
        status: property.status,
        listingId: property.id,
        price: `$${property.price.toLocaleString()}`,
        downPayment: property.price_range_min ? `$${parseFloat(property.price_range_min).toLocaleString()}` : "N/A",
        paymentPlan: property.paymentPlan?.name || "N/A",
        accommodation: property.beds || "N/A",
        possession: "N/A", // This field can be added to schema later if needed
      },

      interiorFeatures: {
        bedroomsAndBathrooms: {
          bedrooms: property.beds || "N/A",
          bathrooms: property.baths || "N/A",
          fullBathrooms: property.baths || "N/A",
        },
        appliances: property.interior_features || [],
        floor: "N/A", // This field can be added to schema later if needed
        aboveGroundSqFt: property.sqft_min || "N/A",
        belowGroundSqFt: "N/A",
        other: property.property_features || [],
      },

      exteriorFeatures: {
        lot: property.lot_features || [],
        roof: "N/A", // This field can be added to schema later if needed
        others: property.exterior_features || [],
        parkingFeatures: property.parking_features || [],
      },

      propertyDetails: {
        propertyType: property.type,
        homeStyle: property.home_style || [],
        stories: property.stories || [],
        view: property.view || [],
        heating: property.heating || [],
        heatingFeatures: property.heating_features || [],
        propertySubtypes: property.property_subtypes || [],
        poolFeatures: property.pool_features || [],
        greenFeatures: property.green_features || [],
        communityFeatures: property.community_features || [],
        popularFeatures: property.popular_features || [],
        financialInformation: property.financial_information || [],
      },

      location: {
        latitude: property.lat,
        longitude: property.long,
        area: property.area?.name,
        community: property.community?.name,
      },

      contact:
        property.propertyContacts?.map((contact) => ({
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          type: contact.type,
          message: contact.message,
        })) || [],

      images: property.images || [],
      brochures: {
        property: property.brochure,
        floorPlan: property.floorPlanBrochure,
        paymentPlan: property.paymentPlanBrochure,
      },

      // Include raw property data for backward compatibility
      rawProperty: property,
    };

    return res.status(200).json({ property: formattedProperty });
  } catch (error) {
    logger.error("Error in getProperty controller:", error);
    res.status(500).json({ error: "Failed to get property" });
  }
};
