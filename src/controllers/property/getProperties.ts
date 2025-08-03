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
      beds,
      baths,
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
      req.user.role !== "AGENT" ? {} : { adminId: req.user.id };

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

    // Add property filters based on featureAmenities JSON field
    const featureAmenitiesFilters: any = {};

    if (beds) featureAmenitiesFilters.beds = beds;
    if (baths) featureAmenitiesFilters.baths = baths;
    if (property_type) {
      const types = Array.isArray(property_type)
        ? property_type
        : [property_type];
      featureAmenitiesFilters.property_type = { hasSome: types };
    }
    if (property_status) {
      const statuses = Array.isArray(property_status)
        ? property_status
        : [property_status];
      featureAmenitiesFilters.property_status = { hasSome: statuses };
    }
    if (popular_features) {
      const features = Array.isArray(popular_features)
        ? popular_features
        : [popular_features];
      featureAmenitiesFilters.popular_features = { hasSome: features };
    }
    if (community_features) {
      const features = Array.isArray(community_features)
        ? community_features
        : [community_features];
      featureAmenitiesFilters.community_features = { hasSome: features };
    }
    if (interior_features) {
      const features = Array.isArray(interior_features)
        ? interior_features
        : [interior_features];
      featureAmenitiesFilters.interior_features = { hasSome: features };
    }
    if (parking_features) {
      const features = Array.isArray(parking_features)
        ? parking_features
        : [parking_features];
      featureAmenitiesFilters.parking_features = { hasSome: features };
    }
    if (view) {
      const views = Array.isArray(view) ? view : [view];
      featureAmenitiesFilters.view = { hasSome: views };
    }
    if (heating) {
      const heatings = Array.isArray(heating) ? heating : [heating];
      featureAmenitiesFilters.heating = { hasSome: heatings };
    }
    if (financial_information) {
      const info = Array.isArray(financial_information)
        ? financial_information
        : [financial_information];
      featureAmenitiesFilters.financial_information = { hasSome: info };
    }
    if (home_style) {
      const styles = Array.isArray(home_style) ? home_style : [home_style];
      featureAmenitiesFilters.home_style = { hasSome: styles };
    }
    if (heating_features) {
      const features = Array.isArray(heating_features)
        ? heating_features
        : [heating_features];
      featureAmenitiesFilters.heating_features = { hasSome: features };
    }
    if (property_subtypes) {
      const subtypes = Array.isArray(property_subtypes)
        ? property_subtypes
        : [property_subtypes];
      featureAmenitiesFilters.property_subtypes = { hasSome: subtypes };
    }
    if (lot_features) {
      const features = Array.isArray(lot_features)
        ? lot_features
        : [lot_features];
      featureAmenitiesFilters.lot_features = { hasSome: features };
    }
    if (pool_features) {
      const features = Array.isArray(pool_features)
        ? pool_features
        : [pool_features];
      featureAmenitiesFilters.pool_features = { hasSome: features };
    }
    if (green_features) {
      const features = Array.isArray(green_features)
        ? green_features
        : [green_features];
      featureAmenitiesFilters.green_features = { hasSome: features };
    }
    if (stories) {
      const storyOptions = Array.isArray(stories) ? stories : [stories];
      featureAmenitiesFilters.stories = { hasSome: storyOptions };
    }
    if (exterior_features) {
      const features = Array.isArray(exterior_features)
        ? exterior_features
        : [exterior_features];
      featureAmenitiesFilters.exterior_features = { hasSome: features };
    }
    if (property_features) {
      const features = Array.isArray(property_features)
        ? property_features
        : [property_features];
      featureAmenitiesFilters.property_features = { hasSome: features };
    }

    // Apply featureAmenities filters if any exist
    if (Object.keys(featureAmenitiesFilters).length > 0) {
      where.featureAmenities = { path: [], ...featureAmenitiesFilters };
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
        ...(req.user.role === "AGENT" && { adminId: req.user.id }),
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

    // Type cast featureAmenities as any to access its properties
    const amenities = property.featureAmenities as any;

    // Format the response in the requested structure
    const formattedProperty = {
      houseDescription: property.overview,

      highlights: {
        listedBy: property.developer?.name || "N/A",
        propertyType: property.type,
        size: `${property.size} sq ft`,
        handover: property.handover
          ? new Date(property.handover).getFullYear()
          : "N/A",
        area: property.area?.name || "N/A",
        community: property.community?.name || "N/A",
        status: property.status,
        listingId: property.id,
        price: `$${property.price.toLocaleString()}`,
        downPayment: `$${property.downPayment.toLocaleString()}`,
        paymentPlan: property.paymentPlan?.name || "N/A",
        accommodation: property.accommodation || "N/A",
        possession: property.possession || "N/A",
      },

      interiorFeatures: {
        bedroomsAndBathrooms: {
          bedrooms: amenities?.beds || "N/A",
          bathrooms: amenities?.baths || "N/A",
          fullBathrooms: amenities?.baths || "N/A",
        },
        appliances: amenities?.interior_features || [],
        floor: amenities?.floor_type || "N/A",
        aboveGroundSqFt: property.size || "N/A",
        belowGroundSqFt: "N/A",
        other: amenities?.property_features || [],
      },

      exteriorFeatures: {
        lot: amenities?.lot_features || [],
        roof: amenities?.roof_type || "N/A",
        others: amenities?.exterior_features || [],
        parkingFeatures: amenities?.parking_features || [],
      },

      propertyDetails: {
        propertyType: property.type,
        homeStyle: amenities?.home_style || [],
        stories: amenities?.stories || "N/A",
        view: amenities?.view || [],
        heating: amenities?.heating || [],
        heatingFeatures: amenities?.heating_features || [],
        propertySubtypes: amenities?.property_subtypes || [],
        poolFeatures: amenities?.pool_features || [],
        greenFeatures: amenities?.green_features || [],
        communityFeatures: amenities?.community_features || [],
        popularFeatures: amenities?.popular_features || [],
        financialInformation: amenities?.financial_information || [],
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
