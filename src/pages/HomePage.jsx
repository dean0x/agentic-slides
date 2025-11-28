import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { presentations, getAllTags } from '@/presentations/registry';
import { Play, Calendar, User, Search } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 }
  }
};

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const allTags = useMemo(() => getAllTags(), []);

  const filteredPresentations = useMemo(() => {
    return presentations.filter(p => {
      const matchesSearch = searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = !selectedTag || p.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-xl font-semibold text-text tracking-tight">
              Agentic<span className="text-primary">Slides</span>
            </h1>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              placeholder="Search presentations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-text placeholder:text-secondary/50 transition-all"
            />
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                  !selectedTag
                    ? 'bg-primary text-white'
                    : 'bg-white text-secondary hover:bg-gray-50 border border-gray-200'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-primary text-white'
                      : 'bg-white text-secondary hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Presentations Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPresentations.map(presentation => (
            <PresentationCard key={presentation.id} presentation={presentation} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredPresentations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-secondary/50" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">No presentations found</h3>
            <p className="text-secondary">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-secondary text-sm">
          <p>
            <span className="font-semibold text-text">Agentic</span>
            <span className="font-semibold text-primary">Slides</span>
            <span className="mx-2">·</span>
            Create beautiful presentations
          </p>
        </div>
      </footer>
    </div>
  );
}

function PresentationCard({ presentation }) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        to={`/presentation/${presentation.id}`}
        className="block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
      >
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
          {presentation.thumbnail ? (
            <img
              src={presentation.thumbnail}
              alt={presentation.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl font-bold text-blue-900/10">
                {presentation.title.substring(0, 1)}
              </div>
            </div>
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-lg">
              <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-text mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {presentation.title}
          </h3>

          {presentation.subtitle && (
            <p className="text-primary text-sm font-medium mb-2">{presentation.subtitle}</p>
          )}

          {presentation.description && (
            <p className="text-secondary text-sm line-clamp-2 mb-4">
              {presentation.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-secondary/70">
            {presentation.author && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {presentation.author}
              </span>
            )}
            {presentation.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {presentation.date}
              </span>
            )}
          </div>

          {/* Tags */}
          {presentation.tags && presentation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {presentation.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 rounded-full text-xs text-secondary"
                >
                  {tag}
                </span>
              ))}
              {presentation.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-secondary">
                  +{presentation.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
