import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, MessageCircle, Settings, LogOut, User, Mic, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BookCard from "@/components/BookCard";
import ChatBot from "@/components/ChatBot";
import AdminPanel from "@/components/AdminPanel";
import VoiceSearch from "@/components/VoiceSearch";
import RecommendationEngine from "@/components/RecommendationEngine";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  available: boolean;
  description?: string;
  rating?: number;
}

interface BorrowedBook {
  id: string;
  user_id: string;
  book_id: string;
  borrowed_at: string;
  returned_at: string | null;
}

const Index = () => {
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(true);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch books from database
  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    } finally {
      setLoadingBooks(false);
    }
  };

  // Fetch borrowed books for current user
  const fetchBorrowedBooks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('borrowed_books')
        .select('*')
        .eq('user_id', user.id)
        .is('returned_at', null);

      if (error) throw error;
      setBorrowedBooks(data || []);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBooks();
      fetchBorrowedBooks();
    }
  }, [user]);

  const handleBorrow = async (bookId: string) => {
    if (!user) return;

    try {
      // Insert borrowed book record
      const { error: borrowError } = await supabase
        .from('borrowed_books')
        .insert({
          user_id: user.id,
          book_id: bookId
        });

      if (borrowError) throw borrowError;

      // Update book availability
      const { error: updateError } = await supabase
        .from('books')
        .update({ available: false })
        .eq('id', bookId);

      if (updateError) throw updateError;

      // Refresh data
      fetchBooks();
      fetchBorrowedBooks();

      const book = books.find(b => b.id === bookId);
      toast({
        title: "Book borrowed!",
        description: `You have successfully borrowed "${book?.title}".`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReturn = async (bookId: string) => {
    if (!user) return;

    try {
      // Update borrowed book record with return date
      const { error: returnError } = await supabase
        .from('borrowed_books')
        .update({ returned_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .is('returned_at', null);

      if (returnError) throw returnError;

      // Update book availability
      const { error: updateError } = await supabase
        .from('books')
        .update({ available: true })
        .eq('id', bookId);

      if (updateError) throw updateError;

      // Refresh data
      fetchBooks();
      fetchBorrowedBooks();

      const book = books.find(b => b.id === bookId);
      toast({
        title: "Book returned!",
        description: `You have successfully returned "${book?.title}".`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      fetchBooks();
      const book = books.find(b => b.id === bookId);
      toast({
        title: "Book deleted!",
        description: `"${book?.title}" has been removed from the library.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Filter and search logic
  const genres = ["All", ...Array.from(new Set(books.map(book => book.genre)))];
  const userBorrowedBookIds = borrowedBooks.map(bb => bb.book_id);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;
    const matchesAvailability = !showAvailableOnly || book.available;
    
    return matchesSearch && matchesGenre && matchesAvailability;
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EJUST Library</h1>
                <p className="text-sm text-gray-600">Smart Voice Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatOpen(true)}
                className="hidden sm:flex"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAdminPanelOpen(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{profile?.name}</span>
                {isAdmin && <Badge variant="secondary">Admin</Badge>}
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search & Discover</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by title, author, or genre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <VoiceSearch onResult={setSearchTerm} />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </Button>
              ))}
              <Button
                variant={showAvailableOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              >
                Available Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <RecommendationEngine 
          books={books} 
          userBorrowedBooks={userBorrowedBookIds}
        />

        {/* Books Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Library Collection ({filteredBooks.length} books)
          </h2>
          
          {loadingBooks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  user={{
                    id: user.id,
                    name: profile?.name || '',
                    email: profile?.email || '',
                    isAdmin: isAdmin,
                    borrowedBooks: userBorrowedBookIds
                  }}
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                  onDelete={isAdmin ? handleDeleteBook : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Mobile Chat */}
      <Button
        className="fixed bottom-6 right-6 sm:hidden rounded-full w-14 h-14 shadow-lg"
        onClick={() => setIsChatOpen(true)}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Modals */}
      <ChatBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        books={books}
      />

      {isAdmin && (
        <AdminPanel
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          books={books}
          onBooksUpdate={() => fetchBooks()}
        />
      )}
    </div>
  );
};

export default Index;
