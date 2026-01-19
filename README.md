# ndotoni Web - Airbnb-Style Property Platform

A modern, Airbnb-inspired property management web application built with Next.js, TypeScript, and AWS Amplify. Features advanced location filtering, beautiful UI, and seamless GraphQL integration.

## ✨ Features

- **🏠 Property Listings** - Beautiful grid layout with high-quality images
- **🔍 Advanced Search & Filtering** - Filter by location (region/district/ward), property type, price, bedrooms, bathrooms, and amenities
- **📍 Location Integration** - Real-time location data from Tanzania API
- **📱 Responsive Design** - Mobile-first design that works on all devices
- **⚡ Fast Performance** - Built with Next.js 14 and optimized for speed
- **🎨 Modern UI** - Clean, Airbnb-inspired interface with Tailwind CSS
- **🔗 GraphQL Integration** - Seamless connection to AWS AppSync API
- **🔒 TypeScript** - Full type safety throughout the application

## 🚀 Getting Started

1. **Install dependencies:**
```bash
cd ndotoniWeb
npm install
```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   - Edit `.env.local` and fill in your AWS credentials:
   ```bash
   NEXT_PUBLIC_USER_POOL_ID=your-user-pool-id
   NEXT_PUBLIC_USER_POOL_CLIENT_ID=your-client-id
   NEXT_PUBLIC_COGNITO_DOMAIN=your-cognito-domain
   NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/auth/callback
   NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=your-appsync-endpoint
   NEXT_PUBLIC_GRAPHQL_REGION=us-west-2
   NEXT_PUBLIC_API_KEY=your-api-key
   ```
   - **Note:** Never commit `.env.local` to version control!

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page with property listings
│   ├── property/[id]/     # Dynamic property detail pages
│   └── globals.css        # Global styles and Tailwind
├── components/            # Reusable React components
│   ├── Header.tsx         # Navigation header
│   ├── HeroSection.tsx    # Landing page hero
│   ├── SearchFilters.tsx  # Advanced filtering component
│   ├── PropertyCard.tsx   # Property listing card
│   └── AmplifyProvider.tsx # AWS Amplify wrapper
├── lib/                   # Utilities and configuration
│   ├── amplify.ts         # AWS Amplify setup
│   ├── graphql.ts         # GraphQL queries & mutations
│   └── locations.ts       # Location data utilities
└── types/                 # TypeScript type definitions
    └── property.ts        # Property-related types
```

## 🎯 Key Components

### Search & Filtering
- **Location Hierarchy**: Region → District → Ward filtering
- **Property Types**: Apartment, House, Studio, Penthouse, Villa
- **Price Range**: Min/max price filtering
- **Specifications**: Bedrooms, bathrooms, furnished status
- **Real-time Results**: Instant filtering without page reload

### Property Cards
- **High-quality Images**: Optimized image loading with Next.js Image
- **Key Information**: Price, location, specifications at a glance
- **Amenities Display**: Visual amenity tags
- **Hover Effects**: Smooth animations and interactions

### Property Details
- **Image Gallery**: Multiple photos with thumbnail navigation
- **Comprehensive Info**: Full specifications, amenities, description
- **Contact Actions**: Contact agent, schedule viewing, save property
- **Location Display**: Detailed address with map integration ready

## 🔧 Configuration

### GraphQL Schema
The app expects your GraphQL schema to include:
- `getPropertyCards` - List properties with pagination
- `getProperty` - Get single property details
- `getAppInitialState` - Get initial app data

### Location API
Uses Tanzania location data from:
```
https://d1i6oti6o90wzi.cloudfront.net/api/locations-current.json
```

## 🎨 Design System

Built with a modern design system featuring:
- **Colors**: Blue primary (#3B82F6), Gray neutrals
- **Typography**: Inter font family
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable button, card, and form components
- **Responsive**: Mobile-first breakpoints (sm, md, lg, xl)

## 📱 Mobile Experience

- Touch-friendly interface
- Optimized image loading
- Collapsible navigation
- Swipe-friendly image galleries
- Fast loading on mobile networks

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
```bash
npx vercel
```

### Deploy to AWS Amplify
```bash
amplify init
amplify add hosting
amplify publish
```

## 🔮 Future Enhancements

- [ ] Map view integration
- [ ] User authentication
- [ ] Property favorites/wishlist
- [ ] Advanced search with filters
- [ ] Property comparison
- [ ] Reviews and ratings
- [ ] Real-time messaging
- [ ] Payment integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.