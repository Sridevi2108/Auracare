import React, { useEffect, useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardFooter from "@/components/DashboardFooter";
import { useDarkMode } from "@/components/DarkModeProvider";

const POLL_INTERVAL = 10_000;

const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#F44336"];

const Analytics: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [moodData, setMoodData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.warn('No userEmail – skipping fetch');
      setLoading(false);
      return;
    }

    const fetchMood = async () => {
      const res = await fetch(`http://localhost:5000/api/mood-logs/email/${encodeURIComponent(userEmail)}`);
      const { moods } = await res.json();
      
      if (Array.isArray(moods)) {
        // For Line Chart: Only Day, Mood, Emotion
        setMoodData(moods.map(e => ({
          day: new Date(e.timestamp).toLocaleString('en-US', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          
          mood: e.mood,
          emotion: e.emotion || 'Neutral',
        })));
    
        // For Pie Chart: Count all emotions dynamically
        const moodCounts: Record<string, number> = {};
    
        moods.forEach(e => {
          const emotion = (e.emotion || 'Neutral').trim();
          moodCounts[emotion] = (moodCounts[emotion] || 0) + 1;
        });
    
        const pieDataFormatted = Object.entries(moodCounts)
          .map(([name, value]) => ({ name, value }));
    
        setPieData(pieDataFormatted);
      }
    };
    
    

    Promise.all([fetchMood()]).finally(() => setLoading(false));
    const timer = setInterval(() => { fetchMood(); }, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-background p-4 border rounded-md shadow-md">
        <p className="font-medium">{`Day: ${label}`}</p>
        <p className="text-primary">{`Mood: ${payload[0].value}/10`}</p>
        <p className="text-muted-foreground">{`Emotion: ${d.emotion}`}</p>
      </div>
    );
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/90 to-background">
      <DashboardNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Your Wellness Analytics</h1>
          <p className="text-muted-foreground">Track your mood and wellness over time</p>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Mood Line Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Weekly Mood Tracker</CardTitle>
              <CardDescription>Your emotional journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 10]} label={{ value: "Mood", angle: -90, position: "insideLeft" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="mood" stroke="#9C27B0" strokeWidth={2} activeDot={{ r: 8 }} name="Mood" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Mood Pie Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>How you felt overall</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>AI recommendations based on your mood</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <ul className="list-disc pl-5 space-y-2">
                <li>Higher moods on weekends. Try mini-breaks mid-week.</li>
                <li>Good sleep (7–8 hrs) correlates with better mood.</li>
                <li>Journaling after bad days lifts your mood.</li>
                <li>Meditation improves your overall mood stability.</li>
              </ul>
              <p className="text-muted-foreground italic mt-4">Based on your chat interactions.</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <DashboardFooter />
    </div>
  );
};

export default Analytics;
