export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="glass-effect border-b border-dark-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">About Becometry</h1>
          <p className="text-xl text-dark-400">
            Discover the story behind the platform connecting experts, creators, and mentors worldwide.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="glass-effect rounded-3xl p-8 md:p-12 shadow-card space-y-8">
          {/* Mission */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-dark-300 leading-relaxed text-lg">
              Becometry is dedicated to creating the world's most comprehensive directory of experts, creators,
              and mentors across every field imaginable. We believe that knowledge should be accessible, and
              expertise should be discoverable.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">What We Do</h2>
            <div className="space-y-4">
              <div className="glass-effect rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold text-accent-purple mb-2">🔍 Curated Directory</h3>
                <p className="text-dark-300">
                  We maintain a carefully curated directory of verified experts across hundreds of categories,
                  from technology and business to health and creative arts.
                </p>
              </div>

              <div className="glass-effect rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold text-accent-blue mb-2">📺 Video Content Hub</h3>
                <p className="text-dark-300">
                  Discover short-form educational content through our YouTube Shorts integration, bringing
                  expert knowledge directly to your feed.
                </p>
              </div>

              <div className="glass-effect rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold text-accent-purple mb-2">🤝 Community First</h3>
                <p className="text-dark-300">
                  Anyone can suggest experts or apply to join, fostering a collaborative community where
                  knowledge-sharing is celebrated.
                </p>
              </div>
            </div>
          </section>

          {/* Why Becometry */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">Why Becometry?</h2>
            <p className="text-dark-300 leading-relaxed text-lg mb-4">
              In a world overflowing with information, finding the right expert can be challenging.
              Becometry solves this by:
            </p>
            <ul className="space-y-3 text-dark-300">
              <li className="flex items-start gap-3">
                <span className="text-accent-purple mt-1">✓</span>
                <span><strong className="text-white">Verifying Expertise:</strong> Every profile is carefully reviewed to ensure authenticity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-blue mt-1">✓</span>
                <span><strong className="text-white">Smart Organization:</strong> Advanced tagging and categorization for easy discovery</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-purple mt-1">✓</span>
                <span><strong className="text-white">Always Current:</strong> Regular updates ensure profiles reflect the latest information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-blue mt-1">✓</span>
                <span><strong className="text-white">Multi-Platform:</strong> Connect across YouTube, Twitter, LinkedIn, and more</span>
              </li>
            </ul>
          </section>

          {/* Join Us */}
          <section className="bg-gradient-to-r from-accent-purple/10 to-accent-blue/10 rounded-2xl p-8 border border-accent-purple/20">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-dark-300 leading-relaxed text-lg mb-6">
              Whether you're an expert looking to share your knowledge or someone seeking to learn from the best,
              Becometry is your platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/apply"
                className="px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all"
              >
                Apply as an Expert
              </a>
              <a
                href="/explore"
                className="px-8 py-3 glass-effect border border-dark-700 text-dark-300 rounded-xl font-semibold hover:bg-dark-800 hover:text-accent-purple transition-all"
              >
                Explore Profiles
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
