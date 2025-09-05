import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { mockDiscussions, mockUsers } from '@/lib/mockData';
import { Discussion } from '@/types';

interface DiscussionTabProps {
  inventoryId: string;
  canPost: boolean;
}

export const DiscussionTab: React.FC<DiscussionTabProps> = ({ 
  inventoryId, 
  canPost 
}) => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    // Filter discussions for this inventory
    const inventoryDiscussions = mockDiscussions.filter(
      disc => disc.inventoryId === inventoryId
    );
    setDiscussions(inventoryDiscussions);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // In a real app, this would poll for new messages or use WebSocket
    }, 5000);

    return () => clearInterval(interval);
  }, [inventoryId]);

  const handlePostMessage = async () => {
    if (!newMessage.trim() || !user || !canPost) return;

    setIsPosting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newDiscussion: Discussion = {
      id: `disc_${Date.now()}`,
      inventoryId,
      userId: user.id,
      userName: user.name,
      content: newMessage.trim(),
      createdAt: new Date(),
    };

    setDiscussions([...discussions, newDiscussion]);
    setNewMessage('');
    setIsPosting(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getUserAvatar = (userId: string) => {
    return mockUsers.find(u => u.id === userId)?.avatar;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discussion ({discussions.length})</CardTitle>
        <CardDescription>
          Collaborate and discuss about this inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Messages */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {discussions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No discussions yet. Start the conversation!
            </div>
          ) : (
            discussions.map((discussion) => (
              <div key={discussion.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getUserAvatar(discussion.userId)} />
                  <AvatarFallback>
                    {discussion.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{discussion.userName}</span>
                    <span className="text-muted-foreground">
                      {formatDate(discussion.createdAt)}
                    </span>
                  </div>
                  <div className="text-sm bg-muted p-3 rounded-lg">
                    <p className="whitespace-pre-wrap">{discussion.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Post Message */}
        {canPost ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts about this inventory..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handlePostMessage}
                disabled={!newMessage.trim() || isPosting}
              >
                <Send className="mr-2 h-4 w-4" />
                {isPosting ? 'Posting...' : 'Post Message'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Please log in to participate in discussions.
          </div>
        )}
      </CardContent>
    </Card>
  );
};