
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  avatar: string;
  index: number;
}

const testimonialData = [
  {
    content: "AuraCare has been a lifesaver during my most anxious moments. The AI companion feels surprisingly human and compassionate.",
    author: "Sarah J.",
    role: "Teacher",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    content: "I was skeptical at first, but the personalized recommendations have genuinely improved my daily mental health routine.",
    author: "Michael T.",
    role: "Software Engineer",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
  },
  {
    content: "Having access to support 24/7 has made all the difference in my mental health journey. I feel less alone knowing I can always connect.",
    author: "Elena R.",
    role: "Healthcare Professional",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    content: "The guided meditation sessions are tailored perfectly to my needs. It's like having a personal mindfulness coach.",
    author: "David L.",
    role: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
];

const TestimonialCard: React.FC<TestimonialProps> = ({ content, author, role, avatar, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              cardRef.current?.classList.add('opacity-100', 'translate-y-0');
            }, index * 200);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <Card 
      ref={cardRef}
      className="transition-all duration-500 opacity-0 translate-y-10 hover:shadow-lg"
    >
      <CardContent className="p-6">
        <Quote className="h-8 w-8 text-plum opacity-30 mb-4" />
        <p className="mb-6 text-foreground/80">{content}</p>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={avatar} alt={author} />
            <AvatarFallback className="bg-plum text-white">{author.split(' ')[0][0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            titleRef.current?.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="py-20 bg-gradient-to-b from-pastel-purple/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-4 transition-all duration-500 opacity-0 translate-y-10"
          >
            What Our <span className="text-transparent bg-clip-text bg-plum-gradient">Users Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonialData.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              avatar={testimonial.avatar}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
