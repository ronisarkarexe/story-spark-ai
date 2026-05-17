import { FC, ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
  className?: string;
}

const SectionHeading: FC<SectionHeadingProps> = ({
  title,
  description,
  action,
  id,
  className = "",
}) => {
  return (
    <header
      className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div className="min-w-0 max-w-2xl">
        <h2
          id={id}
          className="section-heading text-3xl font-bold tracking-tight text-slate-100"
        >
          {title}
        </h2>
        {description && (
          <p className="section-subheading mt-1.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 sm:pt-1">{action}</div>}
    </header>
  );
};

export default SectionHeading;
