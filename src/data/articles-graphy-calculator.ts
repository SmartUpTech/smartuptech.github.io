import type { Article } from './articles';

export const graphyCalculatorArticles: Article[] = [
	{
		slug: 'graphy-calculator-app-guide',
		appId: 'graphy-calculator',
		title: 'Graphy Calculator: Calculate Fast, Understand Deeply',
		excerpt: 'The smart calculator that preserves your fast workflows and adds Graphy — visual explanations showing exactly how every answer was built.',
		coverImage: '/blog/graphy-calculator/graphy-calculator-app-guide-cover.webp',
		publishDate: '2026-09-06',
		category: 'App Guide',
		seoTitle: 'Graphy Calculator App | Visual Math, Unit Conversion & Graphy Engine',
		seoDescription: 'Graphy Calculator combines fast calculations, 100+ unit conversions, and Graphy visual explanations. See flowcharts, blocks, and charts for every result.',
		content: `
			<h2>More Than a Calculator — A Visual Math Companion</h2>
			<p><strong>Graphy Calculator</strong> is SmartUp Tech's next evolution of everyday calculation. It keeps everything you already rely on — a fast calculator, comprehensive unit converter, scientific keypad, and offline-ready performance — and adds something entirely new: <strong>Graphy</strong>, a visual explanation engine that shows you <em>how</em> every answer was produced.</p>

			<p>The core promise is simple: <strong>Existing calculation → same result → optional Graphy explanation.</strong> Your calculator workflows stay exactly as fast as before. When you want deeper understanding, open Graphy and watch your result transform into a clear visual story.</p>

			<h2>Five Tabs, One Unified Experience</h2>
			<p>Graphy Calculator is organized around five intuitive sections:</p>
			<ul>
				<li><strong>Calculate</strong> — Percentage, BMI, GST, Discount, EMI, Scientific, and more specialized calculators</li>
				<li><strong>Convert</strong> — Length, weight, temperature, area, volume, currency, and 100+ measurement categories</li>
				<li><strong>Explore</strong> — Discover calculators by category and find the right tool for your task</li>
				<li><strong>Favourites</strong> — Pin the calculators you use most for instant access</li>
				<li><strong>History</strong> — Review past calculations with full context and re-open Graphy views</li>
			</ul>

			<h2>The Graphy Engine: Visual Explanations for Every Result</h2>
			<p>At the heart of Graphy Calculator is the <strong>Graphy Engine</strong> — a shared visual layer that transforms any calculation result into structured, semantic visualizations. Graphy never recalculates your answer. It consumes the same evaluated model as the calculator and renders it through your choice of visual renderer.</p>

			<h3>Available Renderers</h3>
			<ul>
				<li><strong>Flowchart</strong> — Connected nodes showing input → formula → result (universal fallback for every calculator)</li>
				<li><strong>Blocks</strong> — Color-coded stacked blocks breaking formulas into digestible pieces</li>
				<li><strong>Gauge</strong> — Arc indicators for percentage, BMI, and bounded decision ranges</li>
				<li><strong>Charts</strong> — Pie and bar charts for financial breakdowns like EMI amortization</li>
				<li><strong>Timeline & XY</strong> — Coming progressively for date and graph-based calculations</li>
			</ul>

			<h2>One Calculation Path — Zero Drift</h2>
			<p>A foundational rule of Graphy Calculator: <strong>calculator and Graphy share one calculation path.</strong> Graphy visualizes the same BigDecimal-precision result. It never independently computes a different number. This guarantees that what you see in the result field is exactly what Graphy explains — building trust and making verification effortless.</p>

			<h2>Built for Students, Professionals, and Everyday Life</h2>
			<p>Whether you are a student checking a percentage problem, a traveler converting kilometers to miles, a health-conscious user tracking BMI, or a homebuyer evaluating EMI options — Graphy Calculator meets you where you are. Fast when you need speed. Visual when you need clarity.</p>

			<h3>Key Features</h3>
			<ul>
				<li>Graphy visual engine with multiple renderers (flowchart, blocks, gauge, charts)</li>
				<li>100+ unit conversion categories with instant results as you type</li>
				<li>Scientific calculator with expression parsing and memory</li>
				<li>Specialized calculators: Percentage, BMI, GST, Discount, EMI, Age, Compound Interest</li>
				<li>Calculation history, favorites, and share-ready output</li>
				<li>Offline-ready core functionality; dark mode and accessibility built in</li>
			</ul>

			<div class="bg-gray-50 p-8 rounded-3xl my-8 border border-gray-100">
				<h3 class="mt-0">Try Graphy Calculator Today</h3>
				<p>Calculate as you always have. Then open Graphy and see the math come alive.</p>
				<a href="https://play.google.com/store/apps/details?id=net.smartlogic.unitconverter" target="_blank" rel="noopener noreferrer" class="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">Get it on Google Play Store</a>
			</div>

			<p>Explore more on the <a href="/apps/graphy-calculator">Graphy Calculator website</a> or read our guides: <a href="/articles/graphy-calculator/graphy-calculator-usage-guide">How to Use Graphy Calculator</a>, <a href="/articles/graphy-calculator/what-is-graphy">What Is Graphy?</a>, and <a href="/articles/graphy-calculator/graphy-calculation-examples">Graphy Calculation Examples</a>.</p>

			<p><strong>Graphy Calculator — Calculate fast. Understand deeply.</strong></p>
		`
	},
	{
		slug: 'what-is-graphy',
		appId: 'graphy-calculator',
		title: 'What Is Graphy? The Visual Engine Behind Every Calculation',
		excerpt: 'Discover how Graphy transforms calculator results into flowcharts, blocks, gauges, and charts — making math visible, verifiable, and intuitive.',
		coverImage: '/blog/graphy-calculator/what-is-graphy-cover.webp',
		publishDate: '2026-09-06',
		category: 'Graphy Engine',
		seoTitle: 'What Is Graphy? Visual Math Explanations for Calculators',
		seoDescription: 'Learn how Graphy turns calculation results into flowcharts, blocks, gauges, and charts. One calculation path, multiple visual renderers, zero independent math.',
		content: `
			<h2>Making the Invisible Visible</h2>
			<p>Every calculator gives you an answer. <strong>Graphy</strong> shows you the journey. It is the visual explanation layer inside Graphy Calculator that transforms a finished calculation into a structured, semantic diagram — so you can see, verify, and truly understand how a result was produced.</p>

			<p>Graphy is not a separate calculator. It is a <strong>renderer</strong> — a visual interpreter that takes the same evaluated calculation model the app already computed and presents it through your choice of visual format.</p>

			<h2>How Graphy Works</h2>
			<ol>
				<li>You enter values and tap calculate (or convert units as you type)</li>
				<li>The Calculator Engine evaluates the formula with arbitrary-precision math</li>
				<li>The result appears instantly — exactly as before</li>
				<li>Optionally, you open the Graphy panel</li>
				<li>Graphy Builder transforms the evaluation into semantic nodes and connections</li>
				<li>Your chosen renderer (flowchart, blocks, gauge, chart) draws the visual explanation</li>
			</ol>

			<p><strong>Critical rule:</strong> Graphy never calculates independently. If the calculator says 25%, Graphy explains 25% — not 24.9% or 25.1%.</p>

			<h2>Renderer 1: Flowchart — The Universal Fallback</h2>
			<p>Every calculator in Graphy Calculator has a meaningful flowchart representation. Rounded node cards, circular operation markers, thin connectors, and generous whitespace make even complex formulas readable at a glance.</p>

			<p>Here is how a <strong>20% of 500</strong> percentage calculation looks in Graphy flowchart form:</p>

			<div class="graphy-demo my-10">
				<div class="graphy-demo-title">Graphy Flowchart — Percentage Example</div>
				<div class="graphy-flowchart">
					<div class="graphy-node graphy-node-input">
						<span class="graphy-node-label">Input</span>
						<span class="graphy-node-value">Base = 500</span>
						<span class="graphy-node-value">Rate = 20%</span>
					</div>
					<div class="graphy-connector">↓</div>
					<div class="graphy-node graphy-node-formula">
						<span class="graphy-node-label">Formula</span>
						<span class="graphy-node-value">Amount = Base × Rate ÷ 100</span>
					</div>
					<div class="graphy-connector">↓</div>
					<div class="graphy-node graphy-node-compute">
						<span class="graphy-node-label">Compute</span>
						<span class="graphy-node-value">500 × 20 ÷ 100 = 100</span>
					</div>
					<div class="graphy-connector">↓</div>
					<div class="graphy-node graphy-node-result">
						<span class="graphy-node-label">Result</span>
						<span class="graphy-node-value">20% of 500 = <strong>100</strong></span>
					</div>
				</div>
			</div>

			<h2>Renderer 2: Blocks — Structured Formula Breakdown</h2>
			<p>The Blocks renderer stacks color-coded segments — each representing an input, operation, or output. It is ideal when a formula has multiple distinct stages that benefit from vertical separation.</p>

			<p>Example: converting <strong>5 miles to kilometers</strong> (× 1.609344):</p>

			<div class="graphy-demo my-10">
				<div class="graphy-demo-title">Graphy Blocks — Length Conversion</div>
				<div class="graphy-blocks">
					<div class="graphy-block graphy-block-teal">
						<span class="graphy-block-label">Source Value</span>
						<span class="graphy-block-value">5 miles</span>
					</div>
					<div class="graphy-block graphy-block-indigo">
						<span class="graphy-block-label">Conversion Factor</span>
						<span class="graphy-block-value">× 1.609344 km/mi</span>
					</div>
					<div class="graphy-block graphy-block-amber">
						<span class="graphy-block-label">Operation</span>
						<span class="graphy-block-value">5 × 1.609344</span>
					</div>
					<div class="graphy-block graphy-block-result">
						<span class="graphy-block-label">Result</span>
						<span class="graphy-block-value">8.047 km</span>
					</div>
				</div>
			</div>

			<h2>Renderer 3: Gauge — Decision Ranges at a Glance</h2>
			<p>For bounded results like BMI categories or percentage completion, the Gauge renderer places your value on a semantic scale — instantly showing whether you are in a healthy, warning, or critical zone.</p>

			<div class="graphy-demo my-10">
				<div class="graphy-demo-title">Graphy Gauge — BMI Example (24.2)</div>
				<div class="graphy-gauge">
					<div class="graphy-gauge-track">
						<div class="graphy-gauge-zone graphy-gauge-under" style="width:18.5%">Under</div>
						<div class="graphy-gauge-zone graphy-gauge-normal" style="width:25%">Normal</div>
						<div class="graphy-gauge-zone graphy-gauge-over" style="width:20%">Over</div>
						<div class="graphy-gauge-zone graphy-gauge-obese" style="width:36.5%">Obese</div>
						<div class="graphy-gauge-needle" style="left:43%"></div>
					</div>
					<div class="graphy-gauge-label">BMI 24.2 — Normal range (18.5 – 24.9)</div>
				</div>
			</div>

			<h2>Renderer Switching Without Recalculation</h2>
			<p>One of Graphy's most powerful features: you can switch renderers on the same calculation without triggering a new evaluation. Flowchart, blocks, gauge, or chart — they all consume the same GraphyOutput model. Change the view, not the math.</p>

			<h2>GraphyTheme: Consistent Visual Language</h2>
			<p>Every Graphy visualization follows shared design tokens — semantic colors, node shapes, typography, spacing, and animation contracts. Input nodes, formula nodes, compute steps, and results always look consistent across calculators. This consistency is the brand: you learn Graphy once, and it works everywhere.</p>

			<h2>Why Graphy Matters</h2>
			<ul>
				<li><strong>Trust:</strong> Verify that the app applied the right formula with the right inputs</li>
				<li><strong>Learning:</strong> Students see the step-by-step logic, not just the final number</li>
				<li><strong>Debugging:</strong> Professionals catch input errors before they propagate</li>
				<li><strong>Sharing:</strong> Export visual explanations that others can understand instantly</li>
			</ul>

			<h3>Conclusion</h3>
			<p>Graphy is what separates Graphy Calculator from every other calculator on the Play Store. It does not replace fast calculation — it elevates it. Download <a href="https://play.google.com/store/apps/details?id=net.smartlogic.unitconverter" target="_blank" rel="noopener noreferrer">Graphy Calculator on Google Play</a> and experience math you can actually see.</p>
		`
	},
	{
		slug: 'graphy-calculation-examples',
		appId: 'graphy-calculator',
		title: 'Graphy in Action: Percentage, BMI, and EMI Visualized',
		excerpt: 'Walk through three real calculation examples — percentage discount, BMI health range, and EMI loan breakdown — each rendered through Graphy\'s visual engine.',
		coverImage: '/blog/graphy-calculator/graphy-examples-cover.webp',
		publishDate: '2026-09-06',
		category: 'Examples',
		seoTitle: 'Graphy Calculation Examples: Percentage, BMI & EMI Visualized',
		seoDescription: 'See Graphy Calculator in action with percentage, BMI, and EMI examples. Flowcharts, gauges, and bar charts that make complex math instantly understandable.',
		content: `
			<h2>Three Calculations, Three Visual Stories</h2>
			<p>Theory is useful, but Graphy truly shines when you see it applied to real problems. Below are three worked examples — the kind you will encounter daily — each shown through Graphy's visual renderers. These represent the MVP showcase calculators: <strong>Percentage</strong>, <strong>BMI</strong>, and <strong>EMI</strong>.</p>

			<h2>Example 1: Percentage Calculator — "What is 15% off ₹2,400?"</h2>
			<p>You are shopping and see a 15% discount on an item priced at ₹2,400. Instead of mental math, Graphy Calculator computes the discount and shows the full breakdown.</p>

			<table>
				<tr><th>Input</th><th>Value</th></tr>
				<tr><td>Original Price</td><td>₹2,400</td></tr>
				<tr><td>Discount Rate</td><td>15%</td></tr>
				<tr><td>Discount Amount</td><td>₹360</td></tr>
				<tr><td>Final Price</td><td><strong>₹2,040</strong></td></tr>
			</table>

			<div class="graphy-demo my-10">
				<div class="graphy-demo-title">Graphy Flowchart — Discount Calculation</div>
				<div class="graphy-flowchart graphy-flowchart-horizontal">
					<div class="graphy-node graphy-node-input">
						<span class="graphy-node-label">Price</span>
						<span class="graphy-node-value">₹2,400</span>
					</div>
					<div class="graphy-connector-h">→</div>
					<div class="graphy-node graphy-node-formula">
						<span class="graphy-node-label">Discount</span>
						<span class="graphy-node-value">× 15%</span>
					</div>
					<div class="graphy-connector-h">→</div>
					<div class="graphy-node graphy-node-compute">
						<span class="graphy-node-label">Save</span>
						<span class="graphy-node-value">₹360</span>
					</div>
					<div class="graphy-connector-h">→</div>
					<div class="graphy-node graphy-node-result">
						<span class="graphy-node-label">Pay</span>
						<span class="graphy-node-value"><strong>₹2,040</strong></span>
					</div>
				</div>
			</div>

			<p>The flowchart makes it obvious: original price flows through the discount rate to produce savings, then subtracts to the final amount. No hidden steps.</p>

			<h2>Example 2: BMI Calculator — "Am I in a healthy range?"</h2>
			<p>Body Mass Index combines weight and height into a single health indicator. Graphy Calculator computes BMI and uses the <strong>Gauge renderer</strong> to show exactly where you fall on the WHO scale.</p>

			<table>
				<tr><th>Input</th><th>Value</th></tr>
				<tr><td>Weight</td><td>72 kg</td></tr>
				<tr><td>Height</td><td>175 cm (1.75 m)</td></tr>
				<tr><td>Formula</td><td>BMI = weight ÷ height²</td></tr>
				<tr><td>Result</td><td><strong>23.5</strong> (Normal)</td></tr>
			</table>

			<div class="graphy-demo my-10">
				<div class="graphy-demo-title">Graphy Gauge — BMI 23.5</div>
				<div class="graphy-gauge">
					<div class="graphy-gauge-track">
						<div class="graphy-gauge-zone graphy-gauge-under" style="width:18.5%">Underweight</div>
						<div class="graphy-gauge-zone graphy-gauge-normal" style="width:25%">Normal</div>
						<div class="graphy-gauge-zone graphy-gauge-over" style="width:20%">Overweight</div>
						<div class="graphy-gauge-zone graphy-gauge-obese" style="width:36.5%">Obese</div>
						<div class="graphy-gauge-needle" style="left:41%"></div>
					</div>
					<div class="graphy-gauge-label">BMI 23.5 — Healthy Normal Range</div>
				</div>
			</div>

			<div class="graphy-demo my-10">
				<div class="graphy-demo-title">Graphy Blocks — BMI Formula Steps</div>
				<div class="graphy-blocks">
					<div class="graphy-block graphy-block-teal">
						<span class="graphy-block-label">Weight</span>
						<span class="graphy-block-value">72 kg</span>
					</div>
					<div class="graphy-block graphy-block-indigo">
						<span class="graphy-block-label">Height²</span>
						<span class="graphy-block-value">1.75 × 1.75 = 3.0625 m²</span>
					</div>
					<div class="graphy-block graphy-block-amber">
						<span class="graphy-block-label">Divide</span>
						<span class="graphy-block-value">72 ÷ 3.0625</span>
					</div>
					<div class="graphy-block graphy-block-result">
						<span class="graphy-block-label">BMI</span>
						<span class="graphy-block-value">23.5 — Normal</span>
					</div>
				</div>
			</div>

			<h2>Example 3: EMI Calculator — "What will my home loan cost?"</h2>
			<p>Equated Monthly Installment (EMI) is one of the most complex everyday calculations. Graphy Calculator's EMI tool computes the monthly payment and uses <strong>bar charts</strong> to reveal how much goes to principal versus interest over the loan tenure.</p>

			<table>
				<tr><th>Input</th><th>Value</th></tr>
				<tr><td>Loan Amount</td><td>₹25,00,000</td></tr>
				<tr><td>Interest Rate</td><td>8.5% per annum</td></tr>
				<tr><td>Tenure</td><td>20 years (240 months)</td></tr>
				<tr><td>Monthly EMI</td><td><strong>₹21,698</strong></td></tr>
				<tr><td>Total Interest</td><td>₹27,07,520</td></tr>
				<tr><td>Total Payment</td><td>₹52,07,520</td></tr>
			</table>

			<div class="graphy-demo my-10">
				<div class="graphy-demo-title">Graphy Bar Chart — Principal vs Interest</div>
				<div class="graphy-chart">
					<div class="graphy-chart-bar">
						<div class="graphy-chart-fill graphy-chart-principal" style="height:48%"></div>
						<span class="graphy-chart-label">Principal<br/>₹25.0L</span>
					</div>
					<div class="graphy-chart-bar">
						<div class="graphy-chart-fill graphy-chart-interest" style="height:52%"></div>
						<span class="graphy-chart-label">Interest<br/>₹27.1L</span>
					</div>
					<div class="graphy-chart-bar">
						<div class="graphy-chart-fill graphy-chart-total" style="height:100%"></div>
						<span class="graphy-chart-label">Total<br/>₹52.1L</span>
					</div>
				</div>
			</div>

			<div class="graphy-demo my-10">
				<div class="graphy-demo-title">Graphy Flowchart — EMI Formula</div>
				<div class="graphy-flowchart">
					<div class="graphy-node graphy-node-input">
						<span class="graphy-node-label">Inputs</span>
						<span class="graphy-node-value">P = ₹25,00,000 · r = 8.5%/12 · n = 240</span>
					</div>
					<div class="graphy-connector">↓</div>
					<div class="graphy-node graphy-node-formula">
						<span class="graphy-node-label">EMI Formula</span>
						<span class="graphy-node-value">EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1)</span>
					</div>
					<div class="graphy-connector">↓</div>
					<div class="graphy-node graphy-node-result">
						<span class="graphy-node-label">Monthly EMI</span>
						<span class="graphy-node-value"><strong>₹21,698</strong></span>
					</div>
				</div>
			</div>

			<p>The bar chart instantly reveals a sobering truth: over 20 years at 8.5%, you pay more in interest than the original loan amount. Graphy makes this visible — not buried in a number you might ignore.</p>

			<h2>Unit Conversion with Graphy Blocks</h2>
			<p>Graphy Calculator preserves the full unit conversion experience from its predecessor. Converting units generates the same instant results, now with optional Graphy Blocks showing the conversion factor applied step by step.</p>

			<div class="graphy-demo my-10">
				<div class="graphy-demo-title">Graphy Blocks — Celsius to Fahrenheit (100°C)</div>
				<div class="graphy-blocks">
					<div class="graphy-block graphy-block-teal">
						<span class="graphy-block-label">Input</span>
						<span class="graphy-block-value">100°C</span>
					</div>
					<div class="graphy-block graphy-block-indigo">
						<span class="graphy-block-label">Formula</span>
						<span class="graphy-block-value">°F = (°C × 9/5) + 32</span>
					</div>
					<div class="graphy-block graphy-block-amber">
						<span class="graphy-block-label">Compute</span>
						<span class="graphy-block-value">(100 × 1.8) + 32 = 212</span>
					</div>
					<div class="graphy-block graphy-block-result">
						<span class="graphy-block-label">Result</span>
						<span class="graphy-block-value">212°F</span>
					</div>
				</div>
			</div>

			<h2>The Graphy Difference</h2>
			<p>These three examples — percentage, BMI, and EMI — represent the MVP showcase of Graphy Calculator. Each exercises a different renderer: flowchart for sequential logic, gauge for bounded ranges, and bar charts for comparative breakdowns. Together, they prove the architecture: <strong>one calculation engine, many visual stories.</strong></p>

			<div class="bg-gray-50 p-8 rounded-3xl my-8 border border-gray-100">
				<h3 class="mt-0">Experience Graphy Yourself</h3>
				<p>Download Graphy Calculator and try these calculations with live Graphy visualizations.</p>
				<a href="https://play.google.com/store/apps/details?id=net.smartlogic.unitconverter" target="_blank" rel="noopener noreferrer" class="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">Get it on Google Play Store</a>
			</div>

			<section>
				<h3>Graphy Examples FAQs</h3>
				<table>
					<tr><th>Question</th><th>Answer</th></tr>
					<tr><td>Can I switch renderers on the same calculation?</td><td>Yes. Flowchart, blocks, gauge, and charts all consume the same result without recalculating.</td></tr>
					<tr><td>Does Graphy work for unit conversions?</td><td>Yes. Length, temperature, weight, and other conversions show the factor and formula in Graphy Blocks.</td></tr>
					<tr><td>Which calculators have Graphy first?</td><td>Percentage, BMI, and EMI are the MVP showcase. Flowchart is available as fallback for all calculators.</td></tr>
					<tr><td>Is Graphy required to use the app?</td><td>No. Graphy is optional. Your calculator and converter work exactly as fast without opening Graphy.</td></tr>
				</table>
			</section>
		`
	},
	{
		slug: 'graphy-calculator-usage-guide',
		appId: 'graphy-calculator',
		title: 'How to Use Graphy Calculator: A Complete Usage Guide',
		excerpt: 'Step-by-step guide to calculating, converting units, opening Graphy visual explanations, and using favorites and history — without slowing down your workflow.',
		coverImage: '/blog/graphy-calculator/graphy-calculator-usage-guide-cover.webp',
		publishDate: '2026-09-06',
		category: 'Usage Guide',
		seoTitle: 'How to Use Graphy Calculator | Step-by-Step Usage Guide',
		seoDescription: 'Learn how to use Graphy Calculator: five-tab navigation, fast calculations, unit conversion, optional Graphy visual explanations, favorites, and history.',
		content: `
			<h2>Calculate Fast — Understand When You Want To</h2>
			<p><strong>Graphy Calculator</strong> is built around one principle: your existing calculator and unit converter workflows stay exactly as fast as before. Graphy is an optional layer you open when you want to <em>see</em> how an answer was produced. This guide walks you through every part of the app — from your first calculation to switching visual renderers and revisiting past results.</p>

			<h2>Getting Started</h2>
			<p>Download Graphy Calculator from Google Play and open the app. You land on the main screen with five tabs along the bottom. No account is required for core functionality — calculate, convert, and explore offline.</p>

			<ol>
				<li>Install the app from <a href="https://play.google.com/store/apps/details?id=net.smartlogic.unitconverter" target="_blank" rel="noopener noreferrer">Google Play</a></li>
				<li>Open any tab — <strong>Calculate</strong> or <strong>Convert</strong> depending on your task</li>
				<li>Enter values and get your result instantly, just like a standard calculator</li>
				<li>Optionally tap the <strong>Graphy</strong> panel to see a visual explanation</li>
			</ol>

			<h2>The Five Tabs</h2>
			<p>Graphy Calculator organizes everything into five intuitive sections:</p>

			<table>
				<tr><th>Tab</th><th>What It Does</th><th>When to Use It</th></tr>
				<tr><td><strong>Calculate</strong></td><td>Specialized calculators: Percentage, BMI, GST, Discount, EMI, Scientific, and more</td><td>When you need a purpose-built formula — not just basic arithmetic</td></tr>
				<tr><td><strong>Convert</strong></td><td>100+ unit categories: length, weight, temperature, area, volume, currency, and more</td><td>When you need instant conversions as you type</td></tr>
				<tr><td><strong>Explore</strong></td><td>Browse calculators by category and discover new tools</td><td>When you are not sure which calculator fits your task</td></tr>
				<tr><td><strong>Favourites</strong></td><td>Quick access to calculators you pin</td><td>When you use the same tools daily — BMI, GST, currency, etc.</td></tr>
				<tr><td><strong>History</strong></td><td>Past calculations with full context; re-open Graphy views</td><td>When you need to verify or repeat a previous result</td></tr>
			</table>

			<h2>Using the Calculator</h2>
			<p>The basic calculator and scientific keypad work exactly as you expect. Expression display, memory controls, and keypad behavior are unchanged from the established app — Graphy Calculator does not rebuild or replace this foundation.</p>

			<h3>Quick Calculation Workflow</h3>
			<ol>
				<li>Open <strong>Calculate</strong> and select a calculator (e.g., Percentage) or use the scientific keypad</li>
				<li>Enter your values using the on-screen keypad</li>
				<li>Tap calculate — the result appears immediately</li>
				<li>Done. No Graphy step is required unless you want visual confirmation</li>
			</ol>

			<p><strong>Remember:</strong> Existing calculation → same result → optional Graphy explanation. Speed first, depth when you choose it.</p>

			<h2>Using Unit Conversion</h2>
			<p>The <strong>Convert</strong> tab preserves the full unit converter experience. Select a category (length, temperature, weight, etc.), pick source and target units, and type a value. Results update instantly as you type — no extra tap needed.</p>

			<div class="graphy-demo my-10">
				<div class="graphy-demo-title">Typical Conversion Flow</div>
				<div class="graphy-blocks">
					<div class="graphy-block graphy-block-teal">
						<span class="graphy-block-label">Step 1</span>
						<span class="graphy-block-value">Open Convert → choose category</span>
					</div>
					<div class="graphy-block graphy-block-indigo">
						<span class="graphy-block-label">Step 2</span>
						<span class="graphy-block-value">Select units (e.g., miles → km)</span>
					</div>
					<div class="graphy-block graphy-block-amber">
						<span class="graphy-block-label">Step 3</span>
						<span class="graphy-block-value">Type a value — result updates live</span>
					</div>
					<div class="graphy-block graphy-block-result">
						<span class="graphy-block-label">Optional</span>
						<span class="graphy-block-value">Open Graphy to see the conversion factor applied</span>
					</div>
				</div>
			</div>

			<h2>Opening Graphy Visual Explanations</h2>
			<p>Graphy is the visual explanation engine inside Graphy Calculator. After any calculation or conversion, you can open the collapsible <strong>Graphy panel</strong> to see how the answer was built — without triggering a new calculation.</p>

			<h3>How to Open Graphy</h3>
			<ol>
				<li>Complete a calculation or conversion as usual</li>
				<li>Look for the <strong>Graphy</strong> panel below or beside your result</li>
				<li>Tap to expand — a visual explanation renders instantly</li>
				<li>Switch renderers (flowchart, blocks, gauge, chart) without recalculating</li>
			</ol>

			<p><strong>Critical rule:</strong> Graphy never calculates independently. What you see in the result field is exactly what Graphy explains. If the calculator says 100, Graphy shows how 100 was produced — not 99.9 or 100.1.</p>

			<h3>Choosing a Renderer</h3>
			<p>Graphy supports multiple visual formats. Every calculator has at least a <strong>flowchart</strong> (the universal fallback). Specialized calculators may also offer blocks, gauges, or charts:</p>

			<ul>
				<li><strong>Flowchart</strong> — Input → formula → compute → result. Best for sequential logic (percentage, discount, EMI)</li>
				<li><strong>Blocks</strong> — Color-coded stacked segments. Best for multi-step formulas (unit conversion, BMI)</li>
				<li><strong>Gauge</strong> — Arc indicator on a scale. Best for bounded ranges (BMI categories, percentage completion)</li>
				<li><strong>Charts</strong> — Bar or pie breakdown. Best for comparative results (EMI principal vs interest)</li>
			</ul>

			<p>Switch renderers freely on the same result. Graphy re-renders the existing GraphyOutput — it does not re-run the math.</p>

			<h2>Favourites: Pin What You Use Daily</h2>
			<p>If you reach for the same calculators repeatedly — GST for your shop, BMI for health tracking, currency for travel — pin them in <strong>Favourites</strong>:</p>
			<ol>
				<li>Open any calculator from Calculate or Explore</li>
				<li>Tap the favourite (heart/star) icon on the calculator screen</li>
				<li>Access pinned tools instantly from the Favourites tab</li>
			</ol>

			<h2>History: Revisit and Verify</h2>
			<p>Every calculation is saved in <strong>History</strong> with full context — inputs, result, calculator type, and timestamp. This is especially useful when you need to double-check a figure or re-open a Graphy visualization later.</p>

			<ul>
				<li>Scroll through past calculations chronologically</li>
				<li>Tap any entry to see inputs and the result again</li>
				<li>Re-open the Graphy view for that calculation without re-entering values</li>
			</ul>

			<h2>Specialized Calculators at a Glance</h2>
			<p>The <strong>Calculate</strong> tab includes purpose-built tools beyond basic arithmetic. Here is when to reach for each:</p>

			<table>
				<tr><th>Calculator</th><th>Use Case</th><th>Graphy Renderer</th></tr>
				<tr><td>Percentage</td><td>Find X% of Y, increase/decrease by percentage</td><td>Flowchart, Blocks</td></tr>
				<tr><td>BMI</td><td>Body Mass Index from weight and height</td><td>Gauge, Blocks, Flowchart</td></tr>
				<tr><td>EMI</td><td>Monthly loan payment for home, car, or personal loans</td><td>Bar chart, Flowchart</td></tr>
				<tr><td>GST</td><td>Add or remove Goods and Services Tax</td><td>Flowchart</td></tr>
				<tr><td>Discount</td><td>Calculate sale price after a percentage off</td><td>Flowchart</td></tr>
				<tr><td>Scientific</td><td>Trigonometry, logarithms, expressions with memory</td><td>Flowchart</td></tr>
			</table>

			<h2>Practical Tips</h2>
			<ul>
				<li><strong>Speed first:</strong> You never need to open Graphy. Use it when understanding matters — homework, invoices, health checks, loan decisions.</li>
				<li><strong>Verify before sharing:</strong> Open Graphy before sending a result to a client or classmate. The visual breakdown builds trust.</li>
				<li><strong>Explore by category:</strong> Not sure which tool to use? Browse <strong>Explore</strong> by topic — finance, health, conversion, and more.</li>
				<li><strong>Offline-ready:</strong> Core calculator and converter functions work without an internet connection.</li>
				<li><strong>Dark mode:</strong> Graphy visualizations follow the same theme tokens in light and dark mode for consistent readability.</li>
			</ul>

			<h2>What Graphy Calculator Is Not (Yet)</h2>
			<p>Graphy Calculator MVP focuses on adding visual explanations to existing functionality. The following are planned for future releases but not part of the current experience:</p>
			<ul>
				<li>Coins, timeline, and XY graph renderers (coming progressively)</li>
				<li>AI-powered insights and what-if suggestions</li>
				<li>Advanced PDF export</li>
				<li>Full catalog of 100+ specialized calculators (expanding over time)</li>
			</ul>

			<div class="bg-gray-50 p-8 rounded-3xl my-8 border border-gray-100">
				<h3 class="mt-0">Ready to Try It?</h3>
				<p>Calculate as you always have. Open Graphy when you want to understand the math behind the number.</p>
				<a href="https://play.google.com/store/apps/details?id=net.smartlogic.unitconverter" target="_blank" rel="noopener noreferrer" class="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">Get Graphy Calculator on Google Play</a>
			</div>

			<p>Want to go deeper? Read <a href="/articles/graphy-calculator/what-is-graphy">What Is Graphy?</a> for the visual engine explained, or see <a href="/articles/graphy-calculator/graphy-calculation-examples">Graphy Calculation Examples</a> with percentage, BMI, and EMI walkthroughs.</p>

			<section>
				<h3>Usage Guide FAQs</h3>
				<table>
					<tr><th>Question</th><th>Answer</th></tr>
					<tr><td>Do I have to open Graphy every time?</td><td>No. Graphy is completely optional. Your calculator works at full speed without it.</td></tr>
					<tr><td>Will Graphy change my result?</td><td>Never. Graphy visualizes the same calculation the app already performed.</td></tr>
					<tr><td>Can I use the app offline?</td><td>Yes. Core calculator, converter, and Graphy rendering work offline.</td></tr>
					<tr><td>How do I find a specific calculator?</td><td>Use Explore to browse by category, or search from the Calculate tab.</td></tr>
					<tr><td>Can I revisit a past Graphy view?</td><td>Yes. Open History, tap the entry, and re-open Graphy for that calculation.</td></tr>
				</table>
			</section>

			<p><strong>Graphy Calculator — Calculate fast. Understand deeply.</strong></p>
		`
	}
];
