import React, { useState } from "react";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

/**
 * PasswordInput - A reusable password input with show/hide toggle and accessibility support.
 * Props:
 *   id, name, value, onChange, placeholder, required, className, ...rest
 */
const PasswordInput = React.forwardRef(function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Password",
  required = false,
  className = "",
  ...rest
}, ref) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      <input
        ref={ref}
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-label={placeholder}
        className="w-full px-4 py-2 pr-12 rounded bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        {...rest}
      />
      <motion.button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        tabIndex={0}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          setShow((s) => !s);
        }}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.1 }}
      >
        {show ? (
          <EyeSlashIcon className="h-5 w-5 transition-all" />
        ) : (
          <EyeIcon className="h-5 w-5 transition-all" />
        )}
      </motion.button>
    </div>
  );
});

export default PasswordInput;
