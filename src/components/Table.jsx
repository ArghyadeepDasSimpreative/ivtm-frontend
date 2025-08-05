export default function Table({ label, data = [], config = [], dark = false }) {
  console.log("data is ", data);

  const wrapperClass = dark
    ? "bg-blue-950 text-gray-200 border-blue-800"
    : "bg-white text-gray-700 border-gray-200";

  const headerClass = dark
    ? "bg-[#385385] text-white border-b border-blue-800"
    : "bg-gray-100 text-gray-800 border-b border-gray-200";

  const rowBaseClass = dark ? "transition-colors" : "";

  const evenRowBg = dark ? "bg-blue-950" : "bg-white";
  const oddRowBg = dark ? "bg-[#385385]" : "bg-gray-50";

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className={`w-full h-[40vh] flex items-center justify-center shadow rounded ${wrapperClass}`}>
        <p className="text-md text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto w-full mt-6 shadow rounded border ${wrapperClass}`}>
      {label && (
        <h2 className="text-lg font-semibold px-4 py-3 border-b border-blue-800">
          {label}
        </h2>
      )}
      <table className="w-full text-md text-left border-separate border-spacing-0">
        <thead className={headerClass}>
          <tr>
            {config.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 font-medium"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={item._id || idx}
              className={`${idx % 2 === 0 ? evenRowBg : oddRowBg} ${rowBaseClass}`}
            >
              {config.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-2"
                >
                  {col.render ? col.render(item[col.key], item, idx) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
