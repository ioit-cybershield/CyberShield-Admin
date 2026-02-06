type PreviewNavItem = {
  key: string;
  label: string;
  href?: string;
};

export function NavbarPreview({ items }: { items: PreviewNavItem[] }) {
  return (
    <nav className="flex items-center justify-between rounded-xl bg-black px-4 py-2 text-sm text-white">
      <span className="font-semibold tracking-tight">CyberShield</span>
      <div className="flex gap-4">
        {items
          .sort((a, b) => a.key.localeCompare(b.key))
          .map((item) => (
            <a
              key={item.key}
              href={item.href ?? "#"}
              className="text-xs font-medium text-zinc-100 hover:text-amber-300"
            >
              {item.label}
            </a>
          ))}
      </div>
    </nav>
  );
}
