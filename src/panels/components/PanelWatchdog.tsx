import { useEffect } from "react";

type Props = {
  postMessage: (message: any) => void;
  children: any;
};

export default function PanelWatchdog({ postMessage, children }: Props) {
  useEffect(() => {
    const intervalId = setInterval(() => postMessage({ ping: true }), 500);
    return () => clearInterval(intervalId);
  });
  return children;
}
