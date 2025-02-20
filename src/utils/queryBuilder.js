class QueryBuilder {
  constructor() {
    this.params = {}
  }

  withPagination(page, size) {
    this.params.page = page
    this.params.size = size
    return this
  }

  withSort(field, order) {
    this.params.sortField = field
    this.params.sortOrder = order
    return this
  }

  withFilter(filters) {
    this.params.filters = filters
    return this
  }

  build() {
    return this.params
  }
} 