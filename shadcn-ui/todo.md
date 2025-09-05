# Inventory Management System - MVP Implementation Plan

## Core Files to Create/Modify

### 1. **index.html** - Update title and meta tags
- Change title to "Inventory Management System"
- Update description

### 2. **src/App.tsx** - Main application routing
- Add routes for all major pages
- Include authentication context
- Add theme and language providers

### 3. **src/pages/Index.tsx** - Homepage
- Latest inventories table
- Top 5 popular inventories
- Tag cloud
- Search functionality

### 4. **src/pages/Login.tsx** - Authentication page
- Social login (Google, Facebook simulation)
- Login/logout functionality

### 5. **src/pages/Dashboard.tsx** - User personal page
- My inventories table
- Inventories with write access table
- User profile management

### 6. **src/pages/InventoryPage.tsx** - Individual inventory page
- Tabs: Items, Discussion, Settings, Custom ID, Access, Fields, Statistics
- Real-time discussion updates
- Item management

### 7. **src/pages/ItemPage.tsx** - Individual item page
- Item details with custom fields
- Like functionality
- Edit mode for authorized users

### 8. **src/components/InventoryTable.tsx** - Reusable inventory table
- Sortable columns
- Filter functionality
- No buttons in rows (toolbar actions)

## Key Components Structure

### Authentication & Context
- `src/contexts/AuthContext.tsx` - User authentication state
- `src/contexts/ThemeContext.tsx` - Light/dark theme
- `src/contexts/LanguageContext.tsx` - Multi-language support

### Core Components
- `src/components/Header.tsx` - Navigation with search
- `src/components/SearchBar.tsx` - Global search functionality
- `src/components/CustomFieldEditor.tsx` - Field management
- `src/components/CustomIDGenerator.tsx` - ID format configuration
- `src/components/ItemForm.tsx` - Add/edit items
- `src/components/DiscussionTab.tsx` - Real-time discussions

## Data Structure (Mock Implementation)
- `src/lib/mockData.ts` - Sample data for development
- `src/lib/api.ts` - API simulation functions
- `src/types/index.ts` - TypeScript interfaces

## Implementation Priority
1. Basic routing and authentication simulation
2. Homepage with inventory tables
3. User dashboard
4. Inventory page with basic tabs
5. Item management
6. Custom fields system
7. Custom ID generation
8. Discussion system
9. Theme and language switching

## Technical Considerations
- Use localStorage for persistence in MVP
- Simulate real-time updates with intervals
- Bootstrap-based responsive design
- Form validation and error handling
- Optimistic locking simulation