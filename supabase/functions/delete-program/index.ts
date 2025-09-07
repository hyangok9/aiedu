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
    const url = new URL(req.url)
    const programId = url.pathname.split('/').pop()

    if (!programId) {
      throw new Error('프로그램 ID가 필요합니다.')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // 프로그램에 등록된 학생이 있는지 확인
    const { data: registrations, error: regError } = await supabaseClient
      .from('registrations')
      .select('id')
      .eq('program_id', programId)

    if (regError) throw regError

    if (registrations && registrations.length > 0) {
      return new Response(
        JSON.stringify({ error: '등록된 학생이 있는 프로그램은 삭제할 수 없습니다.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // 프로그램 삭제
    const { error: deleteError } = await supabaseClient
      .from('programs')
      .delete()
      .eq('id', programId)

    if (deleteError) throw deleteError

    return new Response(
      JSON.stringify({ success: true }),
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