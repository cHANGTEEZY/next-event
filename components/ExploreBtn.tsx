"use client";

import Image from "next/image";

const ExploreBtn = () => {
  return (
    <button
      id="explore-btn"
      className="mt-7 mx-auto"
      type="button"
      onClick={() => {
        console.log("Hello world");
      }}
    >
      <a href="#event-card">
        Explore Button
        <Image
          src={"/icons/arrow-down.svg"}
          alt="arrow-down"
          width={24}
          height={24}
        />
      </a>
    </button>
  );
};

export default ExploreBtn;
