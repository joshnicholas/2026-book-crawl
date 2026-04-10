import { a0 as ssr_context, a1 as head } from "../../chunks/renderer.js";
import "clsx";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function Map($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="map-container svelte-13da2aa"></div>`);
  });
}
function _page($$renderer) {
  head("1uha8ag", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Book Crawl</title>`);
    });
  });
  Map($$renderer);
}
export {
  _page as default
};
