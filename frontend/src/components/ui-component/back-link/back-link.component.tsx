import { FC } from "react";
import { Link } from "react-router-dom";

interface BackLinkProps {
  to?: string;
  label?: string;
  className?: string;
}

const BackLink: FC<BackLinkProps> = ({
  to = "/",
  label = "Back",
  className = "",
}) => {
  return (
    <Link
      to={to}
      className={`btn-ghost surface-glass ${className}`}
      aria-label={label}
    >
      <i className="fa-solid fa-arrow-left text-sm" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
};

export default BackLink;
