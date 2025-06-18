
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react";
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

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
}

const ChatBot = ({ isOpen, onClose, books }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your library assistant. I can help you find books, provide summaries, and answer questions about our collection. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Check if user is asking for a book summary
    if (userMessage.toLowerCase().includes("summary") || userMessage.toLowerCase().includes("summarize")) {
      const bookTitle = extractBookTitle(userMessage);
      const book = books.find(b => 
        b.title.toLowerCase().includes(bookTitle.toLowerCase()) ||
        bookTitle.toLowerCase().includes(b.title.toLowerCase())
      );
      
      if (book) {
        return generateBookSummary(book);
      }
    }

    // Check if user is asking about book availability
    if (userMessage.toLowerCase().includes("available") || userMessage.toLowerCase().includes("borrow")) {
      const bookTitle = extractBookTitle(userMessage);
      const book = books.find(b => 
        b.title.toLowerCase().includes(bookTitle.toLowerCase()) ||
        bookTitle.toLowerCase().includes(b.title.toLowerCase())
      );
      
      if (book) {
        return `"${book.title}" by ${book.author} is ${book.available ? "available" : "currently borrowed"}. ${book.description || ""}`;
      }
    }

    // Check if user is asking for book recommendations
    if (userMessage.toLowerCase().includes("recommend") || userMessage.toLowerCase().includes("suggest")) {
      const genre = extractGenre(userMessage);
      if (genre) {
        const genreBooks = books.filter(b => 
          b.genre.toLowerCase().includes(genre.toLowerCase())
        ).slice(0, 3);
        
        if (genreBooks.length > 0) {
          return `Here are some ${genre} recommendations:\n\n${genreBooks.map(b => 
            `• "${b.title}" by ${b.author} (Rating: ${b.rating}/5)\n  ${b.description || ""}`
          ).join("\n\n")}`;
        }
      }
      
      // General recommendations
      const topBooks = books.filter(b => (b.rating || 0) >= 4.5).slice(0, 3);
      return `Here are some of our highest-rated books:\n\n${topBooks.map(b => 
        `• "${b.title}" by ${b.author} (Rating: ${b.rating}/5)\n  ${b.description || ""}`
      ).join("\n\n")}`;
    }

    // Search for books by title or author
    const searchTerm = userMessage.toLowerCase();
    const matchingBooks = books.filter(b => 
      b.title.toLowerCase().includes(searchTerm) ||
      b.author.toLowerCase().includes(searchTerm) ||
      b.genre.toLowerCase().includes(searchTerm)
    ).slice(0, 3);

    if (matchingBooks.length > 0) {
      return `I found these books matching your search:\n\n${matchingBooks.map(b => 
        `• "${b.title}" by ${b.author}\n  Genre: ${b.genre} | ${b.available ? "Available" : "Borrowed"}\n  ${b.description || ""}`
      ).join("\n\n")}`;
    }

    // Default responses
    const defaultResponses = [
      "I can help you find books, provide summaries, or answer questions about our library collection. Try asking about a specific book or genre!",
      "Our library has over 50 books across various genres including Fiction, Science Fiction, Fantasy, Romance, and more. What interests you?",
      "You can ask me to summarize any book, check availability, or get recommendations based on your preferences.",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const extractBookTitle = (message: string): string => {
    // Simple extraction - look for quotes or common patterns
    const quotedMatch = message.match(/["'"](.*?)["'"]/);
    if (quotedMatch) return quotedMatch[1];
    
    // Look for book titles in our collection
    for (const book of books) {
      if (message.toLowerCase().includes(book.title.toLowerCase())) {
        return book.title;
      }
    }
    
    return "";
  };

  const extractGenre = (message: string): string => {
    const genres = ["fiction", "science fiction", "fantasy", "romance", "thriller", "mystery", "horror", "adventure", "drama", "philosophy"];
    return genres.find(genre => message.toLowerCase().includes(genre)) || "";
  };

  const generateBookSummary = (book: Book): string => {
    // Enhanced summaries based on the book
    const summaries: { [key: string]: string } = {
      "The Great Gatsby": "Set in the summer of 1922, this masterpiece follows Nick Carraway as he observes the tragic story of his mysterious neighbor Jay Gatsby. Gatsby's obsessive love for Daisy Buchanan drives him to extraordinary lengths, ultimately revealing the corruption beneath the glittering surface of the Jazz Age. The novel explores themes of the American Dream, social class, and the impossibility of recapturing the past.",
      
      "To Kill a Mockingbird": "Through the eyes of Scout Finch, Harper Lee presents a powerful story of moral courage in 1930s Alabama. When Scout's father, lawyer Atticus Finch, defends a Black man falsely accused of rape, the family faces the ugly reality of racial prejudice. This coming-of-age story masterfully weaves together themes of justice, morality, and the loss of innocence.",
      
      "1984": "In a dystopian future where Big Brother watches everything, Winston Smith works for the Party rewriting history. His rebellion begins with forbidden love and evolves into a desperate fight for truth and freedom. Orwell's chilling vision explores surveillance, propaganda, and the power of totalitarian control over thought itself.",
      
      "Pride and Prejudice": "Elizabeth Bennet's sharp wit meets Mr. Darcy's apparent arrogance in this beloved romance. Set in Regency England, the novel follows their evolving relationship as misunderstandings give way to mutual respect and love. Austen brilliantly satirizes social conventions while creating one of literature's most enduring love stories.",
    };

    return summaries[book.title] || `"${book.title}" by ${book.author} is ${book.description || "a compelling read in the " + book.genre + " genre"}. This ${book.genre.toLowerCase()} work has earned a rating of ${book.rating}/5 from readers and is ${book.available ? "currently available" : "currently borrowed"} in our library.`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000); // Simulate API delay

    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Sorry, I encountered an error. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Library Assistant</span>
            <Badge variant="secondary">AI Powered</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isBot
                        ? "bg-blue-100 text-blue-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.isBot ? (
                        <Bot className="w-4 h-4 mt-0.5 text-blue-600" />
                      ) : (
                        <User className="w-4 h-4 mt-0.5 text-gray-600" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-blue-100 text-blue-900 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about books, summaries, or recommendations..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBot;
