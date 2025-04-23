import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowRight, Fuel, Calculator, CreditCard, BarChart4, Users, Coffee, Truck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-background">
          {/* Background Image - more subtle opacity */}
          <div 
            className="absolute inset-0 z-[-1] opacity-15 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-fuel-station.jpg')" }}
          />
        </div>
        <div className="container relative z-10 px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Fuel Partner for <span className="text-accent font-light">Every Journey</span>
            </h1>
            <p className="text-lg md:text-xl text-text-base/80">
              Ararat OIL provides premium fuel solutions with cutting-edge technology
              for businesses and consumers alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" className="gap-2 font-medium bg-accent text-accent-foreground hover:bg-accent/90 shadow-none">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 font-medium border-primary/10 bg-transparent hover:bg-primary/5">
                Download App <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-10">
              <img src="/app-store.svg" alt="App Store" className="h-12 cursor-pointer hover:opacity-80 transition-opacity" />
              <img src="/google-play.svg" alt="Google Play" className="h-12 cursor-pointer hover:opacity-80 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Features</h2>
            <p className="text-lg text-text-base/60 max-w-2xl mx-auto">
              Comprehensive fuel management solutions for every need
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Fuel Types",
                description: "Premium quality fuels for optimal performance",
                icon: <Fuel className="h-8 w-8" />,
              },
              {
                title: "Filling Systems",
                description: "Advanced technology for efficient service",
                icon: <Truck className="h-8 w-8" />,
              },
              {
                title: "Max Drive",
                description: "Loyalty program for regular customers",
                icon: <CreditCard className="h-8 w-8" />,
              },
              {
                title: "Max Café",
                description: "Refreshments while you refuel",
                icon: <Coffee className="h-8 w-8" />,
              },
            ].map((feature, index) => (
              <Card 
                key={index}
                className="transition-all duration-300 bg-background hover:bg-primary/5 border border-primary/5"
              >
                <CardHeader className="pb-2">
                  <div className="w-14 h-14 rounded-full mb-4 bg-accent/10 flex items-center justify-center text-accent">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-base/70">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="p-0 hover:bg-transparent hover:text-accent gap-1 text-primary/70">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Cards Section */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-text-base/60 max-w-2xl mx-auto">
              Comprehensive solutions for fuel management and business operations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Inventory Management",
                description: "Real-time tracking of fuel levels and automated reordering systems",
                icon: <Calculator className="h-6 w-6" />,
              },
              {
                title: "Sales & Revenue",
                description: "Advanced POS systems and detailed sales analytics dashboard",
                icon: <BarChart4 className="h-6 w-6" />,
              },
              {
                title: "Real-Time Reports",
                description: "Comprehensive reporting with actionable insights for your business",
                icon: <CreditCard className="h-6 w-6" />,
              },
            ].map((service, index) => (
              <div 
                key={index} 
                className="rounded-xl p-8 bg-background transition-all duration-300 border border-primary/5 hover:border-primary/10"
              >
                <div className="w-12 h-12 rounded-full mb-6 bg-accent flex items-center justify-center text-accent-foreground">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-text-base/70 mb-6">{service.description}</p>
                <Button variant="ghost" className="p-0 hover:bg-transparent hover:text-accent gap-1">
                  Explore service <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Integration Section */}
      <section className="py-20 bg-primary">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Manage Your Fuel Business Anywhere</h2>
              <p className="text-white/80 mb-8 text-lg">
                Our mobile app puts the power of comprehensive fuel management in your pocket,
                with real-time data and controls at your fingertips.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Track sales and inventory in real-time",
                  "Manage tanks and monitor fuel levels",
                  "View profits and generate reports",
                  "Receive alerts and notifications",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 mt-0.5 rounded-full bg-accent flex-shrink-0 flex items-center justify-center text-accent-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Download App
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/10 blur-2xl rounded-full transform scale-110" />
                <img 
                  src="/app-mockup.png" 
                  alt="Ararat Oil Mobile App" 
                  className="relative z-10 max-w-full max-h-[600px] rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story / People */}
      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About Ararat Oil</h2>
              <p className="text-lg text-text-base/70 mb-6">
                At Ararat Oil, we're more than just a fuel provider. We're a trusted partner
                committed to powering your journey with quality fuels and exceptional service.
              </p>
              <p className="text-lg text-text-base/70 mb-6">
                Founded in 2015, we've grown from a single station to a network of over 45 locations
                across the region, serving thousands of customers daily with our premium products.
              </p>
              <div className="mt-8">
                <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  Our Story <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden shadow-neumorphic">
                <img src="/team-1.jpg" alt="Team" className="w-full h-auto" />
              </div>
              <div className="rounded-lg overflow-hidden shadow-neumorphic mt-8">
                <img src="/station-1.jpg" alt="Station" className="w-full h-auto" />
              </div>
              <div className="rounded-lg overflow-hidden shadow-neumorphic mt-4">
                <img src="/station-2.jpg" alt="Station" className="w-full h-auto" />
              </div>
              <div className="rounded-lg overflow-hidden shadow-neumorphic">
                <img src="/team-2.jpg" alt="Team" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News / Blog */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News</h2>
            <p className="text-lg text-text-base/70 max-w-2xl mx-auto">
              Stay updated with the latest from Ararat Oil
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "New Station Opening in Downtown",
                date: "April 15, 2025",
                image: "/news-1.jpg",
                description: "We're excited to announce the opening of our newest station in the heart of downtown.",
              },
              {
                title: "Introducing Our New Premium Fuel Line",
                date: "March 28, 2025",
                image: "/news-2.jpg",
                description: "Our new premium fuel formula provides better performance and improved efficiency.",
              },
              {
                title: "Partnership with Local Businesses",
                date: "February 10, 2025",
                image: "/news-3.jpg",
                description: "Ararat Oil partners with local businesses to provide exclusive discounts to customers.",
              },
            ].map((news, index) => (
              <Card 
                key={index} 
                className="overflow-hidden transition-all duration-300 border border-primary/5 hover:border-primary/10"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="text-sm text-text-base/60 mb-2">{news.date}</div>
                  <CardTitle className="text-xl">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-base/70">{news.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="p-0 hover:bg-transparent hover:text-accent gap-1">
                    Read more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" className="gap-2 border-primary/10 hover:bg-primary/5">
              View All News <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Fuel Your Business Growth?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Join our network of successful partners and take advantage of our cutting-edge
              fuel management solutions and support services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="gap-2 font-semibold bg-accent text-accent-foreground hover:bg-accent/90">
                Become a Partner <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 font-semibold bg-transparent text-white border-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background text-primary pt-16 pb-8 border-t border-primary/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Ararat Oil</h3>
              <p className="text-primary/70 mb-4">
                Your trusted partner for premium fuel solutions and business management systems.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <a 
                    key={social}
                    href={`#${social}`}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Products</h3>
              <ul className="space-y-2">
                {["Fuel Types", "Filling Systems", "Max Drive", "Max Café", "Mobile App"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 hover:text-accent transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Careers", "Partners", "Blog", "Contact Us"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 hover:text-accent transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Subscribe</h3>
              <p className="text-primary/70 mb-4">
                Stay updated with our latest news and updates.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-primary/10 border-0 rounded-l-md p-2 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <Button className="rounded-l-none bg-accent text-accent-foreground hover:bg-accent/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-primary/50 text-sm">
              © {new Date().getFullYear()} Ararat Oil. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#" className="text-primary/50 hover:text-primary text-sm">Privacy Policy</a>
              <a href="#" className="text-primary/50 hover:text-primary text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
