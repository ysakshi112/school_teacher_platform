export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Approval Pending ⏳
        </h1>

        <p className="text-gray-600">
          Your account is under review.
          <br />
          You will be able to access the dashboard once approved.
        </p>

        <p className="text-sm text-gray-400 mt-4">
          Please check back later.
        </p>
      </div>
    </div>
  );
}
