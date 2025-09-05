import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Heart, Edit, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockInventories, mockItems, mockUsers } from '@/lib/mockData';
import { Item, Inventory } from '@/types';

export default function ItemPage() {
  const { inventoryId, itemId } = useParams<{ inventoryId: string; itemId: string }>();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (inventoryId && itemId) {
      const foundInventory = mockInventories.find(inv => inv.id === inventoryId);
      const foundItem = mockItems.find(item => item.id === itemId && item.inventoryId === inventoryId);
      
      setInventory(foundInventory || null);
      setItem(foundItem || null);
      setLoading(false);
    }
  }, [inventoryId, itemId]);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!item || !inventory) {
    return <Navigate to="/404" replace />;
  }

  const isLiked = user && item.likes.includes(user.id);
  const canEdit = user && (
    user.id === item.createdBy || 
    user.id === inventory.createdBy || 
    user.isAdmin ||
    inventory.writeAccessUsers.includes(user.id) ||
    inventory.isPublic
  );

  const getCreatorName = () => {
    return mockUsers.find(u => u.id === item.createdBy)?.name || 'Unknown User';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const toggleLike = () => {
    if (!user) return;
    
    // In a real app, this would make an API call
    const newLikes = isLiked 
      ? item.likes.filter(id => id !== user.id)
      : [...item.likes, user.id];
    
    setItem({ ...item, likes: newLikes });
  };

  return (
    <div className="container py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to={`/inventory/${inventoryId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {inventory.title}
          </Link>
        </Button>
      </div>

      {/* Item Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Item {item.customId}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Created by {getCreatorName()}</span>
            <span>•</span>
            <span>{formatDate(item.createdAt)}</span>
            {item.updatedAt > item.createdAt && (
              <>
                <span>•</span>
                <span>Updated {formatDate(item.updatedAt)}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user && (
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={toggleLike}
            >
              <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {item.likes.length}
            </Button>
          )}
          
          {canEdit && (
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Item Details */}
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>
            Custom field values for this item
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fixed Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Custom ID</label>
              <p className="font-mono text-lg">{item.customId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p>{formatDate(item.createdAt)}</p>
            </div>
          </div>

          {/* Custom Fields */}
          {inventory.customFields.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Custom Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventory.customFields.map((field) => {
                  const value = item.customFieldValues[field.id];
                  return (
                    <div key={field.id}>
                      <label className="text-sm font-medium text-muted-foreground">
                        {field.title}
                      </label>
                      {field.type === 'boolean' ? (
                        <div className="mt-1">
                          <Badge variant={value ? "default" : "secondary"}>
                            {value ? "Yes" : "No"}
                          </Badge>
                        </div>
                      ) : field.type === 'multiline' ? (
                        <div className="mt-1 p-3 bg-muted rounded-md">
                          <p className="whitespace-pre-wrap">{value || 'Not specified'}</p>
                        </div>
                      ) : field.type === 'document' ? (
                        <div className="mt-1">
                          {value ? (
                            <a 
                              href={value} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Document
                            </a>
                          ) : (
                            <span className="text-muted-foreground">No document</span>
                          )}
                        </div>
                      ) : (
                        <p className="mt-1">{value || 'Not specified'}</p>
                      )}
                      {field.description && (
                        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}