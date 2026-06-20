export const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'ROOM', 'STUDIO', 'COMMERCIAL', 'LAND'];

export const PRESET_AMENITIES = [
  'WiFi', 'Parking', 'Security Guard', 'Generator', 'Water Tank',
  'Air Conditioning', 'Swimming Pool', 'Gym', 'Balcony', 'Garden',
  'CCTV', 'Elevator', 'Laundry', 'Furnished Kitchen', 'Borehole',
  'Solar Power', 'Intercom', 'Gated Community',
];

export const labels: Record<string, Record<string, string>> = {
  en: {
    basicInfo: 'Basic Info', pricing: 'Pricing & Fees', details: 'Property Details',
    location: 'Location', availability: 'Availability', amenities: 'Amenities', media: 'Photos & Media',
    title: 'Title', description: 'Description', propertyType: 'Property Type', status: 'Status',
    monthlyRent: 'Monthly Rent (TZS)', deposit: 'Deposit (TZS)', serviceCharge: 'Service Charge (TZS)',
    currency: 'Currency', utilitiesIncluded: 'Utilities Included', utilitiesSub: 'Water, electricity included in rent',
    bedrooms: 'Bedrooms', bathrooms: 'Bathrooms', size: 'Size (m²)', floors: 'Floors',
    parking: 'Parking Spaces', furnished: 'Furnished', furnishedSub: 'Property comes with furniture',
    district: 'District', ward: 'Ward', street: 'Street', postalCode: 'Postal Code', pinOnMap: 'Pin on Map',
    availableForRent: 'Available for Rent', availableSub: 'Show this property to potential tenants',
    availableFrom: 'Available From', minLease: 'Min. Lease (months)', maxLease: 'Max. Lease (months)',
    save: 'Save', saving: 'Saving…', saved: 'Saved!', cancel: 'Cancel',
    select: 'Select', available: 'Available', rented: 'Rented', draft: 'Draft',
  },
  sw: {
    basicInfo: 'Taarifa za Msingi', pricing: 'Bei na Gharama zingine', details: 'Maelezo ya Nyumba',
    location: 'Mahali', availability: 'Upatikanaji', amenities: 'Vifaa', media: 'Picha na Video',
    title: 'Jina la Nyumba', description: 'Maelezo', propertyType: 'Aina ya Nyumba', status: 'Hali',
    monthlyRent: 'Kodi ya Mwezi (TZS)', deposit: 'Amana (TZS)', serviceCharge: 'Service Charge(TZS)',
    currency: 'Sarafu', utilitiesIncluded: 'Huduma Zimejumuishwa', utilitiesSub: 'Maji, umeme vimejumuishwa kwenye kodi',
    bedrooms: 'Vyumba vya Kulala', bathrooms: 'Bafu na Choo', size: 'Ukubwa (m²)', floors: 'Ghorofa',
    parking: 'Nafasi za Kuegesha', furnished: 'Ina Samani', furnishedSub: 'Nyumba ina samani',
    district: 'Wilaya', ward: 'Kata', street: 'Mtaa', postalCode: 'Sanduku la Posta', pinOnMap: 'Weka kwenye Ramani',
    availableForRent: 'Inapatikana Kukodishwa', availableSub: 'Onyesha nyumba hii kwa wapangaji',
    availableFrom: 'Inapatikana Kuanzia', minLease: 'Muda wa Chini (miezi)', maxLease: 'Muda wa Juu (miezi)',
    save: 'Hifadhi', saving: 'Inahifadhi…', saved: 'Imehifadhiwa!', cancel: 'Ghairi',
    select: 'Chagua', available: 'Inapatikana', rented: 'Imekodishwa', draft: 'Rasimu',
  },
};
