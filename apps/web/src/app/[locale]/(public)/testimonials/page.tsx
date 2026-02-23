import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Star, ArrowRight, Quote } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('testimonials_page');
  return { title: `${t('title')} — FlacronCV` };
}

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'Google',
    avatar: 'SJ',
    avatarColor: 'bg-violet-500',
    rating: 5,
    text: 'FlacronCV helped me land my dream job at Google. The AI writing assistant saved me hours of work, and the ATS optimization tips were invaluable. I got 3x more interviews after using it.',
    tag: 'Tech',
  },
  {
    name: 'Mohammed Al-Rashid',
    role: 'Finance Analyst',
    company: 'Goldman Sachs',
    avatar: 'MA',
    avatarColor: 'bg-brand-500',
    rating: 5,
    text: 'The multilingual support is incredible. I created my CV in both English and Arabic in under 30 minutes. The Professional template made my CV look like it was designed by a professional.',
    tag: 'Finance',
  },
  {
    name: 'Emma Müller',
    role: 'UX Designer',
    company: 'Spotify',
    avatar: 'EM',
    avatarColor: 'bg-emerald-500',
    rating: 5,
    text: 'As a designer, I was skeptical — but the templates are genuinely beautiful and modern. The Creative template was perfect for my portfolio-style CV. I got hired within 2 weeks!',
    tag: 'Design',
  },
  {
    name: 'James Chen',
    role: 'Product Manager',
    company: 'Stripe',
    avatar: 'JC',
    avatarColor: 'bg-cyan-500',
    rating: 5,
    text: 'I used 4 different CV builders before FlacronCV. None of them had the AI quality of this one. The bullet point suggestions for PM roles were eerily accurate.',
    tag: 'Product',
  },
  {
    name: 'Priya Patel',
    role: 'Data Scientist',
    company: 'Microsoft',
    avatar: 'PP',
    avatarColor: 'bg-pink-500',
    rating: 5,
    text: 'The ATS Score Checker is a game changer. I could see exactly why my previous CV was failing automated screening and fix it instantly. Got an interview at Microsoft the same week.',
    tag: 'Data Science',
  },
  {
    name: 'Carlos Rivera',
    role: 'Marketing Director',
    company: 'HubSpot',
    avatar: 'CR',
    avatarColor: 'bg-amber-500',
    rating: 5,
    text: "I've recommended FlacronCV to my entire team. The cover letter AI is especially strong — it writes personalized letters that don't sound generic. Worth every penny of the Pro plan.",
    tag: 'Marketing',
  },
  {
    name: 'Aisha Kamara',
    role: 'HR Manager',
    company: 'Deloitte',
    avatar: 'AK',
    avatarColor: 'bg-teal-500',
    rating: 5,
    text: 'As an HR professional who reviews CVs daily, I can say the templates in FlacronCV are among the cleanest and most readable I see. Applicants using it immediately stand out.',
    tag: 'HR',
  },
  {
    name: 'Tom Nakamura',
    role: 'DevOps Engineer',
    company: 'AWS',
    avatar: 'TN',
    avatarColor: 'bg-orange-500',
    rating: 5,
    text: 'Setup took 5 minutes. The drag-and-drop editor is intuitive and the real-time preview is smooth. I exported my CV as PDF and DOCX — both looked flawless.',
    tag: 'Engineering',
  },
  {
    name: 'Fatima Zahra',
    role: 'Graduate Student',
    company: 'Oxford University',
    avatar: 'FZ',
    avatarColor: 'bg-indigo-500',
    rating: 5,
    text: 'As a student with limited budget, the free plan gave me more than enough to create a professional academic CV. The Academic template was exactly what I needed for my PhD applications.',
    tag: 'Academic',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white dark:border-stone-800 dark:from-stone-900 dark:to-black">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mb-4 flex justify-center">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-5xl">
            Loved by Professionals Worldwide
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600 dark:text-stone-400">
            Real stories from real people who landed their dream jobs with FlacronCV
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-stone-500 dark:text-stone-400">
            <span className="font-semibold text-stone-900 dark:text-white">10,000+</span> happy
            users ·
            <span className="font-semibold text-stone-900 dark:text-white">4.9/5</span> average
            rating ·
            <span className="font-semibold text-stone-900 dark:text-white">50,000+</span> CVs
            created
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="break-inside-avoid">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${t.avatarColor}`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
                <Quote className="h-5 w-5 shrink-0 text-brand-300 dark:text-brand-700" />
              </div>
              <StarRating count={t.rating} />
              <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                "{t.text}"
              </p>
              <div className="mt-3">
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                  {t.tag}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200 bg-gradient-to-br from-brand-600 to-brand-700 dark:border-stone-800">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Join thousands of successful professionals
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-200">
            Start building your CV for free — no credit card required.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                className="bg-white text-brand-600 hover:bg-brand-50"
              >
                Start Building Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
