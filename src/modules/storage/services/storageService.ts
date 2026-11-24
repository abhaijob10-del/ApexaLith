import { ProjectDocument } from '../../../types';

export interface FileUploadPayload {
  file: File;
  category: 'Blueprint' | 'CAD Drawing' | 'Permit' | 'Contract' | 'Site Photo' | 'Elevation';
  projectId?: string;
  version?: string;
}

export interface StorageUploadResult {
  document: ProjectDocument;
  signedUrl: string;
  hash: string;
}

class StorageService {
  private allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/x-dwg',
    'image/vnd.dwg',
    'application/dxf',
    'application/x-dxf'
  ];

  /**
   * Validate uploaded floor plan / drawing file type
   */
  public validateDocumentFile(file: File): { valid: boolean; message?: string } {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'dwg', 'dxf', 'ifc'];
    
    if (ext && validExtensions.includes(ext)) {
      return { valid: true };
    }
    
    if (this.allowedTypes.includes(file.type)) {
      return { valid: true };
    }

    return {
      valid: false,
      message: `Invalid file format (${ext}). Supported formats: PDF, PNG, JPG, CAD (DXF/DWG), IFC.`
    };
  }

  /**
   * Simulates secure upload to AES-256 encrypted object storage
   */
  public async uploadDocument(payload: FileUploadPayload): Promise<StorageUploadResult> {
    const { file, category, version = 'v1.0' } = payload;
    
    // Simulate hashing & storage latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const hashHex = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(file.name + Date.now()))))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const document: ProjectDocument = {
      id: docId,
      title: file.name,
      category: category as any,
      fileType: fileExt as any,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      version,
      encryptedKeyHash: hashHex
    };

    const signedUrl = `https://vault.apexalith.com/secure/download/${docId}?token=${hashHex.substring(0, 16)}`;

    return {
      document,
      signedUrl,
      hash: hashHex
    };
  }

  /**
   * Generate temporary signed download link for documents
   */
  public getSignedDownloadUrl(documentId: string): string {
    const expires = Date.now() + 24 * 60 * 60 * 1000;
    return `https://vault.apexalith.com/download/${documentId}?expires=${expires}&sig=sec_exp_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const storageService = new StorageService();
