
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Star, Clock, CheckCircle, Trash2 } from "lucide-react";

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

interface BookCardProps {
  book: Book;
  user: User | null;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  onDelete?: (bookId: string) => void;
}

const BookCard = ({ book, user, onBorrow, onReturn, onDelete }: BookCardProps) => {
  const isBorrowed = user?.borrowedBooks.includes(book.id);

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="w-12 h-16 bg-gradient-to-b from-blue-500 to-purple-600 rounded flex items-center justify-center mb-3">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col items-end space-y-1">
            {book.available ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Available
              </Badge>
            ) : (
              <Badge variant="destructive">
                <Clock className="w-3 h-3 mr-1" />
                Borrowed
              </Badge>
            )}
            {book.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600">{book.rating}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{book.title}</h3>
          <p className="text-gray-600 text-sm mt-1">by {book.author}</p>
          <Badge variant="outline" className="mt-2 text-xs">
            {book.genre}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
        {book.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">ISBN: {book.isbn}</p>
      </CardContent>
      
      <CardFooter className="pt-0">
        {user?.isAdmin ? (
          <div className="w-full space-y-2">
            <Button 
              onClick={() => onDelete?.(book.id)}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Book
            </Button>
          </div>
        ) : user ? (
          isBorrowed ? (
            <Button 
              onClick={() => onReturn(book.id)}
              variant="outline"
              className="w-full"
            >
              Return Book
            </Button>
          ) : book.available ? (
            <Button 
              onClick={() => onBorrow(book.id)}
              className="w-full"
            >
              Borrow Book
            </Button>
          ) : (
            <Button disabled className="w-full">
              Currently Unavailable
            </Button>
          )
        ) : (
          <Button disabled className="w-full">
            Login to Borrow
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
