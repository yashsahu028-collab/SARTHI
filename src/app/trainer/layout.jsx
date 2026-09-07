import { TrainerProvider } from "@/lib/services/TrainerContext";
import "@/app/dashboard/dashboard.css";
import "./trainer.css";

export const metadata = {
  title: "SARTHI – Faculty & Trainer Mission Control",
  description: "National meteorological capacity building and instructor command center for IMD trainers and scientists.",
};

export default function TrainerLayout({ children }) {
  return <TrainerProvider>{children}</TrainerProvider>;
}
