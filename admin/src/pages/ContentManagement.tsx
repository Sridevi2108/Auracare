import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Gamepad, FileText, Music, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import FeatureCard from "@/components/FeatureCard";
import { useNavigate } from "react-router-dom";

type Content = {
  id: string;
  title: string;
  type: string;
  status: string;
  date: string;
};

const initialContents: Content[] = [
  // your mock data...
];

export default function ContentManagement() {
  const [contents, setContents] = useState<Content[]>(initialContents);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filtered = contents.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setContents(contents.filter(c => c.id !== id));
    toast.success("Content deleted successfully");
  };
  const handleEdit = (id: string) => {
    toast.info(`Editing ${id}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* ① Feature cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Play Games"
          subtitle="Fun mental wellness games to boost your mood"
          body="Interactive games designed to improve mental well-being"
          icon={<Gamepad className="h-6 w-6 text-purple-600" />}
          buttonText="Start Playing"
          onClick={() => navigate("/dashboard/games")}
        />
        <FeatureCard
          title="Relaxation Quiz"
          subtitle="Discover personalized relaxation techniques"
          body="Interactive quiz to find what relaxation methods work best for you"
          icon={<FileText className="h-6 w-6 text-purple-600" />}
          buttonText="Take Quiz"
          onClick={() => navigate("/dashboard/quiz")}
        />
        <FeatureCard
          title="Relaxation Music"
          subtitle="Calming sounds to ease your mind"
          body="Soothing music and sounds designed to reduce stress and anxiety"
          icon={<Music className="h-6 w-6 text-purple-600" />}
          buttonText="Listen Now"
          onClick={() => navigate("/dashboard/music")}
        />
      </div>

      {/* ② (example) Search & Add button */}
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-9 w-full sm:w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => toast.info("Open content form")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Content
        </Button>
      </div>

      {/* ③ Tabs & Table: your existing table logic... */}
      <Tabs defaultValue="all" className="w-full">
        {/* … */}
      </Tabs>
    </div>
  );
}
