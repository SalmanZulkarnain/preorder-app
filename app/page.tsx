import Banner from "@/components/features/marketing/Banner";
import Feature from "@/components/features/marketing/Feature";
import Tutorial from "@/components/features/marketing/Tutorial";
import Testimonial from "@/components/features/marketing/Testimonial";
import Subscribe from "@/components/features/marketing/Subscribe";
import Popular from "@/components/features/marketing/Popular";

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
