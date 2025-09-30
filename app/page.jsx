"use client";

import Link from "next/link";
import { useState } from "react";
import { useProduct } from "@/lib/product-context";
import ProductCard from "@/components/features/product/ProductCard";
import Image from "next/image";

const PreorderFoodLandingPage = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    e.preventDefault();
    alert(
      `Terima kasih! Email ${email} telah terdaftar untuk mendapatkan informasi preorder.`
    );
    setEmail("");
  };

  const { products } = useProduct();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Preorder Makanan Lezat
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Pesan sekarang, nikmati kapan saja. Makanan segar langsung ke rumah
            Anda!
          </p>
          <Link
            href="/product"
            className="bg-white text-green-700 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg text-lg"
          >
            Lihat Menu
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Mengapa Preorder di Kami?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Makanan Segar</h3>
              </div>
              <div className="flex justify-center mb-4">
                <Image
                  src="/assets/fresh.jpg"
                  width={128}
                  height={128}
                  alt="Fresh ingredients and colorful vegetables arranged beautifully"
                  className="rounded-full w-32 h-32 object-cover"
                />
              </div>
              <p>
                Kami menggunakan bahan-bahan segar pilihan setiap hari untuk
                memastikan kualitas terbaik.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">
                  Pengiriman Tepat Waktu
                </h3>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/pengiriman.webp"
                  alt="Fast delivery service with scooter and food package"
                  className="rounded-full w-32 h-32 object-cover"
                />
              </div>
              <p>
                Pesanan Anda akan sampai tepat waktu sesuai dengan jadwal yang
                Anda pilih.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Beragam Pilihan</h3>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/beragam.jpg"
                  alt="Variety of delicious foods on a table"
                  className="rounded-full w-32 h-32 object-cover"
                />
              </div>
              <p>
                Dari makanan tradisional hingga internasional, kami punya semua
                yang Anda inginkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Menu Populer</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              return <ProductCard key={p.id} product={p} />;
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/product"
              className="bg-white border border-green-600 text-green-600 hover:bg-green-50 font-medium py-3 px-6 rounded"
            >
              Lihat Semua Menu
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Cara Memesan</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Pilih Menu</h3>
              <p className="text-muted-foreground">
                Pilih makanan favorit Anda dari berbagai pilihan menu
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Masukkan Keranjang</h3>
              <p className="text-muted-foreground">
                Masukkan makanan favorit anda ke dalam keranjang dan isi form
                pemesanan
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Bayar</h3>
              <p className="text-muted-foreground">
                Lakukan pembayaran dengan metode yang tersedia
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-lg mb-2">Ambil Ditempat</h3>
              <p className="text-muted-foreground">
                Ambil makanan anda di hari Minggu yang ceria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Apa Kata Pelanggan Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="italic mb-4">
                "Makanannya selalu fresh dan enak. Pengiriman selalu tepat waktu
                sesuai janji. Recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-600 mr-4 flex-shrink-0 overflow-hidden">
                  <Image
                    src="/assets/orang1.jpg"
                    width={48}
                    height={48}
                    alt="Portrait of a smiling young woman"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">Diana S.</p>
                  <p className="text-sm text-gray-600">Pelanggan Setia</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="italic mb-4">
                "Saya sering preorder untuk acara kantor. Porsinya pas dan
                harganya terjangkau untuk kualitas premium."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-600 mr-4 flex-shrink-0 overflow-hidden">
                  <Image
                    src="/assets/orang3.jpg"
                    width={48}
                    height={48}
                    alt="Portrait of a professional man in business attire"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">Budi P.</p>
                  <p className="text-sm text-gray-600">Pelanggan Kantoran</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="italic mb-4">
                "Sebagai ibu bekerja, preorder makanan sangat membantu. Tidak
                perlu repot masak, tapi keluarga tetap bisa makan enak."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-600 mr-4 flex-shrink-0 overflow-hidden">
                  <Image
                    src="/assets/orang2.webp"
                    width={48}
                    height={48}
                    alt="Portrait of a professional man in business attire"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">Danu W.</p>
                  <p className="text-sm text-gray-600">Pelajar Rantau</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Dapatkan Info Menu Terbaru
          </h2>
          <p className="text-muted-foreground mb-8">
            Daftarkan email Anda untuk mendapatkan informasi menu terbaru dan
            promo spesial
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <div className="flex-1 max-w-md">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              Berlangganan
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PreorderFoodLandingPage;
