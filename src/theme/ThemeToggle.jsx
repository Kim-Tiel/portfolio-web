import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:border-[var(--accent)]"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
