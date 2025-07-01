// components/FeatureCard.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface FeatureCardProps {
  title: string;
  subtitle: string;
  body: React.ReactNode;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title, subtitle, body, icon, buttonText, onClick
}) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
    <CardHeader className="flex items-center space-x-3">
      {icon}
      <div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="flex-1 my-4 bg-muted p-4 rounded-lg text-center text-muted-foreground">
      {body}
    </CardContent>
    <CardFooter>
      <Button onClick={onClick} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
        {buttonText}
      </Button>
    </CardFooter>
  </Card>
);

export default FeatureCard;
