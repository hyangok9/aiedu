import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, phone, email, rating, review_text } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // 등록된 교육생인지 확인 (이름과 전화번호만으로)
    const { data: registration, error: regError } = await supabaseClient
      .from('registrations')
      .select('id, name, program')
      .eq('name', name)
      .eq('phone', phone)
      .single()

    if (regError || !registration) {
      return new Response(
        JSON.stringify({ error: '등록된 교육생 정보를 찾을 수 없습니다. 성명과 전화번호를 정확히 입력해주세요.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // 후기 작성
    const { data: review, error: reviewError } = await supabaseClient
      .from('reviews')
      .insert([
        {
          student_name: name,
          program_title: registration.program,
          rating: rating,
          review_text: review_text,
          registration_id: registration.id
        }
      ])
      .select()
      .single()

    if (reviewError) throw reviewError

    return new Response(
      JSON.stringify({ review }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})