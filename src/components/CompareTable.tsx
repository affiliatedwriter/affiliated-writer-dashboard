"use client";
import React from "react";

/**
 * CompareTable
 * - class: aap-unique-comparison-table (master prompt অনুযায়ী)
 * - columns: Product Image | Product Name | Best For | Check Price
 *
 * props.products: Array<{
 *   image?: string;           // ফাঁকা থাকলে placeholder বসবে
 *   name: string;
 *   bestFor: string;          // 2–4 words
 *   priceUrl?: string;        // affiliate / amazon url
 *   ctaText?: string;         // default: "Check Price"
 *   rel?: string;             // default: "nofollow sponsored"
 * }>
 */
export default function CompareTable({ products = [] }) {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="aap-unique-comparison-wrapper">
      <table className="aap-unique-comparison-table">
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Best For</th>
            <th>Check Price</th>
          </tr>
        </thead>
        <tbody>
          {safeProducts.map((p, idx) => (
            <tr key={idx}>
              <td data-label="Product Image">
                {p?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p?.name || "product image"}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  "[Product Image Placeholder]"
                )}
              </td>

              <td data-label="Product Name">
                {p?.name?.trim() ? p.name : "[Product Name Placeholder]"}
              </td>

              <td data-label="Best For">
                {p?.bestFor?.trim() ? p.bestFor : "[Best For Placeholder]"}
              </td>

              <td data-label="Check Price">
                {p?.priceUrl ? (
                  <a
                    className="aap-cta-button"
                    href={p.priceUrl}
                    target="_blank"
                    rel={p?.rel || "nofollow sponsored"}
                  >
                    {p?.ctaText || "Check Price"}
                  </a>
                ) : (
                  "[Check Price Button Placeholder]"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
