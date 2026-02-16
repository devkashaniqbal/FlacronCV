import { FileText } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left: Brand panel */}
      <div className="hidden w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 lg:flex lg:flex-col lg:justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
            <FileText className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-white">FlacronCV</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-white">
            Build your future<br />with AI-powered CVs
          </h2>
          <p className="mt-4 text-lg text-brand-200">
            Join thousands of professionals who land their dream jobs with FlacronCV.
          </p>
        </div>
        <p className="text-sm text-brand-300">
          &copy; {new Date().getFullYear()} FlacronCV. All rights reserved.
        </p>
      </div>

      {/* Right: Auth form */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-stone-900 dark:text-white">
                Flacron<span className="text-brand-600">CV</span>
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
