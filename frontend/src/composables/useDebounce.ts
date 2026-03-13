import { ref, watch, type Ref } from 'vue'
export function useDebounce<T>(source: Ref<T>, delay = 300): Ref<T> {
  const cloneIfNeeded = (value: T): T => {
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        return [...value] as T
      } else {
        return { ...value } as T
      }
    }
    return value
  }

  const debounced = ref<T>(cloneIfNeeded(source.value)) as Ref<T>

  let timer: ReturnType<typeof setTimeout> | null = null

  watch(
    source,
    (newValue) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        debounced.value = cloneIfNeeded(newValue)
      }, delay)
    },
    { deep: true },
  )

  return debounced
}
