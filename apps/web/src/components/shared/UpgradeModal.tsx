'use client';

import { useRouter } from '@/i18n/routing';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Sparkles, Check, Crown } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'ai_credits' | 'exports' | 'templates' | 'cvs' | 'cover_letters';
}

export default function UpgradeModal({ isOpen, onClose, reason = 'ai_credits' }: UpgradeModalProps) {
  const router = useRouter();

  const reasonMessages = {
    ai_credits: {
      title: 'AI Credits Exhausted',
      description: "You've used all your AI credits for this month. Upgrade to Pro or Enterprise for more AI-powered features!",
      icon: Sparkles,
    },
    exports: {
      title: 'Export Limit Reached',
      description: 'Upgrade to unlock unlimited exports and premium features!',
      icon: Crown,
    },
    templates: {
      title: 'Premium Template',
      description: 'This template requires a Pro or Enterprise plan. Upgrade to access all premium templates!',
      icon: Crown,
    },
    cvs: {
      title: 'CV Limit Reached',
      description: 'Upgrade to create unlimited CVs and access premium features!',
      icon: Crown,
    },
    cover_letters: {
      title: 'Cover Letter Limit Reached',
      description: 'Upgrade to create unlimited cover letters and access premium features!',
      icon: Crown,
    },
  };

  const message = reasonMessages[reason];
  const Icon = message.icon;

  const handleUpgrade = () => {
    onClose();
    router.push('/settings/billing');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={message.title} size="md">
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/30">
            <Icon className="h-8 w-8 text-brand-600 dark:text-brand-400" />
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-sm text-stone-600 dark:text-stone-400">
          {message.description}
        </p>

        {/* Pro Features */}
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/50">
          <h4 className="mb-3 font-semibold text-stone-900 dark:text-white">Pro Plan Includes:</h4>
          <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Unlimited AI Credits</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Unlimited CVs & Cover Letters</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>All Premium Templates</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Unlimited Exports (PDF & DOCX)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Priority Support</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            variant="primary"
            onClick={handleUpgrade}
            icon={<Crown className="h-4 w-4" />}
            className="flex-1"
          >
            Upgrade Now
          </Button>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
        </div>
      </div>
    </Modal>
  );
}
