
-- Create a profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create a books table to store all book information
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT NOT NULL,
  isbn TEXT NOT NULL UNIQUE,
  description TEXT,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create a borrowed_books table to track which users have borrowed which books
CREATE TABLE public.borrowed_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  borrowed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  returned_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, book_id, returned_at)
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrowed_books ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for books table
CREATE POLICY "Anyone can view books" ON public.books
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert books" ON public.books
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can update books" ON public.books
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can delete books" ON public.books
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for borrowed_books table
CREATE POLICY "Users can view their own borrowed books" ON public.borrowed_books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own borrowed books" ON public.borrowed_books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own borrowed books" ON public.borrowed_books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all borrowed books" ON public.borrowed_books
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NEW.email = 'admin@library.com'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample books data
INSERT INTO public.books (title, author, genre, isbn, description, rating) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic Literature', '978-0-7432-7356-5', 'A classic American novel about the Jazz Age', 4.2),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', '978-0-06-112008-4', 'A gripping tale of racial injustice and childhood', 4.5),
('1984', 'George Orwell', 'Science Fiction', '978-0-452-28423-4', 'A dystopian social science fiction novel', 4.4),
('Pride and Prejudice', 'Jane Austen', 'Romance', '978-0-14-143951-8', 'A romantic novel of manners', 4.3),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', '978-0-547-92822-7', 'A magical adventure in Middle-earth', 4.6),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Fantasy', '978-0-439-02348-1', 'The beginning of the magical Harry Potter series', 4.7),
('The Alchemist', 'Paulo Coelho', 'Philosophy', '978-0-06-112241-5', 'A philosophical novel about following dreams', 4.2),
('Brave New World', 'Aldous Huxley', 'Science Fiction', '978-0-06-085052-4', 'A dystopian vision of the future', 4.0),
('The Lord of the Rings', 'J.R.R. Tolkien', 'Fantasy', '978-0-544-00341-5', 'An epic fantasy adventure', 4.8),
('Jane Eyre', 'Charlotte Brontë', 'Romance', '978-0-14-144114-6', 'A Gothic romance novel', 4.1);
