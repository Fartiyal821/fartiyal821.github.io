import { useState } from 'react';
import { ExternalLink, Package } from 'lucide-react';
import type { AffiliateProduct } from '../types';

export function ProductCard({ product }: { product: AffiliateProduct }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="grid grid-cols-1 gap-5 sm:gap-6 rounded-xl border border-white/[0.08] bg-[#111827] p-5 sm:p-6 transition-colors duration-150 hover:border-indigo-500/35 lg:grid-cols-12 lg:items-start">
      {/* Left: Image, Product Name & Category */}
      <div className="lg:col-span-3 min-w-0 space-y-3">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#090F1C] flex items-center justify-center">
          {product.imageUrl && !imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center text-[#9CA3AF]">
              <Package className="h-8 w-8 text-indigo-400/70" />
              <span className="text-xs font-medium text-[#9CA3AF] line-clamp-2">{product.name}</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-[#06B6D4]">{product.category}</p>
          <h3 className="mt-1 font-display text-lg font-semibold text-[#F9FAFB] leading-snug">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Middle: Description, Features, Specs, Audience, Pros & Limitations */}
      <div className="lg:col-span-7 min-w-0 space-y-4">
        <p className="text-sm leading-relaxed text-[#D1D5DB]">{product.description}</p>

        {product.features.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold tracking-wide text-[#9CA3AF] mb-2">
              Key Features
            </h4>
            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-sm text-[#D1D5DB]">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#6366F1] font-mono text-xs mt-1">-</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 border-t border-white/[0.06] pt-3 sm:grid-cols-2 text-xs leading-relaxed">
          {product.specifications && (
            <div>
              <span className="font-semibold text-[#F9FAFB]">Specifications: </span>
              <span className="text-[#9CA3AF] font-mono">{product.specifications}</span>
            </div>
          )}
          {product.suitableAudience && (
            <div>
              <span className="font-semibold text-[#F9FAFB]">Suitable for: </span>
              <span className="text-[#9CA3AF]">{product.suitableAudience}</span>
            </div>
          )}
          {product.advantages && (
            <div>
              <span className="font-semibold text-[#10B981]">Advantages: </span>
              <span className="text-[#9CA3AF]">{product.advantages}</span>
            </div>
          )}
          {product.limitations && (
            <div>
              <span className="font-semibold text-amber-400">Limitations: </span>
              <span className="text-[#9CA3AF]">{product.limitations}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Visit Product CTA */}
      <div className="lg:col-span-2 flex flex-col items-stretch lg:items-end justify-between gap-2.5 border-t border-white/[0.06] pt-4 lg:border-t-0 lg:pt-0">
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#6366F1] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 whitespace-nowrap"
        >
          <span>Visit Product</span>
          <ExternalLink className="h-4 w-4" />
        </a>
        {product.disclosureStatus && (
          <p className="text-[11px] text-[#9CA3AF] text-center lg:text-right">
            Affiliate link &middot; No extra cost
          </p>
        )}
      </div>
    </article>
  );
}
