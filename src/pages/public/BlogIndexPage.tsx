import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight, 
  Tag, 
  Search, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { BLOG_POSTS, getBlogPostsByCategory } from '../../seo/blogData';
import { SEO_PAGES } from '../../seo/metadata';

export const BlogIndexPage: React.FC = () => {
  const meta = SEO_PAGES.blog;
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { id: 'todos', label: 'Todos os Artigos' },
    { id: 'rdc', label: 'RDC 216 & Legislação' },
    { id: 'auditoria', label: 'Auditorias Sanitárias' },
    { id: 'nutricionista-rt', label: 'Nutricionista RT' },
    { id: 'nao-conformidades', label: 'Não Conformidades & 5W2H' },
    { id: 'etiquetagem', label: 'Etiquetagem & Validade' },
    { id: 'gestao', label: 'Gestão de Consultoria' },
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'todos' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <PublicLayout>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={meta.canonicalPath}
        keywords={meta.keywords}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ name: 'Blog', url: meta.canonicalPath }]} />

        {/* Hero Section */}
        <section className="py-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Biblioteca Técnica PRAXIS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            {meta.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {meta.subheadline}
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por termo (ex: RDC 216, 5W2H, validade, ART)..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 text-xs font-semibold scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-base font-semibold text-slate-600 dark:text-slate-400">Nenhum artigo encontrado para a busca realizada.</p>
            <button
              onClick={() => { setSelectedCategory('todos'); setSearchTerm(''); }}
              className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="p-6">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                      {post.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTimeMinutes} min de leitura
                    </span>
                  </div>

                  {/* Title */}
                  <Link to={`/blog/${post.slug}/`}>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {post.description}
                  </p>

                  {/* Author and Date */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{post.author}</span>
                  </div>
                </div>

                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Atualizado em {new Date(post.updatedAt).toLocaleDateString('pt-BR')}</span>
                  <Link
                    to={`/blog/${post.slug}/`}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Ler artigo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};
