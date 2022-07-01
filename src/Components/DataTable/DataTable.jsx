import './DataTable.css';

export default function DataTable({ data, file, setSelectedColumn }) {
  return (
    <>
      <h2 className="table-name"> {data && file.name}</h2>
      <div className="data-table">
        <table>
          <tbody>
            <tr>
              {data &&
                data[0].map((col) => {
                  return (
                    <th
                      key={col}
                      className="col"
                      onClick={() => {
                        setSelectedColumn(col);
                      }}
                    >
                      {col}
                    </th>
                  );
                })}
            </tr>
            {data &&
              data.map((row, idx) =>
                idx === 0 ? null : (
                  <tr key={row}>
                    {row.map((col, idx) => (
                      <td key={idx}>{col}</td>
                    ))}
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </>
  );
}
