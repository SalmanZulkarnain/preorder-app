import Banner from "@/components/features/home/Banner";
import Feature from "@/components/features/home/Feature";
import Tutorial from "@/components/features/home/Tutorial";
import Testimonial from "@/components/features/home/Testimonial";
import Subscribe from "@/components/features/home/Subscribe";
import Popular from "@/components/features/home/Popular";

const PreorderFoodLandingPage = () => {

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <Banner />

      {/* Features Section */}
      <Feature />

      {/* Popular Products Section */}
      <Popular />

      {/* How It Works Section */}
      <Tutorial />

      {/* Testimonials Section */}
      <Testimonial />

      {/* Newsletter Section */}
      <Subscribe />
    </div>
  );
};

export default PreorderFoodLandingPage;
