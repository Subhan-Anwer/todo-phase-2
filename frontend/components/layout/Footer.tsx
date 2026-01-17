/**
 * Footer Component
 *
 * Application footer with copyright and links.
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {currentYear} Todo App. All rights reserved.
          </p>

          {/* Links */}
          <nav className="flex gap-6" aria-label="Footer navigation">
            <a
              href="/about"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              About
            </a>
            <a
              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Terms
            </a>
            <a
              href="/contact"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
