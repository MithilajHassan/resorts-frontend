interface PaginationProps {
    totalItems: number; 
    limit: number; 
    currentPage: number;
    onPageChange: (page: number) => void; 
    updatePage: (page: number) => void;
  }
  
  const PaginationComponent = ({
    totalItems,
    limit,
    currentPage,
    onPageChange,
    updatePage,
  }: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / limit)
  
    const getPageNumbers = () => {
      const pages: number[] = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    };
  
    return (
      <div className="flex justify-center items-center mt-6 space-x-2">

        <button
          className={`px-3 py-2 rounded-md border ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100 text-gray-600"
          }`}
          disabled={currentPage === 1}
          onClick={() => {
            if (currentPage > 1){
                onPageChange(currentPage - 1)
                updatePage(currentPage - 1)
            }  
          }}
        >
          Previous
        </button>
  

        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`px-3 py-2 rounded-md border ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100 text-gray-600"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
  

        <button
          className={`px-3 py-2 rounded-md border ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100 text-gray-600"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => {
            if (currentPage < totalPages){
                onPageChange(currentPage + 1);
                updatePage(currentPage + 1);
            }
          }}
        >
          Next
        </button>
      </div>
    );
  };
  
  export default PaginationComponent;
  