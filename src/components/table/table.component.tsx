import React from "react";
import { Skeleton } from ".";
import { useCurrency } from "../currency-list/use-currency";
import { Currency } from "../../models/currency";

const getCurrencyImage = (id: number | string) => {
  return `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;
};

export const Table: React.FC = () => {
  const {
    currencies,
    loading,
    page,
    totalPages,
    handleSort,
    renderCurrencyPrice,
    renderSortIcon,
    decreasePage,
    increasePage,
  } = useCurrency();

  const renderNoDataFound = () => (
    <tr>
      <td className="border px-4 py-2 text-center" colSpan={6}>
        No data found.
      </td>
    </tr>
  );

  const renderSkeletonRow = (idx: number) => (
    <tr key={idx}>
      {[...Array(6)].map((_, idx) => (
        <td key={idx} className="border px-4 py-2">
          <Skeleton width="100%" height="2rem" />
        </td>
      ))}
    </tr>
  );

  const renderCurrencyRow = (currency: Currency, idx: number) => (
    <tr key={currency.id} className={idx % 2 === 0 ? "" : "bg-gray-100"}>
      <td className="border px-4 py-2">
        <div className="flex items-center">
          <img
            className="w-8 h-8 mr-2"
            src={getCurrencyImage(currency.id)}
            alt={currency.name}
          />
          <div>{currency.name}</div>
        </div>
      </td>
      <td className="border px-4 py-2">{currency.symbol}</td>
      <td className="border px-4 py-2">
        {renderCurrencyPrice(currency.quote.USD.price)}
      </td>
      <td className="border px-4 py-2">
        {currency.quote.USD.market_cap.toLocaleString()}
      </td>
      <td
        className={`border px-4 py-2 ${
          currency.quote.USD.percent_change_24h >= 0
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {currency.quote.USD.percent_change_24h.toFixed(2)}%
      </td>
      <td className="border px-4 py-2">
        {currency.quote.USD.volume_24h.toLocaleString()}
      </td>
    </tr>
  );

  const renderTableBody = () => {
    if (loading) {
      return [...Array(10)].map((_, idx) => renderSkeletonRow(idx));
    } else if (currencies.length === 0) {
      return renderNoDataFound();
    } else {
      return currencies.map((currency, idx) =>
        renderCurrencyRow(currency, idx)
      );
    }
  };

  return (
    <>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name {renderSortIcon("name")}
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("symbol")}
            >
              Symbol {renderSortIcon("symbol")}
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("price")}
            >
              Price {renderSortIcon("price")}
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("market_cap")}
            >
              Market Cap {renderSortIcon("market_cap")}
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("percent_change_24h")}
            >
              24h % Change {renderSortIcon("percent_change_24h")}
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("volume_24h")}
            >
              24h Volume {renderSortIcon("volume_24h")}
            </th>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </table>
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={decreasePage}
          disabled={page === 1}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Previous
        </button>
        <div className="text-gray-700 font-bold w-32">
          Page {page} of {loading ? "..." : totalPages}
        </div>
        <button
          onClick={increasePage}
          disabled={page === totalPages}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Next
        </button>
      </div>
    </>
  );
};
