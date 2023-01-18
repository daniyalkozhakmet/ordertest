import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import placeholderImage from "../utility/place.png";
type NewsPropType = {
  news: {
    title: string;
    description: string;
    image: string;
  };
};
export const News: React.FC<NewsPropType> = ({ news }) => {
  return (
    <div className="border flex flex-col justify-between p-1">
      <h1 className="text-2xl px-1 font-semibold uppercase py-2 text-secondary">
        {news.title}
      </h1>
      <p className="p-1">
        {news.description.length > 100
          ? news.description.slice(0, 100) + "..."
          : news.description}
      </p>
      <div className="py-3 h-3/5 flex flex-col justify-end">
        <LazyLoadImage
          src={news.image}
          className="object-cover object-center h-full w-full"
          height={200}
          placeholderSrc={placeholderImage}
          effect="blur"
          alt="placeholderImage"
        />
      </div>
    </div>
  );
};
