export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPayment } from "@/lib/utils/fetchData";
import { Suspense } from "react";
import TransactionAdminClient from "./TransactionAdminClient";

async function TransactionData() {
  const payments = await getPayment();
  return <TransactionAdminClient initialPayments={payments} />;
}

export default async function TransactionAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold">Transactions</h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm"
                href="/admin/dashboard"
              >
                Home
                <ChevronRight className="w-4" />
              </Link>
            </li>
            <li className="text-sm text-gray-800">Transactions</li>
          </ol>
        </nav>
      </div>

      <Suspense fallback={TransactionSkeleton()}>
        <TransactionData />
      </Suspense>
    </div>
  );
}

function TransactionSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  );
}