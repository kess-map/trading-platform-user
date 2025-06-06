import { motion } from "framer-motion";

const LoadingSpinner = ({size}) => {
	const sizes = size || 'min-h-screen'
	return (
		<div className={`${sizes} flex items-center justify-center relative overflow-hidden`}>
			<motion.div
				className='w-16 h-16 border-4 border-t-4 border-t-lime-500 border-lime-200 rounded-full'
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			/>
		</div>
	);
};

export default LoadingSpinner;