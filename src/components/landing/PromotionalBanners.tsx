'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import type { PromotionalBanner } from '@/types';

export function PromotionalBanners() {
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await fetch('/api/banners');
        const data = await response.json();

        if (data.success) {
          setBanners(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBanners();
  }, []);

  const defaultBanners: PromotionalBanner[] = [
    {
      id: '1',
      title: 'Summer Sale',
      subtitle: 'Up to 50% off on selected items',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920',
      link: '/store?featured=true',
      buttonText: 'Shop Now',
      active: true,
      order: 1,
      createdAt: Date.now(),
    },
    {
      id: '2',
      title: 'New Arrivals',
      subtitle: 'Check out our latest collection',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
      link: '/store?sort=newest',
      buttonText: 'Explore',
      active: true,
      order: 2,
      createdAt: Date.now(),
    },
    {
      id: '3',
      title: 'Free Shipping',
      subtitle: 'On orders over $100',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920',
      link: '/store',
      buttonText: 'Shop Now',
      active: true,
      order: 3,
      createdAt: Date.now(),
    },
  ];

  const displayBanners = banners.length > 0 ? banners : defaultBanners;

  if (loading) {
    return (
      <section className="py-8">
        <div className="container px-4 md:px-6">
          <div className="h-[300px] md:h-[400px] rounded-2xl bg-muted animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container px-4 md:px-6">
        <Carousel
          opts={{
            loop: true,
            align: 'start',
          }}
          // autoPlay={5000}
          className="w-full"
        >
          <CarouselContent>
            {displayBanners.map((banner, index) => (
              <CarouselItem key={banner.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden"
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                  <div className="absolute inset-0 flex items-center">
                    <div className="px-8 md:px-16 max-w-xl">
                      <motion.h2
                        className="text-3xl md:text-5xl font-bold text-white mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {banner.title}
                      </motion.h2>
                      <motion.p
                        className="text-lg md:text-xl text-white/80 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        {banner.subtitle}
                      </motion.p>
                      {banner.link && banner.buttonText && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <Button size="lg" asChild className="group">
                            <Link href={banner.link}>
                              {banner.buttonText}
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
}
