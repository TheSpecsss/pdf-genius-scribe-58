
import { GeneratedPDF } from './types';

/**
 * Creates a fallback PDF when the main generation process fails
 */
export const createFallbackPDF = async (): Promise<GeneratedPDF> => {
  console.warn("Using fallback PDF generation");
  
  try {
    // Import pdfmake and fonts dynamically
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    const pdfFonts = (await import('pdfmake/build/vfs_fonts')).pdfMake.vfs;
    
    // Set up the virtual file system for fonts
    pdfMake.vfs = pdfFonts;
    
    // Create a simple fallback document with Times New Roman 11px as default
    const docDefinition = {
      defaultStyle: {
        font: 'Times',
        fontSize: 11
      },
      content: [
        { 
          text: 'Generated Document',
          style: 'header'
        },
        {
          text: '\nThis is a basic document generated as a fallback.\n\n',
          style: 'subheader'
        },
        {
          text: `Generated on: ${new Date().toLocaleString()}`,
          style: 'normal'
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          margin: [0, 0, 0, 5]
        },
        normal: {
          fontSize: 11
        }
      }
    };
    
    // Generate PDF blob
    const pdfBlob = await new Promise<Blob>((resolve, reject) => {
      try {
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getBlob((blob) => {
          resolve(blob);
        });
      } catch (error) {
        console.error("Error in fallback PDF blob generation:", error);
        reject(error);
      }
    });
    
    // Create blob URL
    const downloadUrl = URL.createObjectURL(pdfBlob);
    
    return {
      downloadUrl,
      fileName: `fallback-document-${new Date().getTime()}.pdf`
    };
  } catch (error) {
    console.error("Error in fallback PDF generation:", error);
    throw new Error("Failed to generate fallback PDF");
  }
};
