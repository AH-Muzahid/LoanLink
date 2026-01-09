import { motion } from 'framer-motion';

const Reveal = ({ children, delay = 0, className = "", duration = 0.5, y = 30 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: duration, delay: delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default Reveal;
