/**
 * Fetches public Google Play rating stats for each app in apps.ts.
 * Output: src/data/play-store-ratings.json (used at site build time).
 *
 * Skip with SKIP_PLAY_RATINGS_SYNC=1 (e.g. offline local builds).
 */
import gplay from 'google-play-scraper';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { apps } from '../src/data/apps.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src/data/play-store-ratings.json');

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

function playPackageId(playStoreUrl: string): string {
	const match = playStoreUrl.match(/[?&]id=([^&]+)/);
	return match?.[1] ?? '';
}

function loadPrevious(): PlayStoreRatingsFile {
	try {
		return JSON.parse(readFileSync(outPath, 'utf8')) as PlayStoreRatingsFile;
	} catch {
		return { fetchedAt: '', apps: {} };
	}
}

async function main() {
	if (process.env.SKIP_PLAY_RATINGS_SYNC === '1') {
		console.log('[sync-play-store-ratings] Skipped (SKIP_PLAY_RATINGS_SYNC=1).');
		return;
	}

	const previous = loadPrevious();
	const appsOut: Record<string, PlayStoreRatingSnapshot> = { ...previous.apps };

	for (const app of apps) {
		const appId = playPackageId(app.playStoreUrl);
		if (!appId) {
			console.warn(`[sync-play-store-ratings] No package id for ${app.id}`);
			continue;
		}

		try {
			const detail = await gplay.app({ appId, lang: 'en', country: 'in' });
			if (detail.score == null || detail.ratings == null) {
				throw new Error('Missing score or ratings in Play response');
			}

			appsOut[app.id] = {
				score: detail.score,
				ratings: detail.ratings,
				reviews: detail.reviews ?? 0,
				playStoreUrl: detail.url ?? app.playStoreUrl,
			};
			console.log(
				`[sync-play-store-ratings] ${app.id}: ${detail.score}★ (${detail.ratings} ratings)`,
			);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			console.warn(`[sync-play-store-ratings] Failed ${app.id}: ${message}`);
		}
	}

	if (Object.keys(appsOut).length === 0) {
		console.error('[sync-play-store-ratings] No rating data available.');
		process.exit(1);
	}

	const payload: PlayStoreRatingsFile = {
		fetchedAt: new Date().toISOString(),
		apps: appsOut,
	};

	writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`);
	console.log(`[sync-play-store-ratings] Wrote ${outPath}`);
}

main();
