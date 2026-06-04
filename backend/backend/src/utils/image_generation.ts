import config from "../config";
import ApiError from "../errors/api_error";
import httpStatus from "http-status";

const genreImages: { [key: string]: string } = {
  drama: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
  comedy: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop",
  horror: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop",
  romance: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
  "sci-fi": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
  scifi: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
  fantasy: "https://images.unsplash.com/photo-1519074069444-1ba4e66640c2?q=80&w=600&auto=format&fit=crop",
  mystery: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
  adventure: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop",
};

export async function fetchImageURL(
  prompt: string
): Promise<{ imageUrl: string }> {
  const normalized = (prompt || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  let fallbackImage = genreImages.default;
  for (const genre in genreImages) {
    if (normalized.includes(genre)) {
      fallbackImage = genreImages[genre];
      break;
    }
  }

  const accessKey = config.unsplash_key_api;
  if (!accessKey) {
    return { imageUrl: fallbackImage };
  }

  const url = `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(
    prompt
  )}&client_id=${accessKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { imageUrl: fallbackImage };
    }
    const data = await response.json();
    return {
      imageUrl:
        data.results && data.results.length > 0
          ? data.results[0].urls.regular
          : fallbackImage,
    };
  } catch (error) {
    return { imageUrl: fallbackImage };
  }
}
