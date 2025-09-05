import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Users, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockInventories, mockUsers } from '@/lib/mockData';
import { Inventory } from '@/types';

export default function Index() {
  const { t } = useLanguage();
  const [latestInventories, setLatestInventories] = useState<Inventory[]>([]);
  const [popularInventories, setPopularInventories] = useState<Inventory[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    // Get latest inventories (sorted by creation date)
    const latest = [...mockInventories]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
    setLatestInventories(latest);

    // Get popular inventories (sorted by item count)
    const popular = [...mockInventories]
      .sort((a, b) => b.itemCount - a.itemCount)
      .slice(0, 5);
    setPopularInventories(popular);

    // Extract all unique tags
    const tags = Array.from(new Set(mockInventories.flatMap(inv => inv.tags)));
    setAllTags(tags);
  }, []);

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

  return (
    <div className="container py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {t('home.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </div>

      {/* Latest Inventories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('home.latest')}
          </CardTitle>
          <CardDescription>
            Recently created inventories from the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestInventories.map((inventory) => (
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
                  <TableCell>{getUserName(inventory.createdBy)}</TableCell>
                  <TableCell>{inventory.itemCount}</TableCell>
                  <TableCell>{formatDate(inventory.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {inventory.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {inventory.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{inventory.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Popular Inventories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('home.popular')}
          </CardTitle>
          <CardDescription>
            Most active inventories with the highest number of items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularInventories.map((inventory) => (
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
                  <TableCell>{getUserName(inventory.createdBy)}</TableCell>
                  <TableCell className="font-medium">{inventory.itemCount}</TableCell>
                  <TableCell>
                    <Badge variant={inventory.isPublic ? "default" : "secondary"}>
                      {inventory.isPublic ? "Public" : "Private"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tag Cloud */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {t('home.tags')}
          </CardTitle>
          <CardDescription>
            Discover inventories by popular tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                asChild
                className="hover:bg-primary hover:text-primary-foreground"
              >
                <Link to={`/search?tag=${encodeURIComponent(tag)}`}>
                  #{tag}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}