export default function TableSkeleton({ rows = 5, columns = 7 }) {
  return (
    <table className="w-full">
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td
                key={colIndex}
                className="border-b border-gray-200 px-5 py-4"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
