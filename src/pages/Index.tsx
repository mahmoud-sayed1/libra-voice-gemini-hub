
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, User, LogOut, Mic, Star, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import BookCard from "@/components/BookCard";
import AdminPanel from "@/components/AdminPanel";
import VoiceSearch from "@/components/VoiceSearch";
import RecommendationEngine from "@/components/RecommendationEngine";
import ChatBot from "@/components/ChatBot";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  rating?: number;
  available: boolean;
}

interface BorrowedBook {
  id: string;
  book_id: string;
  borrowed_at: string;
  returned_at: string | null;
  book: Book;
}

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, loading: authLoading, signOut, isAdmin } = useAuth();
  const { toast } = useToast();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/auth';
    }
  }, [user, authLoading]);

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
        description: "Failed to fetch books",
        variant: "destructive",
      });
    }
  };

  const fetchBorrowedBooks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('borrowed_books')
        .select(`
          *,
          book:books(*)
        `)
        .eq('user_id', user.id)
        .is('returned_at', null);

      if (error) throw error;
      setBorrowedBooks(data || []);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchBooks();
      fetchBorrowedBooks();
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleBorrowBook = async (bookId: string) => {
    if (!user) return;

    try {
      // Check if already borrowed
      const isAlreadyBorrowed = borrowedBooks.some(bb => bb.book_id === bookId);
      if (isAlreadyBorrowed) {
        toast({
          title: "Already borrowed",
          description: "You have already borrowed this book",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('borrowed_books')
        .insert({
          user_id: user.id,
          book_id: bookId,
        });

      if (error) throw error;

      toast({
        title: "Book borrowed successfully!",
        description: "The book has been added to your collection.",
      });

      fetchBorrowedBooks();
    } catch (error) {
      console.error('Error borrowing book:', error);
      toast({
        title: "Error",
        description: "Failed to borrow book",
        variant: "destructive",
      });
    }
  };

  const handleReturnBook = async (borrowId: string) => {
    try {
      const { error } = await supabase
        .from('borrowed_books')
        .update({ returned_at: new Date().toISOString() })
        .eq('id', borrowId);

      if (error) throw error;

      toast({
        title: "Book returned successfully!",
        description: "Thank you for returning the book.",
      });

      fetchBorrowedBooks();
    } catch (error) {
      console.error('Error returning book:', error);
      toast({
        title: "Error",
        description: "Failed to return book",
        variant: "destructive",
      });
    }
  };

  const handleVoiceResult = (transcript: string) => {
    setSearchTerm(transcript);
    toast({
      title: "Voice search captured",
      description: `Searching for: "${transcript}"`,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const genres = ["All", ...new Set(books.map(book => book.genre))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const userBorrowedBookIds = borrowedBooks.map(bb => bb.book_id);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading your library...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EJUST Library</h1>
                <p className="text-sm text-gray-600">Smart Voice Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Welcome, {profile?.name || user.email}</span>
                {isAdmin && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Admin
                  </Badge>
                )}
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Panel */}
        {isAdmin && (
          <div className="mb-8">
            <AdminPanel onBookAdded={fetchBooks} />
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search books, authors, or genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-12 bg-white"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <VoiceSearch onResult={handleVoiceResult} />
              </div>
            </div>
            
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* My Borrowed Books */}
        {borrowedBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              My Borrowed Books ({borrowedBooks.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {borrowedBooks.map((borrowedBook) => (
                <BookCard
                  key={borrowedBook.id}
                  book={borrowedBook.book}
                  onBorrow={() => {}}
                  onReturn={() => handleReturnBook(borrowedBook.id)}
                  isBorrowed={true}
                  isAvailable={borrowedBook.book.available}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommendation Engine */}
        <div className="mb-8">
          <RecommendationEngine 
            books={books}
            userBorrowedBooks={userBorrowedBookIds}
          />
        </div>

        {/* Books Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            All Books ({filteredBooks.length})
          </h2>
          
          {filteredBooks.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-600">
                {searchTerm ? `No books match "${searchTerm}"` : "No books available in this genre"}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBorrow={() => handleBorrowBook(book.id)}
                  isBorrowed={userBorrowedBookIds.includes(book.id)}
                  isAvailable={book.available}
                />
              ))}
            </div>
          )}
        </div>

        {/* AI Chat Assistant */}
        <ChatBot />
      </div>
    </div>
  );
};

export default Index;
