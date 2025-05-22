export function ShimmerCard() {
  return (
    <div className="border p-4 rounded-md shadow w-64 animate-pulse bg-gray-100">
      <div className="h-40 w-full bg-gray-300 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    </div>
  );
}
