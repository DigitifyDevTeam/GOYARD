import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type RobotsMetaProps = {
  shouldNoindex: (pathname: string) => boolean;
};

function upsertRobotsMeta(content: string) {
  let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

export default function RobotsMeta({ shouldNoindex }: RobotsMetaProps) {
  const location = useLocation();

  useEffect(() => {
    if (shouldNoindex(location.pathname)) {
      upsertRobotsMeta("noindex,follow");
      return;
    }

    const existing = document.querySelector('meta[name="robots"]');
    existing?.remove();
  }, [location.pathname, shouldNoindex]);

  return null;
}

