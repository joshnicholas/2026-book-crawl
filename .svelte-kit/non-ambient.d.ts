
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>
		};
		Pathname(): "/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/data/markers.json" | "/favicon.png" | "/images/book-and-paper-25451dbd-thumb-mobile.jpg" | "/images/book-and-paper-25451dbd-thumb.jpg" | "/images/book-and-paper-25451dbd.jpg" | "/images/book-and-paper-c41503f1-thumb-mobile.jpg" | "/images/book-and-paper-c41503f1-thumb.jpg" | "/images/book-and-paper-c41503f1.jpg" | "/images/book-and-paper-c8a2945d-thumb-mobile.jpg" | "/images/book-and-paper-c8a2945d-thumb.jpg" | "/images/book-and-paper-c8a2945d.jpg" | "/images/brunswick-bound-705f8953-thumb-mobile.jpg" | "/images/brunswick-bound-705f8953-thumb.jpg" | "/images/brunswick-bound-705f8953.jpg" | "/images/jeffreys-books-f2605466-thumb-mobile.jpg" | "/images/jeffreys-books-f2605466-thumb.jpg" | "/images/jeffreys-books-f2605466.jpg" | "/images/readings-carlton-b77687d1-thumb-mobile.jpg" | "/images/readings-carlton-b77687d1-thumb.jpg" | "/images/readings-carlton-b77687d1.jpg" | "/images/readings-chadstone-041b90e1-thumb-mobile.jpg" | "/images/readings-chadstone-041b90e1-thumb.jpg" | "/images/readings-chadstone-041b90e1.jpg" | "/images/readings-chadstone-7a2632fb-thumb-mobile.jpg" | "/images/readings-chadstone-7a2632fb-thumb.jpg" | "/images/readings-chadstone-7a2632fb.jpg" | "/images/readings-chadstone-d58ef115-thumb-mobile.jpg" | "/images/readings-chadstone-d58ef115-thumb.jpg" | "/images/readings-chadstone-d58ef115.jpg" | "/images/readings-emporium-73023d57-thumb-mobile.jpg" | "/images/readings-emporium-73023d57-thumb.jpg" | "/images/readings-emporium-73023d57.jpg" | "/images/readings-kids-9c80d577-thumb-mobile.jpg" | "/images/readings-kids-9c80d577-thumb.jpg" | "/images/readings-kids-9c80d577.jpg" | "/images/readings-malvern-252badd8-thumb-mobile.jpg" | "/images/readings-malvern-252badd8-thumb.jpg" | "/images/readings-malvern-252badd8.jpg" | "/images/sat-at-a-sunlight-table-drinking-a-nice--87e011a3-thumb.webp" | "/images/sat-at-a-sunlight-table-drinking-a-nice--87e011a3.webp" | "/images/seddon-book-alley-0b497494-thumb-mobile.jpg" | "/images/seddon-book-alley-0b497494-thumb.jpg" | "/images/seddon-book-alley-0b497494.jpg" | "/images/seddon-book-alley-418fe638-thumb-mobile.jpg" | "/images/seddon-book-alley-418fe638-thumb.jpg" | "/images/seddon-book-alley-418fe638.jpg" | "/images/seddon-book-alley-77944e12-thumb-mobile.jpg" | "/images/seddon-book-alley-77944e12-thumb.jpg" | "/images/seddon-book-alley-77944e12.jpg" | "/images/seddon-book-alley-912d2286-thumb-mobile.jpg" | "/images/seddon-book-alley-912d2286-thumb.jpg" | "/images/seddon-book-alley-912d2286.jpg" | "/images/seddon-book-alley-c2b02ceb-thumb-mobile.jpg" | "/images/seddon-book-alley-c2b02ceb-thumb.jpg" | "/images/seddon-book-alley-c2b02ceb.jpg" | "/images/sun-bookshop-9b865c33-thumb-mobile.jpg" | "/images/sun-bookshop-9b865c33-thumb.jpg" | "/images/sun-bookshop-9b865c33.jpg" | "/images/sun-bookshop-a07bb78a-thumb-mobile.jpg" | "/images/sun-bookshop-a07bb78a-thumb.jpg" | "/images/sun-bookshop-a07bb78a.jpg" | "/images/sun-bookshop-cfa56974-thumb-mobile.jpg" | "/images/sun-bookshop-cfa56974-thumb.jpg" | "/images/sun-bookshop-cfa56974.jpg" | "/images/the-chestnut-tree-0ea6cb5b-thumb.jpg" | "/images/the-chestnut-tree-0ea6cb5b.jpg" | "/images/the-chestnut-tree-22bb5d75-thumb-mobile.jpg" | "/images/the-chestnut-tree-22bb5d75-thumb.jpg" | "/images/the-chestnut-tree-22bb5d75.jpg" | "/images/the-chestnut-tree-33c0f77d-thumb-mobile.jpg" | "/images/the-chestnut-tree-33c0f77d-thumb.jpg" | "/images/the-chestnut-tree-33c0f77d.jpg" | "/images/the-chestnut-tree-33ff3949-thumb-mobile.jpg" | "/images/the-chestnut-tree-33ff3949-thumb.jpg" | "/images/the-chestnut-tree-33ff3949.jpg" | "/images/the-chestnut-tree-52fc669b-thumb-mobile.jpg" | "/images/the-chestnut-tree-52fc669b-thumb.jpg" | "/images/the-chestnut-tree-52fc669b.jpg" | "/images/the-chestnut-tree-c2c48810-thumb.jpg" | "/images/the-chestnut-tree-c2c48810.jpg" | "/images/the-chestnut-tree-e95eda9a-thumb-mobile.jpg" | "/images/the-chestnut-tree-e95eda9a-thumb.jpg" | "/images/the-chestnut-tree-e95eda9a.jpg" | "/images/the-leaf-bookshop-6d89ab89-thumb-mobile.jpg" | "/images/the-leaf-bookshop-6d89ab89-thumb.jpg" | "/images/the-leaf-bookshop-6d89ab89.jpg" | "/images/the-little-bookroom-e3b4a0e9-thumb-mobile.jpg" | "/images/the-little-bookroom-e3b4a0e9-thumb.jpg" | "/images/the-little-bookroom-e3b4a0e9.jpg" | "/images/through-the-looking-glass-fitzroy-79d45c11-thumb-mobile.jpg" | "/images/through-the-looking-glass-fitzroy-79d45c11-thumb.jpg" | "/images/through-the-looking-glass-fitzroy-79d45c11.jpg" | "/robots.txt" | string & {};
	}
}