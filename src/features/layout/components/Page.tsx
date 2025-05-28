import React from "react";

import { Header } from "./Header";
import "./Page.css";

type User = {
  name: string;
};

/**
 * Page component for main content layout
 * Styled with the Ararat OIL olive-lime color palette (#000000, #3E432E, #616F39, #A7D129)
 */
export const Page: React.FC = () => {
  const [user, setUser] = React.useState<User>();

  return (
    <article>
      <Header
        user={user}
        onLogin={() => setUser({ name: "Jane Doe" })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setUser({ name: "Jane Doe" })}
      />

      <section className="storybook-page">
        <h2>Ararat OIL Component Library</h2>
        <p>
          Welcome to the Ararat OIL component library. This component showcase
          follows a{" "}
          <a
            href="https://componentdriven.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>component-driven</strong>
          </a>{" "}
          architecture.
        </p>
        <p>
          Our components use the olive-lime color palette (#000000, #3E432E,
          #616F39, #A7D129) and follow a feature-based architecture to maximize
          reusability and maintainability.
        </p>
        <ul>
          <li>
            <strong>Core components</strong> - Fundamental UI building blocks
            with consistent styling
          </li>
          <li>
            <strong>Feature components</strong> - Domain-specific components for
            business functionality
          </li>
          <li>
            <strong>Layout components</strong> - Structural components for page
            organization
          </li>
        </ul>
        <p>
          Explore our component library to see how we've implemented a
          consistent design system across the entire application.
        </p>
        <div className="tip-wrapper">
          <span className="tip">Tip</span> Use the Storybook sidebar to navigate
          between components
        </div>
      </section>
    </article>
  );
};
