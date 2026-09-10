import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem, getBreadcrumbSchema } from '../../seo/structured-data';
import { StructuredData } from './StructuredData';

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const fullItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    ...items.filter((item) => item.url !== '/' && item.name.toLowerCase() !== 'home')
  ];

  return (
    <>
      <StructuredData data={getBreadcrumbSchema(fullItems)} />
      <nav aria-label="Navegação Estruturada" className={`flex items-center text-xs text-slate-500 dark:text-slate-400 py-3 ${className}`}>
        <ol className="flex items-center flex-wrap gap-1.5">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            return (
              <li key={item.url} className="flex items-center gap-1.5">
                {index === 0 ? (
                  <Link
                    to="/"
                    className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Página Inicial do PRAXIS"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Início</span>
                  </Link>
                ) : isLast ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px] sm:max-w-none" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.url}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
