export const en = {
  // Navigation
  nav: {
    home: "Home",
    properties: "Properties",
    messages: "Messages",
    profile: "Profile",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    myStays: "My Stays",
    favorites: "Favorites",
    myProperties: "My Properties",
    listProperty: "List Property",
    adminPanel: "Admin Panel",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    about: "About",
    contact: "Contact",
  },

  // Hero Section
  hero: {
    titleBefore: "Find Your",
    titleHighlight: "Dream",
    titleAfter: "Home",
    subtitle: "Discover verified rentals in Tanzania",
    searchPlaceholder: "Search properties...",
    stats: {
      properties: "Properties",
      locations: "Locations", 
      support: "Support",
    },
  },

  // Property Listings
  properties: {
    availableNow: "Available Now",
    readyToMoveIn: "Ready to move in",
    bedrooms: "bedrooms",
    bathrooms: "bathrooms",
    sqft: "sqft",
    perMonth: "per month",
    perMonthShort: "/mo",
    bed: "bed",
    beds: "beds",
    viewDetails: "View Details",
    contactAgent: "Contact Agent",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    messageAboutProperty: "Message about this property",
    
    // Property types
    propertyTypes: {
      apartment: "Apartment",
      house: "House",
      villa: "Villa",
      studio: "Studio",
      room: "Room",
      commercial: "Commercial",
      land: "Land",
    },
    
    // Property card format
    propertyIn: "in", // "Apartment in Njiro"
    
    // Sections
    nearbyTitle: "Near You",
    nearbySubtitle: "Properties in your area",
    bestPricesTitle: "Best Prices",
    bestPricesSubtitle: "Most affordable properties",
    mostPopularTitle: "Most Popular",
    mostPopularSubtitle: "Properties everyone is viewing",
    favoritesTitle: "Your Favorites",
    favoritesSubtitle: "Properties you've saved",
    recentTitle: "Recently Viewed",
    recentSubtitle: "Properties you've recently looked at",
    morePropertiesTitle: "More Properties",
    morePropertiesSubtitle: "Explore all available properties",
    allPropertiesTitle: "Explore all properties",
    allPropertiesSubtitle: "Discover more places to stay",
    
    showAll: "Show all",
    sort: "Sort",
    clearFilters: "Clear filters",
    
    // Empty states
    noProperties: "No properties match your filters",
    tryAdjusting: "Try adjusting your search criteria",
    clearAllFilters: "Clear all filters",
  },

  // Search & Filters
  search: {
    where: "Where",
    wherePlaceholder: "Region or District",
    whereQuestion: "Where do you want to live?",
    searchDestinations: "Search destinations",
    checkIn: "Check in",
    checkOut: "Check out", 
    guests: "Guests",
    searchButton: "Search",
    
    // Filters
    propertyType: "Property Type",
    priceRange: "Price Range",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    amenities: "Amenities",
    
    // Property types
    apartment: "Apartment",
    house: "House",
    villa: "Villa",
    studio: "Studio",
    
    // Amenities
    wifi: "WiFi",
    parking: "Parking",
    pool: "Swimming Pool",
    gym: "Gym",
    security: "Security",
    generator: "Generator",
  },

  // Messages/Chat
  messages: {
    title: "Messages",
    conversations: "conversations",
    conversation: "conversation",
    searchPlaceholder: "Search",
    startConversation: "Start the conversation",
    sendFirstMessage: "Send your first message about",
    messagePlaceholder: "Message",
    signInRequired: "Sign in to access Messages",
    signInDescription: "You need to be signed in to view and send messages. Please sign in to continue.",
    selectConversation: "Select a conversation",
    selectDescription: "Choose a conversation from the sidebar to start messaging",
    moreOptions: "More options",
    backToConversations: "Back to conversations",
  },

  // Auth
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up", 
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signInButton: "Sign In",
    signUpButton: "Create Account",
    or: "or",
    continueWithGoogle: "Continue with Google",
    continueWithFacebook: "Continue with Facebook",
  },

  // Common
  common: {
    loading: "Loading...",
    loadingProperties: "Loading properties...",
    error: "Error",
    tryAgain: "Try Again",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    
    // Time
    now: "now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
    weeksAgo: "weeks ago",
    
    // Currency
    currency: "TZS",
  },

  // Property Details
  propertyDetails: {
    overview: "Overview",
    amenities: "Amenities",
    location: "Location",
    reviews: "Reviews",
    host: "Host",
    bookNow: "Book Now",
    contactHost: "Contact Host",
    shareProperty: "Share Property",
    reportProperty: "Report Property",
    
    // Sections
    aboutProperty: "About this property",
    whereYoullBe: "Where you'll be",
    thingsToKnow: "Things to know",
    
    // Rules
    houseRules: "House rules",
    checkInTime: "Check-in time",
    checkOutTime: "Check-out time",
    maxGuests: "Maximum guests",
  },

  // Landlord / Property Creation
  landlord: {
    // Dashboard
    dashboard: {
      title: "Landlord Dashboard",
      myProperties: "My Properties",
      inbox: "Inbox",
      analytics: "Analytics",
      settings: "Settings",
    },

    // Property Creation
    createProperty: {
      title: "Create a new listing",
      titleDuplicate: "Duplicate property listing",
      subtitle: "Share your space with guests and start earning on ndotoni",
      subtitleDuplicate: "Create a new listing based on an existing property",
      publishButton: "Publish listing",
      saveAsDraft: "Save as draft",
      creating: "Creating...",
      
      // Duplication banner
      duplicatingTitle: "Duplicating Property",
      duplicatingMessage: "This form has been pre-filled with data from an existing property. You can modify any details before publishing.",
      
      // Progress
      stepOf: "Step {current} of {total}",
      
      // Navigation
      back: "Back",
      continue: "Continue",
      
      // Validation
      fixErrors: "Please fix the following errors:",
      fieldRequired: "{field} is required",
      
      // Steps
      steps: {
        basicInfo: "Basic Information",
        location: "Location",
        specifications: "Specifications",
        pricing: "Pricing",
        availability: "Availability",
        media: "Photos & Media",
      },
      
      // Step 1: Basic Info
      basicInfo: {
        propertyName: "What's the name of your place?",
        propertyNameHelper: "Short names work best. Have fun with it—you can always change it later.",
        propertyNamePlaceholder: "e.g., Modern 2-Bedroom Apartment in Masaki",
        
        description: "Create your description",
        descriptionHelper: "Share what makes your place special and help guests imagine their stay.",
        descriptionPlaceholder: "Describe your property, its features, and what makes it special...",
        characterCount: "{count}/500",
        
        propertyType: "What type of place will guests have?",
        apartment: "Apartment",
        apartmentDesc: "A property in a residential building",
        house: "House",
        houseDesc: "A standalone residential property",
        villa: "Villa",
        villaDesc: "A luxurious standalone property",
        studio: "Studio",
        studioDesc: "A single-room living space",
        commercial: "Commercial",
        commercialDesc: "Office or retail space",
        land: "Land",
        landDesc: "Undeveloped property",
      },
      
      // Step 2: Location
      location: {
        title: "Where is your property located?",
        helper: "Guests will only get your exact address once they've booked a reservation.",
        
        region: "Region",
        regionPlaceholder: "Select region",
        district: "District",
        districtPlaceholder: "Select district",
        ward: "Ward",
        wardPlaceholder: "Enter ward",
        street: "Street address",
        streetPlaceholder: "Enter street address",
        
        coordinates: "Location on map",
        coordinatesHelper: "Drag the marker to the exact location of your property",
        latitude: "Latitude",
        longitude: "Longitude",
      },
      
      // Step 3: Specifications
      specifications: {
        title: "Share some basics about your place",
        helper: "You'll be able to add more details later.",
        
        bedrooms: "Bedrooms",
        bathrooms: "Bathrooms",
        squareMeters: "Square meters",
        floors: "Floors",
        parkingSpaces: "Parking spaces",
        
        furnished: "Furnished",
        furnishedYes: "Yes, fully furnished",
        furnishedNo: "No, unfurnished",
        
        amenities: "What amenities do you offer?",
        amenitiesHelper: "Select all that apply",
      },
      
      // Step 4: Pricing
      pricing: {
        title: "Now, set your price",
        helper: "You can change it anytime.",
        
        monthlyRent: "Monthly rent",
        monthlyRentHelper: "This is the amount tenants will pay each month",
        deposit: "Security deposit",
        depositHelper: "Usually equivalent to 1-2 months rent",
        serviceCharge: "Service charge (optional)",
        serviceChargeHelper: "Additional monthly fees for maintenance, etc.",
        
        currency: "Currency",
        utilitiesIncluded: "Utilities included in rent",
        utilitiesIncludedYes: "Yes, utilities are included",
        utilitiesIncludedNo: "No, tenants pay separately",
      },
      
      // Step 5: Availability
      availability: {
        title: "When is your property available?",
        helper: "This helps tenants plan their move-in date.",
        
        availableNow: "Available immediately",
        availableFrom: "Available from",
        availableFromHelper: "Select the earliest date tenants can move in",
        
        leaseTerm: "Lease terms",
        minimumLease: "Minimum lease term (months)",
        maximumLease: "Maximum lease term (months)",
        leaseHelper: "Typical lease terms are 6-12 months",
      },
      
      // Step 6: Media
      media: {
        title: "Add photos of your property",
        helper: "You'll need at least one photo to publish. You can add more or make changes later.",
        
        uploadPhotos: "Upload photos",
        dragDrop: "Drag and drop your photos here, or click to browse",
        requirements: "JPG, PNG or WEBP • Max 5MB each • Min 1024x768px",
        
        mainPhoto: "Main photo",
        mainPhotoHelper: "This will be the first photo guests see",
        
        videos: "Videos (optional)",
        videosHelper: "Add video tours to showcase your property",
        
        floorPlan: "Floor plan (optional)",
        floorPlanHelper: "Help guests visualize the layout",
        
        virtualTour: "Virtual tour link (optional)",
        virtualTourHelper: "Add a 360° virtual tour link",
      },
    },
  },

  // Profile & Account Settings
  profile: {
    title: "Profile",
    signInRequired: "Sign In Required",
    signInDescription: "You need to sign in to view your profile.",
    editProfile: "Edit Profile",
    accountSettings: "Account Settings",
    languageAndCurrency: "Language & Currency",
    language: "Language",
    currency: "Currency",
    preferencesUpdated: "Preferences updated successfully!",
    preferencesUpdateError: "Failed to update preferences",
    saving: "Saving...",
    savePreferences: "Save Preferences",
    accountInformation: "Account Information",
    accountType: "Account Type",
    accountStatus: "Account Status",
    memberSince: "Member Since",
    lastUpdated: "Last Updated",
    never: "Never",
    userId: "User ID",
    dangerZone: "Danger Zone",
    signOut: "Sign Out",
    signOutDescription: "Sign out of your account on this device.",
    deleteAccount: "Delete Account",
    deleteAccountDescription: "Permanently delete your account and all associated data. This action cannot be undone.",
    deleteAccountDisabled: "Account deletion is currently disabled. Please contact support for assistance.",
  },

  // Auth Modal
  authModal: {
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
    resetPassword: "Reset your password",
    verifyEmail: "Verify your email",
    createNewPassword: "Create new password",
    signInSubtitle: "Sign in to your ndotoni account",
    signUpSubtitle: "Join ndotoni to find your perfect home",
    forgotPasswordSubtitle: "Enter your email to reset your password",
  },

  // Become Landlord
  becomeLandlord: {
    title: "Become a Landlord",
    subtitle: "Fill out this form to list your properties on ndotoni",
    personalInformation: "Personal Information",
    businessInformation: "Business Information",
    contactInformation: "Contact Information",
    alternatePhoneNumber: "Alternate Phone Number",
    preFilledFromAccount: "Pre-filled from your account",
    addressInformation: "Address Information",
    loadingLocationData: "Loading location data...",
    region: "Region",
    district: "District",
    ward: "Ward",
    street: "Street Address",
    submit: "Submit",
    submitting: "Submitting...",
    success: "Your application has been submitted successfully!",
    error: "There was an error submitting your application.",
  },

  // Common UI Messages
  uiMessages: {
    success: "Success!",
    error: "Error",
    loading: "Loading...",
    saving: "Saving...",
    deleting: "Deleting...",
    updating: "Updating...",
    creating: "Creating...",
    noData: "No data",
    tryAgain: "Try again",
    somethingWentWrong: "Something went wrong",
    operationFailed: "Operation failed",
    operationSuccess: "Operation successful",
  },

  // Property Status
  propertyStatus: {
    draft: "Draft",
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  },

  // Application Status
  applicationStatus: {
    submitted: "Submitted",
    underReview: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
  },

  // User Types
  userType: {
    tenant: "Tenant",
    landlord: "Landlord",
    admin: "Admin",
  },

  // Account Status
  accountStatus: {
    active: "Active",
    suspended: "Suspended",
    pending: "Pending",
  },

  // Form Labels & Placeholders
  forms: {
    enterFirstName: "Enter your first name",
    enterLastName: "Enter your last name",
    enterEmail: "Enter your email",
    enterPhone: "Enter your phone number",
    enterPassword: "Create password",
    confirmPassword: "Confirm your password",
    emailCannotBeChanged: "Email address cannot be changed. Please contact support if you need to update it.",
    validTanzaniaPhone: "Enter a valid Tanzania phone number",
    updateProfile: "Update Profile",
    updating: "Updating...",
    editListing: "Edit your listing",
    updateListingSubtitle: "Update your property details and get your listing live",
    saveChanges: "Save Changes",
    submitApplication: "Submit Application",
    submitting: "Submitting...",
    refresh: "Refresh",
    deleteItem: "Delete this item",
  },

  // Validation Messages
  validation: {
    required: "This field is required",
    invalidEmail: "Invalid email address",
    invalidPhone: "Invalid phone number",
    passwordTooShort: "Password must be at least 8 characters",
    passwordsDoNotMatch: "Passwords do not match",
    invalidDate: "Invalid date",
    invalidNumber: "Invalid number",
    maxLength: "Maximum length is {max} characters",
    minLength: "Minimum length is {min} characters",
  },

  // Error Messages
  errors: {
    generic: "An error occurred. Please try again.",
    networkError: "Network error. Please make sure you are connected to the internet.",
    unauthorized: "You do not have permission to perform this action.",
    notFound: "Not found.",
    serverError: "Server error. Please try again later.",
    updatePropertyError: "Error updating property. Please try again.",
    uploadFilesError: "Error uploading files. Please try again.",
    deleteItemsError: "Error deleting items. Please try again.",
    fetchError: "Error fetching data. Please try again.",
  },

  // Success Messages
  success: {
    profileUpdated: "Your profile has been updated successfully!",
    preferencesUpdated: "Your preferences have been updated successfully!",
    propertyUpdated: "Your property has been updated successfully!",
    propertyCreated: "Your property has been created successfully!",
    applicationSubmitted: "Your application has been submitted successfully!",
    messageSent: "Message sent successfully!",
    fileUploaded: "File uploaded successfully!",
    itemDeleted: "Item deleted successfully!",
  },

  // Media & Upload
  media: {
    uploadPhotos: "Upload Photos",
    uploadVideos: "Upload Videos",
    selectFiles: "Select Files",
    dragDropFiles: "Drag and drop your files here, or click to browse",
    fileRequirements: "JPG, PNG or WEBP • Max 5MB each",
    maxFileSize: "Maximum file size is 5MB",
    unsupportedFileType: "Unsupported file type",
    uploading: "Uploading...",
    uploadSuccess: "File uploaded successfully",
    uploadError: "Error uploading file",
    deleteConfirm: "Are you sure you want to delete this item?",
    searchImages: "Search images by name or label...",
  },

  // Property Edit
  propertyEdit: {
    title: "Edit your listing",
    subtitle: "Update your property details and get your listing live",
    saveChanges: "Save Changes",
    saving: "Saving...",
  },

  // Application
  application: {
    title: "Rental Application",
    applicantDetails: "Applicant Details",
    propertyDetails: "Property Details",
    submitDate: "Submit Date",
    status: "Status",
    viewDetails: "View Details",
    noApplications: "No applications found",
  },

  // About Page
  about: {
    hero: {
      badge: "Building the future of housing",
      title: "About",
      titleHighlight: "ndotoni",
      subtitle: "Transforming property rentals across East Africa. Making quality housing accessible to everyone through technology and trust.",
      getInTouch: "Get In Touch",
      browseProperties: "Browse Properties",
    },
    stats: {
      propertiesListed: "Properties Listed",
      happyTenants: "Happy Tenants",
      citiesCovered: "Cities Covered",
      yearsOfExperience: "Years of Experience",
    },
    tabs: {
      story: "Our Story",
      mission: "Mission & Vision",
      team: "Our Team",
    },
    story: {
      title: "Our Story",
      paragraph1: "ndotoni was born from a simple frustration: finding quality rental properties in East Africa was difficult, time-consuming, and often unreliable.",
      paragraph2: "In 2016, we set out to change that. We started with a vision to create a platform that would connect property owners directly with tenants, eliminating middlemen and reducing costs while improving transparency and trust.",
      paragraph3: "What started as a small company in Tanzania has grown into a leading property rental platform across East Africa. We've helped thousands of families find their perfect homes and assisted property owners in managing their investments more efficiently.",
      quote: "Today, we continue to innovate and expand our services, always keeping our core mission at heart: making quality housing accessible to everyone.",
    },
    mission: {
      title: "Mission & Vision",
      missionTitle: "Our Mission",
      missionDescription: "To increase access to quality housing by creating a transparent, efficient, and trustworthy platform that connects property owners with tenants across East Africa.",
      visionTitle: "Our Vision",
      visionDescription: "A future where everyone has access to safe, affordable, and quality housing, supported by technology that makes property rentals easy, transparent, and fair for all parties.",
      valuesTitle: "Our Values",
      transparency: "Transparency",
      transparencyDesc: "Open, honest communication between all parties in every transaction.",
      innovation: "Innovation",
      innovationDesc: "Continuously improving our platform to make rentals easier and more efficient.",
      community: "Community",
      communityDesc: "Building strong relationships between property owners, tenants, and local communities.",
      quality: "Quality",
      qualityDesc: "Maintaining high standards for properties and service quality.",
    },
    team: {
      title: "Meet Our Team",
      subtitle: "A diverse team of passionate individuals dedicated to transforming the rental experience.",
    },
    whyChooseUs: {
      title: "Why Choose ndotoni?",
      subtitle: "We make finding your perfect home easy, secure, and worry-free.",
      verifiedProperties: "Verified Properties",
      verifiedPropertiesDesc: "All properties are verified to ensure quality and legitimacy.",
      directCommunication: "Direct Communication",
      directCommunicationDesc: "Connect directly with property owners without intermediaries.",
      securePayments: "Secure Payments",
      securePaymentsDesc: "Secure payment processing for all transactions.",
      support24_7: "24/7 Support",
      support24_7Desc: "Round-the-clock customer support to help you every step of the way.",
    },
    cta: {
      title: "Ready to Find Your Perfect Home?",
      subtitle: "Join thousands of satisfied tenants who have found their perfect properties through ndotoni.",
      startSearching: "Start Searching",
      contactUs: "Contact Us",
    },
  },

  // Contact Page
  contact: {
    header: {
      online: "We're online and ready to help",
      title: "Contact",
      titleHighlight: "Us",
      subtitle: "Ready to find your perfect home or list your property? We're here to make it happen.",
      callUs: "Call Us",
      callUsDesc: "Speak directly with our team",
      emailUs: "Email Us",
      emailUsDesc: "Get a response within 24 hours",
      liveChat: "Live Chat",
      liveChatDesc: "Chat with us instantly",
      startChat: "Start Chat",
      fastResponse: "Fast Response",
      fastResponseTime: "Within 2 hours",
      available24_7: "Available 24/7",
      alwaysHere: "We're always here for you",
    },
    tabs: {
      sendMessage: "Send Message",
      ourOffices: "Our Offices",
      businessHours: "Business Hours",
    },
    form: {
      title: "Send Us a Message",
      subtitle: "Fill out the form below and we'll get back to you within 24 hours",
      fullName: "Full Name",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number",
      inquiryType: "Inquiry Type",
      subject: "Subject",
      message: "Message",
      sendMessage: "Send Message",
      sendingMessage: "Sending Message...",
      messageSent: "Message sent successfully!",
      messageSentDesc: "We'll get back to you soon.",
      messageFailed: "Failed to send message",
      messageFailedDesc: "Please try again or contact us directly.",
      inquiryTypes: {
        general: "General Inquiry",
        support: "Customer Support",
        partnership: "Business Partnership",
        property: "Property Related",
      },
      placeholders: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+255 123 456 789",
        subject: "How can we help you?",
        message: "Tell us more about your inquiry...",
      },
    },
    offices: {
      title: "Our Offices",
      subtitle: "Visit us at any of our offices across Tanzania",
      mainOffice: "Main Office",
    },
    hours: {
      title: "Business Hours",
      subtitle: "We're here to help you during these hours",
      regularHours: "Regular Hours",
      mondayFriday: "Monday - Friday",
      saturday: "Saturday",
      sunday: "Sunday",
      closed: "Closed",
      emergencySupport: "Emergency Support",
      available24_7: "Available 24/7",
      forUrgentIssues: "For urgent property issues",
      emergencyHotline: "Emergency Hotline",
      holidayHours: "Holiday Hours",
      holidayHoursDesc: "Our hours may vary during public holidays. Please check our website or call ahead.",
    },
    cta: {
      title: "Ready to Get Started?",
      subtitle: "Join thousands of satisfied customers who have found their perfect properties with ndotoni.",
      browseProperties: "Browse Properties",
      learnMore: "Learn More About Us",
    },
  },

  // Footer
  footer: {
    company: "Company",
    support: "Support",
    hosting: "Hosting",
    about: "About",
    contact: "Contact",
    careers: "Careers",
    helpCenter: "Help Center",
    safety: "Safety",
    cancellation: "Cancellation",
    community: "Community",
    listYourProperty: "List Your Property",
    hostResources: "Host Resources",
    communityForum: "Community Forum",
    hostingResponsibly: "Hosting Responsibly",
    privacy: "Privacy",
    terms: "Terms",
    sitemap: "Sitemap",
    allRightsReserved: "All rights reserved © 2024 ndotoni. All rights reserved.",
  },

  // Admin
  admin: {
    dashboard: {
      title: "Admin Dashboard",
      welcome: "Welcome back, {name}! Manage your platform from here.",
      totalProperties: "Total Properties",
      pendingReview: "Pending Review",
      totalUsers: "Total Users",
      applications: "Applications",
      properties: "Properties",
      users: "Users",
      manageProperties: "Manage Properties",
      manageUsers: "Manage Users",
      viewApplications: "View Applications",
      manageAndReview: "Manage and review property listings",
      viewAndEdit: "View and edit user accounts",
      reviewApplications: "Review rental applications",
      propertiesPendingReview: "Properties Pending Review",
      recentProperties: "Recent Properties",
      viewAll: "View All",
      review: "Review",
      noPropertiesPending: "No properties pending review",
      noPropertiesFound: "No properties found",
    },
    users: {
      title: "Users",
      searchPlaceholder: "Search users...",
      editUser: "Edit User",
      save: "Save",
      cancel: "Cancel",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      updateSuccess: "User updated successfully!",
      updateError: "Failed to update user. Please try again.",
      noUsers: "No users found",
    },
    applications: {
      title: "Applications",
      searchPlaceholder: "Search applications...",
      allStatuses: "All Statuses",
      submitted: "Submitted",
      underReview: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
      viewDetails: "View Details",
      applicant: "Applicant",
      property: "Property",
      status: "Status",
      submittedDate: "Submitted Date",
      noApplications: "No applications found",
    },
    properties: {
      title: "Properties",
      searchPlaceholder: "Search properties...",
      allStatuses: "All Statuses",
      draft: "Draft",
      active: "Active",
      inactive: "Inactive",
      updateStatus: "Update Status",
      updateSuccess: "Property status updated successfully!",
      updateError: "Failed to update property status. Please try again.",
      noProperties: "No properties found",
    },
  },
};
