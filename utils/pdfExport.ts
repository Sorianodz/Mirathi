import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportPDF(elementId: string, filename: string) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Create a temporary unconstrained clone if we need to ensure full capture
    // html2canvas works best directly on elements though.
    
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF in A4 size
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 20;
    
    // Add header
    pdf.setFontSize(10);
    pdf.setTextColor(128);
    pdf.text('⚠️ بياناتك لم يتم حفظها في أي سيرفر لضمان خصوصيتك', pdfWidth / 2, 10, { align: 'center' });
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text('تم إنشاء هذا التقرير بواسطة حاسبة المواريث والزكاة - يعمل محلياً على جهازك', pdfWidth / 2, pdfHeight - 10, { align: 'center' });
    
    const dateStr = new Date().toLocaleDateString('ar-DZ').replace(/\//g, '-');
    pdf.save(`${filename}_${dateStr}.pdf`);
}

export function printReport(elementId: string) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const content = element.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
        <html dir="rtl" lang="ar">
        <head>
            <title>تقرير</title>
            <style>
                body { font-family: 'Noto Naskh Arabic', Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                th { background-color: #f3f4f6; }
                .bg-emerald-600 { background-color: #059669; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 1.25rem; }
                .bg-blue-600 { background-color: #2563eb; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 1.25rem; }
                ul { list-style-type: none; padding: 0; }
                li { margin-bottom: 5px; }
                .grid { display: flex; flex-wrap: wrap; gap: 15px; }
                .grid > div { flex: 1; min-width: 150px; background: #f9f9f9; padding: 10px; border-radius: 8px; text-align: center; }
                .font-bold { font-weight: bold; }
                .text-emerald-700 { color: #047857; }
                .text-blue-700 { color: #1d4ed8; }
                .text-amber-600 { color: #d97706; }
                .text-xl { font-size: 1.25rem; }
                .text-2xl { font-size: 1.5rem; }
            </style>
        </head>
        <body>
            <div style="text-align: center; margin-bottom: 20px; color: #666; font-size: 12px;">
                ⚠️ بياناتك لم يتم حفظها في أي سيرفر لضمان خصوصيتك
            </div>
            ${content}
            <div style="margin-top: 30px; text-align: center; color: #999; font-size: 11px; border-top: 1px solid #eee; padding-top: 10px;">
                تم إنشاء هذا التقرير بواسطة حاسبة المواريث والزكاة - التطبيق يعمل محلياً على جهازك
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 500); // giving time for styles to apply
}
