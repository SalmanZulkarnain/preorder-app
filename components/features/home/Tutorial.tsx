const Tutorial = () => {
    return (
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
    )
}

export default Tutorial