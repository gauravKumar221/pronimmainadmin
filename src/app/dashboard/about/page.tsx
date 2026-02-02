'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">About Us</h1>
        <p className="text-gray-500">Our mission and the team behind Pronim.al</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="pronimal-card p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
          <p className="text-gray-600 mb-6">
            Pronim.al was founded with a single mission: to revolutionize how real estate agencies and agents manage their relationships with property owners. We believe in providing simple, powerful, and beautiful tools that make professional management accessible to everyone.
          </p>
          <p className="text-gray-600">
            Based in the heart of the tech industry, we combine cutting-edge technology with deep industry expertise to deliver a dashboard that truly works for you.
          </p>
        </div>
        <div className="relative h-64 md:h-auto rounded-lg overflow-hidden shadow-sm">
          <Image
            src="https://picsum.photos/seed/about-us/800/600"
            alt="Our Team"
            fill
            className="object-cover"
            data-ai-hint="modern office"
          />
        </div>
      </div>

      <div className="pronimal-card p-8">
        <h2 className="text-xl font-bold text-primary mb-6 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-xl">1</span>
            </div>
            <h3 className="font-bold">Transparency</h3>
            <p className="text-sm text-gray-500">We believe in open communication and honest data management.</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-xl">2</span>
            </div>
            <h3 className="font-bold">Innovation</h3>
            <p className="text-sm text-gray-500">Constantly pushing the boundaries of what a dashboard can do.</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-xl">3</span>
            </div>
            <h3 className="font-bold">User First</h3>
            <p className="text-sm text-gray-500">Every feature is designed with the user's efficiency in mind.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
