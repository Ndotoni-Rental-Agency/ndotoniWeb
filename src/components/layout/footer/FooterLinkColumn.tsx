import Link from 'next/link';

export type FooterLinkItem = {
  name: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
};

type FooterLinkColumnProps = {
  title: string;
  links: FooterLinkItem[];
};

export function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold text-ink-700 dark:text-gray-100 tracking-[0.18em] uppercase mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.name}>
            {link.onClick ? (
              <button
                type="button"
                onClick={link.onClick}
                className="text-sm text-left text-ink-500 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
              >
                {link.name}
              </button>
            ) : link.external && link.href ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-500 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
              >
                {link.name}
              </a>
            ) : link.href ? (
              <Link
                href={link.href}
                className="text-sm text-ink-500 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
              >
                {link.name}
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
