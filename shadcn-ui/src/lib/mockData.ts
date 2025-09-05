import { User, Inventory, Item, Discussion, CustomField, CustomIDElement } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    isAdmin: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    isAdmin: false,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    isAdmin: false,
    createdAt: new Date('2024-02-01'),
  },
];

export const mockCustomFields: CustomField[] = [
  {
    id: 'field1',
    type: 'text',
    title: 'Model',
    description: 'Device model name',
    showInTable: true,
    order: 1,
  },
  {
    id: 'field2',
    type: 'number',
    title: 'Price',
    description: 'Purchase price in USD',
    showInTable: true,
    order: 2,
  },
  {
    id: 'field3',
    type: 'multiline',
    title: 'Notes',
    description: 'Additional notes and comments',
    showInTable: false,
    order: 3,
  },
];

export const mockCustomIDFormat: CustomIDElement[] = [
  {
    id: 'id1',
    type: 'text',
    value: 'LAP',
    order: 1,
  },
  {
    id: 'id2',
    type: 'sequence',
    order: 2,
  },
];

export const mockInventories: Inventory[] = [
  {
    id: 'inv1',
    title: 'Office Laptops',
    description: 'Company laptop inventory for tracking and management',
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    tags: ['laptops', 'equipment', 'IT'],
    isPublic: false,
    createdBy: '1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    version: 1,
    customFields: mockCustomFields,
    customIDFormat: mockCustomIDFormat,
    writeAccessUsers: ['2'],
    itemCount: 15,
  },
  {
    id: 'inv2',
    title: 'Library Books',
    description: 'Public library book collection management',
    category: 'Book',
    tags: ['books', 'library', 'education'],
    isPublic: true,
    createdBy: '2',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    version: 1,
    customFields: [
      {
        id: 'book1',
        type: 'text',
        title: 'Author',
        description: 'Book author name',
        showInTable: true,
        order: 1,
      },
      {
        id: 'book2',
        type: 'text',
        title: 'ISBN',
        description: 'International Standard Book Number',
        showInTable: true,
        order: 2,
      },
      {
        id: 'book3',
        type: 'number',
        title: 'Year',
        description: 'Publication year',
        showInTable: true,
        order: 3,
      },
    ],
    customIDFormat: [
      {
        id: 'book_id1',
        type: 'text',
        value: 'BOOK',
        order: 1,
      },
      {
        id: 'book_id2',
        type: 'random6',
        order: 2,
      },
    ],
    writeAccessUsers: [],
    itemCount: 234,
  },
  {
    id: 'inv3',
    title: 'Office Furniture',
    description: 'Furniture inventory for office spaces',
    category: 'Furniture',
    tags: ['furniture', 'office', 'workspace'],
    isPublic: false,
    createdBy: '1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    version: 1,
    customFields: [
      {
        id: 'furn1',
        type: 'text',
        title: 'Type',
        description: 'Furniture type (desk, chair, etc.)',
        showInTable: true,
        order: 1,
      },
      {
        id: 'furn2',
        type: 'text',
        title: 'Location',
        description: 'Office location',
        showInTable: true,
        order: 2,
      },
    ],
    customIDFormat: [
      {
        id: 'furn_id1',
        type: 'text',
        value: 'FURN',
        order: 1,
      },
      {
        id: 'furn_id2',
        type: 'sequence',
        order: 2,
      },
    ],
    writeAccessUsers: ['3'],
    itemCount: 45,
  },
];

export const mockItems: Item[] = [
  {
    id: 'item1',
    inventoryId: 'inv1',
    customId: 'LAP001',
    createdBy: '1',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    version: 1,
    likes: ['2', '3'],
    customFieldValues: {
      field1: 'MacBook Pro 16"',
      field2: 2499,
      field3: 'Assigned to John Doe, Development team',
    },
  },
  {
    id: 'item2',
    inventoryId: 'inv1',
    customId: 'LAP002',
    createdBy: '2',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    version: 1,
    likes: ['1'],
    customFieldValues: {
      field1: 'Dell XPS 13',
      field2: 1299,
      field3: 'Assigned to Jane Smith, Marketing team',
    },
  },
];

export const mockDiscussions: Discussion[] = [
  {
    id: 'disc1',
    inventoryId: 'inv1',
    userId: '2',
    userName: 'Jane Smith',
    content: 'Should we add a warranty expiration field to track maintenance schedules?',
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: 'disc2',
    inventoryId: 'inv1',
    userId: '1',
    userName: 'John Doe',
    content: 'Good idea! I\'ll add that as a custom field. We should also consider adding a "Status" field for tracking if devices are in use, in repair, or available.',
    createdAt: new Date('2024-01-15T11:15:00'),
  },
];

// Helper functions for mock API
export const generateCustomId = (format: CustomIDElement[]): string => {
  return format
    .sort((a, b) => a.order - b.order)
    .map(element => {
      switch (element.type) {
        case 'text':
          return element.value || '';
        case 'random20':
          return Math.floor(Math.random() * 1048576).toString().padStart(6, '0');
        case 'random32':
          return Math.floor(Math.random() * 4294967296).toString();
        case 'random6':
          return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        case 'random9':
          return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        case 'guid':
          return crypto.randomUUID();
        case 'datetime':
          return new Date().toISOString().slice(0, 10).replace(/-/g, '');
        case 'sequence':
          // In real implementation, this would query the database
          return '001';
        default:
          return '';
      }
    })
    .join('');
};