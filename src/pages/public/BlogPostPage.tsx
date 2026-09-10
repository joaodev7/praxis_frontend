import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  BookOpen, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { FAQ } from '../../components/seo/FAQ';
import { StructuredData } from '../../components/seo/StructuredData';
import { Button } from '../../components/ui/Button';
import { getBlogPostBySlug, BLOG_POSTS } from '../../seo/blogData';
import { getArticleSchema } from '../../seo/structured-data';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <PublicLayout>
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Artigo Não Encontrado</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            O artigo técnico que você está procurando foi movido ou não existe mais.
          </p>
          <Link to="/blog/">
            <Button variant="primary">Voltar para o Blog</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.description,
    slug: post.slug,
    author: post.author,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    category: post.categoryLabel
  });

  return (
    <PublicLayout>
      <SEO
        title={`${post.title} | Blog PRAXIS`}
        description={post.description}
        canonical={`/blog/${post.slug}/`}
        keywords={post.tags}
        ogType="article"
      />

      <StructuredData data={articleSchema} id={`schema-article-${post.slug}`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb
          items={[
            { name: 'Blog', url: '/blog/' },
            { name: post.title, url: `/blog/${post.slug}/` }
          ]}
        />

        <article className="py-8">
          {/* Header metadata */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                {post.categoryLabel}
              </span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTimeMinutes} min de leitura
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* E-E-A-T Author Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{post.author}</div>
                  <div className="text-slate-500 dark:text-slate-400">{post.authorRole}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Publicado: {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                </span>
                <span>•</span>
                <span>Atualizado: {new Date(post.updatedAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* 1. Qual problema o usuário possui? (Section 18) */}
          <div className="my-8 p-5 rounded-xl border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
            <h2 className="font-bold text-amber-900 dark:text-amber-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              O Desafio na Prática
            </h2>
            <p>{post.problemStatement}</p>
          </div>

          {/* 2. Qual é a resposta direta? (GEO / AI citável) */}
          <div className="my-8 p-6 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 text-slate-900 dark:text-slate-100">
            <h2 className="font-bold text-blue-800 dark:text-blue-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Resposta Direta & Conceito
            </h2>
            <p className="text-base sm:text-lg font-medium leading-relaxed italic">
              "{post.summaryAnswer}"
            </p>
          </div>

          {/* 3. Como aplicar? (Conteúdo detalhado) */}
          <div className="space-y-10 my-10">
            {post.contentSections.map((section, idx) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-800 pb-2">
                  {section.heading}
                </h2>
                {section.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {p}
                  </p>
                ))}

                {section.tips && (
                  <div className="p-4 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[11px] block mb-1">Dica Profissional:</span>
                    {section.tips.map((t, tIdx) => (
                      <p key={tIdx}>• {t}</p>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* 4. Quais erros evitar? */}
          <div className="my-10 p-6 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20">
            <h2 className="text-base font-bold text-rose-900 dark:text-rose-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Erros Comuns que Devem ser Evitados
            </h2>
            <ul className="space-y-2 text-sm text-rose-900 dark:text-rose-200">
              {post.mistakesToAvoid.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Quando utilizar? */}
          <div className="my-8 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
              Quando Aplicar este Procedimento?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {post.whenToUse}
            </p>
          </div>

          {/* 6. Como o PRAXIS pode ajudar? */}
          <div className="my-10 p-8 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solução Integrada</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mb-3">
              Como o PRAXIS Simplifica esta Rotina
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed mb-6">
              {post.howPraxisHelps}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/login?register=true">
                <Button variant="white" className="font-bold">
                  Testar Gratuitamente no PRAXIS
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/software-para-nutricionistas/">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Conhecer a Plataforma
                </Button>
              </Link>
            </div>
          </div>

          {/* Fontes e Referências Legais (E-E-A-T) */}
          {post.legalReferences && post.legalReferences.length > 0 && (
            <div className="my-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <h2 className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                Legislação e Fontes Técnicas Citadas
              </h2>
              <ul className="space-y-1">
                {post.legalReferences.map((ref, idx) => (
                  <li key={idx}>• {ref}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 my-8">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>

          {/* FAQ da Página */}
          {post.faqs && post.faqs.length > 0 && (
            <FAQ items={post.faqs} title="Dúvidas Frequentes sobre este Tema" />
          )}

          {/* Artigos Relacionados */}
          {relatedPosts.length > 0 && (
            <div className="my-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">
                Artigos Relacionados neste Cluster
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/blog/${rel.slug}/`}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-500 transition-all block group"
                  >
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{rel.categoryLabel}</span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6">
            <Link to="/blog/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Voltar para todos os artigos do Blog
            </Link>
          </div>
        </article>
      </div>
    </PublicLayout>
  );
};
