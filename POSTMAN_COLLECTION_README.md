# Real Estate API - Postman Collection

This repository contains a comprehensive Postman collection for the Real Estate API backend, providing easy access to all available endpoints with proper authentication and request examples.

## 📋 Contents

- `Real_Estate_API.postman_collection.json` - Complete Postman collection with all API endpoints
- `Real_Estate_API.postman_environment.json` - Environment variables for the collection
- This README file with setup and usage instructions

## 🚀 Getting Started

### Prerequisites

- [Postman](https://www.postman.com/downloads/) installed on your machine
- Real Estate API backend server running (default: `http://localhost:3000`)

### Installation

1. **Import the Collection:**
   - Open Postman
   - Click "Import" button
   - Select `Real_Estate_API.postman_collection.json`
   - The collection will be imported with all endpoints organized in folders

2. **Import the Environment:**
   - In Postman, go to "Environments" tab
   - Click "Import" button
   - Select `Real_Estate_API.postman_environment.json`
   - Select the "Real Estate API Environment" as your active environment

3. **Configure Base URL:**
   - In the environment variables, set `baseUrl` to your API server URL
   - Default: `http://localhost:3000`

## 🔐 Authentication

The API uses JWT token authentication via HTTP cookies. Follow these steps:

1. **Register a new admin account:**
   - Use the "Register Admin" request in the "Authentication" folder
   - Provide name, email, and password

2. **Login:**
   - Use the "Login Admin" request
   - The response will set an authentication cookie
   - The login request includes a test script that automatically extracts and stores the token

3. **Authenticated Requests:**
   - All protected endpoints automatically use the stored authentication token
   - The token is sent via the `Cookie` header as `token={{authToken}}`

## 📁 Collection Structure

### Authentication
- `POST /auth/register` - Register new admin user
- `POST /auth/login` - Login admin user (auto-extracts token)

### Developers
- `GET /api/developers` - Get all developers with pagination
- `GET /api/developers/{id}` - Get specific developer
- `POST /api/developers` - Create new developer
- `PATCH /api/developers/{id}` - Update developer
- `DELETE /api/developers/{id}` - Delete developer

### Areas
- `GET /api/areas` - Get all areas with pagination
- `GET /api/areas/{id}` - Get specific area
- `POST /api/areas` - Create new area
- `PATCH /api/areas/{id}` - Update area
- `DELETE /api/areas/{id}` - Delete area

### Communities
- `GET /api/communities` - Get all communities with pagination
- `GET /api/communities/{id}` - Get specific community
- `POST /api/communities` - Create new community
- `PATCH /api/communities/{id}` - Update community
- `DELETE /api/communities/{id}` - Delete community

### Accommodations
- `GET /api/accommodations` - Get all accommodations with pagination
- `GET /api/accommodations/{id}` - Get specific accommodation
- `POST /api/accommodations` - Create new accommodation
- `PATCH /api/accommodations/{id}` - Update accommodation
- `DELETE /api/accommodations/{id}` - Delete accommodation

### Possessions
- `GET /api/possessions` - Get all possessions with pagination
- `GET /api/possessions/{id}` - Get specific possession
- `POST /api/possessions` - Create new possession
- `PATCH /api/possessions/{id}` - Update possession
- `DELETE /api/possessions/{id}` - Delete possession

### Payment Plans
- `GET /api/payment-plans` - Get all payment plans with pagination
- `GET /api/payment-plans/{id}` - Get specific payment plan
- `POST /api/payment-plans` - Create new payment plan
- `PATCH /api/payment-plans/{id}` - Update payment plan
- `DELETE /api/payment-plans/{id}` - Delete payment plan

### Feature Amenities
- `GET /api/feature-amenities` - Get all feature amenities with pagination
- `GET /api/feature-amenities/{id}` - Get specific feature amenity
- `POST /api/feature-amenities` - Create new feature amenity
- `PATCH /api/feature-amenities/{id}` - Update feature amenity
- `DELETE /api/feature-amenities/{id}` - Delete feature amenity

### Properties
- `GET /api/properties` - Get all properties with pagination and filtering
- `GET /api/properties` - Get properties with advanced filters (status, type, price range, etc.)
- `GET /api/properties/{id}` - Get specific property
- `POST /api/properties` - Create new property
- `PATCH /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### Property Contacts
- `GET /api/property-contacts` - Get all property contacts with pagination
- `GET /api/property-contacts` - Get property contacts filtered by property ID
- `GET /api/property-contacts/{id}` - Get specific property contact
- `POST /api/property-contacts` - Create new property contact
- `PATCH /api/property-contacts/{id}` - Update property contact
- `DELETE /api/property-contacts/{id}` - Delete property contact

### Contacts
- `GET /api/contacts` - Get all contacts with pagination
- `GET /api/contacts/{id}` - Get specific contact
- `POST /api/contacts` - Create new contact
- `PATCH /api/contacts/{id}` - Update contact
- `DELETE /api/contacts/{id}` - Delete contact

### Collections (User-scoped)
- `GET /api/collections` - Get user's property collections
- `GET /api/collections/{id}` - Get specific collection
- `POST /api/collections` - Add property to user's collection
- `DELETE /api/collections/{id}` - Remove property from collection

### Request Tours (User-scoped)
- `GET /api/request-tours` - Get user's tour requests
- `GET /api/request-tours/{id}` - Get specific tour request
- `POST /api/request-tours` - Create new tour request
- `PATCH /api/request-tours/{id}` - Update tour request
- `DELETE /api/request-tours/{id}` - Delete tour request

### System
- `GET /api` - Health check endpoint
- `GET /api/logs` - View application logs (admin only)

## 🔧 Environment Variables

The collection uses the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `baseUrl` | API server base URL | `http://localhost:3000` |
| `authToken` | JWT authentication token | (auto-populated) |
| `developerId` | Developer ID for testing | (populate manually) |
| `areaId` | Area ID for testing | (populate manually) |
| `communityId` | Community ID for testing | (populate manually) |
| `accommodationId` | Accommodation ID for testing | (populate manually) |
| `possessionId` | Possession ID for testing | (populate manually) |
| `paymentPlanId` | Payment Plan ID for testing | (populate manually) |
| `featureAmenityId` | Feature Amenity ID for testing | (populate manually) |
| `propertyId` | Property ID for testing | (populate manually) |
| `propertyContactId` | Property Contact ID for testing | (populate manually) |
| `contactId` | Contact ID for testing | (populate manually) |
| `collectionId` | Collection ID for testing | (populate manually) |
| `requestTourId` | Request Tour ID for testing | (populate manually) |

## 📝 Usage Examples

### 1. Setting Up Test Data

1. Start by creating basic entities in this order:
   - Register/Login as admin
   - Create Area
   - Create Developer
   - Create Community (requires Area ID)
   - Create Accommodation
   - Create Possession
   - Create Payment Plan
   - Create Feature Amenity

2. Copy the returned IDs and update your environment variables

3. Create Properties using the IDs from above

### 2. Property Filtering

The Properties endpoint supports advanced filtering:

```
GET /api/properties?status=Ready_To_Move&type=Apartments&isFeatured=true&minPrice=500000&maxPrice=2000000&minSize=800&maxSize=2000&page=1&limit=10
```

Available filters:
- `status`: Coming_Soon, Offplan, Ready_To_Move, Resale
- `type`: Apartments, Villas, Townhouses, Penthouses, Lands, Offices, Mansions, Duplex, Warehouse, Lofts
- `isFeatured`: true/false
- `developerId`, `communityId`, `areaId`: Filter by related entities
- `minPrice`, `maxPrice`: Price range filtering
- `minSize`, `maxSize`: Size range filtering

### 3. User-Scoped Operations

Collections and Request Tours are automatically scoped to the authenticated user:
- Users can only see their own collections and tour requests
- Creating collections/tours automatically associates them with the current user

## 🏗️ Request Body Examples

### Create Property
```json
{
  "developerId": "developer-uuid",
  "communityId": "community-uuid",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "name": "Luxury Marina Apartment",
  "overview": "A stunning 2-bedroom apartment with marina views",
  "status": "Ready_To_Move",
  "type": "Apartments",
  "isFeatured": true,
  "accommodation": ["2 Bedroom", "2 Bathroom"],
  "possession": "Ready",
  "size": 1200,
  "downPayment": 250000,
  "paymentPlanId": "payment-plan-uuid",
  "handover": "2024-12-31T00:00:00.000Z",
  "featureAmenitiesId": "amenity-uuid",
  "brochure": "https://example.com/brochure.pdf",
  "floorPlanBrochure": "https://example.com/floor-plan.pdf",
  "paymentPlanBrochure": "https://example.com/payment-plan.pdf",
  "price": 1500000,
  "accommodationId": "accommodation-uuid",
  "possessionId": "possession-uuid",
  "areaId": "area-uuid"
}
```

### Create Request Tour
```json
{
  "propertyId": "property-uuid",
  "mode": "OFFLINE",
  "timeframe": "MORNING",
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "message": "I would like to schedule a tour this weekend."
}
```

## ⚠️ Important Notes

1. **Authentication**: Always login before making requests to protected endpoints
2. **Dependencies**: Create entities in the correct order due to foreign key relationships
3. **IDs**: Use actual UUIDs from created resources, not placeholder text
4. **Validation**: All requests are validated according to the Zod schemas
5. **Pagination**: Most GET endpoints support `page` and `limit` query parameters
6. **Error Handling**: Check response status codes and error messages for debugging

## 🛠️ Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Ensure you've logged in successfully
   - Check that the authToken environment variable is set
   - Verify the token hasn't expired (30-day expiry)

2. **Validation Errors**
   - Check required fields in request bodies
   - Ensure email formats are valid
   - Verify URL formats for image and document links
   - Check enum values (status, type, mode, timeframe)

3. **Foreign Key Errors**
   - Ensure referenced entities exist (area, developer, community, etc.)
   - Use actual UUIDs, not placeholder values
   - Create dependencies in the correct order

4. **404 Not Found**
   - Verify the base URL is correct
   - Check that the server is running
   - Confirm endpoint paths match the API routes

## 📞 Support

For issues with the API itself, check the application logs using the "View Logs" endpoint or review the server console output.

For Postman collection issues, ensure you have the latest version of Postman and have imported both the collection and environment files correctly.
