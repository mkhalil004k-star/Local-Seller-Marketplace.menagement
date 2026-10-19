import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Trash2, ShoppingBag, ImageOff, Store, Package,
  AlertCircle, SearchX, X,
} from "lucide-react";
import Modal from "../component/Modal";

// Label + input for the Add Product popup (outside Products so inputs keep focus)
function Field({ label, className = "", ...inputProps }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
        {label}
      </label>
      <input
        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
        {...inputProps}
      />
    </div>
  );
}

function Products() {

  let navigate = useNavigate();

  let role = localStorage.getItem("role");

  let [products, setProducts] = useState([]);
  let [loading, setLoading] = useState(true);
  let [showAdd, setShowAdd] = useState(false);
  let [search, setSearch] = useState("");
  let [category, setCategory] = useState("all");
  let [saving, setSaving] = useState(false);
  let [deletingId, setDeletingId] = useState("");
  let [formError, setFormError] = useState("");
  let [pageError, setPageError] = useState("");

  let emptyForm = {
    title: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    imageUrl: ""
  };

  let [form, setForm] = useState(emptyForm);

  let base = import.meta.env.VITE_beckend_base_URL;

  let headers = {
    Authorization: "Bearer " + localStorage.getItem("token")
  };


  // Get Products
  async function getProducts() {

    try {

      let response = await axios.get(
        base + "/product/all",
        {
          headers,
          withCredentials: true
        }
      );

      if (response.data.success) {
        setProducts(response.data.products);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }


  useEffect(function () {
    getProducts();
  }, []);


  // Add Product
  async function addProduct() {

    setFormError("");
    setSaving(true);

    try {

      let response = await axios.post(
        base + "/product/add",
        form,
        {
          headers,
          withCredentials: true
        }
      );

      if (response.data.success) {

        setForm(emptyForm);
        setShowAdd(false);   // popup band
        getProducts();

      } else {

        setFormError(response.data.message || "Could not add product");

      }

    } catch (error) {

      setFormError(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setSaving(false);

    }
  }


  // Delete Product
  async function deleteProduct(id) {

    if (!window.confirm("Delete this product?")) {
      return;
    }

    setPageError("");
    setDeletingId(id);

    try {

      let response = await axios.delete(
        base + "/product/delete",
        {
          headers,
          withCredentials: true,
          data: {
            id: id
          }
        }
      );

      if (response.data.success) {

        await getProducts();

      } else {

        setPageError(response.data.message || "Could not delete product");

      }

    } catch (error) {

      setPageError(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setDeletingId("");

    }
  }


  // Order Now (Buyer) - checkout page par bhejo
  function orderNow(productId) {

    navigate("/checkout/" + productId, {
      state: { quantity: 1 }
    });

  }


  // Input Change
  function change(key) {

    return function (e) {

      setForm({
        ...form,
        [key]: e.target.value
      });

    };
  }


  function openAdd() {
    setFormError("");
    setShowAdd(true);
  }

  function closeAdd() {
    setShowAdd(false);
    setFormError("");
  }


  // Categories come from the products themselves
  let categories = Array.from(
    new Set(products.map(function (p) { return p.category; }).filter(Boolean))
  );

  // Search + category filter (products itself is never changed)
  let text = search.trim().toLowerCase();

  let visibleProducts = products.filter(function (p) {
    let matchesCategory = category === "all" || p.category === category;
    let matchesText =
      (p.title ?? "").toLowerCase().includes(text) ||
      (p.category ?? "").toLowerCase().includes(text) ||
      (p.seller?.name ?? "").toLowerCase().includes(text);
    return matchesCategory && matchesText;
  });


  // Small helper for the stock label under the price
  function stockLabel(stock) {
    if (stock <= 0) return { text: "Out of stock", style: "bg-red-50 text-red-600" };
    if (stock <= 5) return { text: "Only " + stock + " left", style: "bg-amber-50 text-amber-700" };
    return { text: "In stock (" + stock + ")", style: "bg-emerald-50 text-emerald-700" };
  }


  return (

    <div className="min-h-screen w-full bg-neutral-50 p-6 md:p-10">

      <div className="mx-auto max-w-6xl">


        {/* Heading + Add Product button */}

        <div className="anim-fade-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl">
              Products
            </h1>
            <p className="mt-1 text-neutral-500">
              {loading ? "Loading..." : products.length + " products from local sellers."}
            </p>
          </div>


          {role === "seller" && (

            <button
              onClick={openAdd}
              className="flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-500 hover:text-neutral-900 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              <Plus size={18} />
              Add product
            </button>

          )}

        </div>


        {/* Error banner (delete wagera ke liye) */}

        {pageError && (

          <p
            role="alert"
            className="anim-fade-in mb-6 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span className="flex-1">{pageError}</span>
            <button
              onClick={function () {
                setPageError("");
              }}
              className="cursor-pointer text-red-400 hover:text-red-600"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </p>

        )}


        {/* Search + category chips */}

        {products.length > 0 && (

          <div
            style={{ animationDelay: "100ms" }}
            className="anim-fade-up mb-8 flex flex-col gap-4"
          >

            <div className="relative w-full sm:max-w-sm">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={function (e) {
                  setSearch(e.target.value);
                }}
                placeholder="Search by product, category or seller"
                aria-label="Search products"
                className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              />
            </div>

            {categories.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {["all"].concat(categories).map(function (c) {
                  return (
                    <button
                      key={c}
                      onClick={function () {
                        setCategory(c);
                      }}
                      aria-pressed={category === c}
                      className={
                        "shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 " +
                        (category === c
                          ? "bg-neutral-900 text-white shadow"
                          : "bg-white text-neutral-600 ring-1 ring-neutral-200 hover:text-neutral-900")
                      }
                    >
                      {c === "all" ? "All" : c}
                    </button>
                  );
                })}
              </div>
            )}

          </div>

        )}


        {/* Products List */}

        {loading ? (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(function (i) {
              return (
                <div key={i} className="animate-pulse overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200">
                  <div className="h-52 bg-neutral-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-2/3 rounded bg-neutral-200" />
                    <div className="h-4 w-1/3 rounded bg-neutral-200" />
                    <div className="h-10 rounded bg-neutral-100" />
                  </div>
                </div>
              );
            })}
          </div>

        ) : products.length === 0 ? (

          <div className="anim-zoom-in rounded-3xl border border-dashed border-neutral-300 bg-white py-20 text-center">
            <Package className="mx-auto mb-3 text-neutral-300" size={40} />
            <h3 className="text-lg font-semibold text-neutral-900">No products yet</h3>
            <p className="mt-1 text-sm text-neutral-500">
              {role === "seller"
                ? "Add your first product so buyers can find your shop."
                : "Sellers have not added any products yet."}
            </p>
            {role === "seller" && (
              <button
                onClick={openAdd}
                className="mt-6 cursor-pointer rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-500 hover:text-neutral-900 active:scale-95"
              >
                Add your first product
              </button>
            )}
          </div>

        ) : visibleProducts.length === 0 ? (

          <div className="anim-zoom-in rounded-3xl border border-dashed border-neutral-300 bg-white py-16 text-center">
            <SearchX className="mx-auto mb-3 text-neutral-300" size={40} />
            <h3 className="text-lg font-semibold text-neutral-900">No products match your search</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Try a different word or choose another category.
            </p>
            <button
              onClick={function () {
                setSearch("");
                setCategory("all");
              }}
              className="mt-5 cursor-pointer rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-500 hover:text-neutral-900 active:scale-95"
            >
              Clear filters
            </button>
          </div>

        ) : (

          <div
            key={category}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >

            {visibleProducts.map(function (p, i) {

              let outOfStock = (p.stock ?? 0) <= 0;
              let stock = stockLabel(p.stock ?? 0);
              let deleting = deletingId === p._id;

              return (

                <div
                  key={p._id}
                  style={{ animationDelay: Math.min(i, 8) * 70 + "ms" }}
                  className="anim-fade-up group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >


                  {/* Image */}

                  <div className="relative h-52 overflow-hidden bg-neutral-100">

                    {p.imageUrl ? (

                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className={
                          "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 " +
                          (outOfStock ? "opacity-50 grayscale" : "")
                        }
                      />

                    ) : (

                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400">
                        <ImageOff size={32} />
                        <span className="text-sm">No image</span>
                      </div>

                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent" />

                    {p.category && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-800 backdrop-blur">
                        {p.category}
                      </span>
                    )}

                  </div>


                  <div className="flex flex-1 flex-col p-5">

                    <h3 className="truncate text-lg font-bold text-neutral-900">
                      {p.title}
                    </h3>


                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-2xl font-extrabold text-amber-600">
                        Rs {Number(p.price).toLocaleString()}
                      </p>
                      <span className={"rounded-full px-3 py-1 text-xs font-semibold " + stock.style}>
                        {stock.text}
                      </span>
                    </div>


                    {p.description && (

                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                        {p.description}
                      </p>

                    )}


                    <p className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                        <Store size={14} />
                      </span>
                      {p.seller?.name || "Unknown"}
                    </p>


                    <div className="mt-auto flex flex-col gap-2 pt-5">

                      {/* Order Now - Sirf Buyer */}

                      {role === "buyer" && (

                        !outOfStock ? (

                          <button
                            onClick={function () {
                              orderNow(p._id);
                            }}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-500 hover:text-neutral-900 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                          >
                            <ShoppingBag size={16} />
                            Order now
                          </button>

                        ) : (

                          <p className="w-full rounded-xl bg-neutral-100 py-2.5 text-center text-sm font-semibold text-neutral-500">
                            Out of stock
                          </p>

                        )

                      )}


                      {/* Delete */}

                      {(role === "admin" || role === "seller") && (

                        <button
                          disabled={deleting}
                          onClick={function () {
                            deleteProduct(p._id);
                          }}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                        >
                          <Trash2 size={16} />
                          {deleting ? "Deleting..." : "Delete"}
                        </button>

                      )}

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>


      {/* Add Product popup */}

      <Modal
        open={showAdd}
        onClose={closeAdd}
        title="Add product"
      >

        {formError && (

          <p
            role="alert"
            className="anim-fade-in mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {formError}
          </p>

        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <Field
            label="Product title"
            className="md:col-span-2"
            placeholder="e.g. Winter jacket"
            value={form.title}
            onChange={change("title")}
          />

          <Field
            label="Price (Rs)"
            type="number"
            placeholder="0"
            value={form.price}
            onChange={change("price")}
          />

          <Field
            label="Stock"
            type="number"
            placeholder="Items available"
            value={form.stock}
            onChange={change("stock")}
          />

          <Field
            label="Category"
            className="md:col-span-2"
            placeholder="e.g. Clothing"
            value={form.category}
            onChange={change("category")}
          />

          <Field
            label="Image URL"
            className="md:col-span-2"
            placeholder="https://..."
            value={form.imageUrl}
            onChange={change("imageUrl")}
          />

          <Field
            label="Description"
            className="md:col-span-2"
            placeholder="Short details about the product"
            value={form.description}
            onChange={change("description")}
          />

        </div>


        <div className="mt-6 flex gap-3">

          <button
            onClick={addProduct}
            disabled={saving}
            className="flex-1 cursor-pointer rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-500 hover:text-neutral-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add product"}
          </button>

          <button
            onClick={closeAdd}
            className="flex-1 cursor-pointer rounded-xl border border-neutral-300 bg-white py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 active:scale-95"
          >
            Cancel
          </button>

        </div>

      </Modal>

    </div>

  );
}

export default Products;