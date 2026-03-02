import db from "@/lib/db";
import { SortOption } from "@/types";


interface ProductGridProps {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: SortOption;
  featured?: boolean;
  page?: number;
  limit?: number;
  onPaginationChange?: (pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }) => void;
}

export async function fetchProduct(
    {
  category,
  minPrice,
  maxPrice,
  search,
  sort = 'newest',
  featured,
  page = 1,
  limit = 12,
  onPaginationChange,
}: ProductGridProps
){
    const result = await db.query({
        products: {
            $: {
                limit,
                offset: page,
                order: {featured: 'asc', status: 'asc'},
            }
        },
    });
}