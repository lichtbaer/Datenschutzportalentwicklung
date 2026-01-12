import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations = {
  de: {
    // Institution Selection
    'institution.title': 'Datenschutzportal für Forschungsvorhaben',
    'institution.subtitle': 'Willkommen beim Datenschutzportal für Forschungsprojekte',
    'institution.question': 'Zu welcher Institution gehören Sie?',
    'institution.description': 'Bitte wählen Sie die Institution aus, in deren Rahmen Sie Ihre Studie durchführen',
    'institution.university': 'Goethe Universität Frankfurt(GU)',
    'institution.university.desc': 'Für Forschungsprojekte der Goethe-Universität Frankfurt am Main',
    'institution.clinic': 'Universitätsmedizin Frankfurt(UMF)',
    'institution.clinic.desc': 'Für klinische Forschungsprojekte des Universitätsmedizin Frankfurt',
    'institution.footer': 'Bei Fragen zur richtigen Auswahl wenden Sie sich bitte an das Datenschutz-Team',
    
    // Project Type Selection
    'projectType.title': 'Datenschutzportal für Forschungsvorhaben',
    'projectType.question': 'Was möchten Sie tun?',
    'projectType.description': 'Wählen Sie aus, ob Sie ein neues Projekt einreichen oder ein eingereichtes Projekt bearbeiten möchten',
    'projectType.new': 'Neues Projekt einreichen',
    'projectType.new.desc': 'Reichen Sie Datenschutzunterlagen für ein neues Forschungsprojekt ein',
    'projectType.existing': 'Eingereichtes Projekt bearbeiten',
    'projectType.existing.desc': 'Laden Sie zusätzliche Dokumente für ein bereits eingereichtes Projekt hoch',
    'projectType.info': 'Hinweis: Für eingereichtes Projekte benötigen Sie Ihre Projekt-ID oder den ursprünglichen Projekttitel zur Identifikation.',
    'projectType.back': 'Zurück zur Institution-Auswahl',
    
    // Existing Project Form
    'existingProject.title': 'Eingereichtes Projekt bearbeiten',
    'existingProject.search': 'Projekt suchen',
    'existingProject.label': 'Projekt-ID oder Projekttitel',
    'existingProject.placeholder': 'z.B. PRJ-2024-001 oder "Studie zur..."',
    'existingProject.hint': 'Geben Sie die Projekt-ID oder den vollständigen Projekttitel ein, den Sie bei der Ersteinreichung verwendet haben',
    'existingProject.searching': 'Suche läuft...',
    'existingProject.searchButton': 'Projekt suchen',
    'existingProject.infoTitle': 'Wichtiger Hinweis',
    'existingProject.info1': 'Die Projekt-ID finden Sie in Ihrer ursprünglichen Bestätigungs-E-Mail',
    'existingProject.info2': 'Alternativ können Sie nach dem exakten Projekttitel suchen',
    'existingProject.info3': 'Groß- und Kleinschreibung wird bei der Suche nicht berücksichtigt',
    'existingProject.notFound': 'Projekt nicht gefunden. Bitte überprüfen Sie Ihre Eingabe.',
    'existingProject.error': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    'existingProject.back': 'Zurück zur Auswahl',
    'existingProject.warning': 'Diese Option gilt nur für Forschungsprojekte, die bereits gemäß dem neuen Datenschutzprozess (gültig seit Mai 2025) eingereicht wurden. Sie können hier fehlende Unterlagen und Überarbeitungen hochladen, wenn es z. B. vom Datenschutz-Team Nachfragen bzw. Forderungen gibt oder etwas nachgereicht werden soll. Wenn Sie inhaltliche Anpassungen an bereits genehmigten Projekten (Amendments) vornehmen wollen (vor oder nach dem neuen Datenschutzprozess gestartet), wenden Sie sich bitte per E-Mail an das Datenschutz-Team. Wenn Sie Projekte neu einreichen wollen, die Sie bereits vor dem neuen Datenschutzprozess eingereicht hatten, wählen Sie bitte auf der Startseite "Neues Projekt einreichen".',
    'existingProject.moreInfo': 'Weitere Informationen zur Einreichung finden Sie hier',
    'existingProject.projectDetails': 'Projektdetails:',
    'existingProject.projectDetailsPlaceholder': 'Bitte fassen Sie kurz zusammen, was Sie überarbeitet haben, sodass wir uns schneller ein Bild machen können.',
    'existingProject.templates': 'Hier finden Sie Vorlagen für Nachreichungen',
    
    // Form
    'form.title': 'Datenschutzportal für Forschungsvorhaben',
    'form.info': 'Bitte laden Sie alle erforderlichen Dokumente für Ihr Forschungsprojekt hoch. Die Dokumente werden sicher in der next.Hessencloud gespeichert. Sie erhalten eine Bestätigungs-E-Mail nach erfolgreichem Upload.',
    'form.baseData': 'Basisdaten',
    'form.email': 'E-Mail-Adresse',
    'form.uploaderName': 'Name des Einreichenden (optional)',
    'form.projectTitle': 'Projekttitel (Kurztitel)',
    'form.projectTitleHint': 'Dieser Kurztitel wird zur Kommunikation/Zuordnung verwendet, bitte notieren Sie ihn sich und geben Sie ihn bei jeder Kommunikatin mit dem Datenschutz an.',
    'form.prospectiveStudy': 'Prospektive Studie / Prospektiver Anteil',
    'form.documents': 'Dokumente hochladen',
    'form.required': '*',
    'form.emailPlaceholder': 'Ihre dienstliche E-Mail-Adresse, unter der Wir Sie kontaktieren können',
    'form.namePlaceholder': 'Max Mustermann',
    'form.titlePlaceholder': 'Kurztitel unter dem Sie ihr Projekt eingereicht haben',
    'form.back': 'Zurück zur Auswahl',
    'form.legalConfirmation': 'Dokument: Verpflichtung zur Rechtskonformen Datennutzung ',
    
    // Links
    'link.moodle': 'Schulung(en) via Moodle-Kurs',
    'link.sop': 'SOP (Standard Operating Procedure, Verfahrensanweisung)',
    'link.research': 'Forschungsportal',
    'link.email': 'E-Mail Datenschutz-Team',
    
    // Categories
    'category.datenschutzkonzept': 'Datenschutzkonzept',
    'category.verantwortung': 'Ich bestätige die rechtskonforme Nutzung der Daten',
    'category.schulung_uni': 'Nachweis der Schulung ist vorgeschrieben',
    'category.schulung_ukf': 'Nachweis der Schulung ist vorgeschrieben',
    'category.einwilligung': 'Einwilligungsformular(e)/PatInfo(s)',
    'category.ethikvotum': 'Ethikvotum',
    'category.sonstiges': 'Sonstiges',
    'category.nachzureichende_daten': 'Nachzureichende Unterlagen',
    'category.sonstiges.desc': 'Darstellungen/Dokumente zum Datenfluss (wenn vorhanden), oder bei Verwendung von Fragebögen die Fragen. Wenn Sie den Datenfluss nicht im DSK beschrieben haben, laden Sie das Dokument hier hoch.',
    
    // File Upload
    'upload.dropzone': 'Klicken Sie hier oder ziehen Sie Dateien hier hin',
    'upload.formats': 'PDF, DOC, DOCX, ODT, ODS, ODP, ZIP, PNG, JPG',
    'upload.preview': 'Vorschau',
    'upload.close': 'Schließen',
    'upload.inProgress': 'Dokumente werden hochgeladen...',
    'upload.complete': 'Upload abgeschlossen!',
    'upload.file': 'Datei',
    'upload.files': 'Dateien',
    'upload.elapsedTime': 'Verstrichene Zeit: {seconds} Sekunden',
    'upload.emailDelay': 'Der E-Mail-Versand kann bei Problemen etwas länger dauern. Bitte haben Sie etwas Geduld.',
    'upload.phase.preparing': 'Vorbereitung',
    'upload.phase.preparing.desc': 'Dateien werden vorbereitet...',
    'upload.phase.validating': 'Validierung',
    'upload.phase.validating.desc': 'Dateien werden auf Gültigkeit geprüft...',
    'upload.phase.connecting': 'Verbindung wird hergestellt',
    'upload.phase.connecting.desc': 'Verbindung zur next.Hessencloud wird hergestellt...',
    'upload.phase.uploading': 'Dateien werden hochgeladen',
    'upload.phase.uploading.desc': '{count} Datei(en) werden hochgeladen...',
    'upload.phase.processing': 'Verarbeitung',
    'upload.phase.processing.desc': 'Metadaten werden erstellt...',
    'upload.phase.email': 'E-Mail wird versendet',
    'upload.phase.email.desc': 'Bestätigungs-E-Mail wird versendet...',
    'upload.phase.completing': 'Abschluss',
    'upload.phase.completing.desc': 'Upload wird abgeschlossen...',
    'upload.phase.done': 'Abgeschlossen',
    'upload.phase.done.desc': 'Alle Dokumente wurden erfolgreich hochgeladen.',
    
    // Errors
    'error.title': 'Bitte beheben Sie folgende Fehler:',
    'error.emailRequired': 'E-Mail-Adresse ist erforderlich',
    'error.emailInvalid': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'error.titleRequired': 'Projekttitel ist erforderlich',
    'error.categoryRequired': 'ist ein Pflichtfeld',
    'error.uploadFailed': 'Ein Fehler ist beim Upload aufgetreten. Bitte versuchen Sie es erneut.',
    'error.legalRequired': 'Bitte bestätigen Sie die rechtskonforme Nutzung der Daten.',
    'error.uploadNotSuccessful': 'Upload wurde nicht erfolgreich abgeschlossen.',
    'error.network': 'Verbindungsfehler: Die Verbindung zum Server konnte nicht hergestellt werden. Bitte überprüfen Sie Ihre Internetverbindung.',
    'error.authFailed': 'Authentifizierung fehlgeschlagen. Bitte überprüfen Sie das API-Token.',
    'error.configMissingToken': 'Konfigurationsfehler: API Token fehlt. Bitte kontaktieren Sie den Administrator.',
    'error.configMissingApiUrl': 'Konfigurationsfehler: API URL fehlt. Bitte kontaktieren Sie den Administrator.',
    
    // Submit
    'submit.filesReady': 'bereit zum Upload',
    'submit.noFiles': 'Keine Dateien ausgewählt',
    'submit.uploading': 'Wird hochgeladen...',
    'submit.button': 'Formular absenden und Dokumente hochladen',
    'submit.confirmation': 'Mit dem Absenden bestätigen Sie die Richtigkeit Ihrer Angaben',
    'submit.file': 'Datei',
    'submit.files': 'Dateien',
    
    // Confirmation
    'confirmation.success': 'Upload erfolgreich abgeschlossen!',
    'confirmation.message': 'Ihre Dokumente wurden erfolgreich hochgeladen und in der next.Hessencloud gespeichert. Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse versendet.',
    'confirmation.details': 'Upload-Details',
    'confirmation.projectTitle': 'Projekttitel',
    'confirmation.uploader': 'Uploader',
    'confirmation.email': 'E-Mail-Adresse',
    'confirmation.timestamp': 'Upload-Zeitpunkt',
    'confirmation.documents': 'Hochgeladene Dokumente',
    'confirmation.emailNotification': 'E-Mail-Benachrichtigung',
    'confirmation.emailSent': 'Eine Bestätigungs-E-Mail wurde an {email} gesendet mit allen Details zu Ihrem Upload.',
    'confirmation.teamNotified': 'Das Datenschutz-Team wurde ebenfalls über Ihren Upload informiert.',
    'confirmation.nextSteps': 'Wie geht es weiter?',
    'confirmation.keepEmailProof': 'Bitte bewahren Sie die Bestätigungs-E-Mail als Nachweis auf',
    'confirmation.step1': 'Überprüfe Sie auch ihren Spam-Ordner auf die Bestätigungs-E-Mail.',
    'confirmation.step2': 'Bei Rückfragen werden Sie per E-Mail kontaktiert',
    'confirmation.step3': 'Wenn Sie innerhalb einer 14-Tages-Frist keine Rückmeldung von uns bekommen, gilt Ihr Projekt als automatisch freigegeben und Sie können starten. (Dies gilt nicht für Ausnahmen vom Standard gemäß SOP).',
    'confirmation.note': 'Bitte beachten Sie, dass nur Stichprobenprüfungen vorgesehen sind.',
    'confirmation.newUpload': 'Weiteren Upload durchführen',
    'confirmation.footer': 'Bei Fragen wenden Sie sich bitte an das Datenschutz-Team',
    'confirmation.institution': 'Goethe Universität Frankfurt(GU) / Universitätsmedizin Frankfurt(UMF)',
    
    // Common
    'common.back': 'Zurück',
    'common.warnings': 'Warnungen:',
    'common.removeFile': 'Datei entfernen',
    'common.download': 'Herunterladen',
    'common.zoomIn': 'Vergrößern',
    'common.zoomOut': 'Verkleinern',

    // PDF Preview
    'pdfPreview.pdfCannotBeDisplayed': 'PDF kann nicht angezeigt werden.',
    'pdfPreview.downloadPdf': 'PDF herunterladen',
    'pdfPreview.previewOnlyPdf': 'Vorschau nur für PDF-Dateien verfügbar.',
    'pdfPreview.downloadFile': 'Datei herunterladen',
  },
  en: {
    // Institution Selection
    'institution.title': 'Data Protection Portal',
    'institution.subtitle': 'Welcome to the Data Protection Portal for Research Projects',
    'institution.question': 'Which institution do you belong to?',
    'institution.description': 'Please select the institution under which you are conducting your study',
    'institution.university': 'University of Frankfurt',
    'institution.university.desc': 'For research projects of Goethe University Frankfurt am Main',
    'institution.clinic': 'University Hospital Frankfurt',
    'institution.clinic.desc': 'For clinical research projects of the University Hospital',
    'institution.footer': 'If you have questions about the right choice, please contact the Data Protection Team',
    
    // Project Type Selection
    'projectType.title': 'Data Protection Portal',
    'projectType.question': 'What would you like to do?',
    'projectType.description': 'Choose whether you want to submit a new project or edit an existing project',
    'projectType.new': 'Submit New Project',
    'projectType.new.desc': 'Submit data protection documents for a new research project',
    'projectType.existing': 'Edit Existing Project',
    'projectType.existing.desc': 'Upload additional documents for an existing project',
    'projectType.info': 'Note: For existing projects, you need your project ID or the original project title for identification.',
    'projectType.back': 'Back to Institution Selection',
    
    // Existing Project Form
    'existingProject.title': 'Edit Existing Project',
    'existingProject.search': 'Search Project',
    'existingProject.label': 'Project ID or Project Title',
    'existingProject.placeholder': 'e.g. PRJ-2024-001 or "Study on..."',
    'existingProject.hint': 'Enter the project ID or the complete project title you used during initial submission',
    'existingProject.searching': 'Searching...',
    'existingProject.searchButton': 'Search Project',
    'existingProject.infoTitle': 'Important Note',
    'existingProject.info1': 'You can find the project ID in your original confirmation email',
    'existingProject.info2': 'Alternatively, you can search by exact project title',
    'existingProject.info3': 'Case sensitivity is not considered in the search',
    'existingProject.notFound': 'Project not found. Please check your input.',
    'existingProject.error': 'An error occurred. Please try again.',
    'existingProject.back': 'Back to Selection',
    'existingProject.warning': 'This is only an option for projects submitted after the new process (started in May). If you submitted your project before that and want to resubmit, please submit it as new. For amendments, please contact the data protection team by email.',
    'existingProject.moreInfo': 'Find more information about submission here',
    'existingProject.projectDetails': 'Project details:',
    'existingProject.projectDetailsPlaceholder': 'Please briefly summarize what you have revised so we can get an overview more quickly.',
    'existingProject.templates': 'Here you can find templates for resubmissions',
    
    // Form
    'form.title': 'Data Protection Portal',
    'form.info': 'Please upload all required data protection documents for your research project. The documents will be securely stored in next.Hessencloud. You will receive a confirmation email after successful upload.',
    'form.baseData': 'Basic Data',
    'form.email': 'Email Address',
    'form.uploaderName': 'Uploader Name (optional)',
    'form.projectTitle': 'Project Title (Short Title)',
    'form.projectTitleHint': 'Your project will be communicated under this title.',
    'form.prospectiveStudy': 'Prospective Study / Prospective Component',
    'form.documents': 'Upload Documents',
    'form.required': '*',
    'form.emailPlaceholder': 'Your work email',
    'form.namePlaceholder': 'John Doe',
    'form.titlePlaceholder': 'Title of Research Project',
    'form.back': 'Back to Selection',
    'form.legalConfirmation': 'I confirm the legally compliant use of the data.',
    
    // Links
    'link.moodle': 'Moodle Course',
    'link.sop': 'SOP (Standard Operating Procedure)',
    'link.research': 'Research Portal',
    'link.email': 'Data Protection Team Email',
    
    // Categories
    'category.datenschutzkonzept': 'Data Protection Concept',
    'category.verantwortung': 'I confirm the legally compliant use of the data',
    'category.schulung_uni': 'University Training Certificate',
    'category.schulung_ukf': 'UKF Training Certificate',
    'category.einwilligung': 'Consent Form(s)/PatInfo(s)',
    'category.ethikvotum': 'Ethics Approval',
    'category.sonstiges': 'Other',
    'category.nachzureichende_daten': 'Documents to be submitted later',
    'category.sonstiges.desc': 'Data flow documents (if available), or questions if questionnaires are used. If you have not described the data flow in the data protection concept, please upload the document here.',
    
    // File Upload
    'upload.dropzone': 'Click here or drag files here',
    'upload.formats': 'PDF, DOC, DOCX, ODT, ODS, ODP, ZIP, PNG, JPG',
    'upload.preview': 'Preview',
    'upload.close': 'Close',
    'upload.inProgress': 'Documents are being uploaded...',
    'upload.complete': 'Upload completed!',
    'upload.file': 'file',
    'upload.files': 'files',
    'upload.elapsedTime': 'Elapsed time: {seconds} seconds',
    'upload.emailDelay': 'Email sending may take longer if there are issues. Please be patient.',
    'upload.phase.preparing': 'Preparing',
    'upload.phase.preparing.desc': 'Files are being prepared...',
    'upload.phase.validating': 'Validating',
    'upload.phase.validating.desc': 'Files are being validated...',
    'upload.phase.connecting': 'Connecting',
    'upload.phase.connecting.desc': 'Connecting to next.Hessencloud...',
    'upload.phase.uploading': 'Uploading files',
    'upload.phase.uploading.desc': 'Uploading {count} file(s)...',
    'upload.phase.processing': 'Processing',
    'upload.phase.processing.desc': 'Creating metadata...',
    'upload.phase.email': 'Sending email',
    'upload.phase.email.desc': 'Sending confirmation email...',
    'upload.phase.completing': 'Completing',
    'upload.phase.completing.desc': 'Completing upload...',
    'upload.phase.done': 'Done',
    'upload.phase.done.desc': 'All documents have been successfully uploaded.',
    
    // Errors
    'error.title': 'Please fix the following errors:',
    'error.emailRequired': 'Email address is required',
    'error.emailInvalid': 'Please enter a valid email address',
    'error.titleRequired': 'Project title is required',
    'error.categoryRequired': 'is a required field',
    'error.uploadFailed': 'An error occurred during upload. Please try again.',
    'error.legalRequired': 'Please confirm the legally compliant use of the data.',
    'error.uploadNotSuccessful': 'Upload was not completed successfully.',
    'error.network': 'Connection error: Unable to reach the server. Please check your internet connection.',
    'error.authFailed': 'Authentication failed. Please check the API token.',
    'error.configMissingToken': 'Configuration error: API token is missing. Please contact the administrator.',
    'error.configMissingApiUrl': 'Configuration error: API URL is missing. Please contact the administrator.',
    
    // Submit
    'submit.filesReady': 'ready for upload',
    'submit.noFiles': 'No files selected',
    'submit.uploading': 'Uploading...',
    'submit.button': 'Submit Form and Upload Documents',
    'submit.confirmation': 'By submitting you confirm the accuracy of your information',
    'submit.file': 'file',
    'submit.files': 'files',
    
    // Confirmation
    'confirmation.success': 'Upload Completed Successfully!',
    'confirmation.message': 'Your documents have been successfully uploaded and stored in next.Hessencloud. A confirmation email has been sent to your email address.',
    'confirmation.details': 'Upload Details',
    'confirmation.projectTitle': 'Project Title',
    'confirmation.uploader': 'Uploader',
    'confirmation.email': 'Email Address',
    'confirmation.timestamp': 'Upload Time',
    'confirmation.documents': 'Uploaded Documents',
    'confirmation.emailNotification': 'Email Notification',
    'confirmation.emailSent': 'A confirmation email was sent to {email} with all details about your upload.',
    'confirmation.teamNotified': 'The Data Protection Team has also been informed about your upload.',
    'confirmation.nextSteps': 'What happens next?',
    'confirmation.keepEmailProof': 'Please keep the confirmation email as proof',
    'confirmation.step1': 'Within the next 14 days, you will be informed whether your documents have been selected for review.',
    'confirmation.step2': 'You will be contacted by email if there are any questions',
    'confirmation.step3': 'If you have heard <u>nothing</u> from us after 14 days, you may proceed according to the process.',
    'confirmation.note': 'Please note that under the current process, only random spot checks are planned.',
    'confirmation.newUpload': 'Perform Another Upload',
    'confirmation.footer': 'If you have questions, please contact the Data Protection Team',
    'confirmation.institution': 'University of Frankfurt / University Hospital',
    
    // Common
    'common.back': 'Back',
    'common.warnings': 'Warnings:',
    'common.removeFile': 'Remove file',
    'common.download': 'Download',
    'common.zoomIn': 'Zoom in',
    'common.zoomOut': 'Zoom out',

    // PDF Preview
    'pdfPreview.pdfCannotBeDisplayed': 'Unable to display PDF.',
    'pdfPreview.downloadPdf': 'Download PDF',
    'pdfPreview.previewOnlyPdf': 'Preview is only available for PDF files.',
    'pdfPreview.downloadFile': 'Download file',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('de');

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || key;
    
    // Replace placeholders like {key} with values from params
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
