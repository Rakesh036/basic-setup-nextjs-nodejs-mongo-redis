export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 m-auto">
    {/* // <html lang="en"> */}
    {/* //   <body> */}
        {/* <header className="sticky top-0 bg-white shadow-sm z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <h1 className="text-xl font-bold">Alumni Portal</h1>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="/" className="hover:text-blue-600">Home</a></li>
                <li><a href="#" className="font-medium text-blue-600">Groups</a></li>
                <li><a href="#" className="hover:text-blue-600">Events</a></li>
                <li><a href="#" className="hover:text-blue-600">Directory</a></li>
              </ul>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-sm px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                Sign In
              </button>
            </div>
          </div>
        </header> */}
        <main className="container mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
      
    {/* //   </body> */}
        {/* // </html> */}
    </div>
  );
}