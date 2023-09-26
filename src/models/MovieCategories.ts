// MovieCategories.ts

// Define the MovieCategory enum
export enum MovieCategory {
  Action = 28,
  Adventure = 12,
  Animation = 16,
  Comedy = 35,
  Crime = 80,
  Documentary = 99,
  Drama = 18,
  Family = 10751,
  Fantasy = 14,
  History = 36,
  Horror = 27,
  Music = 10402,
  Mystery = 9648,
  Romance = 10749,
  ScienceFiction = 878,
  TVMovie = 10770,
  Thriller = 53,
  War = 10752,
  Western = 37,
}

// Define the function to get categories by numbers
// MovieCategories.ts

// Define the function to get categories by numbers
export function getCategoriesByNumbers(numbers: number[] = []): string {
  if (!Array.isArray(numbers)) {
    return "Others";
  }

  const categories = numbers.map((number) => {
    const category = Object.keys(MovieCategory).find(
      (key) => MovieCategory[key as keyof typeof MovieCategory] === number
    );
    return category || "Others";
  });

  return categories.join(", ");
}
export function extractRuntimeFromURL(url: string): string | null {
  if (!url) return "01:00";
  const matches = url.match(/\/(\d+)min\.mp4/);

  if (matches && matches.length >= 2) {
    const durationMinutes = parseInt(matches[1], 10);
    return `${durationMinutes} `;
  }

  return "01:00";
}
