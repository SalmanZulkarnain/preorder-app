import Image from "next/image"
import Link from 'next/link'

const Banner = () => {
    return (
        <section className="pb-12">
            <div className="relative overflow-hidden rounded-xl">
                <Image
                    priority
                    src="/assets/banner.jpg"
                    alt="Image banner"
                    width={1280}
                    height={400}
                    className="w-full h-[400px] object-cover"
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
    )
}

export default Banner