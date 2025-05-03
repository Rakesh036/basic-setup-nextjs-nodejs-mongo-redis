'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  const { theme = 'system', resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders after hydration to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to dark theme if device is in dark mode
  const actualTheme = mounted ? resolvedTheme || theme : 'dark';

  // Define dark mode specific styles that will override Sonner's defaults
  const isDarkMode = actualTheme === 'dark';

  return mounted ? (
    <Sonner
      theme={actualTheme}
      className="toaster group"
      closeButton
      richColors
      expand={true}
      position="top-center"
      toastOptions={{
        classNames: {
          toast: `group toast group-[.toaster]:shadow-lg group-[.toaster]:min-w-[400px] group-[.toaster]:px-6 group-[.toaster]:py-4
                 ${isDarkMode ? 'group-[.toaster]:bg-[oklch(0.18_0.035_266)] group-[.toaster]:text-[oklch(0.98_0.01_248)] group-[.toaster]:border-[oklch(0.3_0.02_265/30%)]' : ''}`,
          title: 'group-[.toast]:text-lg group-[.toast]:font-semibold',
          description: `group-[.toast]:text-base group-[.toast]:mt-2 ${isDarkMode ? 'group-[.toast]:text-[oklch(0.7_0.04_256)]' : 'group-[.toast]:text-muted-foreground'}`,
          actionButton: `group-[.toast]:text-base group-[.toast]:py-2 group-[.toast]:px-4 ${isDarkMode ? 'group-[.toast]:bg-[oklch(0.65_0.18_265)] group-[.toast]:text-[oklch(0.98_0.01_248)]' : 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground'} group-[.toast]:hover:opacity-90`,
          cancelButton: `group-[.toast]:text-base ${isDarkMode ? 'group-[.toast]:bg-[oklch(0.22_0.03_260)] group-[.toast]:text-[oklch(0.98_0.01_248)]' : 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'} group-[.toast]:hover:opacity-90`,
          closeButton: `${isDarkMode ? 'group-[.toast]:text-[oklch(0.98_0.01_248/50%)] group-[.toast]:hover:text-[oklch(0.98_0.01_248)]' : 'group-[.toast]:text-foreground/50 group-[.toast]:hover:text-foreground'} group-[.toast]:scale-125`,
          loader: 'group-[.toast]:scale-125',
        },
        duration: 2000,
        style: {
          fontSize: '120px',
          borderRadius: '20px',
          fontWeight: '500',
        },
      }}
      style={{
        ...(isDarkMode && {
          '--normal-bg': 'oklch(0.18 0.035 266)',
          '--normal-text': 'oklch(0.98 0.01 248)',
          '--normal-border': 'oklch(0.3 0.02 265 / 30%)',

          '--success-bg': 'oklch(0.2 0.07 140)',
          '--success-text': 'oklch(0.9 0.12 140)',
          '--success-border': 'oklch(0.3 0.1 140 / 30%)',

          '--error-bg': 'oklch(0.25 0.08 25)',
          '--error-text': 'oklch(0.9 0.1 25)',
          '--error-border': 'oklch(0.4 0.15 25 / 30%)',

          '--info-bg': 'oklch(0.2 0.05 230)',
          '--info-text': 'oklch(0.85 0.1 230)',
          '--info-border': 'oklch(0.3 0.08 230 / 30%)',

          '--warning-bg': 'oklch(0.25 0.09 85)',
          '--warning-text': 'oklch(0.9 0.15 85)',
          '--warning-border': 'oklch(0.4 0.12 85 / 30%)',
        }),
      }}
      {...props}
    />
  ) : null;
};

export { Toaster };
