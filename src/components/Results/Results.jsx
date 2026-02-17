// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

function Result() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      Results
    </motion.div>
  )
}

export default Result
