'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Privacy Policy</h1>
        <p className="text-gray-500">How we handle and protect your data</p>
      </div>

      <div className="pronimal-card p-8 space-y-4 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-primary mb-2">1. Introduction</h2>
          <p>
            Welcome to Pronim.al. We are committed to protecting your personal information and your right to privacy. 
            If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when registering at the Services, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">3. How We Use Your Information</h2>
          <p>
            We use personal information collected via our Services for a variety of business purposes described below. 
            We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">4. Sharing Your Information</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">5. Data Security</h2>
          <p>
            We aim to protect your personal information through a system of organizational and technical security measures.
          </p>
        </section>
      </div>
    </div>
  );
}
