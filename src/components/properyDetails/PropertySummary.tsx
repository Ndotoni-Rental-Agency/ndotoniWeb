export function PropertySummary({ property }: { property: any }) {
    return (
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <p className="text-gray-600">
          {property.address?.ward}, {property.address?.district},{' '}
          {property.address?.region}
        </p>
      </div>
    );
  }
  