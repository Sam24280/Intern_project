import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockInventories, mockItems, mockUsers } from '@/lib/mockData';
import { Inventory, Item } from '@/types';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');
  const [inventoryResults, setInventoryResults] = useState<Inventory[]>([]);
  const [itemResults, setItemResults] = useState<Item[]>([]);

  useEffect(() => {
    performSearch();
  }, [searchParams]);

  const performSearch = () => {
    const query = searchParams.get('q') || '';
    const tag = searchParams.get('tag') || '';
    
    let filteredInventories = mockInventories;
    let filteredItems = mockItems;

    // Filter by search query
    if (query) {
      const queryLower = query.toLowerCase();
      filteredInventories = filteredInventories.filter(inv => 
        inv.title.toLowerCase().includes(queryLower) ||
        inv.description.toLowerCase().includes(queryLower) ||
        inv.tags.some(t => t.toLowerCase().includes(queryLower))
      );
      
      filteredItems = filteredItems.filter(item => {
        const inventory = mockInventories.find(inv => inv.id === item.inventoryId);
        return inventory && (
          item.customId.toLowerCase().includes(queryLower) ||
          Object.values(item.customFieldValues).some(value => 
            String(value).toLowerCase().includes(queryLower)
          )
        );
      });
    }

    // Filter by tag
    if (tag) {
      filteredInventories = filteredInventories.filter(inv => 
        inv.tags.includes(tag)
      );
    }

    setInventoryResults(filteredInventories);
    setItemResults(filteredItems);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (tagFilter) params.set('tag', tagFilter);
    setSearchParams(params);
  };

  const getUserName = (userId: string) => {
    return mockUsers.find(user => user.id === userId)?.name || 'Unknown User';
  };

  const getInventoryName = (inventoryId: string) => {
    return mockInventories.find(inv => inv.id === inventoryId)?.title || 'Unknown Inventory';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="container py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search inventories and items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {(searchParams.get('q') || searchParams.get('tag')) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Searching for:</span>
            {searchParams.get('q') && (
              <Badge variant="outline">"{searchParams.get('q')}"</Badge>
            )}
            {searchParams.get('tag') && (
              <Badge variant="outline">#{searchParams.get('tag')}</Badge>
            )}
          </div>
        )}
      </div>

      {/* Inventory Results */}
      {inventoryResults.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Inventories ({inventoryResults.length})</CardTitle>
            <CardDescription>
              Matching inventories found
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
                {inventoryResults.map((inventory) => (
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
      )}

      {/* Item Results */}
      {itemResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Items ({itemResults.length})</CardTitle>
            <CardDescription>
              Matching items found across all inventories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Custom ID</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Likes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemResults.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link 
                        to={`/inventory/${item.inventoryId}/item/${item.id}`}
                        className="font-mono font-medium hover:underline"
                      >
                        {item.customId}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/inventory/${item.inventoryId}`}
                        className="hover:underline"
                      >
                        {getInventoryName(item.inventoryId)}
                      </Link>
                    </TableCell>
                    <TableCell>{getUserName(item.createdBy)}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>{item.likes.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {inventoryResults.length === 0 && itemResults.length === 0 && (searchParams.get('q') || searchParams.get('tag')) && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No results found for your search.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setTagFilter('');
              setSearchParams({});
            }}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}