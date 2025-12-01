export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="glass-effect border-b border-dark-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Terms of Service</h1>
          <p className="text-xl text-dark-400">
            Last updated: November 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="glass-effect rounded-3xl p-8 md:p-12 shadow-card space-y-8 text-dark-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using Becometry ("the Service"), you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to these Terms of Service, please do not use
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
            <p className="leading-relaxed mb-4">
              Permission is granted to temporarily access and use Becometry for personal, non-commercial purposes.
              This license does not include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for commercial purposes</li>
              <li>Attempting to decompile or reverse engineer any software</li>
              <li>Removing copyright or proprietary notations</li>
              <li>Transferring materials to another person or server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <p className="leading-relaxed">
              When you create an account with us, you must provide accurate, complete, and current information.
              Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding your
              password and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Profile Submissions</h2>
            <p className="leading-relaxed mb-4">
              By submitting a profile application, you warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>All information provided is accurate and truthful</li>
              <li>You have the right to submit the social media profiles linked</li>
              <li>The content does not violate any third-party rights</li>
              <li>You consent to our review and potential publication of your profile</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Becometry reserves the right to reject any application without providing a reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
            <p className="leading-relaxed">
              The Service and its original content (excluding user-submitted content), features, and functionality
              are owned by Becometry and are protected by international copyright, trademark, patent, trade secret,
              and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. User-Generated Content</h2>
            <p className="leading-relaxed">
              You retain ownership of content you submit. However, by submitting content to Becometry, you grant
              us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, and display
              that content in connection with the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Prohibited Uses</h2>
            <p className="leading-relaxed mb-4">
              You may not use the Service:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>In any way that violates applicable laws or regulations</li>
              <li>To impersonate or attempt to impersonate another person or entity</li>
              <li>To engage in any automated use of the system</li>
              <li>To interfere with or disrupt the Service</li>
              <li>To submit false, misleading, or fraudulent information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer</h2>
            <p className="leading-relaxed">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Becometry makes no warranties,
              expressed or implied, and hereby disclaims all warranties including implied warranties of
              merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p className="leading-relaxed">
              In no event shall Becometry be liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of your access to or use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any changes by
              updating the "Last updated" date. Your continued use of the Service after changes constitutes
              acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact us through the application form on
              our website.
            </p>
          </section>

          <div className="pt-8 border-t border-dark-800">
            <a
              href="/privacy"
              className="text-accent-purple hover:text-accent-blue transition-colors font-semibold"
            >
              → View our Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
