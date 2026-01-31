import { useState } from "react";
import { motion } from "motion/react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-background relative">
      
      {/* Top Right Profile */}
      <div className="absolute top-6 right-6">
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full overflow-hidden border border-border"
          >
            <img
              src={user?.photoURL || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown */}
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-lg shadow-lg p-4 z-50"
            >
              <p className="text-sm text-muted-foreground break-all mb-3">
                {user?.email}
              </p>

              <button
                onClick={handleLogout}
                className="w-full text-sm bg-destructive text-destructive-foreground py-2 rounded-md hover:opacity-90 transition"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Center Content */}
      <div className="flex items-center justify-center min-h-screen">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-bold text-foreground"
        >
          Welcome to <span className="text-accent">Versa</span>
        </motion.h1>
      </div>
    </div>
  );
}
