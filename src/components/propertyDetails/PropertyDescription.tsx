export function PropertyDescription({
    description,
  }: {
    description?: string;
  }) {
    if (!description) return null;
  
    return (
      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {description}
        </p>
      </div>
    );
  }
  