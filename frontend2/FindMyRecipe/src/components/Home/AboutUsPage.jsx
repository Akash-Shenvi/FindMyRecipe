import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Helper Components for this page ---

const ValueCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 text-center h-full shadow-sm hover:shadow-lg transition-shadow duration-300">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TeamMemberCard = ({ avatar, name, role }) => (
    <div className="text-center">
        <img src={avatar} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg border-4 border-white"/>
        <h4 className="text-lg font-semibold text-gray-800">{name}</h4>
        <p className="text-orange-600">{role}</p>
    </div>
);

// --- Main About Us Page Component ---

const AboutUsPage = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-gray-50">
      {/* 1. Hero Section */}
      <div className="relative bg-orange-100 text-center py-20 px-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
        >
            <h1 className="text-5xl font-extrabold text-orange-600">Our Culinary Journey</h1>
            <p className="text-xl text-gray-700 mt-4 max-w-2xl mx-auto">
                Connecting kitchens, sharing traditions, and inspiring creativity, one recipe at a time.
            </p>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto py-16 px-6 space-y-20"
      >
        {/* 2. Our Mission Section */}
        <motion.section variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            FindMyRecipe was born from a simple idea: cooking should be a joyful and accessible experience for everyone. In a world full of complex recipes and hard-to-find ingredients, we wanted to create a space that simplifies the culinary process. We leverage the power of AI not to replace the chef, but to be their creative partner, helping you discover amazing dishes you can make with the ingredients you already have.
          </p>
        </motion.section>

        {/* 3. Our Values Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What We Believe In</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon="💡"
              title="Innovation"
              description="Using cutting-edge AI to make recipe discovery and creation effortless and exciting."
            />
            <ValueCard 
              icon="🌍"
              title="Authenticity"
              description="Celebrating diverse culinary traditions and providing recipes that are true to their origins."
            />
            <ValueCard 
              icon="❤️"
              title="Community"
              description="Building a space where food lovers can connect, share their creations, and inspire one another."
            />
          </div>
        </motion.section>

        {/* 4. Meet the Team Section
        <motion.section variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                <TeamMemberCard avatar="https://i.pravatar.cc/150?img=11" name="Priya Sharma" role="Lead Chef & Founder"/>
                <TeamMemberCard avatar="https://i.pravatar.cc/150?img=12" name="Rohan Gupta" role="AI & Tech Lead"/>
                <TeamMemberCard avatar="https://i.pravatar.cc/150?img=5" name="Anjali Mehta" role="Community Manager"/>
            </div>
        </motion.section> */}

        {/* 5. Call to Action Section */}
        <motion.section variants={itemVariants} className="bg-white text-center p-10 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-800">Ready to Start Cooking?</h2>
            <p className="text-gray-600 mt-2 mb-6">Join thousands of home cooks and professional chefs on our platform.</p>
            <div className="flex gap-4 justify-center">
                <Link to="/Recipefind" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-all">
                    Explore Recipes
                </Link>
                <Link to="/upload" className="border border-orange-500 text-orange-600 hover:bg-orange-100 px-8 py-3 rounded-full font-semibold transition-all">
                    Share Your Own
                </Link>
            </div>
        </motion.section>

      </motion.div>
    </div>
  );
};

export default AboutUsPage;