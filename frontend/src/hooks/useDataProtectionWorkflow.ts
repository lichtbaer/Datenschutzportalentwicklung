import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FileCategory, Institution, ProjectType, WorkflowStep } from '../types';
import { api, ApiError } from '../services/api';
import { log } from '../utils/logger';

function createNewProjectCategories(): FileCategory[] {
  return [
    // Store a stable label value; UI text is always derived via i18n keys.
    { key: 'datenschutzkonzept', label: 'datenschutzkonzept', required: true, files: [] },
    { key: 'verantwortung', label: 'verantwortung', required: true, files: [] },
    { key: 'schulung_uni', label: 'schulung_uni', required: true, files: [] },
    { key: 'schulung_ukf', label: 'schulung_ukf', required: true, files: [] },
    { key: 'einwilligung', label: 'einwilligung', required: false, conditionalRequired: true, files: [] },
    { key: 'ethikvotum', label: 'ethikvotum', required: false, files: [] },
    { key: 'sonstiges', label: 'sonstiges', required: false, files: [] },
  ];
}

function createExistingProjectCategories(): FileCategory[] {
  return [
    // Single upload bucket for resubmissions / missing documents.
    { key: 'nachzureichende_daten', label: 'nachzureichende_daten', required: true, files: [] },
  ];
}

export function useDataProtectionWorkflow() {
  const { t } = useLanguage();

  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('projectType');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution>('university');
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [isProspectiveStudy, setIsProspectiveStudy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadTimestamp, setUploadTimestamp] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [categories, setCategories] = useState<FileCategory[]>(() => createNewProjectCategories());

  // Workflow handlers
  const handleInstitutionSelect = (institution: Institution) => {
    setSelectedInstitution(institution);
    setCurrentStep('projectType');
  };

  const handleProjectTypeSelect = (type: ProjectType) => {
    setSelectedProjectType(type);
    if (type === 'new') {
      setCategories(createNewProjectCategories());
      setCurrentStep('form');
    } else {
      setCategories(createExistingProjectCategories());
      setCurrentStep('existingProject');
    }
  };

  const handleBackToInstitution = () => {
    // Institution selection removed
    // setCurrentStep('institution');
    // setSelectedInstitution(null);
    // setSelectedProjectType(null);
  };

  const handleBackToProjectType = () => {
    setCurrentStep('projectType');
    setSelectedProjectType(null);
    // Reset to default categories; the project type selection will set the final list again.
    setCategories(createNewProjectCategories());
  };

  const handleFilesAdded = (categoryKey: string, newFiles: File[]) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.key === categoryKey
          ? { ...cat, files: [...cat.files, ...newFiles] }
          : cat
      )
    );
  };

  const handleFileRemoved = (categoryKey: string, fileIndex: number) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.key === categoryKey
          ? { ...cat, files: cat.files.filter((_, i) => i !== fileIndex) }
          : cat
      )
    );
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    const newWarnings: string[] = [];

    // Validate required fields
    if (!email.trim()) {
      newErrors.push(t('error.emailRequired'));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push(t('error.emailInvalid'));
    }

    if (!projectTitle.trim()) {
      newErrors.push(t('error.titleRequired'));
    }

    // Validate file categories
    categories.forEach(cat => {
      const isRequired = cat.required || (cat.conditionalRequired && isProspectiveStudy);
      
      if (isRequired && cat.files.length === 0) {
        newErrors.push(`${t(`category.${cat.key}`)} ${t('error.categoryRequired')}`);
      }
    });

    setErrors(newErrors);
    setWarnings(newWarnings);

    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus('idle');
    setUploadError(null);

    if (!validateForm()) {
      log.warn('workflow_form_validation_failed');
      return;
    }

    log.info('workflow_submission_started', {
      institution: selectedInstitution,
      projectType: selectedProjectType,
      categoriesCount: categories.length,
      totalFiles: categories.reduce((sum, cat) => sum + cat.files.length, 0),
    });

    setIsSubmitting(true);
    setErrors([]);
    setUploadStatus('uploading');
    setUploadError(null);

    try {
      const result = await api.upload({
        email,
        uploaderName,
        projectTitle,
        projectDetails,
        institution: selectedInstitution || 'university',
        isProspectiveStudy,
        categories,
        projectType: selectedProjectType
      });

      log.info('workflow_upload_completed', { success: result.success });

      if (result.success) {
        setUploadTimestamp(result.timestamp);
        setShowSuccess(true);
        setUploadStatus('success');
      } else {
        log.warn('workflow_upload_returned_success_false');
        const message = result.message || t('error.uploadNotSuccessful');
        setErrors([message]);
        setUploadError(message);
        setUploadStatus('error');
      }
    } catch (error) {
      let errorMessage = t('error.uploadFailed');
      
      if (error instanceof Error) {
        log.error('workflow_upload_error', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });

        if (error instanceof ApiError) {
          errorMessage = t(error.i18nKey);
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = t('error.network');
        } else if (error.message) {
          // Fallback: show the error message if provided (e.g., unexpected runtime errors).
          errorMessage = error.message;
        }
      } else {
        log.error('workflow_upload_error_unknown');
      }
      
      setErrors([errorMessage]);
      setUploadError(errorMessage);
      setUploadStatus('error');
    } finally {
      setIsSubmitting(false);
      log.info('workflow_submission_finished');
    }
  };

  const handleDismissUploadStatus = () => {
    setUploadStatus('idle');
    setUploadError(null);
  };

  const handleNewUpload = () => {
    setEmail('');
    setUploaderName('');
    setProjectTitle('');
    setProjectDetails('');
    setIsProspectiveStudy(false);
    setCategories(createNewProjectCategories());
    setShowSuccess(false);
    setUploadTimestamp('');
    setUploadStatus('idle');
    setUploadError(null);
    setErrors([]);
    setWarnings([]);
    setCurrentStep('projectType');
    // Keep default institution
    setSelectedInstitution('university');
    setSelectedProjectType(null);
  };

  return {
    // State
    currentStep,
    selectedInstitution,
    selectedProjectType,
    email,
    uploaderName,
    projectTitle,
    projectDetails,
    isProspectiveStudy,
    isSubmitting,
    showSuccess,
    uploadTimestamp,
    uploadStatus,
    uploadError,
    errors,
    warnings,
    categories,
    
    // Setters (for form fields)
    setEmail,
    setUploaderName,
    setProjectTitle,
    setProjectDetails,
    setIsProspectiveStudy,
    
    // Handlers
    handleInstitutionSelect,
    handleProjectTypeSelect,
    handleBackToInstitution,
    handleBackToProjectType,
    handleFilesAdded,
    handleFileRemoved,
    handleSubmit,
    handleDismissUploadStatus,
    handleNewUpload
  };
}
