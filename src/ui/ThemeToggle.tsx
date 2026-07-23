import { useUIStore } from '../store/useUIStore';
import { IconButton } from './IconButton';
import { SunIcon, MoonIcon } from './icons';

/** Açıq/tünd tema arasında keçid edir (seçim localStorage-də davam edir). */
export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <IconButton
      title={theme === 'dark' ? 'Açıq temaya keç' : 'Tünd temaya keç'}
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
}
