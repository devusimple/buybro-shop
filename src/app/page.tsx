import { Hero } from '@/components/landing/Hero';
import { FeaturedProducts } from '@/components/landing/FeaturedProducts';
import { Categories } from '@/components/landing/Categories';
import { PromotionalBanners } from '@/components/landing/PromotionalBanners';
import { Testimonials } from '@/components/landing/Testimonials';
import { Newsletter } from '@/components/landing/Newsletter';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <PromotionalBanners />
      <Categories />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
