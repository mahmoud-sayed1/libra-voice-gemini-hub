
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description?: string;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  books: Book[];
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot = ({ books, isOpen, onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your library assistant. Ask me to summarize any book or help you find information about our collection.",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const generateBookSummary = (book: Book): string => {
    const summaries: { [key: string]: string } = {
      "The Great Gatsby": "A story of love, wealth, and the American Dream set in the Jazz Age. Jay Gatsby throws lavish parties hoping to win back his lost love, Daisy, ultimately revealing the emptiness behind the glittering facade of the wealthy elite.",
      "To Kill a Mockingbird": "A powerful tale of racial injustice in the American South, told through the eyes of Scout Finch. Her father, Atticus, defends a Black man falsely accused of rape, teaching valuable lessons about courage, empathy, and moral integrity.",
      "1984": "A dystopian masterpiece depicting a totalitarian society where Big Brother watches everything. Winston Smith struggles against oppressive government control, exploring themes of surveillance, truth, and individual freedom.",
      "Pride and Prejudice": "A witty romance following Elizabeth Bennet and Mr. Darcy as they overcome initial misunderstandings and social prejudices. The novel explores themes of love, class, and personal growth in Regency England.",
      "The Catcher in the Rye": "Holden Caulfield's journey through New York City after being expelled from prep school. A coming-of-age story that explores teenage alienation, depression, and the search for authenticity in an adult world."
    };

    return summaries[book.title] || `${book.title} by ${book.author} is a ${book.genre.toLowerCase()} that ${book.description || "explores compelling themes and characters"}. This engaging work offers readers a unique perspective on its subject matter.`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "";
      const query = inputValue.toLowerCase();

      // Check if user is asking for a book summary
      const foundBook = books.find(book => 
        query.includes(book.title.toLowerCase()) || 
        query.includes(book.author.toLowerCase())
      );

      if (foundBook) {
        botResponse = `Here's a summary of "${foundBook.title}":\n\n${generateBookSummary(foundBook)}`;
      } else if (query.includes("summarize") || query.includes("summary")) {
        botResponse = "Please specify which book you'd like me to summarize. You can ask about any book in our collection by mentioning its title or author.";
      } else if (query.includes("recommend") || query.includes("suggestion")) {
        const randomBooks = books.slice(0, 3);
        botResponse = `I recommend these popular books from our collection:\n\n${randomBooks.map(book => `• ${book.title} by ${book.author}`).join('\n')}`;
      } else {
        botResponse = "I can help you with book summaries and recommendations. Try asking 'Summarize [book title]' or 'What books do you recommend?'";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-96 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <span>Library Assistant</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                {message.isBot && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-xs p-2 rounded-lg text-sm ${
                    message.isBot
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>
                {!message.isBot && (
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-gray-100 p-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Ask about any book..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
