import AppHeader from "@/components/layout/AppHeader";
import UploadForm from "@/components/upload/UploadForm";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { Info } from "lucide-react";

export default function UploadPage() {
  const { currentUser } = useApp();
  const isOperator = currentUser.role === "Operator/TU";

  return (
    <>
      <AppHeader title="Upload Dokumen" subtitle="Unggah dokumen untuk diproses dan diarsipkan" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 lg:p-8"
      >
        {!isOperator && (
          <div className="flex items-start gap-3 mb-6 p-3 sm:p-4 rounded-lg bg-primary/[0.06] border-l-4 border-primary">
            <Info size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-primary font-medium">Hanya Operator TU yang dapat mengunggah dokumen ke sistem SAKURA</p>
          </div>
        )}
        <UploadForm />
      </motion.div>
    </>
  );
}
