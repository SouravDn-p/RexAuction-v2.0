export interface BlogType {
  _id: string;
  title: string;
  fullContent: string;
  imageUrls: string[];
  category: string;
  author: string;
  authorName: string;
  authorEmail: string;
  authorBio: string;
  authorImage: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}