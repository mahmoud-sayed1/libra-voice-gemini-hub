import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Search, Book, User, LogOut, Settings } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import AdminPanel from "@/components/AdminPanel";
import VoiceSearch from "@/components/VoiceSearch";
import BookCard from "@/components/BookCard";
import RecommendationEngine from "@/components/RecommendationEngine";
import { useToast } from "@/hooks/use-toast";

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

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  borrowedBooks: string[];
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const { toast } = useToast();

  // Mock books data - in real app this would come from Supabase
  useEffect(() => {
    const mockBooks: Book[] = [
      {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic Literature",
        isbn: "978-0-7432-7356-5",
        available: true,
        description: "A classic American novel about the Jazz Age",
        rating: 4.2
      },
      {
        id: "2",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        isbn: "978-0-06-112008-4",
        available: true,
        description: "A gripping tale of racial injustice and childhood",
        rating: 4.5
      },
      {
        id: "3",
        title: "1984",
        author: "George Orwell",
        genre: "Science Fiction",
        isbn: "978-0-452-28423-4",
        available: false,
        description: "A dystopian social science fiction novel",
        rating: 4.4
      },
      {
        id: "4",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Romance",
        isbn: "978-0-14-143951-8",
        available: true,
        description: "A romantic novel of manners",
        rating: 4.3
      }
    ];
    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  }, []);

  useEffect(() => {
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
    if (userData.isAdmin) {
      toast({
        title: "Admin access granted!",
        description: `Welcome ${userData.name}, you have administrator privileges.`,
      });
    } else {
      toast({
        title: "Welcome back!",
        description: `Hello ${userData.name}, you're now logged in.`,
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const handleBorrowBook = (bookId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to borrow books.",
        variant: "destructive",
      });
      return;
    }

    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, available: false } : book
    ));
    
    setUser(prev => prev ? {
      ...prev,
      borrowedBooks: [...prev.borrowedBooks, bookId]
    } : null);

    toast({
      title: "Book borrowed!",
      description: "The book has been added to your borrowed list.",
    });
  };

  const handleReturnBook = (bookId: string) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, available: true } : book
    ));
    
    setUser(prev => prev ? {
      ...prev,
      borrowedBooks: prev.borrowedBooks.filter(id => id !== bookId)
    } : null);

    toast({
      title: "Book returned!",
      description: "Thank you for returning the book.",
    });
  };

  const handleVoiceSearch = (transcript: string) => {
    setSearchQuery(transcript);
    toast({
      title: "Voice search completed",
      description: `Searching for: "${transcript}"`,
    });
  };

  const handleDeleteBook = (bookId: string) => {
    if (!user?.isAdmin) {
      toast({
        title: "Access denied",
        description: "Only administrators can delete books.",
        variant: "destructive",
      });
      return;
    }

    const bookToDelete = books.find(book => book.id === bookId);
    setBooks(prev => prev.filter(book => book.id !== bookId));
    
    toast({
      title: "Book deleted!",
      description: `"${bookToDelete?.title}" has been removed from the library.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Libra Voice</h1>
                <p className="text-sm text-gray-600">Smart Library Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">{user.name}</span>
                    {user.isAdmin && <Badge variant="secondary">Admin</Badge>}
                  </div>
                  {user.isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdmin(true)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => setShowAuth(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Books</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by title, author, or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <VoiceSearch 
                onResult={handleVoiceSearch}
                isListening={isListening}
                setIsListening={setIsListening}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        {user && !user.isAdmin && (
          <RecommendationEngine 
            user={user}
            books={books}
            onRecommendations={setRecommendations}
          />
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              user={user}
              onBorrow={handleBorrowBook}
              onReturn={handleReturnBook}
              onDelete={handleDeleteBook}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={handleLogin}
      />

      {showAdmin && user?.isAdmin && (
        <AdminPanel
          isOpen={showAdmin}
          onClose={() => setShowAdmin(false)}
          books={books}
          onBooksUpdate={setBooks}
        />
      )}
    </div>
  );
};

export default Index;
