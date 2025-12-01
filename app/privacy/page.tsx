export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="glass-effect border-b border-dark-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Privacy Policy</h1>
          <p className="text-xl text-dark-400">
            Last updated: November 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="glass-effect rounded-3xl p-8 md:p-12 shadow-card space-y-8 text-dark-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              We collect several types of information to provide and improve our Service:
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name and email address (when creating an account or submitting applications)</li>
              <li>Social media profile URLs you provide</li>
              <li>Profile bio and expertise information</li>
              <li>Favorites and saved profiles</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Usage Data</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>IP address and device information</li>
              <li>Referral source</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide and maintain our Service</li>
              <li>To process your profile applications and submissions</li>
              <li>To send you notifications about your account or submissions</li>
              <li>To provide customer support</li>
              <li>To improve and personalize user experience</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To analyze usage patterns and optimize the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing and Disclosure</h2>
            <p className="leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information. We may share information in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Public Profiles</h3>
            <p className="leading-relaxed">
              Information you provide for your public profile (name, bio, social links, expertise) will be
              visible to all users of the Service. This is the core functionality of Becometry.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Legal Requirements</h3>
            <p className="leading-relaxed">
              We may disclose your information if required to do so by law or in response to valid requests
              by public authorities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Storage and Security</h2>
            <p className="leading-relaxed">
              Your data is stored securely using industry-standard encryption and security practices. While we
              strive to protect your personal information, no method of transmission over the Internet or
              electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies and Tracking</h2>
            <p className="leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our Service:
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Session Cookies</h3>
            <p className="leading-relaxed">
              Used to maintain your login session and remember your preferences.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Preference Cookies</h3>
            <p className="leading-relaxed">
              Remember your settings and favorites (for guest users).
            </p>

            <p className="leading-relaxed mt-4">
              You can instruct your browser to refuse cookies, but some parts of our Service may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services</h2>
            <p className="leading-relaxed mb-4">
              Our Service displays content from third-party platforms:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">YouTube:</strong> For displaying Shorts and video content</li>
              <li><strong className="text-white">Social Media:</strong> Profile links redirect to external platforms</li>
            </ul>
            <p className="leading-relaxed mt-4">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Data Rights</h2>
            <p className="leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise these rights, contact us through the application form.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <p className="leading-relaxed">
              Our Service is not directed to individuals under the age of 13. We do not knowingly collect
              personal information from children. If you become aware that a child has provided us with
              personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Privacy Policy</h2>
            <p className="leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about this Privacy Policy, please contact us through the application form
              on our website.
            </p>
          </section>

          <div className="pt-8 border-t border-dark-800">
            <a
              href="/terms"
              className="text-accent-purple hover:text-accent-blue transition-colors font-semibold"
            >
              → View our Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
