interface Filter {
  name: string;
}

interface SearchQuery {
  query: string;
  filter: string | null;
}

export { Filter, SearchQuery };
