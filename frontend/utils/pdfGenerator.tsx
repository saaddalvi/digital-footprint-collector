import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SearchResult {
  query: string;
  type: string;
  results: any;
  timestamp: string;
}

export function generatePDFReport(data: SearchResult) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFillColor(99, 102, 241); // Indigo
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Digital Footprint Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date(data.timestamp).toLocaleString()}`, pageWidth / 2, 30, { align: 'center' });

  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // Search Information
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Search Information', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Query: ${data.query}`, 14, yPosition);
  yPosition += 7;
  doc.text(`Type: ${data.type.toUpperCase()}`, 14, yPosition);
  yPosition += 15;

  // Generate content based on search type
  if (data.type === 'username') {
    generateUsernameReport(doc, data.results, yPosition);
  } else if (data.type === 'email') {
    generateEmailReport(doc, data.results, yPosition);
  } else if (data.type === 'name') {
    generateNameReport(doc, data.results, yPosition);
  }

  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages} | Digital Footprint Collector`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const filename = `DFC_${data.type}_${data.query.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

function generateUsernameReport(doc: jsPDF, results: any, startY: number) {
  let yPosition = startY;

  // Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Platforms Found: ${results.total_found}`, 14, yPosition);
  yPosition += 10;

  // Social Media Profiles Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Social Media Profiles', 14, yPosition);
  yPosition += 5;

  const foundProfiles = results.social_media.filter((p: any) => p.found);
  const notFoundProfiles = results.social_media.filter((p: any) => !p.found);

  if (foundProfiles.length > 0) {
    const tableData = foundProfiles.map((profile: any) => [
      profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1),
      'Found',
      profile.url
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Platform', 'Status', 'URL']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 9 },
      columnStyles: {
        2: { cellWidth: 80 }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Not Found Platforms
  if (notFoundProfiles.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Platforms Not Found', 14, yPosition);
    yPosition += 5;

    const notFoundData = notFoundProfiles.map((profile: any) => [
      profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1),
      'Not Found'
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Platform', 'Status']],
      body: notFoundData,
      theme: 'grid',
      headStyles: { fillColor: [239, 68, 68] },
      styles: { fontSize: 9 }
    });
  }
}

function generateEmailReport(doc: jsPDF, results: any, startY: number) {
  let yPosition = startY;

  // Email Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Email Information', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Email: ${results.email}`, 14, yPosition);
  yPosition += 7;
  doc.text(`Username: ${results.username}`, 14, yPosition);
  yPosition += 7;
  doc.text(`Domain: ${results.domain}`, 14, yPosition);
  yPosition += 7;
  doc.text(`Provider: ${results.provider}`, 14, yPosition);
  yPosition += 15;

  // Domain Information
  if (results.domain_information && !results.domain_information.error) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Domain Information', 14, yPosition);
    yPosition += 10;

    const domainInfo = results.domain_information;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    if (domainInfo.domain_name) {
      doc.text(`Domain Name: ${domainInfo.domain_name}`, 14, yPosition);
      yPosition += 7;
    }
    if (domainInfo.registrar) {
      doc.text(`Registrar: ${domainInfo.registrar}`, 14, yPosition);
      yPosition += 7;
    }
    if (domainInfo.organization && domainInfo.organization !== 'N/A') {
      doc.text(`Organization: ${domainInfo.organization}`, 14, yPosition);
      yPosition += 7;
    }
    if (domainInfo.creation_date && domainInfo.creation_date !== 'N/A') {
      doc.text(`Creation Date: ${domainInfo.creation_date}`, 14, yPosition);
      yPosition += 7;
    }
    yPosition += 8;
  }

  // Social Media Accounts
  if (results.social_media_accounts && results.social_media_accounts.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Associated Social Media Accounts', 14, yPosition);
    yPosition += 5;

    const foundAccounts = results.social_media_accounts.filter((acc: any) => acc.found);
    
    if (foundAccounts.length > 0) {
      const tableData = foundAccounts.map((account: any) => [
        account.platform.charAt(0).toUpperCase() + account.platform.slice(1),
        account.url
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Platform', 'URL']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] },
        styles: { fontSize: 9 },
        columnStyles: {
          1: { cellWidth: 100 }
        }
      });
    }
  }

  // Note about breach checking
  if (results.note) {
    yPosition = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : yPosition + 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    
    const splitNote = doc.splitTextToSize(results.note, 180);
    doc.text(splitNote, 14, yPosition);
  }
}

function generateNameReport(doc: jsPDF, results: any, startY: number) {
  let yPosition = startY;

  // Personal Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Personal Information', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Full Name: ${results.full_name}`, 14, yPosition);
  yPosition += 7;
  doc.text(`First Name: ${results.first_name}`, 14, yPosition);
  yPosition += 7;
  doc.text(`Last Name: ${results.last_name}`, 14, yPosition);
  yPosition += 15;

  // Username Variations
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Username Variations Checked', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const variations = results.username_variations.join(', ');
  const splitVariations = doc.splitTextToSize(variations, 180);
  doc.text(splitVariations, 14, yPosition);
  yPosition += splitVariations.length * 5 + 10;

  // Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Profiles Found: ${results.total_profiles_found}`, 14, yPosition);
  yPosition += 7;
  doc.text(`Social Profiles: ${results.social_profiles ? results.social_profiles.length : 0}`, 14, yPosition);
  yPosition += 7;
  doc.text(`Professional Profiles: ${results.professional_profiles ? results.professional_profiles.length : 0}`, 14, yPosition);
  yPosition += 15;

  // Professional Profiles
  if (results.professional_profiles && results.professional_profiles.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Professional Profiles', 14, yPosition);
    yPosition += 5;

    const tableData = results.professional_profiles.map((profile: any) => [
      profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1),
      profile.username,
      profile.url
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Platform', 'Username', 'URL']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 9 },
      columnStyles: {
        2: { cellWidth: 70 }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Social Profiles
  if (results.social_profiles && results.social_profiles.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Social Media Profiles', 14, yPosition);
    yPosition += 5;

    const tableData = results.social_profiles.map((profile: any) => [
      profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1),
      profile.username,
      profile.url
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Platform', 'Username', 'URL']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 9 },
      columnStyles: {
        2: { cellWidth: 70 }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Search Queries
  if (results.search_queries && results.search_queries.length > 0) {
    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommended Search Queries', 14, yPosition);
    yPosition += 5;

    const queryData = results.search_queries.map((query: any) => [
      query.type,
      query.description
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Type', 'Description']],
      body: queryData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 9 }
    });
  }
}