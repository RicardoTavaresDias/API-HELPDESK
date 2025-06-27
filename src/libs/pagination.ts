type PaginationType = {
  next?: number
  previous?: number
  totalPage: number
  skip: number
}

export const pagination = (page: number, totalItems: number, limit: number) => {
  const pagination: PaginationType = { 
    totalPage: Math.ceil(totalItems / limit), // Page Total
    skip: (page - 1) * limit // current page
  }

  if(page > 1) pagination.previous = page - 1 // Previous
  if(page < totalItems) pagination.next = page + 1 // Next
  
  return pagination
}