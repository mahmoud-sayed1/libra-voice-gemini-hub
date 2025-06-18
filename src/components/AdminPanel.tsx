import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminPanelProps {
  onBookAdded: () => Promise<void>;
}

const AdminPanel = ({ onBookAdded }: AdminPanelProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('books').insert({
        title,
        author,
        genre,
        isbn,
        description,
        available,
      });

      if (error) throw error;

      toast({
        title: "Book added successfully!",
        description: "The book has been added to the library.",
      });

      setTitle("");
      setAuthor("");
      setGenre("");
      setIsbn("");
      setDescription("");
      setAvailable(true);

      await onBookAdded();
    } catch (error: any) {
      console.error('Error adding book:', error);
      toast({
        title: "Error",
        description: "Failed to add book",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add New Book
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="genre">Genre</Label>
            <Input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              type="text"
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Add Book"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
