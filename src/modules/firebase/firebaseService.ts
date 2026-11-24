import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage, auth } from './firebaseConfig';

export interface ProjectData {
  id: string;
  projectName: string;
  clientName: string;
  projectType: 'Residential' | 'Commercial' | 'Interior' | 'Renovation';
  location: string;
  plotSize: string;
  numberOfFloors: number;
  preferredStyle: string;
  budgetRange: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  status: 'Draft' | 'Active' | 'Archived';
  fileCount?: number;
}

export interface UploadedProjectFile {
  id: string;
  projectId: string;
  fileName: string;
  fileType: 'PDF' | 'PNG' | 'JPEG' | 'DWG' | 'DXF' | 'IFC' | 'ZIP' | string;
  category: 'Floor Plans' | 'CAD Files' | 'IFC Files' | 'Site Images' | 'Videos' | 'Interior References' | 'Exterior References';
  fileSize: number;
  formattedSize: string;
  downloadUrl?: string;
  storagePath?: string;
  uploadedAt: string;
  status: 'Uploaded' | 'Processing' | 'Ready';
}

const LOCAL_STORAGE_PROJECTS_KEY = 'apexalith_digitaltwin_projects_v2';
const LOCAL_STORAGE_UPLOADS_KEY = 'apexalith_digitaltwin_uploads_v2';

// Seed Initial Sample Project
export const INITIAL_DEMO_PROJECT: ProjectData = {
  id: 'proj_apex_01',
  projectName: 'Penthouse Compound Villa Alpha',
  clientName: 'Aurelius Estate Holdings',
  projectType: 'Residential',
  location: 'Beverly Hills, CA',
  plotSize: '14,500 sq ft',
  numberOfFloors: 3,
  preferredStyle: 'Modern Ultra-Luxury',
  budgetRange: '$8,500,000 - $12,000,000',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'Active',
  fileCount: 3
};

export const INITIAL_DEMO_FILES: UploadedProjectFile[] = [
  {
    id: 'file_01',
    projectId: 'proj_apex_01',
    fileName: 'Architectural_FloorPlan_L1_L3.pdf',
    fileType: 'PDF',
    category: 'Floor Plans',
    fileSize: 14200000,
    formattedSize: '14.2 MB',
    downloadUrl: '#',
    uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'Ready'
  },
  {
    id: 'file_02',
    projectId: 'proj_apex_01',
    fileName: 'Structural_Steel_Grid_Revit2025.ifc',
    fileType: 'IFC',
    category: 'IFC Files',
    fileSize: 48500000,
    formattedSize: '48.5 MB',
    downloadUrl: '#',
    uploadedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'Ready'
  },
  {
    id: 'file_03',
    projectId: 'proj_apex_01',
    fileName: 'Site_Boundary_Survey.dwg',
    fileType: 'DWG',
    category: 'CAD Files',
    fileSize: 8900000,
    formattedSize: '8.9 MB',
    downloadUrl: '#',
    uploadedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'Ready'
  }
];

class FirebaseService {
  /**
   * Save or update project in Firestore (with localStorage sync)
   */
  async createProject(projectInput: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt' | 'fileCount' | 'status'>): Promise<ProjectData> {
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    
    const newProject: ProjectData = {
      ...projectInput,
      id: projectId,
      createdAt: now,
      updatedAt: now,
      status: 'Active',
      fileCount: 0,
      userId: auth.currentUser?.uid || 'guest_architect'
    };

    // 1. Local Storage Sync for guaranteed zero-delay UI response
    const existing = this.getLocalProjects();
    const updatedList = [newProject, ...existing];
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(updatedList));

    // 2. Firestore Sync
    try {
      await setDoc(doc(db, 'projects', projectId), {
        ...newProject,
        serverCreatedAt: serverTimestamp()
      });
      console.log(`[Firestore] Project created successfully: ${projectId}`);
    } catch (err) {
      console.warn('[Firestore] Stored locally (Firestore sync deferred or offline):', err);
    }

    return newProject;
  }

  /**
   * Get all projects from Firestore / LocalStorage
   */
  async getProjects(): Promise<ProjectData[]> {
    let localProjects = this.getLocalProjects();
    if (localProjects.length === 0) {
      localProjects = [INITIAL_DEMO_PROJECT];
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(localProjects));
    }

    try {
      const q = query(collection(db, 'projects'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const firestoreProjects: ProjectData[] = [];
        snapshot.forEach((docSnap) => {
          firestoreProjects.push(docSnap.data() as ProjectData);
        });
        if (firestoreProjects.length > 0) {
          return firestoreProjects;
        }
      }
    } catch (err) {
      console.warn('[Firestore] Reading local cached projects list');
    }

    return localProjects;
  }

  /**
   * Upload file to Firebase Storage & log metadata to Firestore
   */
  async uploadProjectFile(
    file: File, 
    projectId: string, 
    category: UploadedProjectFile['category'],
    onProgress?: (progress: number) => void
  ): Promise<UploadedProjectFile> {
    const fileId = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';

    let downloadUrl = '#';
    let storagePath = `uploads/${projectId}/${fileId}_${file.name}`;

    // Attempt Firebase Storage upload if online
    try {
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          (error) => {
            console.warn('[Firebase Storage] Upload notice:', error);
            resolve(); // Fallback gracefully
          },
          async () => {
            try {
              downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            } catch (e) {
              downloadUrl = '#';
            }
            resolve();
          }
        );
      });
    } catch (e) {
      if (onProgress) onProgress(100);
    }

    const uploadedFile: UploadedProjectFile = {
      id: fileId,
      projectId,
      fileName: file.name,
      fileType: ext,
      category,
      fileSize: file.size,
      formattedSize: this.formatBytes(file.size),
      downloadUrl,
      storagePath,
      uploadedAt: now,
      status: 'Uploaded'
    };

    // 1. Save locally
    const localUploads = this.getLocalUploads();
    const updatedUploads = [uploadedFile, ...localUploads];
    localStorage.setItem(LOCAL_STORAGE_UPLOADS_KEY, JSON.stringify(updatedUploads));

    // Update project file count locally
    const projects = this.getLocalProjects();
    const projIdx = projects.findIndex(p => p.id === projectId);
    if (projIdx !== -1) {
      projects[projIdx].fileCount = (projects[projIdx].fileCount || 0) + 1;
      projects[projIdx].updatedAt = now;
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    }

    // 2. Save metadata to Firestore `uploads` collection
    try {
      await setDoc(doc(db, 'uploads', fileId), {
        ...uploadedFile,
        serverUploadedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[Firestore] Upload metadata saved locally');
    }

    return uploadedFile;
  }

  /**
   * Get all uploaded files for a project
   */
  async getProjectFiles(projectId: string): Promise<UploadedProjectFile[]> {
    let localUploads = this.getLocalUploads();
    
    // Include demo files if demo project
    if (projectId === 'proj_apex_01' && !localUploads.some(u => u.projectId === 'proj_apex_01')) {
      localUploads = [...INITIAL_DEMO_FILES, ...localUploads];
      localStorage.setItem(LOCAL_STORAGE_UPLOADS_KEY, JSON.stringify(localUploads));
    }

    try {
      const q = query(collection(db, 'uploads'), where('projectId', '==', projectId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const firestoreFiles: UploadedProjectFile[] = [];
        snapshot.forEach(docSnap => firestoreFiles.push(docSnap.data() as UploadedProjectFile));
        if (firestoreFiles.length > 0) return firestoreFiles;
      }
    } catch (err) {
      // Fallback
    }

    return localUploads.filter(u => u.projectId === projectId);
  }

  // Local Storage Helpers
  private getLocalProjects(): ProjectData[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  private getLocalUploads(): UploadedProjectFile[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_UPLOADS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

export const firebaseService = new FirebaseService();
