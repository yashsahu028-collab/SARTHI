import { StudentProvider } from "@/lib/services/StudentContext";
import "./dashboard.css";

export const metadata = {
  title: "SARTHI – Student Mission Control Dashboard",
  description: "National meteorological training portal and learning management platform for IMD trainees.",
};

export default function DashboardLayout({ children }) {
  return <StudentProvider>{children}</StudentProvider>;
}
