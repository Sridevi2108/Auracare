
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Brain, Heart, Shield } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              cardRef.current?.classList.add('opacity-100', 'translate-y-0');
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Card 
      ref={cardRef}
      className="group transition-all duration-500 opacity-0 translate-y-10 hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-primary/20"
    >
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-plum-lighter flex items-center justify-center mb-4 group-hover:bg-plum-gradient transition-colors duration-300">
          <div className="text-plum group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            titleRef.current?.classList.add('opacity-100', 'translate-y-0');
            setTimeout(() => {
              subtitleRef.current?.classList.add('opacity-100', 'translate-y-0');
            }, 300);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="py-20 bg-gradient-to-b from-background to-pastel-purple/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-4 transition-all duration-500 opacity-0 translate-y-10"
          >
            How AuraCare <span className="text-transparent bg-clip-text bg-plum-gradient">Helps You</span>
          </h2>
          <p 
            ref={subtitleRef}
            className="text-muted-foreground max-w-2xl mx-auto transition-all duration-500 opacity-0 translate-y-10"
          >
            Our AI-powered platform provides personalized mental health support through innovative features designed with your wellbeing in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="24/7 Compassionate Chat"
            description="Connect with our AI companion anytime for supportive conversations, guidance, and a judgment-free space to express yourself."
            delay={100}
          />
          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="Personalized Insights"
            description="Receive tailored recommendations and insights based on your interactions, helping you understand patterns in your mental wellbeing."
            delay={300}
          />
          <FeatureCard
            icon={<Heart className="h-6 w-6" />}
            title="Guided Self-Care"
            description="Access guided meditation, breathing exercises, and mindfulness practices customized to your specific needs and goals."
            delay={500}
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Privacy Focused"
            description="Your data is encrypted and secured. We prioritize your privacy and confidentiality in every interaction."
            delay={700}
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
