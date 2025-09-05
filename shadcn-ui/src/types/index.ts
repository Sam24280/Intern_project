export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface CustomField {
  id: string;
  type: 'text' | 'multiline' | 'number' | 'document' | 'boolean';
  title: string;
  description: string;
  showInTable: boolean;
  order: number;
}

export interface CustomIDElement {
  id: string;
  type: 'text' | 'random20' | 'random32' | 'random6' | 'random9' | 'guid' | 'datetime' | 'sequence';
  value?: string; // for text type
  format?: string; // for datetime and number formatting
  order: number;
}

export interface Inventory {
  id: string;
  title: string;
  description: string;
  category: 'Equipment' | 'Furniture' | 'Book' | 'Other';
  image?: string;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  customFields: CustomField[];
  customIDFormat: CustomIDElement[];
  writeAccessUsers: string[];
  itemCount: number;
}

export interface Item {
  id: string;
  inventoryId: string;
  customId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  likes: string[]; // user IDs who liked
  customFieldValues: Record<string, any>;
}

export interface Discussion {
  id: string;
  inventoryId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (provider: 'google' | 'facebook') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface LanguageContextType {
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  t: (key: string) => string;
}