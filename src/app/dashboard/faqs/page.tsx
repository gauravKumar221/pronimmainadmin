'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Pronim.al?",
    answer: "Pronim.al is a comprehensive admin dashboard designed for agencies and agents to manage their blog posts, banners, agents, agencies, and property owners in one centralized location."
  },
  {
    question: "How do I add a new agent?",
    answer: "Navigate to the 'Agents' section in the sidebar and click on the 'Add Agent' button at the top right. Fill in the required details and save."
  },
  {
    question: "Can I upload my own images for banners?",
    answer: "Yes! In the 'Banner Management' section, you can either provide a direct image URL or use the upload button to select a local image from your device."
  },
  {
    question: "Where is my data stored?",
    answer: "Currently, as a prototype, your data is stored in your browser's local storage. This means it is specific to your device and browser."
  },
  {
    question: "How do I reset my last login time?",
    answer: "The login time is automatically updated every time you sign in. You can also clear your browser's local storage to reset all dashboard data."
  }
];

export default function FAQsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Frequently Asked Questions</h1>
        <p className="text-gray-500">Common questions about using the Pronim.al dashboard</p>
      </div>

      <div className="pronimal-card p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="bg-white border border-gray-100 p-8 rounded-lg text-center space-y-4">
        <h2 className="text-lg font-bold text-primary">Still have questions?</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          If you couldn't find the answer you were looking for, feel free to reach out to our support team for assistance.
        </p>
        <button className="pronimal-btn-accent">Contact Support</button>
      </div>
    </div>
  );
}
