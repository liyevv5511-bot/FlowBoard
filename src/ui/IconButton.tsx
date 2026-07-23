import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Alət paneli və digər idarəetmələr üçün ortaq, əlçatan ikon düyməsi.
 * `active` seçili vəziyyəti, `title` isə həm tooltip, həm aria-label rolunu oynayır.
 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
  title: string;
}

export function IconButton({
  children,
  active = false,
  title,
  className = '',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={[
        'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        'disabled:cursor-not-allowed disabled:opacity-40',
        active ? 'bg-accent text-white' : 'text-content hover:bg-surface-2',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
