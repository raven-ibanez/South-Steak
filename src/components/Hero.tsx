import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-steak-black py-24 lg:py-32 px-4">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-pattern opacity-20" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-steak-black via-transparent to-steak-black/40" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-steak-gold/30 bg-steak-gold/5 backdrop-blur-sm animate-fade-in">
          <span className="text-steak-gold text-sm font-semibold tracking-widest uppercase">
            Premium Wagyu & Ribeye
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter animate-fade-in">
          STEAK CRAVINGS?<br />
          <span className="text-steak-gold">I-SOUTH STEAK</span> MO 'YAN!
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up leading-relaxed">
          Experience the finest cuts of meat, perfectly seared and seasoned.
          The ultimate steakhouse experience delivered straight to your door.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up">
          <a
            href="#menu"
            className="w-full sm:w-auto bg-steak-gold text-steak-black px-10 py-4 rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-[0_0_20px_rgba(244,164,30,0.3)]"
          >
            Order Now
          </a>
          <a
            href="#about"
            className="w-full sm:w-auto border border-white/20 text-white px-10 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 font-bold text-lg"
          >
            Our Story
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;