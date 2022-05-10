import wmRequest from "./index";

export function getSearchHot() {
	return wmRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
	return wmRequest.get("/search/suggest", {
		keywords,
		type: "mobile"
	})
}

export function getSearchResult(keywords) {
	return wmRequest.get("/search", {
		keywords
	})
}