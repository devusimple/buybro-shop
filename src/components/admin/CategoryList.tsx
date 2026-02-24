'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FolderTree,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import type { Category } from '@/types';

interface CategoryListProps {
  categories?: Category[];
  onAddCategory?: () => void;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
}

// Mock categories data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    image: null,
    parentId: null,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    children: [
      {
        id: '1-1',
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones and accessories',
        image: null,
        parentId: '1',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
      },
      {
        id: '1-2',
        name: 'Laptops',
        slug: 'laptops',
        description: 'Laptop computers',
        image: null,
        parentId: '1',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
      },
    ],
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel',
    image: null,
    parentId: null,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
    children: [
      {
        id: '2-1',
        name: 'Men',
        slug: 'men',
        description: "Men's clothing",
        image: null,
        parentId: '2',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
      },
      {
        id: '2-2',
        name: 'Women',
        slug: 'women',
        description: "Women's clothing",
        image: null,
        parentId: '2',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
      },
    ],
  },
  {
    id: '3',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Fashion accessories',
    image: null,
    parentId: null,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
  },
  {
    id: '4',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports equipment and gear',
    image: null,
    parentId: null,
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now() - 345600000,
  },
];

// Flatten categories for display
const flattenCategories = (categories: Category[], level = 0): (Category & { level: number })[] => {
  const result: (Category & { level: number })[] = [];
  categories.forEach((cat) => {
    result.push({ ...cat, level });
    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategories(cat.children, level + 1));
    }
  });
  return result;
};

export function CategoryList({
  categories: externalCategories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>(
    externalCategories || mockCategories
  );
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    if (!externalCategories) {
      const fetchCategories = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/categories');
          const data = await response.json();
          if (data.success) {
            setCategories(data.data);
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCategories();
    }
  }, [externalCategories]);

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Get product count (mock)
  const getProductCount = (category: Category): number => {
    // In a real app, this would come from the API
    return Math.floor(Math.random() * 100);
  };

  // Render category row
  const renderCategoryRow = (category: Category & { level: number }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.includes(category.id);

    return (
      <TableRow key={category.id}>
        <TableCell>
          <div className="flex items-center gap-2" style={{ paddingLeft: category.level * 24 }}>
            {hasChildren ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleExpand(category.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="h-6 w-6" />
            )}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.slug}</p>
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {category.description || '-'}
        </TableCell>
        <TableCell>
          <Badge variant="secondary">{getProductCount(category)} products</Badge>
        </TableCell>
        <TableCell className="w-[60px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditCategory?.(category)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDeleteCategory?.(category)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };

  // Build display categories based on expanded state
  const buildDisplayCategories = (): (Category & { level: number })[] => {
    const result: (Category & { level: number })[] = [];
    
    const processCategory = (cat: Category, level: number) => {
      result.push({ ...cat, level });
      if (cat.children && cat.children.length > 0 && expandedIds.includes(cat.id)) {
        cat.children.forEach((child) => processCategory(child, level + 1));
      }
    };
    
    categories.forEach((cat) => processCategory(cat, 0));
    return result;
  };

  const displayCategories = buildDisplayCategories();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="h-5 w-5" />
          Categories
        </CardTitle>
        <Button onClick={onAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                displayCategories.map((category) => renderCategoryRow(category))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
