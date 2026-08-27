import { panchangArticles } from './articles-panchang';
import { todayArticles } from './articles-today';
import { unitConverterArticles } from './articles-unit-converter';
import { citizenCalculatorArticles } from './articles-citizen-calculator';
import { sindhiTipnoArticles } from './articles-sindhi-tipno';

export interface Article {
	slug: string;
	appId: string; // Links to app.id in apps.ts
	title: string;
	excerpt: string;
	coverImage: string;
	publishDate: string;
	category: string;
	content: string;
	seoTitle?: string;
	seoDescription?: string;
}

export const articles: Article[] = [
	...panchangArticles,
	...todayArticles,
	...unitConverterArticles,
	...citizenCalculatorArticles,
	...sindhiTipnoArticles,
];
