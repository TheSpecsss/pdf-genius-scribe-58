
import { GeneratedPDF, AIResponse } from './types';
import { createFallbackPDF } from './fallback';
import pdfFonts from 'pdfmake/build/vfs_fonts';

/**
 * Generates a PDF document based on a template and filled data
 */
export const generatePDF = async (
  templateId: string,
  filledData: Record<string, string>,
  aiResponse?: AIResponse
): Promise<GeneratedPDF> => {
  try {
    console.log("Generating PDF with template ID:", templateId);
    console.log("Data to fill:", filledData);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Import the Supabase client correctly
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Fetch template from Supabase
    const { data: template, error } = await supabase
      .from('templates')
      .select('file_url, name')
      .eq('id', templateId)
      .single();
    
    if (error || !template) {
      console.error("Error fetching template:", error);
      return createFallbackPDF();
    }
    
    if (!template.file_url) {
      console.warn("Template file URL not found, using fallback sample PDF");
      return createFallbackPDF();
    }
    
    console.log("Using template file URL:", template.file_url);
    
    try {
      // Import pdfmake dynamically
      const pdfMake = (await import('pdfmake/build/pdfmake')).default;
      
      // Set up the virtual file system for fonts
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      
      // Create a document definition with proper font definition
      const docDefinition = {
        content: [
          { text: `${template.name}`, style: 'header' },
          { text: '\n\n' },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          field: {
            fontSize: 11,
            margin: [0, 5, 0, 5]
          }
        },
        defaultStyle: {
          font: 'Roboto',
          fontSize: 11
        }
      };
      
      // Add each field and its value to the document
      Object.entries(filledData).forEach(([key, value]) => {
        const fieldName = key.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        docDefinition.content.push({
          text: `${fieldName}: ${value}`,
          style: 'field'
        });
      });
      
      // Create a descriptive filename
      const fileName = `${template.name.replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`;
      
      // Generate the PDF as a blob
      const pdfBlob = await new Promise<Blob>((resolve, reject) => {
        try {
          const pdfDocGenerator = pdfMake.createPdf(docDefinition);
          pdfDocGenerator.getBlob((blob) => {
            resolve(blob);
          });
        } catch (error) {
          console.error("Error in PDF blob generation:", error);
          reject(error);
        }
      });
      
      const downloadUrl = URL.createObjectURL(pdfBlob);
      
      return {
        downloadUrl,
        fileName,
      };
    } catch (pdfError) {
      console.error("Error generating PDF with pdfmake:", pdfError);
      return createFallbackPDF();
    }
  } catch (error) {
    console.error("PDF generation error:", error);
    return createFallbackPDF();
  }
};
