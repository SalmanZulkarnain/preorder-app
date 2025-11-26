import Image from 'next/image'

const Feature = () => {
  return (
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
                <Image
                  width={128}
                  height={128}
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
                <Image
                  width={128}
                  height={128}
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
  )
}

export default Feature