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
      {/* Banner Section */}
      <section className="pb-12">
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src="/assets/banner.jpg"
            alt="Image banner"
            width={1280}
            height={400}
            className="w-full h-[400px] object-cover rounded-xl"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <h1 className="mb-4 text-3xl font-bold md:text-5xl">
              Preorder Makanan Lezat
            </h1>
            <p className="mb-8 text-xl md:text-2xl">
              Pesan sekarang, nikmati kapan saja. Makanan segar langsung ke
              rumah Anda!
            </p>
            <Link
              href="/product"
              className="px-6 py-3 text-lg font-medium text-green-600 bg-white rounded-lg hover:bg-gray-100"
            >
              Lihat Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container max-w-6xl mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Mengapa Preorder di Kami?
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-6 text-center bg-white rounded-md shadow">
              <div className="mb-4">
                <h3 className="mb-2 text-xl font-bold">Makanan Segar</h3>
              </div>
              <div className="flex justify-center mb-4">
                <Image
                  src="/assets/fresh.jpg"
                  width={128}
                  height={128}
                  alt="Fresh ingredients and colorful vegetables arranged beautifully"
                  className="object-cover w-32 h-32 rounded-full"
                />
              </div>
              <p>
                Kami menggunakan bahan-bahan segar pilihan setiap hari untuk
                memastikan kualitas terbaik.
              </p>
            </div>

            <div className="p-6 text-center bg-white rounded-md shadow">
              <div className="mb-4">
                <h3 className="mb-2 text-xl font-bold">
                  Pengiriman Tepat Waktu
                </h3>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/pengiriman.webp"
                  alt="Fast delivery service with scooter and food package"
                  className="object-cover w-32 h-32 rounded-full"
                />
              </div>
              <p>
                Pesanan Anda akan sampai tepat waktu sesuai dengan jadwal yang
                Anda pilih.
              </p>
            </div>

            <div className="p-6 text-center bg-white rounded-md shadow">
              <div className="mb-4">
                <h3 className="mb-2 text-xl font-bold">Beragam Pilihan</h3>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/beragam.jpg"
                  alt="Variety of delicious foods on a table"
                  className="object-cover w-32 h-32 rounded-full"
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

      {/* Popular Products Section */}
      <section className="py-12">
        <div className="container max-w-6xl mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">Menu Populer</h2>

          <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              return <ProductCard key={p.id} product={p} />;
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/product"
              className="px-6 py-3 font-medium text-green-600 bg-white border border-green-600 rounded hover:bg-green-50"
            >
              Lihat Semua Menu
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="container max-w-6xl mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">Cara Memesan</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold">Pilih Menu</h3>
              <p className="text-muted-foreground">
                Pilih makanan favorit Anda dari berbagai pilihan menu
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold">Masukkan Keranjang</h3>
              <p className="text-muted-foreground">
                Masukkan ke dalam keranjang dan isi form
                pemesanan
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold">Bayar</h3>
              <p className="text-muted-foreground">
                Lakukan pembayaran dengan metode yang tersedia
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold rounded-full bg-primary text-primary-foreground">
                4
              </div>
              <h3 className="mb-2 text-lg font-semibold">Ambil Ditempat</h3>
              <p className="text-muted-foreground">
                Ambil makanan anda di hari Minggu yang ceria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12">
        <div className="container max-w-6xl mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Apa Kata Pelanggan Kami
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="mb-4 italic">
                "Makanannya selalu fresh dan enak. Pengiriman selalu tepat waktu
                sesuai janji. Recommended!"
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 mr-4 overflow-hidden bg-green-600 rounded-full">
                  <Image
                    src="/assets/orang1.jpg"
                    width={48}
                    height={48}
                    alt="Portrait of a smiling young woman"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">Diana S.</p>
                  <p className="text-sm text-gray-600">Pelanggan Setia</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="mb-4 italic">
                "Saya sering preorder untuk acara kantor. Porsinya pas dan
                harganya terjangkau untuk kualitas premium."
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 mr-4 overflow-hidden bg-green-600 rounded-full">
                  <Image
                    src="/assets/orang3.jpg"
                    width={48}
                    height={48}
                    alt="Portrait of a professional man in business attire"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">Budi P.</p>
                  <p className="text-sm text-gray-600">Pelanggan Kantoran</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="mb-4 italic">
                "Sebagai ibu bekerja, preorder makanan sangat membantu. Tidak
                perlu repot masak, tapi keluarga tetap bisa makan enak."
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 mr-4 overflow-hidden bg-green-600 rounded-full">
                  <Image
                    src="/assets/orang2.webp"
                    width={48}
                    height={48}
                    alt="Portrait of a professional man in business attire"
                    className="object-cover w-full h-full"
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
      <section className="py-12">
        <div className="container flex flex-col items-center max-w-4xl mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Dapatkan Info Menu Terbaru
          </h2>
          <p className="mb-8 text-muted-foreground">
            Daftarkan email Anda untuk mendapatkan informasi menu terbaru dan
            promo spesial
          </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col justify-center gap-4 md:flex-row"
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
                className="px-6 py-2 font-medium text-white bg-green-600 rounded-lg hover:bg-green-600"
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
