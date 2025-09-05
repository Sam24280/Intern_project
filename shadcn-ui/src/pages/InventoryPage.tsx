import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Settings, Hash, Users, List, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockInventories, mockItems, mockDiscussions, mockUsers } from '@/lib/mockData';
import { Inventory, Item } from '@/types';
import { ItemsTab } from '@/components/ItemsTab';
import { DiscussionTab } from '@/components/DiscussionTab';

export default function InventoryPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Find inventory
      const foundInventory = mockInventories.find(inv => inv.id === id);
      setInventory(foundInventory || null);

      // Find items for this inventory
      const inventoryItems = mockItems.filter(item => item.inventoryId === id);
      setItems(inventoryItems);

      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!inventory) {
    return <Navigate to="/404" replace />;
  }

  const isOwner = user?.id === inventory.createdBy;
  const hasWriteAccess = user && (
    isOwner || 
    user.isAdmin || 
    inventory.writeAccessUsers.includes(user.id) || 
    inventory.isPublic
  );

  const getOwnerName = () => {
    return mockUsers.find(u => u.id === inventory.createdBy)?.name || 'Unknown User';
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

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{inventory.title}</h1>
            <p className="text-muted-foreground mb-4">{inventory.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Created by {getOwnerName()}</span>
              <span>•</span>
              <span>{formatDate(inventory.createdAt)}</span>
              <span>•</span>
              <Badge variant="outline">{inventory.category}</Badge>
              <Badge variant={inventory.isPublic ? "default" : "secondary"}>
                {inventory.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
          </div>
          {inventory.image && (
            <img 
              src={inventory.image} 
              alt={inventory.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Tags */}
        {inventory.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {inventory.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="items" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="items" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            {t('inventory.items')}
          </TabsTrigger>
          <TabsTrigger value="discussion" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('inventory.discussion')}
          </TabsTrigger>
          {(isOwner || user?.isAdmin) && (
            <>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t('inventory.settings')}
              </TabsTrigger>
              <TabsTrigger value="custom-id" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {t('inventory.customId')}
              </TabsTrigger>
              <TabsTrigger value="access" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('inventory.access')}
              </TabsTrigger>
              <TabsTrigger value="fields" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                {t('inventory.fields')}
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            {t('inventory.stats')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <ItemsTab 
            inventory={inventory} 
            items={items} 
            hasWriteAccess={!!hasWriteAccess}
            onItemsChange={setItems}
          />
        </TabsContent>

        <TabsContent value="discussion">
          <DiscussionTab 
            inventoryId={inventory.id}
            canPost={!!user}
          />
        </TabsContent>

        {(isOwner || user?.isAdmin) && (
          <>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure basic inventory information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom-id">
              <Card>
                <CardHeader>
                  <CardTitle>Custom ID Format</CardTitle>
                  <CardDescription>
                    Configure how item IDs are generated for this inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Custom ID configuration coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access">
              <Card>
                <CardHeader>
                  <CardTitle>Access Management</CardTitle>
                  <CardDescription>
                    Control who can view and edit items in this inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Access management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fields">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Fields</CardTitle>
                  <CardDescription>
                    Define custom fields for items in this inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Field management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Statistics</CardTitle>
              <CardDescription>
                Overview of your inventory data and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{items.length}</div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{inventory.customFields.length}</div>
                  <div className="text-sm text-muted-foreground">Custom Fields</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{inventory.writeAccessUsers.length + 1}</div>
                  <div className="text-sm text-muted-foreground">Contributors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}