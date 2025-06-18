
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface AdminPanelProps {
  onBookAdded: () => void;
}

const AdminPanel = ({ onBookAdded }: AdminPanelProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    description: "",
    rating: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');

      if (error) throw error;
      setBooks(data || []);
    } catch (error: any) {
      console.error('Error fetching books:', error);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('books')
        .insert({
          title: newBook.title,
          author: newBook.author,
          genre: newBook.genre,
          isbn: newBook.isbn,
          description: newBook.description || null,
          rating: newBook.rating ? parseFloat(newBook.rating) : null,
          available: true
        });

      if (error) throw error;

      setNewBook({
        title: "",
        author: "",
        genre: "",
        isbn: "",
        description: "",
        rating: ""
      });

      onBookAdded();
      fetchBooks();

      toast({
        title: "Book added!",
        description: `"${newBook.title}" has been added to the library.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      onBookAdded();
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

  // Fetch books when component mounts
  React.useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Library Administration Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add-book" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-book">Add Book</TabsTrigger>
            <TabsTrigger value="manage-books">Manage Books</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add-book" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add New Book</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBook} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newBook.title}
                        onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={newBook.author}
                        onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Input
                        id="genre"
                        value={newBook.genre}
                        onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input
                        id="isbn"
                        value={newBook.isbn}
                        onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newBook.description}
                      onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={newBook.rating}
                      onChange={(e) => setNewBook({...newBook, rating: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <Plus className="w-4 h-4 mr-2" />
                    {isLoading ? "Adding..." : "Add Book to Library"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage-books" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Library Collection ({books.length} books)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {books.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{book.genre}</Badge>
                          <Badge variant={book.available ? "default" : "destructive"}>
                            {book.available ? "Available" : "Borrowed"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
