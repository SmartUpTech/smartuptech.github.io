import ratingsFile from './play-store-ratings.json';

export interface PlayStoreRatingSnapshot {
	score: number;
	ratings: number;
	reviews: number;
	playStoreUrl: string;
}

export interface PlayStoreRatingsFile {
	fetchedAt: string;
	apps: Record<string, PlayStoreRatingSnapshot>;
}

export const playStoreRatings = ratingsFile as PlayStoreRatingsFile;

export function getPlayStoreRating(appSlug: string): PlayStoreRatingSnapshot | undefined {
	return playStoreRatings.apps[appSlug];
}

/** One decimal when needed (e.g. 4 → "4", 4.5 → "4.5"). */
export function formatPlayStoreScore(score: number): string {
	const rounded = Math.round(score * 10) / 10;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatPlayStoreRatingCount(count: number): string {
	return new Intl.NumberFormat('en-IN').format(count);
}
