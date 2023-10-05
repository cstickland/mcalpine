import { writable } from 'svelte/store'

export const postsPerPage = writable(12)
export const filters = writable(new Set())
export const childFilters = writable(new Set([]))
export const parentFilters = writable(new Set([]))
export const currentPage = writable(1)
