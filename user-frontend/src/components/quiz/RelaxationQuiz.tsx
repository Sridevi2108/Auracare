import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface Question {
  _id: string;
  question: string;
  options: string[];
  // answer, category, difficulty live in the DB but are unused here
}

const RelaxationQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/quiz')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.questions)) {
          setQuestions(res.data.questions.slice(0, 10));
          toast.success('Loaded quiz questions!');
        } else {
          toast.error('Failed to load quiz questions');
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Something went wrong loading questions');
      });
  }, []);

  const handleSelect = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
    } else {
      setCompleted(true);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setCompleted(false);
  };

  if (!questions.length) {
    return <div className="p-8 text-center">Loading questions…</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
        <CardHeader>
          <CardTitle>Relaxation Style Quiz</CardTitle>
          <CardDescription>
            Answer these 10 quick questions to see where you fall.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!completed ? (
            <>
              <div className="text-lg font-medium mb-4">
                Question {currentIndex + 1} of {questions.length}
              </div>
              <div className="text-xl mb-6">
                {questions[currentIndex].question}
              </div>
              <div className="grid gap-4">
                {questions[currentIndex].options.map((opt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full text-left py-4"
                    onClick={handleSelect}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-bold">Quiz Completed!</h2>
              <p>Thanks for participating. Feel free to retake or explore other sections.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {completed && (
            <Button
              onClick={reset}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Retake Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default RelaxationQuiz;
