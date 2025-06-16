import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const NotAvailableComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
        >
          <div className="bg-primary p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <FiClock className="text-white text-3xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold !text-white mb-2">
              Coming Soon!
            </h1>
            <p className="text-white/90">
              We are working hard to bring you this feature
            </p>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-6">
                This module is currently in development. We are excited to
                release it soon!
              </p>

              <div className="relative pt-1 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-green-700">
                    Development Progress
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    65%
                  </span>
                </div>
                <div className="overflow-hidden h-2 bg-gray-200 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-secondary rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/" passHref>
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-accent1 text-white rounded-lg transition-colors"
                >
                  <FiArrowLeft />
                  Return to Home
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NotAvailableComponent;
