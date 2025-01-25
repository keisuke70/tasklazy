"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TaskInputProps {
  onAddTasks: (inputText: string) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function TaskInput({ onAddTasks }: TaskInputProps) {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(true);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText((prevText) => prevText + " " + transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      onAddTasks(inputText);
      setInputText("");
    }
  };

  return (
    <div className="relative">
      <Textarea
        placeholder="Describe your tasks in natural language, e.g., 'Plan a trip, clean the house, and send an email.'"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="min-h-[100px] pr-10"
      />
      <Button
        variant="ghost"
        size="xl"
        className="absolute right-2 top-2"
        onClick={handleVoiceInput}
      >
        <Mic
          size={42}
          className={`${
            isListening ? "text-red-500" : "text-gray-500"
          } transition-all`}
        />
      </Button>
      <div className="flex justify-center w-full mt-4">
        <Button onClick={handleSubmit} className="w-30">
          Add Tasks
        </Button>
      </div>
    </div>
  );
}
