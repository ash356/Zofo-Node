import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Global Variables
const PRIMARY_COLOR = "#6b22a7";
const TEXT_COLOR = "#333";
const MARGIN = 50;
const TABLE_HEADER_COLOR = "#d3d3d3";

// Generate Invoice
const generateInvoice = (order, res, firstAddress) => {
    const doc = new PDFDocument({ size: 'A4', margin: MARGIN });
    const filePath = path.join(__dirname, "../../invoices", `invoice_${order._id}.pdf`);
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true })
    }
    doc.pipe(fs.createWriteStream(filePath));

    generateHeader(doc);
    generateCustomerInformation(doc, order, firstAddress);
    generateInvoiceTable(doc, order);
    generateFooter(doc);

    doc.end();
    doc.pipe(res);

};

// Header
const generateHeader = (doc) => {
    doc.fillColor(PRIMARY_COLOR)
        .fontSize(30)
        .text("ZOFO", MARGIN, 50)
        .moveDown(2);
};

// Customer Info
const generateCustomerInformation = (doc, order, address) => {
    const formattedDate = formatDate(order.createdAt);
    doc.fillColor(TEXT_COLOR)
        .fontSize(20)
        .text("Order", MARGIN, 160);

    generateHr(doc, 185);

    const infoTop = 200;
    doc.fontSize(13).font("Helvetica-Bold")
        .text("Order Number:", MARGIN, infoTop)
        .font("Helvetica")
        .text(order._id, 150, infoTop)

        .font("Helvetica-Bold")
        .text("Order Date:", MARGIN, infoTop + 20)
        .font("Helvetica")
        .text(formattedDate, 150, infoTop + 20)

        .font("Helvetica-Bold")
        .text("Paid:", MARGIN, infoTop + 40)
        .font("Helvetica")
        .text(formatCurrency(order.totalPrice), 150, infoTop + 40)

        .font("Helvetica-Bold")
        .text("Name:", 350, infoTop)
        .font("Helvetica")
        .text(order.userId.userName?.toUpperCase() || "N/A", 450, infoTop)

        .font("Helvetica-Bold")
        .text("Phone:", 350, infoTop + 20)
        .font("Helvetica")
        .text(address.phone || "N/A", 450, infoTop + 20)
        .text(`${address.street || "N/A"}, ${address.city || "N/A"}, Egypt`, 350, infoTop + 40)
        .moveDown();

    generateHr(doc, 262);
};

// Invoice Table
const generateInvoiceTable = (doc, order) => {
    const tableTop = 350;

    doc.save()
        .rect(MARGIN, tableTop - 10, 500, 30)
        .fill(TABLE_HEADER_COLOR)
        .restore();

    doc.fontSize(20).font("Helvetica-Bold").fill(TEXT_COLOR);
    generateTableRow(doc, tableTop, "Product", "Description", "Unit Price", "Quantity", "Line Total");
    generateHr(doc, tableTop + 20);

    order.products.forEach((item, i) => {
        const position = tableTop + (i + 1) * 30;
        generateTableRow(
            doc, position, item.name, item.slug, formatCurrency(item.unitPrice),
            item.quantity, formatCurrency(item.finalPrice)
        );
        generateHr(doc, position + 20);
    });

    const subtotalPosition = tableTop + (order.products.length + 1) * 30;
    doc.font("Helvetica-Bold");
    generateTableRow(doc, subtotalPosition, "", "", "Subtotal", "", formatCurrency(order.subtotalPrice));

    const paidPosition = subtotalPosition + 20;
    generateTableRow(doc, paidPosition, "", "", "Paid", "", formatCurrency(order.totalPrice));

    generateHr(doc, paidPosition + 20);
};

// Table Row
const generateTableRow = (doc, y, item, description, unitCost, quantity, lineTotal) => {
    doc.fontSize(12)
        .text(item, MARGIN, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "center" })
        .text(quantity, 370, y, { width: 90, align: "center" })
        .text(lineTotal, 0, y, { align: "right" });
};

// Footer
const generateFooter = (doc) => {
    doc.fillColor(PRIMARY_COLOR)
        .fontSize(20)
        .text("Thank You", MARGIN, 750, { align: "center", width: 500 });
};

// Horizontal Line
const generateHr = (doc, y) => {
    doc.strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(MARGIN, y)
        .lineTo(550, y)
        .stroke();
};

// Format Currency
const formatCurrency = (cents) => (cents / 100).toFixed(2) + " $";

// Format Date
const formatDate = (date) => `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`
export default generateInvoice;