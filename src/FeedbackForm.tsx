import { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label";

import { MessageCircle, X } from "lucide-react";

const FeedbackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState<string>('');
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle feedback submission here
    console.log('Feedback submitted:', selectedOptions);
    console.log('Feedback submitted:', additionalFeedback);
    setAdditionalFeedback('');
    setSelectedOptions([]);
    setAdditionalFeedback('');
    setIsOpen(false);
  };


  const handleCheckboxChange = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const feedbackOptions = [
    "I can't find something.",
    "I can't figure out how to do something.",
    "Recommend a new feature.",
    "I love it!",
    "Something else."
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
        
        {!isOpen ? (
        
            <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Button onClick={() => setIsOpen(true)} className="rounded-full w-12 h-12 flex items-center justify-center bg-gray-500">
                    <MessageCircle size={24} className=""/>
                    </Button>  
                </TooltipTrigger>
                <TooltipContent>
                    Submit your feedback
                </TooltipContent>
            </Tooltip>
            </TooltipProvider>

) : (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Give Feedback</h2>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="icon"
          className="h-6 w-6"
        >
          <X size={18} />
        </Button>
      </div>
      <p className="mb-2">We'd love to hear from you. How are you feeling about our app?</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-2 mb-4">
          {feedbackOptions.map((option) => (
            <div key={option} className="flex items-center">
              <Checkbox
                id={option}
                checked={selectedOptions.includes(option)}
                onCheckedChange={() => handleCheckboxChange(option)}
              />
              <Label htmlFor={option} className="ml-2">
                {option}
              </Label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <Label htmlFor="additionalFeedback" className="text-left">Anything else you'd like to share?</Label>
          <Textarea
            id="additionalFeedback"
            value={additionalFeedback}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAdditionalFeedback(e.target.value)}
            placeholder="I have feedback on..."
            className="mt-1 w-full"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          {/*<a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>*/}
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                Submit
            </Button>
        </div>
        
      </form>
    </div>
  )}
</div>
);
};

export default FeedbackForm;