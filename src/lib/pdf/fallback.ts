
import { GeneratedPDF } from './types';
import pdfFonts from 'pdfmake/build/vfs_fonts';

/**
 * Creates a fallback PDF when the main generation process fails
 */
export const createFallbackPDF = async (): Promise<GeneratedPDF> => {
  console.warn("Using fallback PDF generation");
  
  try {
    // Import pdfmake dynamically
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    
    // Set up the virtual file system for fonts
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    
    // Create a simple fallback document with Roboto as default
    const docDefinition = {
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
      },
      defaultStyle: {
        font: 'Roboto',
        fontSize: 11
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
