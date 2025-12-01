'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Becometry?",
    answer: "Becometry is a curated directory connecting people with verified experts, creators, and mentors across every field. We help you discover knowledge-shapers through profiles, social media, and video content."
  },
  {
    question: "How do I apply to be featured?",
    answer: "Click 'Apply to Join' in the navigation menu and fill out the application form. You'll need to provide your name, email, category, bio, and at least one social media profile. Our team reviews all applications within 5-7 business days."
  },
  {
    question: "Can I suggest someone else to be featured?",
    answer: "Yes! When filling out the application form, you can choose 'Suggest Someone' instead of 'Apply Myself'. This allows you to recommend experts you know who would be valuable additions to our directory."
  },
  {
    question: "Is Becometry free to use?",
    answer: "Yes, browsing and discovering experts on Becometry is completely free. Creating an account allows you to save unlimited favorites and receive personalized recommendations."
  },
  {
    question: "How do I save profiles to my favorites?",
    answer: "Click the heart icon on any profile card to add it to your favorites. Guest users can save up to 5 favorites, while registered users can save unlimited profiles."
  },
  {
    question: "What are the different categories available?",
    answer: "We organize experts across major categories including Technology, Business, Health & Wellness, Creative Arts, Education, and many more. Each category has numerous subcategories for precise discovery."
  },
  {
    question: "How are experts verified?",
    answer: "Our team manually reviews each application, checking social media profiles, content quality, and expertise indicators. We ensure every featured expert meets our quality standards."
  },
  {
    question: "Can I update my profile after it's published?",
    answer: "Yes! Contact us through the submission form or email with your profile URL and requested changes. We typically process updates within 2-3 business days."
  },
  {
    question: "What is the YouTube Shorts feature?",
    answer: "Our Shorts feed aggregates educational short-form videos from featured experts' YouTube channels, creating a TikTok-style learning experience focused on expert knowledge."
  },
  {
    question: "How do tags work?",
    answer: "Tags help categorize expertise more granularly. We use two types: Universal tags (applicable across all fields like 'Beginner-Friendly') and Contextual tags (specific to categories like 'Machine Learning' in Tech)."
  },
  {
    question: "Can I upload multiple profiles at once?",
    answer: "Admins can bulk upload profiles using our CSV upload feature. Contact us if you're an organization looking to feature multiple experts from your team."
  },
  {
    question: "What social platforms do you support?",
    answer: "We support YouTube, Twitter/X, LinkedIn, Instagram, TikTok, Facebook, and general websites. You can link multiple platforms to create a comprehensive profile."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="glass-effect border-b border-dark-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-dark-400">
            Find answers to common questions about Becometry
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-effect rounded-2xl overflow-hidden border border-dark-700 hover:border-dark-600 transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-dark-900/30 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                <svg
                  className={`w-6 h-6 text-accent-purple transform transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 pt-0">
                  <div className="pt-4 border-t border-dark-800">
                    <p className="text-dark-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 glass-effect rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
          <p className="text-dark-400 mb-6">
            Can't find the answer you're looking for? Feel free to reach out to us.
          </p>
          <a
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all"
          >
            Contact Us
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
