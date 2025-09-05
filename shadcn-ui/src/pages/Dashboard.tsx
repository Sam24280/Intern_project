import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockInventories } from '@/lib/mockData';
import { Inventory } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [myInventories, setMyInventories] = useState<Inventory[]>([]);
  const [writeAccessInventories, setWriteAccessInventories] = useState<Inventory[]>([]);

  useEffect(() => {
    if (user) {
      // Get inventories owned by current user
      const owned = mockInventories.filter(inv => inv.createdBy === user.id);
      setMyInventories(owned);

      // Get inventories where user has write access
      const writeAccess = mockInventories.filter(inv => 
        inv.writeAccessUsers.includes(user.id) || 
        (inv.isPublic && inv.createdBy !== user.id)
      );
      setWriteAccessInventories(writeAccess);
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const InventoryActions = ({ inventory }: { inventory: Inventory }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/inventory/${inventory.id}`} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        {inventory.createdBy === user.id && (
          <>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Manage your inventories and collaborate with others.
          </p>
        </div>
        <Button asChild>
          <Link to="/inventory/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard.createNew')}
          </Link>
        </Button>
      </div>

      {/* My Inventories */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.myInventories')}</CardTitle>
          <CardDescription>
            Inventories you own and manage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myInventories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't created any inventories yet.
              </p>
              <Button asChild>
                <Link to="/inventory/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Inventory
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myInventories.map((inventory) => (
                  <TableRow key={inventory.id}>
                    <TableCell>
                      <Link 
                        to={`/inventory/${inventory.id}`}
                        className="font-medium hover:underline"
                      >
                        {inventory.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{inventory.category}</Badge>
                    </TableCell>
                    <TableCell>{inventory.itemCount}</TableCell>
                    <TableCell>
                      <Badge variant={inventory.isPublic ? "default" : "secondary"}>
                        {inventory.isPublic ? "Public" : "Private"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(inventory.updatedAt)}</TableCell>
                    <TableCell>
                      <InventoryActions inventory={inventory} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Write Access Inventories */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.writeAccess')}</CardTitle>
          <CardDescription>
            Inventories where you can add and edit items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {writeAccessInventories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You don't have write access to any inventories yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Access Type</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {writeAccessInventories.map((inventory) => (
                  <TableRow key={inventory.id}>
                    <TableCell>
                      <Link 
                        to={`/inventory/${inventory.id}`}
                        className="font-medium hover:underline"
                      >
                        {inventory.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{inventory.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {inventory.createdBy === user.id ? 'You' : 'Other User'}
                    </TableCell>
                    <TableCell>{inventory.itemCount}</TableCell>
                    <TableCell>
                      <Badge variant={inventory.isPublic ? "default" : "secondary"}>
                        {inventory.isPublic ? "Public" : "Invited"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/inventory/${inventory.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}