import { Link } from "react-router-dom";
import logo from "../../assets/logo-mktechbail.png";

export default function Logo({ size = 50 }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img
        src={logo}
        alt="MKTech Bail"
        style={{ width: size, height: size }}
        className="object-contain"
      />

      <div>
        <h1 className="text-xl font-bold text-blue-700">
          MKTech Bail
        </h1>

        <p className="text-xs text-slate-500">
          Gestion Immobilière Intelligente
        </p>
      </div>
    </Link>
  );
}