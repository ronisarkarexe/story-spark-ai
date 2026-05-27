"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Breadcrumbs({ paths }) {
  return (
    <nav className="flex items-center text-sm text-gray-600 dark:text-gray-300" aria-label="Breadcrumb">
      {paths.map((path, index) => (
        <div key={index} className="flex items-center">
          <Link
            href={path.href}
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            {path.name}
          </Link>
          {index !== paths.length - 1 && (
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      ))}
    </nav>
  );
}