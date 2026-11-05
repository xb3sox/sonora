import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronRight, 
  Mail, Book, Keyboard, Shield, Music
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What audio quality does Sonora use?',
    answer: 'Sonora streams in lossless quality by default (24-bit/96kHz). You can adjust this in Settings based on your needs and data plan.'
  },
  {
    question: 'How do recommendations work?',
    answer: 'Every recommendation comes with an honest explanation of why we suggested it. We use your listening patterns, intent preferences, and artist connections — never opaque algorithms.'
  },
  {
    question: 'Is my data private?',
    answer: 'Yes. All your listening data is processed locally on your device. We never share your data with third parties. You have full control in Settings.'
  },
  {
    question: 'How do I support artists?',
    answer: 'You can follow artists to stay updated, and tip them directly through their artist page. 100% of tips go to the artist (minus processing fees).'
  },
  {
    question: 'Can I use Sonora offline?',
    answer: 'Yes. Enable Offline Mode in Settings to cache your library for listening without internet.'
  },
  {
    question: 'What is Deep Listening mode?',
    answer: 'Deep Listening is a distraction-free full-screen experience focused on one track at a time, with synchronized lyrics and credits. Perfect for focused listening sessions.'
  },
  {
    question: 'How do I import my library from other services?',
    answer: 'Go to Settings → Import & Export → Import from other services. We support Spotify, Apple Music, YouTube Music, and Tidal.'
  },
  {
    question: 'Are there keyboard shortcuts?',
    answer: 'Yes! Press ? anytime to see all available shortcuts. Common ones: Space (play/pause), L (like), S (shuffle), D (deep listening).'
  },
  {
    question: 'Can I export my data?',
    answer: 'Absolutely. Go to your Profile page and click "Export your data" to download a JSON file with all your favorites, playlists, and preferences.'
  },
  {
    question: 'What happens if I clear my data?',
    answer: 'Clearing data removes all local storage including favorites, history, and preferences. This action cannot be undone, but you can import a previous export.'
  },
];

export function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <header className="mb-8 pt-8 sm:pt-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-sonora-accent uppercase tracking-wider mb-2">
          <HelpCircle size={14} /> Help & Support
        </div>
        <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">
          How can we help?
        </h1>
        <p className="text-sonora-stone text-sm">
          Find answers to common questions or get in touch
        </p>
      </header>

      {/* Quick Links */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="#faq" className="flex items-center gap-3 p-4 bg-sonora-warm rounded-xl hover:bg-sonora-sand transition-calm">
            <Book size={20} className="text-sonora-accent" />
            <div>
              <p className="text-sm font-medium text-sonora-bark">FAQ</p>
              <p className="text-xs text-sonora-stone">Common questions</p>
            </div>
          </a>
          <a href="#shortcuts" className="flex items-center gap-3 p-4 bg-sonora-warm rounded-xl hover:bg-sonora-sand transition-calm">
            <Keyboard size={20} className="text-sonora-accent" />
            <div>
              <p className="text-sm font-medium text-sonora-bark">Shortcuts</p>
              <p className="text-xs text-sonora-stone">Keyboard guide</p>
            </div>
          </a>
          <a href="#contact" className="flex items-center gap-3 p-4 bg-sonora-warm rounded-xl hover:bg-sonora-sand transition-calm">
            <Mail size={20} className="text-sonora-accent" />
            <div>
              <p className="text-sm font-medium text-sonora-bark">Contact</p>
              <p className="text-xs text-sonora-stone">Get in touch</p>
            </div>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-8">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">
          Frequently Asked Questions
        </h2>
        <div className="bg-sonora-warm rounded-xl divide-y divide-sonora-sand">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-sonora-sand/50 transition-calm"
              >
                <span className="text-sm font-medium text-sonora-bark pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronDown size={18} className="text-sonora-stone flex-shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-sonora-stone flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 animate-fade-in">
                  <p className="text-sm text-sonora-earth leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section id="shortcuts" className="mb-8">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">
          Keyboard Shortcuts
        </h2>
        <div className="bg-sonora-warm rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { keys: 'Space', action: 'Play / Pause' },
              { keys: '←', action: 'Previous track' },
              { keys: '→', action: 'Next track' },
              { keys: '↑', action: 'Volume up' },
              { keys: '↓', action: 'Volume down' },
              { keys: 'L', action: 'Like / Unlike' },
              { keys: 'S', action: 'Toggle shuffle' },
              { keys: 'R', action: 'Toggle repeat' },
              { keys: 'Q', action: 'Toggle queue' },
              { keys: 'D', action: 'Deep Listening' },
              { keys: '/', action: 'Focus search' },
              { keys: '?', action: 'Show shortcuts' },
              { keys: 'Cmd+K', action: 'Command palette' },
              { keys: 'Esc', action: 'Close modal' },
            ].map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <span className="text-sonora-earth">{shortcut.action}</span>
                <kbd className="px-2 py-1 bg-sonora-cream border border-sonora-sand rounded text-xs font-mono text-sonora-bark">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">
          Get in Touch
        </h2>
        <div className="bg-sonora-warm rounded-xl p-6">
          <p className="text-sm text-sonora-earth mb-4">
            Have a question, feedback, or need help? We'd love to hear from you.
          </p>
          <div className="space-y-3">
            <a 
              href="mailto:support@sonora.app" 
              className="flex items-center gap-3 p-3 bg-sonora-cream rounded-lg hover:bg-sonora-sand transition-calm"
            >
              <Mail size={18} className="text-sonora-accent" />
              <div>
                <p className="text-sm font-medium text-sonora-bark">Email Support</p>
                <p className="text-xs text-sonora-stone">support@sonora.app</p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-3 bg-sonora-cream rounded-lg">
              <Shield size={18} className="text-sonora-accent" />
              <div>
                <p className="text-sm font-medium text-sonora-bark">Privacy & Security</p>
                <p className="text-xs text-sonora-stone">privacy@sonora.app</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-sonora-stone">
          Sonora v1.0.0 · Built with care
        </p>
      </div>
    </div>
  );
}
