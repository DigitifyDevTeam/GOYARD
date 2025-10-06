import { Camera, Zap, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-moving.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-primary-light/20 to-secondary-light/20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Équipe de déménagement professionnelle"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/95" />
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Devis de déménagement
              <span className="block text-gradient">instantané par IA</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Prenez simplement des photos de vos pièces et obtenez une estimation 
              précise et personnalisée de votre déménagement en quelques minutes.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 slide-up">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={onGetStarted}
              className="group"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="hero-outline" size="xl">
              Voir comment ça marche
            </Button>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto scale-in">
            <div className="glass-card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Photographiez</h3>
              <p className="text-muted-foreground text-sm">
                Prenez des photos de chaque pièce à déménager
              </p>
            </div>

            <div className="glass-card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">2. IA analyse</h3>
              <p className="text-muted-foreground text-sm">
                Notre intelligence artificielle évalue le volume et la complexité
              </p>
            </div>

            <div className="glass-card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Recevez votre devis</h3>
              <p className="text-muted-foreground text-sm">
                Obtenez instantanément une estimation détaillée et précise
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>100% gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Estimation en 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Analyse IA précise</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Aucun engagement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}