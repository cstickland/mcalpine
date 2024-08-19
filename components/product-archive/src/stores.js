import { writable } from 'svelte/store'

export const postsPerPage = writable(48)
export const filters = writable(new Set())
export const childFilters = writable(new Set([]))
export const parentFilters = writable(new Set([]))
export const finishFilters = writable(new Set([]))
export const allFilters = writable(new Set([]))
export const currentPage = writable(1)
