import { Area, Community, Developer, Property } from "@/generated/prisma";

interface AlertEmailPropertyType extends Property, Community, Area, Developer {
  community: Community;
  area: Area;
  developer: Developer;
}

interface AlertEmailData {
  userName: string;
  properties: AlertEmailPropertyType[];
  alertCriteria: {
    areas?: string[];
    communities?: string[];
    propertyTypes?: string[];
    propertyStatus?: string[];
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    maxBeds?: number;
    minBaths?: number;
    maxBaths?: number;
    minSqft?: number;
    maxSqft?: number;
    features?: string[];
    developers?: string[];
  };
  unsubscribeUrl: string;
}

export const generatePropertyAlertEmail = (data: AlertEmailData): string => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatCriteria = () => {
    const criteria = [];
    if (data.alertCriteria.areas?.length) {
      criteria.push(`Areas: ${data.alertCriteria.areas.join(", ")}`);
    }
    if (data.alertCriteria.communities?.length) {
      criteria.push(
        `Communities: ${data.alertCriteria.communities.join(", ")}`
      );
    }
    if (data.alertCriteria.propertyTypes?.length) {
      criteria.push(
        `Property Types: ${data.alertCriteria.propertyTypes.join(", ")}`
      );
    }
    if (data.alertCriteria.minPrice || data.alertCriteria.maxPrice) {
      const priceRange = [
        data.alertCriteria.minPrice
          ? formatPrice(data.alertCriteria.minPrice)
          : "Any",
        data.alertCriteria.maxPrice
          ? formatPrice(data.alertCriteria.maxPrice)
          : "Any",
      ].join(" - ");
      criteria.push(`Price Range: ${priceRange}`);
    }
    if (data.alertCriteria.minBeds || data.alertCriteria.maxBeds) {
      const bedsRange = [
        data.alertCriteria.minBeds || "Any",
        data.alertCriteria.maxBeds || "Any",
      ].join(" - ");
      criteria.push(`Bedrooms: ${bedsRange}`);
    }
    return criteria.length ? criteria.join(" • ") : "All properties";
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Properties Matching Your Alert</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        
        .alert-criteria {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
        }
        
        .alert-criteria h3 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .alert-criteria p {
            color: #6c757d;
            font-size: 14px;
        }
        
        .properties-section h2 {
            color: #2c3e50;
            margin-bottom: 25px;
            font-size: 22px;
            text-align: center;
        }
        
        .property-card {
            border: 1px solid #e9ecef;
            border-radius: 10px;
            margin-bottom: 25px;
            overflow: hidden;
            transition: box-shadow 0.3s ease;
        }
        
        .property-card:hover {
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .property-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background-color: #f8f9fa;
        }
        
        .property-info {
            padding: 20px;
        }
        
        .property-title {
            font-size: 20px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .property-price {
            font-size: 24px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 15px;
        }
        
        .property-details {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .detail-item {
            background-color: #f8f9fa;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 14px;
            color: #6c757d;
        }
        
        .property-location {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .property-description {
            color: #495057;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 15px;
        }
        
        .view-property-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s ease;
        }
        
        .view-property-btn:hover {
            transform: translateY(-2px);
        }
        
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .footer p {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .unsubscribe-btn {
            color: #dc3545;
            text-decoration: none;
            font-size: 14px;
        }
        
        .unsubscribe-btn:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 600px) {
            .property-details {
                flex-direction: column;
                gap: 10px;
            }
            
            .detail-item {
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 New Properties Found!</h1>
            <p>Properties matching your search criteria</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello ${data.userName || "there"},
            </div>
            
            <div class="alert-criteria">
                <h3>Your Search Criteria:</h3>
                <p>${formatCriteria()}</p>
            </div>
            
            <div class="properties-section">
                <h2>🎯 ${data.properties.length} New ${
    data.properties.length === 1 ? "Property" : "Properties"
  } Found</h2>
                
                ${data.properties
                  .map(
                    (property) => `
                    <div class="property-card">
                        ${
                          property.images && property.images.length > 0
                            ? `
                            <img src="${property.images[0]}" alt="${property.name}" class="property-image" />
                        `
                            : `
                            <div class="property-image" style="display: flex; align-items: center; justify-content: center; background-color: #f8f9fa; color: #6c757d;">
                                No Image Available
                            </div>
                        `
                        }
                        
                        <div class="property-info">
                            <div class="property-title">${property.name}</div>
                            <div class="property-price">${formatPrice(
                              property.price
                            )}</div>
                            
                            <div class="property-details">
                                ${
                                  property.beds
                                    ? `<span class="detail-item">🛏️ ${property.beds} Beds</span>`
                                    : ""
                                }
                                ${
                                  property.baths
                                    ? `<span class="detail-item">🚿 ${property.baths} Baths</span>`
                                    : ""
                                }
                                ${
                                  property.sqft
                                    ? `<span class="detail-item">📐 ${property.sqft} sqft</span>`
                                    : ""
                                }
                                ${
                                  property.type
                                    ? `<span class="detail-item">🏢 ${property.type}</span>`
                                    : ""
                                }
                            </div>
                            
                            <div class="property-location">
                                📍 ${property.community.name}, ${
                      property.area.name
                    }
                                ${
                                  property.developer
                                    ? ` • By ${property.developer.name}`
                                    : ""
                                }
                            </div>
                            
                            ${
                              property.description
                                ? `
                                <div class="property-description">
                                    ${
                                      property.description.length > 150
                                        ? property.description.substring(
                                            0,
                                            150
                                          ) + "..."
                                        : property.description
                                    }
                                </div>
                            `
                                : ""
                            }
                            
                            <a href="${
                              process.env.CLIENT_URL ||
                              "https://your-website.com"
                            }/p/${property.id}" class="view-property-btn">
                                View Property Details
                            </a>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent because you have an active property alert.</p>
            <p>If you no longer wish to receive these alerts, you can:</p>
            <a href="${
              data.unsubscribeUrl
            }" class="unsubscribe-btn">Unsubscribe from this alert</a>
        </div>
    </div>
</body>
</html>
  `;
};
