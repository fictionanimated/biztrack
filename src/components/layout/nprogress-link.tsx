"use client";

import Link from "next/link";
import NProgress from "nprogress";
import React from "react";
import { usePathname } from "next/navigation";

// A custom Link component that starts NProgress on click for smoother navigation feedback.
const NProgressLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link>
>(({ href, onClick, ...props }, ref) => {
  const pathname = usePathname();
  const newPathname = typeof href === "string" ? href : href.pathname;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't start progress for links to the same page or for new tabs
    if (newPathname === pathname || event.metaKey || event.ctrlKey) {
      if (onClick) onClick(event);
      return;
    }

    NProgress.start();
    if (onClick) {
      onClick(event);
    }
  };

  return <Link href={href} {...props} onClick={handleClick} ref={ref} />;
});
NProgressLink.displayName = "NProgressLink";

export default NProgressLink;
