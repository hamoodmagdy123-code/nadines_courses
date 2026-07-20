import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/lib/data'

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (error) throw error
      return data as Course[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useAllCourses() {
  return useQuery({
    queryKey: ['courses-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data as Course[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCourseBySlug(slug: string) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error) throw error
      return data as Course
    },
    staleTime: 5 * 60 * 1000,
  })
}
