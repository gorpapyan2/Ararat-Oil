import React from 'react';
import { cn } from '@/shared/utils';

interface DataTableProps {
  data: any[];
  columns: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessorKey}
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  key={`${row.id}-${column.accessorKey}`}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {row[column.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
