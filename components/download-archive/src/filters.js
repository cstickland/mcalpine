import { writable } from 'svelte/store'

export const allCategories = writable(new Set())
export const allFileTypes = writable(new Set())
export const allDownloadTypes = writable(new Set())

export const activeCategoryFilters = writable(new Set())
export const activeFileTypeFilters = writable(new Set())
export const activeDownloadTypeFilters = writable(new Set())
