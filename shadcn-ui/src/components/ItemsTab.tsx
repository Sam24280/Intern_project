import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Inventory, Item } from '@/types';
import { mockUsers } from '@/lib/mockData';

interface ItemsTabProps {
  inventory: Inventory;
  items: Item[];
  hasWriteAccess: boolean;
  onItemsChange: (items: Item[]) => void;
}

export const ItemsTab: React.FC<ItemsTabProps> = ({ 
  inventory, 
  items, 
  hasWriteAccess 
}) => {
  const getUserName = (userId: string) => {
    return mockUsers.find(user => user.id === userId)?.name || 'Unknown User';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getFieldValue = (item: Item, fieldId: string) => {
    const value = item.customFieldValues[fieldId];
    const field = inventory.customFields.find(f => f.id === fieldId);
    
    if (!field || value === undefined || value === null) {
      return '-';
    }

    if (field.type === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (field.type === 'document' && value) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View
        </a>
      );
    }
    
    return String(value);
  };

  const visibleFields = inventory.customFields.filter(field => field.showInTable);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Items ({items.length})</CardTitle>
            <CardDescription>
              All items in this inventory
            </CardDescription>
          </div>
          {hasWriteAccess && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No items in this inventory yet.
            </p>
            {hasWriteAccess && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Item
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Custom ID</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Created</TableHead>
                {visibleFields.map((field) => (
                  <TableHead key={field.id}>{field.title}</TableHead>
                ))}
                <TableHead>Likes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link 
                      to={`/inventory/${inventory.id}/item/${item.id}`}
                      className="font-mono font-medium hover:underline"
                    >
                      {item.customId}
                    </Link>
                  </TableCell>
                  <TableCell>{getUserName(item.createdBy)}</TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  {visibleFields.map((field) => (
                    <TableCell key={field.id}>
                      {getFieldValue(item, field.id)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>{item.likes.length}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};