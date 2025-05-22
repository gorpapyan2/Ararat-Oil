import { FuelSupply } from '../types';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export function exportToCsv(supplies: FuelSupply[], filename: string) {
  const headers = [
    'Delivery Date',
    'Provider',
    'Tank',
    'Fuel Type',
    'Quantity (L)',
    'Price/L',
    'Total Cost',
    'Payment Status',
    'Comments'
  ];

  const rows = supplies.map(supply => [
    format(new Date(supply.delivery_date), 'yyyy-MM-dd'),
    supply.provider?.name || '',
    supply.tank?.name || '',
    supply.tank?.fuel_type || '',
    supply.quantity_liters.toString(),
    supply.price_per_liter.toFixed(2),
    supply.total_cost.toFixed(2),
    supply.payment_status || '',
    supply.comments || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPdf(supplies: FuelSupply[], filename: string) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Fuel Supplies Report', 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 22);

  // Prepare table data
  const tableData = supplies.map(supply => [
    format(new Date(supply.delivery_date), 'yyyy-MM-dd'),
    supply.provider?.name || '',
    supply.tank?.name || '',
    supply.tank?.fuel_type || '',
    supply.quantity_liters.toString(),
    `$${supply.price_per_liter.toFixed(2)}`,
    `$${supply.total_cost.toFixed(2)}`,
    supply.payment_status || ''
  ]);

  // Add table
  (doc as any).autoTable({
    head: [['Date', 'Provider', 'Tank', 'Type', 'Quantity', 'Price/L', 'Total', 'Status']],
    body: tableData,
    startY: 30,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255
    }
  });

  // Add summary
  const totalQuantity = supplies.reduce((sum, s) => sum + s.quantity_liters, 0);
  const totalCost = supplies.reduce((sum, s) => sum + s.total_cost, 0);
  
  const finalY = (doc as any).lastAutoTable.finalY || 30;
  
  doc.setFontSize(10);
  doc.text(`Total Quantity: ${totalQuantity.toLocaleString()} L`, 14, finalY + 10);
  doc.text(`Total Cost: $${totalCost.toLocaleString()}`, 14, finalY + 17);

  // Save the PDF
  doc.save(`${filename}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
} 