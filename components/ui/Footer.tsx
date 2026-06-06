export default function Footer() {
  return (
    <footer className="px-6 py-12 text-white bg-green-600 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">Preorder Makanan</h3>
            <p>
              Menyediakan makanan lezat dengan sistem preorder untuk kenyamanan
              Anda.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Kontak Kami</h3>
            <p>Email: info@preordermakanan.com</p>
            <p>Telepon: (021) 1234-5678</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Jam Operasional</h3>
            <p>Senin - Jumat: 08:00 - 20:00</p>
            <p>Sabtu - Minggu: 09:00 - 17:00</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Follow Kami</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">
                Facebook
              </a>
              <a href="#" className="hover:underline">
                Instagram
              </a>
              <a href="#" className="hover:underline">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 text-center border-t border-white/20">
          <p>
            &copy; Copyright {new Date().getFullYear()} Preorder Makanan |
            Salman Zulkarnain | All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
