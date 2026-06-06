import Image from 'next/image'

const Testimonial = () => {
  return (
    <section className="py-12">
        <div className="container max-w-6xl mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Apa Kata Pelanggan Kami
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="mb-4 italic">
                &quot;Makanannya selalu fresh dan enak. Pengiriman selalu tepat waktu
                sesuai janji. Recommended!&quot;
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
                &quot;Saya sering preorder untuk acara kantor. Porsinya pas dan
                harganya terjangkau untuk kualitas premium.&quot;
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
                &quot;Sebagai Pelajar Rantau yang sibuk dan jauh dari rumah, preorder makanan sangat membantu. Harganya terjangkau dan rasanya serasa masakan ibu.&quot;
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
  )
}

export default Testimonial