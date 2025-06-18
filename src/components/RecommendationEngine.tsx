
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
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

interface RecommendationEngineProps {
  books: Book[];
  userBorrowedBooks: string[];
}

const RecommendationEngine = ({ books, userBorrowedBooks }: RecommendationEngineProps) => {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const GEMINI_API_KEY = "AIzaSyDnBva5Y82GKAwxS_3tLp0FkJxr3OWlkbw";

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // Get user's borrowing history for context
      const borrowedBooks = books.filter(book => userBorrowedBooks.includes(book.id));
      const availableBooks = books.filter(book => book.available && !userBorrowedBooks.includes(book.id));
      
      // Create prompt for Gemini AI
      const prompt = `Based on the following user's reading history and available books, recommend 3 books that would be most suitable for them.

User's previously borrowed books:
${borrowedBooks.map(book => `- ${book.title} by ${book.author} (${book.genre})`).join('\n')}

Available books in library:
${availableBooks.map(book => `- ${book.title} by ${book.author} (${book.genre}) - Rating: ${book.rating || 'N/A'}`).join('\n')}

Please respond with just the titles of 3 recommended books from the available list, separated by commas. Consider genre preferences and ratings.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      const recommendationText = data.candidates[0]?.content?.parts[0]?.text || '';
      
      // Parse the recommended book titles
      const recommendedTitles = recommendationText
        .split(',')
        .map(title => title.trim())
        .slice(0, 3);

      // Find the actual book objects
      const recommendedBooks = recommendedTitles
        .map(title => availableBooks.find(book => 
          book.title.toLowerCase().includes(title.toLowerCase()) ||
          title.toLowerCase().includes(book.title.toLowerCase())
        ))
        .filter(Boolean) as Book[];

      // If AI recommendations don't match, fall back to rating-based recommendations
      if (recommendedBooks.length === 0) {
        const fallbackRecommendations = availableBooks
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);
        setRecommendations(fallbackRecommendations);
      } else {
        setRecommendations(recommendedBooks);
      }

      toast({
        title: "Recommendations updated!",
        description: "AI has analyzed your preferences and found great matches.",
      });

    } catch (error) {
      console.error('Error generating recommendations:', error);
      
      // Fallback to simple rating-based recommendations
      const availableBooks = books.filter(book => book.available && !userBorrowedBooks.includes(book.id));
      const fallbackRecommendations = availableBooks
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);
      
      setRecommendations(fallbackRecommendations);

      toast({
        title: "Using backup recommendations",
        description: "Showing highest rated available books.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (books.length > 0) {
      generateRecommendations();
    }
  }, [userBorrowedBooks.length]);

  if (recommendations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>AI Recommendations</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRecommendations}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Generating personalized recommendations...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((book) => (
              <div key={book.id} className="bg-white rounded-lg p-4 shadow-sm border">
                <h4 className="font-medium text-sm mb-1">{book.title}</h4>
                <p className="text-xs text-gray-600 mb-2">by {book.author}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {book.genre}
                  </span>
                  {book.rating && (
                    <span className="text-xs text-gray-500">★ {book.rating}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Powered by Gemini AI • Recommendations based on your reading history and preferences
        </p>
      </CardContent>
    </Card>
  );
};

export default RecommendationEngine;
