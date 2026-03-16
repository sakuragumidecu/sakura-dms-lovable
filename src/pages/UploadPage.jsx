import AppHeader from "@/components/layout/AppHeader";
import UploadForm from "@/components/upload/UploadForm";
import { motion } from "framer-motion";

export default function UploadPage() {
  return (
    <>
      <AppHeader title="Upload Dokumen" subtitle="Unggah dokumen untuk diproses dan diarsipkan" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 lg:p-8"
      >
        <UploadForm />
      </motion.div>
    </>
  );
}
