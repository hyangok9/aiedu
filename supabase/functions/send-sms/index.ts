import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, name, program } = await req.json()

    // 실제 문자 발송 서비스 연동 필요 (예: 알리고, 네이버 클라우드 등)
    // 현재는 시뮬레이션으로 처리
    const message = `[AI마케팅교육원] ${name}님, ${program} 등록이 완료되었습니다. 곧 교육 일정을 안내드리겠습니다.`
    
    console.log(`SMS sent to ${phone}: ${message}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '문자가 발송되었습니다.',
        phone,
        content: message
      }),
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