import React from 'react';
import banner from '../../../assets/images/banner.png'; 

export default function HeroSection() {
    return (
        <img 
            src={banner} 
            alt=""
            style={{
                width: "100%",
                height: "50vh"
            }}
            />
    );
}