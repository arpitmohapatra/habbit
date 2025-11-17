import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <div className="relative">
      {React.Children.map(children, child =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, open, setOpen, asChild }) => {
  const handleClick = (e) => {
    e.stopPropagation()
    setOpen(!open)
  }

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && !e.target.closest('.dropdown-menu-container')) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [open, setOpen])

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    })
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  )
}

const DropdownMenuContent = ({ children, open, setOpen, align = "end", className }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "dropdown-menu-container absolute z-50 min-w-[12rem] overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 shadow-lg",
            align === "end" ? "right-0" : "left-0",
            "mt-2",
            className
          )}
        >
          {React.Children.map(children, child =>
            React.isValidElement(child) ? React.cloneElement(child, { setOpen }) : child
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const DropdownMenuItem = ({ children, onClick, setOpen, className, disabled }) => {
  const handleClick = (e) => {
    if (disabled) return
    e.stopPropagation()
    if (onClick) onClick(e)
    if (setOpen) setOpen(false)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700",
        className
      )}
    >
      {children}
    </div>
  )
}

const DropdownMenuSeparator = () => {
  return (
    <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}

