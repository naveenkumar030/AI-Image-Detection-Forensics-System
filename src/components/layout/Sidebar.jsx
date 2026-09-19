import React from "react";
import {
  LayoutDashboard,
  Scan,
  History,
  BarChart3,
  BookOpen,
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, historyCount = 0 }) {
  const navItems = [
    { id: "dashboard",    label: "Dashboard",    shortLabel: "Home",     icon: LayoutDashboard },
    { id: "detection",    label: "RL Detection", shortLabel: "Detect",   icon: Scan,   badge: "Live" },
    { id: "history",      label: "History",      shortLabel: "History",  icon: History, count: historyCount > 0 ? String(historyCount) : null },
    { id: "analytics",    label: "RL Telemetry", shortLabel: "Analytics",icon: BarChart3 },
    { id: "how-it-works", label: "How RL Works", shortLabel: "How It Works", icon: BookOpen },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR (lg+) ─────────────────────────── */}
      {/* Mobile backdrop when drawer is open */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed top-0 left-0 bottom-0 z-50",
          "w-64 glass-panel border-r border-[#b1ada1]/20",
          "flex flex-col",
          "transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="p-5 border-b border-[#b1ada1]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#c15f3c]/10 border border-[#c15f3c]/40 text-[#c15f3c] shrink-0">
              <span className="text-xl font-bold font-mono">◉</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-[#2b2723] font-sans">
                  Veri<span className="text-[#c15f3c]">Lens</span>
                </span>
                <span className="shrink-0 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-bold">
                  RL v4.2
                </span>
              </div>
              <p className="text-[11px] text-[#767167] font-medium tracking-wide truncate">
                AI Image Detection
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#767167] font-semibold">
              Navigation
            </span>
            <span className="text-[10px] font-mono text-[#c15f3c] font-semibold">MDP ENGINE</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={[
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-200 group",
                  isActive
                    ? "text-[#c15f3c] bg-[#c15f3c]/10 border border-[#c15f3c]/40 shadow-sm"
                    : "text-[#767167] hover:text-[#2b2723] hover:bg-[#f4f3ee] border border-transparent hover:border-[#b1ada1]/30",
                ].join(" ")}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#c15f3c]" : "text-[#767167] group-hover:text-[#2b2723]"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#c15f3c] text-white font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#f4f3ee] border border-[#b1ada1]/40 text-[#2b2723] font-semibold">
                      {item.count}
                    </span>
                  )}
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#c15f3c]" />}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV (< lg) ─────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#b1ada1]/30"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 6px)" }}
      >
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={[
                  "relative flex flex-col items-center justify-center gap-0.5",
                  "flex-1 py-2 px-1 min-h-[54px] transition-colors duration-150",
                  isActive ? "text-[#c15f3c]" : "text-[#767167]",
                ].join(" ")}
              >
                {/* Active top bar */}
                {isActive && (
                  <span className="absolute top-0 left-2 right-2 h-[2px] rounded-full bg-[#c15f3c]" />
                )}

                <Icon className="w-[18px] h-[18px] shrink-0" />

                <span
                  className="font-mono font-semibold text-center leading-tight max-w-full overflow-hidden"
                  style={{ fontSize: "9px" }}
                >
                  {item.shortLabel}
                </span>

                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-0.5 right-1 text-[7px] font-mono px-1 rounded-full bg-[#c15f3c] text-white font-bold leading-none">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="absolute top-0.5 right-1 text-[7px] font-mono px-1 rounded-full bg-[#2b2723] text-white font-bold leading-none">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
