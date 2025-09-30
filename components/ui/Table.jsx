export default function Table({ columns, data, renderRow }) {
  return (
    <div className="overflow-x-auto shadow-sm">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead className="text-gray-500 text-xs sm:text-sm">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="border-b border-gray-200 px-5 py-4 text-left"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item, index) => renderRow(item, index))}</tbody>
      </table>
    </div>
  );
}
