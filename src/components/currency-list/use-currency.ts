import React from "react";
import { Currency, CurrencyListLatestParams } from "../../models/currency";

async function fetchData(
  params: CurrencyListLatestParams,
  signal: AbortSignal
) {
  const query = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  try {
    const response = await fetch(
      `/api/cryptocurrency/listings/latest?${query}`,
      { signal }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

export const useCurrency = () => {
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [sort, setSort] = React.useState("market_cap");
  const [sortDir, setSortDir] = React.useState("desc");

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    fetchData(
      {
        start: (page - 1) * 10 + 1,
        limit: 10,
      },
      signal
    ).then((data) => {
      setCurrencies(data.data);
      setTotalPages(Math.ceil(data.status.total_count / 10));
      setLoading(false);
    });

    return () => {
      controller.abort();
    };
  }, [page]);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page");
    if (pageParam) {
      const newPage = parseInt(pageParam);
      setPage(newPage);
    }
  }, []);

  const sortedCurrencies = React.useMemo(() => {
    return currencies.sort((a, b) => {
      if (sortDir === "asc") {
        if (sort === "name") {
          return a.name.localeCompare(b.name);
        } else if (sort === "symbol") {
          return a.symbol.localeCompare(b.symbol);
        } else {
          return (
            a.quote.USD[sort as keyof typeof a.quote.USD] -
            b.quote.USD[sort as keyof typeof b.quote.USD]
          );
        }
      } else {
        if (sort === "name") {
          return b.name.localeCompare(a.name);
        } else if (sort === "symbol") {
          return b.symbol.localeCompare(a.symbol);
        } else {
          return (
            b.quote.USD[sort as keyof typeof b.quote.USD] -
            a.quote.USD[sort as keyof typeof a.quote.USD]
          );
        }
      }
    });
  }, [currencies, sort, sortDir]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.history.pushState(
      { page: newPage },
      `Page ${newPage}`,
      `?page=${newPage}`
    );
  };

  const increasePage = () => {
    handlePageChange(page + 1);
  };

  const decreasePage = () => {
    handlePageChange(page - 1);
  };

  const handleSort = (column: string) => {
    if (sort === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSort(column);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (column: string) => {
    if (sort === column) {
      return sortDir === "asc" ? "▲" : "▼";
    } else {
      return "";
    }
  };

  const renderCurrencyPrice = (price: number) => {
    if (price < 1) {
      const precision = 3 - Math.floor(Math.log10(price));
      return price.toFixed(precision);
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return {
    currencies: sortedCurrencies,
    page,
    totalPages,
    loading,
    increasePage,
    decreasePage,
    handleSort,
    renderSortIcon,
    renderCurrencyPrice,
  };
};
