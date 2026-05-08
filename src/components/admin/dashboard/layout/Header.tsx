export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-(--color-outline-variant) bg-white px-6">
      <h2 className="text-h2">ClinicalAI</h2>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 rounded-full bg-(--color-error) px-4 py-2 text-white">
          <span className="material-symbols-outlined text-sm">emergency</span>
          Emergency Alert
        </button>

        <span className="material-symbols-outlined">notifications</span>

        <span className="material-symbols-outlined">account_circle</span>
      </div>
    </header>
  );
}
