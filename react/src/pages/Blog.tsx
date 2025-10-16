import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Clock, ArrowRight, User, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "Guide complet pour un déménagement réussi",
    slug: "guide-complet-demenagement-reussi",
    excerpt: "Découvrez nos meilleurs conseils pour organiser votre déménagement de A à Z sans stress. De la préparation à l'installation dans votre nouveau logement.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    category: "Conseils",
    author: "Sophie Martin",
    date: "15 Oct 2025",
    readTime: "5 min",
    featured: true,
  },
  {
    id: 2,
    title: "Comment emballer vos objets fragiles",
    slug: "comment-emballer-objets-fragiles",
    excerpt: "Les techniques professionnelles pour protéger votre vaisselle, vos œuvres d'art et vos objets précieux pendant le transport.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
    category: "Astuces",
    author: "Marc Dubois",
    date: "12 Oct 2025",
    readTime: "4 min",
    featured: false,
  },
  {
    id: 3,
    title: "Déménagement écologique : nos solutions durables",
    slug: "demenagement-ecologique-solutions-durables",
    excerpt: "Adoptez une approche respectueuse de l'environnement pour votre déménagement avec nos cartons recyclables et nos véhicules propres.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
    category: "Environnement",
    author: "Claire Leblanc",
    date: "10 Oct 2025",
    readTime: "6 min",
    featured: true,
  },
  {
    id: 4,
    title: "Check-list ultime pour votre déménagement",
    slug: "checklist-ultime-demenagement",
    excerpt: "Ne rien oublier grâce à notre liste complète des tâches à effectuer avant, pendant et après votre déménagement.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
    category: "Organisation",
    author: "Thomas Bernard",
    date: "8 Oct 2025",
    readTime: "7 min",
    featured: false,
  },
  {
    id: 5,
    title: "Déménager avec des enfants : guide pratique",
    slug: "demenager-avec-enfants-guide-pratique",
    excerpt: "Comment impliquer vos enfants dans le processus et rendre cette transition plus facile pour toute la famille.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
    category: "Famille",
    author: "Julie Rousseau",
    date: "5 Oct 2025",
    readTime: "5 min",
    featured: false,
  },
  {
    id: 6,
    title: "Les erreurs à éviter lors d'un déménagement",
    slug: "erreurs-eviter-demenagement",
    excerpt: "Apprenez des expériences des autres et évitez les pièges les plus courants pour un déménagement sans accroc.",
    image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&auto=format&fit=crop&q=80",
    category: "Conseils",
    author: "Pierre Durand",
    date: "3 Oct 2025",
    readTime: "6 min",
    featured: false,
  },
  {
    id: 7,
    title: "Budget déménagement : comment faire des économies",
    slug: "budget-demenagement-economies",
    excerpt: "Nos astuces pour réduire les coûts de votre déménagement sans compromettre la qualité du service.",
    image: "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=800&auto=format&fit=crop&q=80",
    category: "Finance",
    author: "Nathalie Petit",
    date: "1 Oct 2025",
    readTime: "5 min",
    featured: false,
  },
  {
    id: 8,
    title: "Déménagement longue distance : ce qu'il faut savoir",
    slug: "demenagement-longue-distance",
    excerpt: "Toutes les informations essentielles pour organiser un déménagement vers une autre région ou un autre pays.",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=80",
    category: "Organisation",
    author: "Alexandre Moreau",
    date: "28 Sep 2025",
    readTime: "8 min",
    featured: false,
  },
  {
    id: 9,
    title: "Assurance déménagement : tout comprendre",
    slug: "assurance-demenagement-guide-complet",
    excerpt: "Les différentes options d'assurance pour protéger vos biens pendant le transport et éviter les mauvaises surprises.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=80",
    category: "Juridique",
    author: "Isabelle Laurent",
    date: "25 Sep 2025",
    readTime: "6 min",
    featured: false,
  },
];

const categories = ["Tous", "Conseils", "Astuces", "Organisation", "Environnement", "Famille", "Finance", "Juridique"];

export default function Blog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1c3957] via-[#2a4f6b] to-[#1c3957] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm font-medium text-[#CC922F]">Blog & Actualités</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Conseils & Astuces
              <span className="block text-[#CC922F] mt-2">pour votre déménagement</span>
            </h1>
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
              Découvrez nos guides complets, astuces pratiques et dernières actualités pour réussir votre déménagement en toute sérénité.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#CC922F] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#CC922F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </section>

      {/* Category Filters */}
      <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#1c3957] to-[#2a4f6b] text-white shadow-lg shadow-[#1c3957]/30 scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Posts */}
        {selectedCategory === "Tous" && featuredPosts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-[#CC922F] to-[#1c3957] rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">Articles à la une</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <article
                  key={post.id}
                  onClick={() => post.slug && navigate(`/blog/${post.slug}`)}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-4 py-1.5 bg-[#CC922F] text-white text-sm font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#1c3957] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-[#CC922F] group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-gradient-to-r from-[#1c3957] to-[#CC922F] rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === "Tous" ? "Tous les articles" : `Articles : ${selectedCategory}`}
            </h2>
            <span className="ml-auto text-gray-500 font-medium">
              {filteredPosts.length} {filteredPosts.length > 1 ? "articles" : "article"}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => post.slug && navigate(`/blog/${post.slug}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-[#1c3957] text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1c3957] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readTime} de lecture</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[#CC922F] font-medium text-sm group-hover:gap-3 transition-all">
                        Lire
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="mt-20">
          <div className="bg-gradient-to-r from-[#CC922F] to-[#1C3957] text-white p-12 rounded-3xl text-center">
            <motion.div
              className="inline-flex items-center gap-2 mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="w-8 h-8" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-['Poppins',sans-serif]">
              Restez informé de nos derniers articles
            </h2>
            
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
              Inscrivez-vous à notre newsletter pour recevoir nos meilleurs conseils et astuces directement dans votre boîte mail.
            </p>
            
            {/* Email Subscription Form */}
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-6 py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white shadow-lg font-['Poppins',sans-serif]"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#1C3957] text-white font-semibold rounded-full hover:bg-[#2a4f6b] shadow-lg transition-all duration-200 font-['Poppins',sans-serif]"
              >
                S'abonner
              </motion.button>
            </form>
            
            <p className="text-sm text-white/80">
              🔒 Vos données sont protégées et ne seront jamais partagées.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

