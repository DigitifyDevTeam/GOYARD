// Form data management utilities
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  [key: string]: any;
}

const STORAGE_KEY = 'userFormData';
const COMPLETION_KEY = 'formCompletionStatus';

export const FormDataManager = {
  // Save form data to localStorage
  saveFormData: (data: Partial<UserFormData>): void => {
    try {
      const existingData = FormDataManager.getFormData();
      const updatedData = { ...existingData, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      // Update completion status
      FormDataManager.updateCompletionStatus();
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  },

  // Get form data from localStorage
  getFormData: (): Partial<UserFormData> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error retrieving form data:', error);
      return {};
    }
  },

  // Check if required fields are completed
  isFormComplete: (requiredFields: string[] = ['firstName', 'lastName', 'email', 'phone']): boolean => {
    const data = FormDataManager.getFormData();
    return requiredFields.every(field => 
      data[field] && data[field].trim() !== ''
    );
  },

  // Update completion status
  updateCompletionStatus: (): void => {
    const isComplete = FormDataManager.isFormComplete();
    localStorage.setItem(COMPLETION_KEY, JSON.stringify({
      isComplete,
      timestamp: new Date().toISOString()
    }));
  },

  // Mark form as submitted via API
  markFormSubmitted: (clientId?: number): void => {
    localStorage.setItem('userFormSubmitted', 'true');
    localStorage.setItem('formCompletionStatus', 'true');
    if (clientId) {
      localStorage.setItem('clientId', clientId.toString());
    }
  },

  // Get completion status
  getCompletionStatus: (): { isComplete: boolean; timestamp: string } | null => {
    try {
      const stored = localStorage.getItem(COMPLETION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving completion status:', error);
      return null;
    }
  },

  // Clear all form data
  clearFormData: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COMPLETION_KEY);
  },

  // Reset form data but keep completion status
  resetFormData: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export default FormDataManager;
