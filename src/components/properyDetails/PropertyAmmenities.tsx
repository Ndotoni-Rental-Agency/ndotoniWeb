export function PropertyAmenities({
    amenities,
  }: {
    amenities: string[];
  }) {
    if (!amenities.length) return null;
  
    return (
      <div>
        <h3 className="font-semibold mb-2">Amenities</h3>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {amenities.map(a => (
            <li key={a}>• {a}</li>
          ))}
        </ul>
      </div>
    );
  }
  