"use client";

import Link from "next/link";
import { LayoutDashboard, History, Wallet, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  // const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "History", href: "/history", icon: History },
    { name: "Portfolio", href: "/portfolio", icon: Wallet },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex flex-col w-56 bg-card shadow-md h-9/10 p-4 rounded-xl">
        <h2 className="text-xl font-bold mb-6 text-card-foreground">Menu</h2>
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-card-foreground">{item.name}</span>
            </Link>
          ))}
          <div
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="w-6 h-6 text-muted-foreground" />
            <span>Logout</span>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-card shadow-lg border-t border-border flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <item.icon className="w-6 h-6" />
            <span>{item.name}</span>
          </Link>
        ))}
        <div
          className="flex flex-col items-center gap-1 text-xs
          text-muted-foreground hover:text-primary"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-6 h-6" />
          <span>Logout</span>
        </div>
      </div>
    </>
  );
}
