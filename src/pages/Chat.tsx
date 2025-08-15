import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Send,
  Plus,
  Settings,
  MoreHorizontal,
  User,
  Home,
  ArrowLeft,
  Sparkles,
  Trash2,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export default function Chat() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedModel, setSelectedModel] = useState("@cf/meta/llama-3.2-3b-preview");
  const [message, setMessage] = useState("");
  const [activeConversationId, setActiveConversationId] = useState("1");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const currentUrl = window.location.href;
      const redirectUrl = `https://user.axionshosting.com/auth/login?redirect=${encodeURIComponent(currentUrl)}&app=main`;
      window.location.href = redirectUrl;
    }
  }, [loading, isAuthenticated]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render chat if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: New chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
      
      // Cmd/Ctrl + B: Toggle sidebar (desktop only)
      if ((e.metaKey || e.ctrlKey) && e.key === 'b' && window.innerWidth >= 1024) {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      
      // Escape: Close sidebar on mobile
      if (e.key === 'Escape' && sidebarOpen && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Close sidebar on outside click for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Store conversations and messages from API
  const [conversations, setConversations] = useState<any>({});
  const [conversationsList, setConversationsList] = useState<any[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  // Get current conversation data
  const currentConversation = conversations[activeConversationId];

  // Load conversations from API
  useEffect(() => {
    const loadConversations = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoadingConversations(true);
        const response = await fetch('https://axionlabs-api.a-contactnaol.workers.dev/v1/conversations');
        const result = await response.json();
        
        if (result.success && result.data) {
          const conversationsData: any = {};
          const conversationsArray = result.data;
          
          // Load messages for each conversation
          for (const conv of conversationsArray) {
            const messagesResponse = await fetch(`https://axionlabs-api.a-contactnaol.workers.dev/v1/conversations/${conv.id}/messages`);
            const messagesResult = await messagesResponse.json();
            
            conversationsData[conv.id] = {
              ...conv,
              messages: messagesResult.success ? messagesResult.data.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
              })) : []
            };
          }
          
          setConversations(conversationsData);
          setConversationsList(conversationsArray.sort((a: any, b: any) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          ));
          
          // Set active conversation to the most recent one if none selected
          if (!activeConversationId && conversationsArray.length > 0) {
            setActiveConversationId(conversationsArray[0].id);
          }
        }
        
        // If no conversations exist, create a default one
        if (!result.data || result.data.length === 0) {
          await handleNewChat();
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
        // Create a default conversation on error
        await handleNewChat();
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, [isAuthenticated]);

  const models = [
    {
      id: "@cf/meta/llama-3.2-1b-preview",
      name: "Llama 3.2 1B",
      description: "Fast and efficient"
    },
    {
      id: "@cf/meta/llama-3.2-3b-preview", 
      name: "Llama 3.2 3B",
      description: "Balanced performance"
    },
    {
      id: "@cf/meta/codellama-7b-instruct-awq",
      name: "CodeLlama 7B", 
      description: "Code and reasoning"
    },
    {
      id: "@cf/mistral/mistral-7b-instruct-v0.1",
      name: "Mistral 7B",
      description: "Creative and detailed"
    }
  ];

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversationId) return;
    
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    // Add user message to current conversation locally (for immediate UI feedback)
    setConversations(prev => ({
      ...prev,
      [activeConversationId]: {
        ...prev[activeConversationId],
        messages: [...(prev[activeConversationId]?.messages || []), userMessage]
      }
    }));
    
    const currentMessage = message;
    setMessage("");
    setIsTyping(true);
    
    try {
      // Get conversation history for context
      const conversationHistory = (conversations[activeConversationId]?.messages || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message
      conversationHistory.push({ role: "user", content: currentMessage });
      
      // Call the API with conversation_id for database storage
      const response = await fetch('https://axionlabs-api.a-contactnaol.workers.dev/v1/ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory,
          model: selectedModel,
          conversation_id: activeConversationId
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        const aiResponse = {
          id: result.data.conversation_id + '_' + Date.now(),
          role: "assistant",
          content: result.data.response,
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        // Update local conversation with AI response
        setConversations(prev => ({
          ...prev,
          [activeConversationId]: {
            ...prev[activeConversationId],
            messages: [...(prev[activeConversationId]?.messages || []), aiResponse]
          }
        }));
        
        // Update conversation title if this is the first real message
        if (conversations[activeConversationId]?.messages?.length <= 2) {
          const title = currentMessage.slice(0, 50) + (currentMessage.length > 50 ? '...' : '');
          setConversations(prev => ({
            ...prev,
            [activeConversationId]: {
              ...prev[activeConversationId],
              title
            }
          }));
        }
      } else {
        throw new Error(result.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Chat API error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setConversations(prev => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: [...(prev[activeConversationId]?.messages || []), errorResponse]
        }
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = async () => {
    try {
      // Create new conversation via API
      const response = await fetch('https://axionlabs-api.a-contactnaol.workers.dev/v1/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Conversation',
          model: selectedModel
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        const newConversation = {
          ...result.data,
          messages: [
            {
              id: 'welcome_' + Date.now(),
              role: "assistant",
              content: "Hello! I'm Gideon, your AI assistant powered by Cloudflare Workers AI. I'm now fully operational and ready to help you with anything you need. How can I assist you today?",
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            }
          ]
        };
        
        // Add to local state
        setConversations(prev => ({
          ...prev,
          [result.data.id]: newConversation
        }));
        
        // Update conversations list
        setConversationsList(prev => [result.data, ...prev]);
        
        // Set as active conversation
        setActiveConversationId(result.data.id);
      }
    } catch (error) {
      console.error('Failed to create new conversation:', error);
      // Fallback to local-only conversation
      const newId = 'local_' + Date.now();
      const newConversation = {
        id: newId,
        title: "New Conversation",
        messages: [
          {
            id: 'welcome_' + Date.now(),
            role: "assistant",
            content: "Hello! I'm Gideon, your AI assistant. How can I help you today?",
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }
        ],
        created_at: new Date().toISOString()
      };
      
      setConversations(prev => ({
        ...prev,
        [newId]: newConversation
      }));
      setActiveConversationId(newId);
    }
  };

  const handleSwitchConversation = (conversationId) => {
    setActiveConversationId(conversationId);
  };

  const handleDeleteConversation = (conversationId) => {
    if (Object.keys(conversations).length === 1) {
      // If this is the last conversation, create a new one
      handleNewChat();
    }
    
    setConversations(prev => {
      const newConversations = { ...prev };
      delete newConversations[conversationId];
      return newConversations;
    });
    
    // If we deleted the active conversation, switch to the first available one
    if (conversationId === activeConversationId) {
      const remainingIds = Object.keys(conversations).filter(id => id !== conversationId);
      if (remainingIds.length > 0) {
        setActiveConversationId(remainingIds[0]);
      }
    }
  };

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'hsl(var(--color-background))', color: 'hsl(var(--color-foreground))' }}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 chat-sidebar flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6" style={{ borderBottom: '1px solid hsl(var(--color-sidebar-border))' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--color-primary))' }}>
                <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--color-primary-foreground))' }} />
              </div>
              <span className="font-semibold text-lg">Gideon</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* Mobile Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 h-10 w-10"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handleNewChat}
            className="w-full btn-primary rounded-lg h-10"
            aria-label="Create new chat (Ctrl+K)"
          >
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </Button>
          
          <div className="flex gap-2 mt-3">
            <Button asChild variant="outline" size="sm" className="flex-1 btn-secondary">
              <Link to="/">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1 btn-secondary">
              <Link to="/gideon">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Gideon
              </Link>
            </Button>
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white opacity-50"></div>
              </div>
            ) : conversationsList.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              conversationsList.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSwitchConversation(conv.id)}
                className={`conversation-item group ${
                  conv.id === activeConversationId 
                    ? 'active' 
                    : ''
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Switch to conversation: ${conv.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSwitchConversation(conv.id);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium truncate" style={{ color: 'hsl(var(--color-foreground))' }}>{conv.title}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" style={{ color: 'hsl(var(--color-foreground-muted))' }} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        className="status-error"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-caption truncate mb-1">
                  {conv.messages[conv.messages.length - 1]?.content || "New conversation"}
                </p>
                <p className="text-caption" style={{ color: 'hsl(var(--color-foreground-subtle))' }}>
                  {new Date(conv.created_at || conv.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4" style={{ borderTop: '1px solid hsl(var(--color-sidebar-border))' }}>
          <div className="conversation-item flex items-center gap-3 p-2 -m-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-small font-medium">{user?.user_metadata?.full_name || user?.full_name || 'Demo User'}</p>
              <p className="text-caption">Enterprise Plan</p>
            </div>
            <Settings className="w-4 h-4" style={{ color: 'hsl(var(--color-foreground-muted))' }} />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-0" style={{ backgroundColor: 'hsl(var(--color-background))' }}>
        {/* Header */}
        <div className="p-4" style={{ borderBottom: '1px solid hsl(var(--color-border))', backgroundColor: 'hsl(var(--color-surface))' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 h-10 w-10"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--color-primary))' }}>
                <Brain className="w-4 h-4" style={{ color: 'hsl(var(--color-primary-foreground))' }} />
              </div>
              <div>
                <h1 className="text-heading-4">Gideon</h1>
                <p className="text-caption">AI Assistant</p>
              </div>
            </div>
            
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-44 md:w-52" style={{ backgroundColor: 'hsl(var(--color-surface))', borderColor: 'hsl(var(--color-border))', color: 'hsl(var(--color-foreground))' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'hsl(var(--color-surface))', borderColor: 'hsl(var(--color-border))' }}>
                {models.map((model) => (
                  <SelectItem 
                    key={model.id} 
                    value={model.id}
                    className="hover:bg-gray-50 focus:bg-gray-50"
                    style={{ color: 'hsl(var(--color-foreground))' }}
                  >
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-caption">{model.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1" style={{ backgroundColor: 'hsl(var(--color-background))' }}>
          <div className="chat-message-container">
            <div className="space-y-6">
              {currentConversation?.messages.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-blue-500' 
                        : ''
                    }`} style={msg.role !== 'user' ? { backgroundColor: 'hsl(var(--color-primary))' } : {}}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Brain className="w-4 h-4" style={{ color: 'hsl(var(--color-primary-foreground))' }} />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="text-body-small font-medium" style={{ color: 'hsl(var(--color-foreground-muted))' }}>
                        {msg.role === 'user' ? 'You' : 'Gideon'}
                      </div>
                      <div className="text-body leading-relaxed" style={{ color: 'hsl(var(--color-foreground))' }}>
                        {msg.content}
                      </div>
                      <div className="text-caption opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              )) || []}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="group">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'hsl(var(--color-primary))' }}>
                      <Brain className="w-4 h-4" style={{ color: 'hsl(var(--color-primary-foreground))' }} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="text-body-small font-medium" style={{ color: 'hsl(var(--color-foreground-muted))' }}>
                        Gideon
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full typing-dot" style={{ backgroundColor: 'hsl(var(--color-foreground-muted))' }}></div>
                        <div className="w-2 h-2 rounded-full typing-dot" style={{ backgroundColor: 'hsl(var(--color-foreground-muted))' }}></div>
                        <div className="w-2 h-2 rounded-full typing-dot" style={{ backgroundColor: 'hsl(var(--color-foreground-muted))' }}></div>
                        <span className="text-body-small ml-2" style={{ color: 'hsl(var(--color-foreground-muted))' }}>typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div style={{ borderTop: '1px solid hsl(var(--color-border))', backgroundColor: 'hsl(var(--color-surface))' }}>
          <div className="chat-message-container">
            <div className="relative chat-input-container">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Message Gideon..."
                className="border-0 bg-transparent focus:ring-0 rounded-2xl h-14 text-base pr-14"
                style={{ color: 'hsl(var(--color-foreground))' }}
                aria-label="Type your message here"
                autoComplete="off"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="sm"
                className={`absolute right-3 top-3 h-8 w-8 p-0 rounded-lg transition-all ${
                  message.trim() 
                    ? 'btn-primary' 
                    : 'cursor-not-allowed'
                }`}
                style={!message.trim() ? { 
                  backgroundColor: 'hsl(var(--color-secondary))', 
                  color: 'hsl(var(--color-foreground-muted))'
                } : {}}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mt-4 flex items-center justify-center">
              <p className="text-caption">
                Gideon can make mistakes. Please verify important information.
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-caption">
                  Powered by AI
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}