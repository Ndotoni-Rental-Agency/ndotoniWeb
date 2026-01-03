# Landlord Portal

The Landlord Portal is a comprehensive property management system that allows landlords to create, update, and manage their properties, as well as organize their media library.

## Features

### 1. Dashboard (`/landlord`)
- Overview of property portfolio statistics
- Quick actions for common tasks
- Recent activity feed
- Key metrics: total properties, available/occupied units, monthly revenue

### 2. Property Management (`/landlord/properties`)
- View all properties in a list format
- Filter by property status (Available, Occupied, Maintenance, Inactive)
- Search properties by title, location, or other criteria
- Quick actions: edit, view public listing
- Property status indicators and application counts

### 3. Create Property (`/landlord/properties/create`)
- Multi-step form for adding new properties
- Sections: Basic Info, Location, Specifications, Pricing, Availability, Media
- **Structured location selection** using official Tanzania location data
- Form validation and error handling
- Integration with GraphQL API for property creation

### 4. Edit Property (`/landlord/properties/[id]/edit`)
- Update existing property details
- Pre-populated form with current property data
- Save changes with GraphQL mutations

### 5. Media Library (`/landlord/media`)
- Upload and organize property photos and videos
- Grid and list view modes
- Bulk selection and deletion
- Drag-and-drop file upload
- File type filtering (images/videos)
- Tag-based organization

### 6. Integrated Media Management
- **Property Creation**: Select from existing media library or upload new images
- **Media Selector**: Browse and select multiple images from library
- **Upload Integration**: Upload new images directly during property creation
- **Comprehensive Media Manager**: Handle photos, videos, floor plans, and virtual tours

## Components

### Core Components
- `LandlordLayout`: Sidebar navigation and responsive layout
- `PropertyForm`: Reusable form component for create/edit operations
- `MediaUpload`: File upload component with progress tracking

### GraphQL Integration
- Property CRUD operations
- Media upload URL generation
- Landlord-specific property queries
- Real-time updates and error handling

## API Integration

### Property Operations
```typescript
// Create property
createProperty(landlordId: string, input: CreatePropertyInput)

// Update property
updateProperty(propertyId: string, landlordId: string, input: UpdatePropertyInput)

// Get landlord properties
getLandlordProperties(landlordId: string, limit?: number, nextToken?: string)
```

### Media Operations
```typescript
// Get media library
getMediaLibrary(userId: string)

// Get upload URL
getMediaUploadUrl(userId: string, fileName: string, contentType: string)

// Associate media with property
associateMediaWithProperty(propertyId: string, userId: string, media: PropertyMedia)
```

## Navigation Structure

```
/landlord
├── / (Dashboard)
├── /properties (Property List)
├── /properties/create (Create Property)
├── /properties/[id]/edit (Edit Property)
└── /media (Media Library)
```

## Responsive Design

The landlord portal is fully responsive with:
- Mobile-first sidebar navigation
- Collapsible menu for mobile devices
- Responsive grid layouts
- Touch-friendly interactions

## Future Enhancements

1. **Analytics Dashboard**
   - Revenue tracking and trends
   - Occupancy rate analytics
   - Property performance metrics

2. **Tenant Management**
   - Tenant profiles and communication
   - Lease management
   - Rent collection tracking

3. **Maintenance Requests**
   - Tenant-submitted maintenance requests
   - Contractor management
   - Request tracking and status updates

4. **Financial Management**
   - Expense tracking
   - Profit/loss reports
   - Tax document generation

5. **Advanced Media Features**
   - Image editing and cropping
   - Virtual tour integration
   - 360-degree photo support

## Getting Started

1. Navigate to `/landlord` to access the dashboard
2. Use the sidebar navigation to access different sections
3. Create your first property using the "Create Property" form
4. Upload media files to the media library
5. Manage your properties from the properties list page

The portal integrates seamlessly with the existing ndotoni property platform and uses the same GraphQL API for data operations.

## Location Management

The landlord portal uses structured location data to ensure consistency and accuracy:

### LocationSelector Component
- Fetches official Tanzania location data from API
- Cascading dropdowns: Region → District → Ward
- Prevents incorrect location entries
- Shows location preview with breakdown
- Optional street address input
- Fallback to mock data if API unavailable

### Location Data Flow
1. **Region Selection**: Choose from available regions
2. **District Selection**: Filtered by selected region
3. **Ward Selection**: Filtered by selected district (optional)
4. **Street Input**: Free text for specific address (optional)
5. **Coordinates**: Auto-populated using approximate location data

### Benefits
- **Data Consistency**: All properties use standardized location names
- **User Experience**: Guided selection prevents typos
- **Search Accuracy**: Enables precise location-based filtering
- **Integration Ready**: Compatible with mapping and search features
- **Simplified UX**: Coordinates are handled automatically, no manual input required

## Geocoding Integration

The system automatically handles coordinate generation for properties:

### Current Implementation
- **Approximate Coordinates**: Uses predefined coordinates for major Tanzania locations
- **Automatic Population**: Coordinates are set when location is selected
- **Fallback System**: Defaults to Dar es Salaam center if location not found
- **No User Input**: Landlords don't need to manually enter coordinates

### Supported Locations
- Major regions: Dar es Salaam, Arusha, Mwanza, Dodoma, etc.
- Dar es Salaam districts: Kinondoni, Ilala, Temeke
- Popular wards: Masaki, Mikocheni, Oyster Bay, Upanga, etc.

### Future Enhancements
- Integration with Google Maps Geocoding API
- Real-time coordinate lookup for any address
- Address validation and suggestions
- Map-based location picker
## Media Integration During Property Creation

The property creation process now includes comprehensive media management:

### MediaSelector Component
- **Library Integration**: Browse existing media library during property creation
- **Search & Filter**: Find images by filename or tags
- **Multi-Selection**: Select up to 10 images per property
- **Upload on Demand**: Upload new images without leaving the form
- **Visual Preview**: See selected images with easy removal options

### PropertyMediaManager Component
- **Tabbed Interface**: Separate sections for Photos, Videos, Floor Plans, Virtual Tours
- **Photo Management**: Full MediaSelector integration for property images
- **Video URLs**: Manual entry for video links (YouTube, Vimeo, direct links)
- **Floor Plan Upload**: Single floor plan image with preview
- **Virtual Tours**: Support for 360° tour links and interactive walkthroughs
- **Media Summary**: Overview of all media types with counts

### Workflow Benefits
1. **Streamlined Process**: Add media without switching between pages
2. **Reuse Existing Assets**: Select from previously uploaded images
3. **Immediate Upload**: Add new images during property creation
4. **Comprehensive Coverage**: Handle all media types in one interface
5. **Visual Feedback**: See selections and previews in real-time

### Technical Features
- **Auto-Selection**: Newly uploaded images are automatically selected
- **Limit Management**: Prevents over-selection with clear feedback
- **Error Handling**: Graceful fallbacks for API failures
- **Mock Data Support**: Works with sample data for development
- **Responsive Design**: Optimized for desktop and mobile use