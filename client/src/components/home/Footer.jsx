import { Github } from "lucide-react";

const Footer = () => (
  <footer className="relative z-10 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#121110] pt-24 pb-12 w-full mt-auto text-gray-900 dark:text-white">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] sm:gap-12 gap-16 mb-24">
        <div>
          <div className="mb-6">
            <img
              src="/light_logo.png"
              alt="Sumora"
              className="h-8 w-auto dark:hidden"
            />
            <img
              src="/dark_logo.png"
              alt="Sumora"
              className="h-8 w-auto hidden dark:block"
            />
          </div>
          <p className="text-gray-600 dark:text-[#a8a19b] min-w-[280px] max-w-sm mb-8 text-[15px] leading-relaxed font-light">
            Ace your next interview with AI-powered practice sessions, instant
            scoring, personalized feedback, and resume building.
          </p>
          <div className="flex items-center gap-5 text-gray-500">
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2498-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8745-.6177-1.2498a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="lg:pl-6">
          <h4 className="text-gray-900 dark:text-white font-medium mb-6">
            Product
          </h4>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Integrations
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Changelog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Docs
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:pl-6">
          <h4 className="text-gray-900 dark:text-white font-medium mb-6">
            Resources
          </h4>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Community
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Tutorials
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                API Reference
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:pl-6">
          <h4 className="text-gray-900 dark:text-white font-medium mb-6">
            Company
          </h4>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Partners
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="h-px w-full bg-black/5 dark:bg-white/5 border-t border-gray-200 dark:border-white/5 mb-8"></div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2026 Sumora. All rights reserved.</p>
        <div className="flex items-center flex-wrap justify-center gap-x-8 gap-y-2">
          <a
            href="#"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cookie Management
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
