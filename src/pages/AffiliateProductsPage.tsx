import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, Package, Search } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCard } from '../components/ProductCard';
import { SeoHead } from '../components/SeoHead';
import { subscribePublishedProducts } from '../services/repository';
import { PRODUCT_CATEGORIES, type AffiliateProduct } from '../types';

export function AffiliateProductsPage() {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = subscribePublishedProducts(
      (items) => {
        setProducts(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Unable to load products.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
      const textMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.specifications.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <>
      <SeoHead
        title="Recommended Technology Products for Programmers – Short Study"
        description="Explore practical developer keyboards, laptops, audio equipment, storage devices, and study accessories with transparent specifications and disclosures."
      />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Affiliate Products' }]} />

        <div className="flex flex-col gap-3 sm:gap-4 border-b border-white/[0.08] pb-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#F9FAFB] sm:text-4xl">
              Technology &amp; Study Gear
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
              Practical hardware, developer tools, and study accessories selected for coding
              students and software engineers.
            </p>
          </div>
          <div className="text-sm text-[#9CA3AF] tabular-nums shrink-0">
            <span className="font-mono font-semibold text-[#F9FAFB]">{filteredProducts.length}</span>{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'} listed
          </div>
        </div>

        {/* Mandatory Visible Affiliate Disclosure */}
        <aside
          aria-label="Affiliate disclosure"
          className="mt-6 flex items-start gap-3 rounded-xl border border-indigo-500/25 bg-[#090F1C] p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-[#D1D5DB]"
        >
          <Info className="h-4 w-4 shrink-0 text-[#06B6D4] mt-0.5" />
          <p>
            Short Study may earn a commission when you purchase products through certain links on
            this website. This comes at no additional cost to you. Our product recommendations are
            intended to help readers discover useful technology products.{' '}
            <Link to="/affiliate-disclosure" className="text-indigo-300 underline hover:text-white">
              Read full Affiliate Disclosure
            </Link>
            .
          </p>
        </aside>

        {/* Search & Category Filter */}
        <div className="mt-6 sm:mt-8 space-y-5">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or specifications..."
              aria-label="Search affiliate products"
              className="w-full rounded-lg border border-white/10 bg-[#090F1C] py-2.5 pl-10 pr-4 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#6366F1] focus:outline-none"
            />
          </div>

          <div
            role="tablist"
            aria-label="Product categories"
            className="-mx-5 px-5 md:mx-0 md:px-0 flex overflow-x-auto no-scrollbar md:flex-wrap items-center gap-2 border-b border-white/[0.06] pb-5 md:pb-6"
          >
            {['All', ...PRODUCT_CATEGORIES].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-lg px-3.5 py-2 md:px-3 md:py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#6366F1] text-white'
                      : 'bg-[#111827] text-[#9CA3AF] border border-white/[0.08] hover:text-[#F9FAFB] hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product List */}
        <div className="mt-8">
          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-sm text-rose-200">
              {error}
            </div>
          ) : loading ? (
            <div className="space-y-5">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-44 rounded-xl border border-white/[0.06] bg-[#111827] animate-pulse"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-10 text-center">
              <Package className="mx-auto h-9 w-9 text-[#06B6D4]" />
              <h2 className="mt-3 font-display text-lg font-semibold text-[#F9FAFB]">
                {products.length === 0
                  ? 'No published affiliate products yet'
                  : 'No products match your current filter'}
              </h2>
              <p className="mt-1.5 text-sm text-[#9CA3AF] max-w-md mx-auto">
                {products.length === 0
                  ? 'Products added and published in the Admin Dashboard will appear here automatically.'
                  : 'Try resetting your search query or switching to All categories.'}
              </p>
              {selectedCategory !== 'All' || searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-5 rounded-lg border border-white/15 bg-[#090F1C] px-4 py-2 text-sm font-medium text-[#F9FAFB] hover:bg-white/5"
                >
                  Reset Filters
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
