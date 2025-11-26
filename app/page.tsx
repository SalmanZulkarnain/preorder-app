import Banner from "./components/Banner";
import Feature from "./components/Feature";
import Tutorial from "./components/Tutorial";
import Testimonial from "./components/Testimonial";
import Subscribe from "./components/Subscribe";
import Popular from "./components/Popular";

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
