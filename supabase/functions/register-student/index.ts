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
    const { name, phone, email, program_id, additional_requests } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // 해당 프로그램의 현재 등록자 수 확인
    const { data: program, error: programError } = await supabaseClient
      .from('programs')
      .select('current_students, max_students, title')
      .eq('id', program_id)
      .single()

    if (programError) throw programError

    if (program.current_students >= program.max_students) {
      return new Response(
        JSON.stringify({ error: '수강 정원이 마감되었습니다.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // 등록 정보 저장
    const { data: registration, error: regError } = await supabaseClient
      .from('registrations')
      .insert([
        {
          name,
          phone,
          email,
          program_id,
          program: program.title,
          additional_requests: additional_requests || null
        }
      ])
      .select()
      .single()

    if (regError) throw regError

    // 프로그램의 현재 등록자 수 업데이트
    const { error: updateError } = await supabaseClient
      .from('programs')
      .update({ current_students: program.current_students + 1 })
      .eq('id', program_id)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ registration }),
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