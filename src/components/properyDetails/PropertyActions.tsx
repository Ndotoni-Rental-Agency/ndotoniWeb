export function PropertyActions({ property }: { property: any }) {
    return (
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-black text-white rounded">
          Contact Agent
        </button>
        <button className="px-4 py-2 border rounded">
          Save
        </button>
      </div>
    );
  }
  