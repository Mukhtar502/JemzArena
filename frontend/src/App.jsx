import { useEffect, useState } from "react";
import "./App.css";
import imageOne from "./assets/featured/WhatsApp Image 2026-06-18 at 01.02.32.jpeg";
import imageTwo from "./assets/featured/WhatsApp Image 2026-06-18 at 01.02.33.jpeg";
import imageThree from "./assets/featured/WhatsApp Image 2026-06-30 at 00.05.23 (1).jpeg";
import imageFour from "./assets/featured/WhatsApp Image 2026-06-30 at 00.05.23 (2).jpeg";
import imageFive from "./assets/featured/WhatsApp Image 2026-06-30 at 00.05.23 (3).jpeg";
import imageSix from "./assets/featured/WhatsApp Image 2026-06-30 at 00.05.23 (4).jpeg";
import imageSeven from "./assets/featured/WhatsApp Image 2026-06-30 at 00.05.23 (5).jpeg";
import imageEight from "./assets/featured/WhatsApp Image 2026-06-30 at 00.05.23 (6).jpeg";
import imageNine from "./assets/featured/WhatsApp Image 2026-06-30 at 00.05.23 (7).jpeg";
import imageTen from "./assets/featured/WhatsApp Image 2026-06-30 at 00.05.23.jpeg";

const featuredImages = [
  imageOne,
  imageTwo,
  imageThree,
  imageFour,
  imageFive,
  imageSix,
  imageSeven,
  imageEight,
  imageNine,
  imageTen,
];

const fallbackProducts = [
  {
    name: "Meat Pie",
    description:
      "Flaky pastry filled with seasoned minced beef and warm spices.",
    price: "$15.99",
    tag: "Bestseller",
    image: featuredImages[0],
  },
  {
    name: "Jollof Rice (Signature)",
    description:
      "Classic West-African Jollof, slow-cooked tomato rice with seasoned turkey or chicken.",
    price: "$12.99",
    tag: "House Special",
    image: featuredImages[1],
  },
  {
    name: "Peppered Chicken Platter",
    description:
      "Spicy, charred peppered chicken pieces served with sides — great for sharing.",
    price: "$18.50",
    tag: "Spicy",
    image: featuredImages[2],
  },
  {
    name: "Assorted Buffet Pack",
    description:
      "Chafing-dish style selection of jollof, fried rice, and house sides for events.",
    price: "$29.99",
    tag: "Platter",
    image: featuredImages[3],
  },
  {
    name: "Jollof Meal Pack",
    description:
      "Takeaway tubs of our signature Jollof — ideal for families and catering.",
    price: "$20.00",
    tag: "Family",
    image: featuredImages[4],
  },
  {
    name: "Mixed Rice Bowl",
    description:
      "A hearty bowl with Jollof and fried rice, served with a protein (turkey/chicken).",
    price: "$10.99",
    tag: "Combo",
    image: featuredImages[5],
  },
  {
    name: "Fried Plantain (Dodo)",
    description:
      "Sweet, caramelised fried plantain — a perfect side for many dishes.",
    price: "$4.50",
    tag: "Side",
    image: featuredImages[6],
  },
  {
    name: "Grilled Fish Platter",
    description:
      "Seasoned grilled fish served with plantain, rice and salad — festival-ready.",
    price: "$24.00",
    tag: "Platter",
    image: featuredImages[7],
  },
  {
    name: "Shrimp Spring Rolls",
    description:
      "Crisp spring rolls wrapped around plump shrimp — light and crunchy.",
    price: "$8.50",
    tag: "Starter",
    image: featuredImages[8],
  },
  {
    name: "Puff Puff",
    description:
      "Soft, golden fried dough balls — sweet, pillowy and addictive.",
    price: "$5.99",
    tag: "Dessert",
    image: featuredImages[9],
  },
];

function App() {
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/products?limit=6",
        );
        if (!response.ok) throw new Error("Backend unavailable");

        const data = await response.json();
        const items = Array.isArray(data) ? data : data.items || [];

        if (items.length) {
          setProducts(
            items.slice(0, 10).map((item, index) => ({
              name: item.name,
              description: item.description,
              price: `$${Number(item.price).toFixed(2)}`,
              tag: item.category || "Featured",
              image: featuredImages[index % featuredImages.length],
            })),
          );
        }
      } catch (error) {
        console.info("Using fallback menu:", error);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          JemzArena
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#menu">Menu</a>
          <a href="#story">Story</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="btn btn-dark" href="#menu">
          Order now
        </a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Warm flavors • Crafted for daily cravings</p>
            <h1>Comfort food, styled for the modern table.</h1>
            <p className="lead">
              Discover a polished food-ordering experience with rich colors,
              fast browsing, and a mobile-first layout built for every screen.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#menu">
                Explore menu
              </a>
              <a className="btn btn-outline" href="#story">
                Our story
              </a>
            </div>
            <ul className="hero-highlights">
              <li>Freshly prepared favorites</li>
              <li>Fast checkout experience</li>
              <li>Responsive across mobile, tablet, and desktop</li>
            </ul>
          </div>

          <div className="hero-card" aria-label="Featured item">
            <div className="hero-card-top">
              <p>Tonight’s spotlight</p>
              <h2>Spiced beef suya bowl</h2>
            </div>
            <div className="meal-preview">
              <div className="meal-badge">Chef pick</div>
              <div className="meal-text">
                <strong>Smoky spice</strong>
                <span>Rice, greens, and house sauce</span>
              </div>
            </div>
          </div>
        </section>

        <section className="stats" aria-label="Highlights">
          <article>
            <strong>12+</strong>
            <span>signature dishes</span>
          </article>
          <article>
            <strong>24/7</strong>
            <span>day-to-day ordering</span>
          </article>
          <article>
            <strong>100%</strong>
            <span>mobile responsive</span>
          </article>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-title">
            <p className="eyebrow">Featured picks</p>
            <h2>Built for cravings and easy browsing.</h2>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-visual">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    product.name
                  )}
                </div>
                <div className="product-meta">
                  <span className="eyebrow">{product.tag}</span>
                  <strong>{product.price}</strong>
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <a className="btn btn-outline" href="#contact">
                  Add to order
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="story-card">
            <p className="eyebrow">Why JemzArena</p>
            <h2>A food experience with warmth, clarity, and comfort.</h2>
            <p>
              We blend earthy colors, generous spacing, and intuitive navigation
              to create an ordering experience that feels inviting on every
              device.
            </p>
            <a className="btn btn-primary" href="#contact">
              Get started
            </a>
          </div>
        </section>
      </main>

      <footer id="contact">
        <p>JemzArena • Designed for joyful, responsive ordering.</p>
      </footer>
    </div>
  );
}

export default App;
