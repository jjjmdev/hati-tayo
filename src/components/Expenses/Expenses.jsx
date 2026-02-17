// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { UserRound, Plus } from 'lucide-react'

function Expenses() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      Expenses
    </motion.div>
  )
}

export default Expenses
