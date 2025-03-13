
export interface TemplateMetadata {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  placeholders: string[];
}

export interface GeneratedPDF {
  downloadUrl: string;
  fileName: string;
}

export interface AIResponse {
  auto_filled_data: Record<string, string>;
  placeholder_positions: Record<string, {
    page: number;
    x: number;
    y: number;
  }>;
  // Removed font_detection property
}
