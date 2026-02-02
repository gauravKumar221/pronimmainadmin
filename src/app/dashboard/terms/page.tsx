'use client';

import React from 'react';

export default function TermsAndConditionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Terms & Conditions</h1>
        <p className="text-gray-500">Legal agreement for using Pronim.al</p>
      </div>

      <div className="pronimal-card p-8 space-y-4 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-primary mb-2">1. Agreement to Terms</h2>
          <p>
            These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Pronim.al ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">3. User Representations</h2>
          <p>
            By using the Site, you represent and warrant that all registration information you submit will be true, accurate, current, and complete; you will maintain the accuracy of such information and promptly update such registration information as necessary.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">4. Prohibited Activities</h2>
          <p>
            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">5. Governing Law</h2>
          <p>
            These Terms shall be governed by and defined following the laws of our jurisdiction. Pronim.al and yourself irrevocably consent that the courts shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
          </p>
        </section>
      </div>
    </div>
  );
}
