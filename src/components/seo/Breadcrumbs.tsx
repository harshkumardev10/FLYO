import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '@/lib/types/seo';
import { generateBreadcrumbSchema } from '@/lib/seo/schemas';
import { JsonLd } from './JsonLd';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [{ name: 'Home', item: '/' }, ...items];
  const schemaData = generateBreadcrumbSchema(allItems);

  return (
    <>
      <JsonLd data={schemaData} />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          {allItems.map((crumb, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={crumb.item} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                {isLast ? (
                  <span className="font-semibold text-slate-800" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.item}
                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                  >
                    {index === 0 && <Home className="w-3 h-3 text-slate-400" />}
                    <span>{crumb.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
