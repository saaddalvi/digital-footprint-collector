import Button from './Button';
import { generatePDFReport } from '@/utils/pdfGenerator';

interface PDFExportButtonProps {
  data: any;
}

export default function PDFExportButton({ data }: PDFExportButtonProps) {
  const handleExport = () => {
    generatePDFReport(data);
  };

  return (
    <Button onClick={handleExport} variant="primary" size="sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <span>Generate PDF Report</span>
    </Button>
  );
}