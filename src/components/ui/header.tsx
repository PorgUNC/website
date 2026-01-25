"use client";

import {Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuToggle,} from "@heroui/navbar";
import { Logo, LogoMobile, LogoTagline } from '@/components/Logo/Logo'
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";

const HeroHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navItems = [
    ["Home", "/"],
    ["Polls", "/polls"],
    ["News", "/posts"],
    ["Methodology", "/methodology"],
    ["About Us", "/about"],
    ["Contact", "/contact"],
    ["Search", "/search"],
  ];

  return (
    <header className="w-full bg-background">
      <Navbar
        className="sm:hidden"
        isBordered
        isBlurred={false}
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      >
        <NavbarContent justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarContent justify="center">
          <Link href="/" className="flex flex-row items-center gap-1">
            <LogoMobile className="h-10" />
          </Link>
        </NavbarContent>

        <NavbarContent justify="end" />

        <NavbarMenu>
          {navItems.map(([label, href]) => (
            <NavbarItem key={label}>
              <Link
                href={href}
                className="text-foreground hover:opacity-80"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarMenu>
      </Navbar>

      <div className="hidden sm:flex flex-col w-full pt-4">

        <div className="hidden sm:flex flex-row w-full pt-4 items-center justify-center">
          <Link href="/" className="flex flex-row items-center gap-2">
            <Logo/>
            <LogoTagline loading="eager" priority="high" className="invert dark:invert-0 w-60 sm:w-80 lg:w-110" />
          </Link>
        </div>


        <Navbar position="static" isBordered isBlurred={false}>
          <NavbarContent />
          <NavbarContent className="flex gap-4" justify="center">
            {navItems.map(([label, href]) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);

              return (
                <NavbarItem
                  key={label}
                  data-active={isActive ? "true" : undefined}
                >
                  <Link
                    href={href}
                    className={`transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-foreground hover:opacity-80"
                    }`}
                  >
                    {label}
                  </Link>
                </NavbarItem>
              );
            })}
          </NavbarContent>
          <NavbarContent />
        </Navbar>
      </div>
    </header>
  );
};

export default HeroHeader;
