import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import heroImg from './hero.png' // 👈 adjust name/extension to match your file

const CampaignHero = () => {
  return (
    <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20 px-6 md:px-12">
      <div className="container mx-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Empower Dreams with Solana Crowdfunding
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90">
              Fuel innovation, support meaningful causes, and be part of something bigger.
              Discover inspiring campaigns, back passionate creators, and help turn bold ideas into reality.
              Join our community of dreamers, doers, and changemakers today. 🚀💜
            </p>
            <div className="mt-8 flex flex-col md:flex-row items-center md:items-start">
              <Link
                href="/account"
                className="bg-white text-green-600 hover:bg-green-100 font-semibold py-3 px-6
                rounded-lg shadow-md transition-all mb-4 md:mb-0 md:mr-4 w-full md:w-auto text-center"
              >
                Explore Campaigns
              </Link>
              <Link
                href="/create"
                className="text-white bg-green-600 hover:bg-green-700 font-semibold py-3 px-6
                rounded-lg shadow-md transition-all w-full md:w-auto text-center"
              >
                Start a Campaign
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src={heroImg} // 👈 imported image
              alt="Crowdfunding Illustration"
              width={576}
              height={384}
              className="w-full rounded-lg shadow-lg h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CampaignHero
