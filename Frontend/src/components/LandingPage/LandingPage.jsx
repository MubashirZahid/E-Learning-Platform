import React from 'react';
import Courses from '../features/Landing/Courses';
import HeroSection from '../features/Landing/HeroSection';
import Stats from '../features/Landing/Stats';
import Navbar from '../layout/nav/navbar';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      {/* <Stats /> */}
      <Courses />
    </>
  );
}
