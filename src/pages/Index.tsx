import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Book, User, LogOut, Settings, Plus, MessageCircle } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import AdminPanel from "@/components/AdminPanel";
import VoiceSearch from "@/components/VoiceSearch";
import BookCard from "@/components/BookCard";
import RecommendationEngine from "@/components/RecommendationEngine";
import ChatBot from "@/components/ChatBot";
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
  const [showWelcome, setShowWelcome] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
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
      },
      {
        id: "5",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        genre: "Fiction",
        isbn: "978-0-316-76948-0",
        available: true,
        description: "A controversial coming-of-age story",
        rating: 3.8
      },
      {
        id: "6",
        title: "Lord of the Flies",
        author: "William Golding",
        genre: "Fiction",
        isbn: "978-0-571-05686-2",
        available: true,
        description: "A story of survival and human nature",
        rating: 4.0
      },
      {
        id: "7",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        isbn: "978-0-547-92822-7",
        available: true,
        description: "A magical adventure in Middle-earth",
        rating: 4.6
      },
      {
        id: "8",
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
        isbn: "978-0-439-02348-1",
        available: false,
        description: "The beginning of the magical Harry Potter series",
        rating: 4.7
      },
      {
        id: "9",
        title: "The Da Vinci Code",
        author: "Dan Brown",
        genre: "Thriller",
        isbn: "978-0-307-47427-5",
        available: true,
        description: "A thrilling mystery involving art and religion",
        rating: 4.1
      },
      {
        id: "10",
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Philosophy",
        isbn: "978-0-06-112241-5",
        available: true,
        description: "A philosophical novel about following dreams",
        rating: 4.2
      },
      {
        id: "11",
        title: "Brave New World",
        author: "Aldous Huxley",
        genre: "Science Fiction",
        isbn: "978-0-06-085052-4",
        available: true,
        description: "A dystopian vision of the future",
        rating: 4.0
      },
      {
        id: "12",
        title: "The Chronicles of Narnia",
        author: "C.S. Lewis",
        genre: "Fantasy",
        isbn: "978-0-06-623851-4",
        available: true,
        description: "A magical journey to another world",
        rating: 4.5
      },
      {
        id: "13",
        title: "Gone Girl",
        author: "Gillian Flynn",
        genre: "Thriller",
        isbn: "978-0-307-58836-4",
        available: false,
        description: "A psychological thriller about marriage",
        rating: 4.0
      },
      {
        id: "14",
        title: "The Girl with the Dragon Tattoo",
        author: "Stieg Larsson",
        genre: "Mystery",
        isbn: "978-0-307-45454-1",
        available: true,
        description: "A gripping Swedish crime novel",
        rating: 4.2
      },
      {
        id: "15",
        title: "Life of Pi",
        author: "Yann Martel",
        genre: "Adventure",
        isbn: "978-0-15-602732-3",
        available: true,
        description: "A survival story with a tiger",
        rating: 3.9
      },
      {
        id: "16",
        title: "The Kite Runner",
        author: "Khaled Hosseini",
        genre: "Fiction",
        isbn: "978-1-59448-000-3",
        available: true,
        description: "A story of friendship and redemption",
        rating: 4.3
      },
      {
        id: "17",
        title: "The Book Thief",
        author: "Markus Zusak",
        genre: "Historical Fiction",
        isbn: "978-0-375-83100-3",
        available: true,
        description: "A story set in Nazi Germany",
        rating: 4.4
      },
      {
        id: "18",
        title: "The Hunger Games",
        author: "Suzanne Collins",
        genre: "Science Fiction",
        isbn: "978-0-439-02348-1",
        available: false,
        description: "A dystopian adventure story",
        rating: 4.1
      },
      {
        id: "19",
        title: "Twilight",
        author: "Stephenie Meyer",
        genre: "Romance",
        isbn: "978-0-316-01584-4",
        available: true,
        description: "A vampire romance story",
        rating: 3.6
      },
      {
        id: "20",
        title: "The Fault in Our Stars",
        author: "John Green",
        genre: "Young Adult",
        isbn: "978-0-525-47881-2",
        available: true,
        description: "A touching story about young love",
        rating: 4.2
      },
      {
        id: "21",
        title: "Animal Farm",
        author: "George Orwell",
        genre: "Political Fiction",
        isbn: "978-0-452-28424-1",
        available: true,
        description: "An allegorical novella about farm animals",
        rating: 4.1
      },
      {
        id: "22",
        title: "Of Mice and Men",
        author: "John Steinbeck",
        genre: "Fiction",
        isbn: "978-0-14-017739-8",
        available: true,
        description: "A story of friendship during the Great Depression",
        rating: 3.9
      },
      {
        id: "23",
        title: "The Outsiders",
        author: "S.E. Hinton",
        genre: "Young Adult",
        isbn: "978-0-14-038572-4",
        available: true,
        description: "A coming-of-age story about teenage gangs",
        rating: 4.0
      },
      {
        id: "24",
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        genre: "Science Fiction",
        isbn: "978-1-451-67331-9",
        available: true,
        description: "A dystopian novel about book burning",
        rating: 4.0
      },
      {
        id: "25",
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        isbn: "978-0-544-00341-5",
        available: true,
        description: "An epic fantasy adventure",
        rating: 4.8
      },
      {
        id: "26",
        title: "Romeo and Juliet",
        author: "William Shakespeare",
        genre: "Drama",
        isbn: "978-0-14-062430-8",
        available: true,
        description: "The classic tale of star-crossed lovers",
        rating: 4.1
      },
      {
        id: "27",
        title: "Hamlet",
        author: "William Shakespeare",
        genre: "Drama",
        isbn: "978-0-14-062431-5",
        available: true,
        description: "Shakespeare's most famous tragedy",
        rating: 4.2
      },
      {
        id: "28",
        title: "Jane Eyre",
        author: "Charlotte Brontë",
        genre: "Romance",
        isbn: "978-0-14-144114-6",
        available: true,
        description: "A Gothic romance novel",
        rating: 4.1
      },
      {
        id: "29",
        title: "Wuthering Heights",
        author: "Emily Brontë",
        genre: "Romance",
        isbn: "978-0-14-143955-6",
        available: true,
        description: "A passionate tale of love and revenge",
        rating: 3.8
      },
      {
        id: "30",
        title: "The Picture of Dorian Gray",
        author: "Oscar Wilde",
        genre: "Gothic Fiction",
        isbn: "978-0-14-143957-0",
        available: true,
        description: "A philosophical novel about beauty and corruption",
        rating: 4.0
      },
      {
        id: "31",
        title: "Dracula",
        author: "Bram Stoker",
        genre: "Horror",
        isbn: "978-0-14-143984-6",
        available: true,
        description: "The classic vampire novel",
        rating: 4.0
      },
      {
        id: "32",
        title: "Frankenstein",
        author: "Mary Shelley",
        genre: "Science Fiction",
        isbn: "978-0-14-143947-1",
        available: true,
        description: "The story of Victor Frankenstein and his monster",
        rating: 3.9
      },
      {
        id: "33",
        title: "The Adventures of Tom Sawyer",
        author: "Mark Twain",
        genre: "Adventure",
        isbn: "978-0-14-036708-9",
        available: true,
        description: "A classic American adventure story",
        rating: 3.9
      },
      {
        id: "34",
        title: "Adventures of Huckleberry Finn",
        author: "Mark Twain",
        genre: "Adventure",
        isbn: "978-0-14-243717-4",
        available: true,
        description: "A journey down the Mississippi River",
        rating: 3.8
      },
      {
        id: "35",
        title: "The Call of the Wild",
        author: "Jack London",
        genre: "Adventure",
        isbn: "978-0-14-018651-2",
        available: true,
        description: "A dog's journey in the Alaskan wilderness",
        rating: 4.0
      },
      {
        id: "36",
        title: "White Fang",
        author: "Jack London",
        genre: "Adventure",
        isbn: "978-0-14-036752-2",
        available: true,
        description: "The story of a wolf-dog's domestication",
        rating: 3.9
      },
      {
        id: "37",
        title: "The Secret Garden",
        author: "Frances Hodgson Burnett",
        genre: "Children's Literature",
        isbn: "978-0-14-036793-5",
        available: true,
        description: "A magical story about a hidden garden",
        rating: 4.2
      },
      {
        id: "38",
        title: "Little Women",
        author: "Louisa May Alcott",
        genre: "Family",
        isbn: "978-0-14-036774-4",
        available: true,
        description: "The story of the March sisters",
        rating: 4.1
      },
      {
        id: "39",
        title: "Anne of Green Gables",
        author: "L.M. Montgomery",
        genre: "Children's Literature",
        isbn: "978-0-14-036794-2",
        available: true,
        description: "The adventures of an orphan girl",
        rating: 4.3
      },
      {
        id: "40",
        title: "The Lion, the Witch and the Wardrobe",
        author: "C.S. Lewis",
        genre: "Fantasy",
        isbn: "978-0-06-764898-1",
        available: true,
        description: "Children discover a magical world",
        rating: 4.4
      },
      {
        id: "41",
        title: "Alice's Adventures in Wonderland",
        author: "Lewis Carroll",
        genre: "Fantasy",
        isbn: "978-0-14-036782-9",
        available: true,
        description: "Alice's journey through Wonderland",
        rating: 4.0
      },
      {
        id: "42",
        title: "Peter Pan",
        author: "J.M. Barrie",
        genre: "Fantasy",
        isbn: "978-0-14-036781-2",
        available: true,
        description: "The boy who never grew up",
        rating: 4.1
      },
      {
        id: "43",
        title: "The Wizard of Oz",
        author: "L. Frank Baum",
        genre: "Fantasy",
        isbn: "978-0-14-036795-9",
        available: true,
        description: "Dorothy's journey to the Emerald City",
        rating: 3.9
      },
      {
        id: "44",
        title: "A Tale of Two Cities",
        author: "Charles Dickens",
        genre: "Historical Fiction",
        isbn: "978-0-14-143960-0",
        available: true,
        description: "Set during the French Revolution",
        rating: 4.0
      },
      {
        id: "45",
        title: "Great Expectations",
        author: "Charles Dickens",
        genre: "Fiction",
        isbn: "978-0-14-143956-3",
        available: true,
        description: "Pip's journey from poverty to wealth",
        rating: 4.0
      },
      {
        id: "46",
        title: "Oliver Twist",
        author: "Charles Dickens",
        genre: "Fiction",
        isbn: "978-0-14-143974-7",
        available: true,
        description: "The story of an orphan in Victorian London",
        rating: 3.9
      },
      {
        id: "47",
        title: "David Copperfield",
        author: "Charles Dickens",
        genre: "Fiction",
        isbn: "978-0-14-143944-0",
        available: true,
        description: "A semi-autobiographical novel",
        rating: 4.1
      },
      {
        id: "48",
        title: "A Christmas Carol",
        author: "Charles Dickens",
        genre: "Fiction",
        isbn: "978-0-14-062198-7",
        available: true,
        description: "Scrooge's Christmas transformation",
        rating: 4.3
      },
      {
        id: "49",
        title: "The Time Machine",
        author: "H.G. Wells",
        genre: "Science Fiction",
        isbn: "978-0-14-143997-6",
        available: true,
        description: "A journey through time",
        rating: 3.8
      },
      {
        id: "50",
        title: "The Invisible Man",
        author: "H.G. Wells",
        genre: "Science Fiction",
        isbn: "978-0-14-143998-3",
        available: true,
        description: "A scientist becomes invisible",
        rating: 3.7
      },
      {
        id: "51",
        title: "War of the Worlds",
        author: "H.G. Wells",
        genre: "Science Fiction",
        isbn: "978-0-14-143999-0",
        available: true,
        description: "Martians invade Earth",
        rating: 3.9
      },
      {
        id: "52",
        title: "Twenty Thousand Leagues Under the Sea",
        author: "Jules Verne",
        genre: "Adventure",
        isbn: "978-0-14-400002-2",
        available: true,
        description: "An underwater adventure",
        rating: 4.0
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
    setShowWelcome(false);
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
    setShowWelcome(true);
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

  const enterLibrary = () => {
    setShowWelcome(false);
  };

  // Welcome screen
  if (showWelcome) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url('/lovable-uploads/707845b5-52f8-47db-bdf7-4d6c1a188fb5.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative z-10 text-center text-white px-4">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Book className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">Welcome to our EJUST Library</h1>
            <p className="text-xl mb-8 drop-shadow-md">Smart Voice Assistant for Enhanced Learning</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => setShowAuth(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <User className="w-5 h-5 mr-2" />
              Login to Access Library
            </Button>
            
            <div className="mt-4">
              <Button 
                onClick={enterLibrary}
                variant="outline"
                size="lg"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white px-8 py-3 text-lg"
              >
                Browse as Guest
              </Button>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">EJUST Library</h1>
                <p className="text-sm text-gray-600">Smart Voice Assistant</p>
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
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAdmin(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Book
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAdmin(true)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowChatBot(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Assistant
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowChatBot(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Assistant
                  </Button>
                  <Button onClick={() => setShowAuth(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </>
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

      {showChatBot && (
        <ChatBot
          isOpen={showChatBot}
          onClose={() => setShowChatBot(false)}
          books={books}
        />
      )}
    </div>
  );
};

export default Index;
