import { FileCategory } from '../types';

export interface UploadData {
  email: string;
  uploaderName: string;
  projectTitle: string;
  institution: string;
  isProspectiveStudy: boolean;
  categories: FileCategory[];
}

export interface UploadResult {
  success: boolean;
  timestamp: string;
  project_id?: string;
  files_uploaded?: number;
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export const api = {
  upload: async (data: UploadData): Promise<UploadResult> => {
    const formData = new FormData();

    // Add basic fields
    formData.append('email', data.email);
    if (data.uploaderName) {
      formData.append('uploader_name', data.uploaderName);
    }
    formData.append('project_title', data.projectTitle);
    formData.append('institution', data.institution);
    formData.append('is_prospective_study', String(data.isProspectiveStudy));

    // Process files and categories
    const categoryMap: Record<string, string> = {};

    data.categories.forEach((category) => {
      category.files.forEach((file) => {
        formData.append('files', file);
        categoryMap[file.name] = category.key;
      });
    });

    // Add category mapping
    formData.append('file_categories', JSON.stringify(categoryMap));

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: result.success,
        timestamp: result.timestamp,
        project_id: result.project_id,
        files_uploaded: result.files_uploaded,
        message: result.message,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
};
