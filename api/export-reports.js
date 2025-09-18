const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data, salonId, dateRange } = req.body;

    if (type === 'excel') {
      // Generate Excel report
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Revenue Report');

      // Add headers
      worksheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Customer', key: 'customer', width: 20 },
        { header: 'Service', key: 'service', width: 25 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Payment Method', key: 'paymentMethod', width: 20 },
        { header: 'Status', key: 'status', width: 15 }
      ];

      // Add data rows
      data.forEach(booking => {
        worksheet.addRow({
          date: booking.date,
          customer: booking.customerName,
          service: booking.serviceName,
          amount: booking.amount,
          paymentMethod: booking.paymentMethod,
          status: booking.status
        });
      });

      // Add totals
      const totalRow = data.length + 2;
      worksheet.addRow({});
      worksheet.addRow({
        date: 'TOTAL',
        amount: data.reduce((sum, booking) => sum + booking.amount, 0)
      });

      // Style the total row
      worksheet.getRow(totalRow).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="revenue-report-${salonId}-${Date.now()}.xlsx"`);
      res.send(buffer);

    } else if (type === 'pdf') {
      // Generate PDF report
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="revenue-report-${salonId}-${Date.now()}.pdf"`);
        res.send(pdfData);
      });

      // Add content to PDF
      doc.fontSize(20).text('Revenue Report', 100, 100);
      doc.fontSize(12).text(`Salon ID: ${salonId}`, 100, 140);
      doc.text(`Date Range: ${dateRange}`, 100, 160);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 100, 180);

      // Add table headers
      let yPosition = 220;
      doc.text('Date', 100, yPosition);
      doc.text('Customer', 200, yPosition);
      doc.text('Service', 300, yPosition);
      doc.text('Amount', 450, yPosition);
      doc.text('Payment', 550, yPosition);

      // Add data rows
      data.forEach(booking => {
        yPosition += 20;
        doc.text(booking.date, 100, yPosition);
        doc.text(booking.customerName, 200, yPosition);
        doc.text(booking.serviceName, 300, yPosition);
        doc.text(`DKK ${booking.amount}`, 450, yPosition);
        doc.text(booking.paymentMethod, 550, yPosition);
      });

      // Add total
      yPosition += 30;
      doc.fontSize(14).text(`Total Revenue: DKK ${data.reduce((sum, booking) => sum + booking.amount, 0)}`, 100, yPosition);

      doc.end();
    } else {
      res.status(400).json({ error: 'Invalid export type' });
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
}
